import { beforeEach, describe, expect, it } from '@jest/globals';
import axios, { Axios } from 'axios';
import { Chance } from 'chance';

const chance = Chance();

describe('Notes API', () => {
   let client: Axios;
   
   beforeEach(() => {
       client = axios.create({
           baseURL: 'http://localhost:3000',
       });
   });
   
   it('CRUD', async () => {
       // 1: List notes (should be empty)
       let response = await client.get('/notes');
       expect(response.status).toBe(200);
       
       // 2: Create note
       const createResponse = await client.post('/notes', {
           name: 'My First Note',
           fields: {
               author: 'Alice',
               category: 'personal',
               priority: 1
           },
           contentPath: '/content/note1.md'
       });
       expect(createResponse.status).toBe(201);
       expect(createResponse.data.name).toBe('My First Note');
       expect(createResponse.data.fields.author).toBe('Alice');
       expect(createResponse.data.contentPath).toBe('/content/note1.md');
       expect(createResponse.data.id).toBeDefined();
       
       const noteId = createResponse.data.id;
       
       // 3: List notes (should have 1)
       response = await client.get('/notes');
       expect(response.status).toBe(200);
       expect(response.data).toHaveLength(1);
       
       // 4: Get specific note
       const getNoteResponse = await client.get(`/notes/${noteId}`);
       expect(getNoteResponse.status).toBe(200);
       expect(getNoteResponse.data.id).toBe(noteId);
       expect(getNoteResponse.data.name).toBe('My First Note');
       expect(getNoteResponse.data.fields.author).toBe('Alice');
       expect(getNoteResponse.data.contentPath).toBe('/content/note1.md');
       
       // 5: Update note
       const updateResponse = await client.put(`/notes/${noteId}`, {
           name: 'My Updated Note',
           contentPath: '/content/note1-updated.md'
       });
       
       expect(updateResponse.status).toBe(200);
       expect(updateResponse.data.name).toBe('My Updated Note');
       expect(updateResponse.data.fields.author).toBe('Alice Updated');
       expect(updateResponse.data.fields.category).toBe('work');
       expect(updateResponse.data.fields.priority).toBe(2);
       expect(updateResponse.data.contentPath).toBe('/content/note1-updated.md');
       
       // 6: Get note again (verify update)
       const verifyResponse = await client.get(`/notes/${noteId}`);
       expect(verifyResponse.status).toBe(200);
       expect(verifyResponse.data.name).toBe('My Updated Note');
       expect(verifyResponse.data.fields.author).toBe('Alice Updated');
       expect(verifyResponse.data.fields.tags).toEqual(['important', 'review']);
       
       // 7: Delete note
       const deleteResponse = await client.delete(`/notes/${noteId}`);
       expect(deleteResponse.status).toBe(204);
       
       // 8: List notes (should be empty again)
       response = await client.get('/notes');
       expect(response.status).toBe(200);
       expect(response.data).toHaveLength(0);
       
       // 9: Try to get deleted note (should 404)
       try {
           await client.get(`/notes/${noteId}`);
           throw new Error('Expected 404 error');
       } catch (error: any) {
           expect(error.response.status).toBe(404);
       }
   });
});