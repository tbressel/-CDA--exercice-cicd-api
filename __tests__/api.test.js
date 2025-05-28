const request = require('supertest');
const app = require('../index');
const mysql2 = require('mysql2');

// api/index.test.js

// Mock the mysql2 library
jest.mock('mysql2', () => {
    const mockPool = {
        getConnection: jest.fn((callback) => callback(null, { release: jest.fn() })),
        query: jest.fn((query, callback) => {
            if (query === 'SELECT * FROM utilisateur') {
                callback(null, [
                    { nom: 'Bonno', prenom: 'Jean', age: 56 },
                    { nom: 'Time', prenom: 'Vincent', age: 12 },
                ]);
            } else {
                callback(new Error('Query not recognized'));
            }
        }),
    };
    return {
        createPool: jest.fn(() => mockPool),
    };
});

describe('API Functional Tests', () => {
    it('should return 200 and a message for the root endpoint', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('OK');
    });

    it('should return a list of users for the /utilisateurs endpoint', async () => {
        const response = await request(app).get('/utilisateurs');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { nom: 'Bonno', prenom: 'Jean', age: 56 },
            { nom: 'Time', prenom: 'Vincent', age: 12 },
        ]);
    });
});