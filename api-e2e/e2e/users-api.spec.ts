import { beforeEach, describe, expect, it } from '@jest/globals';
import axios, { Axios } from 'axios';
import { Chance } from 'chance';

const chance = Chance();

describe('Users API', () => {

    let client: Axios;

    beforeEach(() => {
        client = axios.create({
            baseURL: 'http://localhost:3000',
        });
    });

    it('CRUD', async () => {
        const name = chance.name();

       // 1: List users
       let response = await client.get('/users');
       expect(response.status).toBe(200);
       const numUsers = response.data.length;

       // 2: Create user
       const createResponse = await client.post('/users', {
           name,
       });
       expect(createResponse.status).toBe(201);
       expect(createResponse.data.name).toBe(name);
       expect(createResponse.data.id).toBeDefined();
       
       const userId = createResponse.data.id;

       // 3: List users (should have 1 more user)
       response = await client.get('/users');
       expect(response.status).toBe(200);
       expect(response.data).toHaveLength(numUsers + 1);

       // 4: Get specific user
       const getUserResponse = await client.get(`/users/${userId}`);
       expect(getUserResponse.status).toBe(200);
       expect(getUserResponse.data.id).toBe(userId);
       expect(getUserResponse.data.name).toBe(name);

       // 5: Update user
       const updateResponse = await client.patch(`/users/${userId}`, {
           name: `${name} Updated`
       });
       
       expect(updateResponse.status).toBe(200);
       expect(updateResponse.data.name).toBe(`${name} Updated`);

       // 6: Get user again (verify update)
       const verifyResponse = await client.get(`/users/${userId}`);
       expect(verifyResponse.status).toBe(200);
       expect(verifyResponse.data.name).toBe(`${name} Updated`);

       // 7: Delete user
       const deleteResponse = await client.delete(`/users/${userId}`);
       expect(deleteResponse.status).toBe(204);

       // 8: List users (should be empty again)
       response = await client.get('/users');
       expect(response.status).toBe(200);
       expect(response.data).toHaveLength(numUsers);

       // 9: Try to get deleted user (should 404)
       try {
           await client.get(`/users/${userId}`);
           throw new Error('Expected 404 error');
       } catch (error: any) {
           expect(error.response.status).toBe(404);
       }
   });
});

