const request = require('supertest');
const app = require('./index'); // Impor app dari index.js

describe('Test Endpoints API', () => {
    // Tes untuk endpoint GET /
    it('should return "Hello, World!" for the root endpoint', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Hello, World!');
    });

    // Tes untuk endpoint GET /api/greeting
    it('should return a JSON message for the /api/greeting endpoint', async () => {
        const response = await request(app).get('/api/greeting');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: 'Halo dari API!' });
    });
});