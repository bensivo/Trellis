import { beforeEach, describe, expect, it } from '@jest/globals';
import axios, { Axios } from 'axios';
import { Chance } from 'chance';

const chance = Chance();

describe('Attachments API', () => {
   let client: Axios;
   
   beforeEach(() => {
       client = axios.create({
           baseURL: 'http://localhost:3000',
       });
   });
   
   it('CRUD', async () => {
       // Create test file content
       const content = 'This is a test file content for attachment testing.';
       const filename = 'test-document.txt';
       
       // 1: Upload attachment
       const formData = new FormData();
       const blob = new Blob([content], { type: 'text/plain' });
       formData.append('file', blob, filename);
       
       const uploadResponse = await client.post('/attachments', formData, {
           headers: {
               'Content-Type': 'multipart/form-data',
           },
       });
       
       expect(uploadResponse.status).toBe(201);
       expect(uploadResponse.data).toEqual(expect.objectContaining({
        id: expect.any(Number),
        filename: expect.stringContaining('.txt'),
        path: expect.stringContaining('.txt'),
        size: expect.any(Number),
       }))
       
       const attachmentId = uploadResponse.data.id;
       const generatedFilename = uploadResponse.data.filename;
       
       // 2: Get attachment
       const getResponse = await client.get(`/attachments/${attachmentId}`);
       expect(getResponse.status).toBe(200);
       expect(getResponse.headers['content-type']).toBe('text/plain');
       expect(getResponse.headers['content-disposition']).toBe(`attachment; filename="${generatedFilename}"`);
       expect(getResponse.data).toBe(content);
       
       // 3: Delete attachment
       const deleteResponse = await client.delete(`/attachments/${attachmentId}`);
       expect(deleteResponse.status).toBe(204);
       
       // 4: Try to get deleted attachment (should 404)
       try {
           await client.get(`/attachments/${attachmentId}`);
           throw new Error('Expected 404 error');
       } catch (error: any) {
           expect(error.response.status).toBe(404);
       }
   });

});