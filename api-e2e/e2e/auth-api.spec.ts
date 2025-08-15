import { describe, it, expect, beforeEach } from '@jest/globals';
import { Chance } from 'chance';
import axios, { Axios } from 'axios';

const chance = Chance();

describe('Auth API', () => {
    let client: Axios;

    beforeEach(() => {
        client = axios.create({
            baseURL: 'http://localhost:3000',
            withCredentials: true, // Important for cookies
        });
    });

    it('POST /auth/login returns 404 with invalid userId', async () => {
        // When: I login with a non-existent userId
        const res = await client.post('/auth/login', { userId: 9999 }, {
            validateStatus: (status) => status === 404,
        });

        // Then: I get a 404 status
        expect(res.status).toBe(404);
        expect(res.data.error).toBe('User not found');
    });

    it('POST /auth/login creates session cookie', async () => {
        // Given: There's a user in the database
        const userName = chance.name();
        let res = await client.post('/users', { name: userName });
        const userId = res.data.id;

        // When: I login with that UserID
        res = await client.post('/auth/login', { userId });

        // Then: I get a 201 status
        expect(res.status).toBe(201);

        // Then: I get a session cookie set
        const setCookieHeader = res.headers['set-cookie'];
        if (!setCookieHeader) {
            throw new Error('Set-Cookie header not found in response');
        }
        expect(setCookieHeader).toBeDefined();
        expect(setCookieHeader[0]).toContain('session_token=');
        expect(setCookieHeader[0]).toContain('HttpOnly');
        expect(setCookieHeader[0]).toContain('Secure');
    });

    it('GET auth/me returns user when authenticated', async () => {
        // Given: I have a logged in session
        const userName = chance.name();
        let res = await client.post('/users', { name: userName });
        const userId = res.data.id;

        // Given: I've logged in with that userid, and got the session cookie
        res = await client.post('/auth/login', { userId });
        const setCookieHeader = res.headers['set-cookie'];
        const sessionToken = setCookieHeader ? setCookieHeader[0].split(';')[0].split('=')[1] : null;
        if (!sessionToken) {
            throw new Error('Session token not found in cookie');
        }

        // When: I call /auth/me
        res = await client.get('/auth/me', {
            headers: {
                Cookie: `session_token=${sessionToken}`,
            }
        });

        // Then: I get the user data
        expect(res.status).toBe(200);
        expect(res.data.id).toBe(userId);
        expect(res.data.name).toBe(userName);
    });

    it('GET auth/me returns 401 when session not found', async () => {
        // When: I call /auth/me, with a made-up session token
        const res = await client.get('/auth/me', {
            headers: {
                Cookie: `session_token=alsfjasdlkfasdalsdkj`
            },
            validateStatus: (status) => status === 401, // We expect a 401 status
        });

        // Then: I get the user data
        expect(res.status).toBe(401);
        expect(res.data.error).toBe('Not authenticated');
    });

    it('GET auth/me returns 401 if I pass no cookies', async () => {
        // When: I call /auth/me, with a made-up session token
        const res = await client.get('/auth/me', {
            validateStatus: (status) => status === 401, // We expect a 401 status
        });

        // Then: I get the user data
        expect(res.status).toBe(401);
        expect(res.data.error).toBe('Not authenticated');
    });
});