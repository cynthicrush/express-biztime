
const request = require('supertest');
const app = require('../app');
const db = require('../db');

beforeEach(async () => {
    await db.query('DELETE FROM invoices');
    await db.query('DELETE FROM companies');
    await db.query(`INSERT INTO companies
                    VALUES ('apple', 'Apple Computer', 'Maker of OSX.'), ('ibm', 'IBM', 'Big blue.')`);
    await db.query(`INSERT INTO invoices (comp_Code, amt, paid, paid_date)
                    VALUES ('apple', 100, false, null),
                            ('apple', 200, false, null),
                            ('apple', 300, true, '2018-01-01'),
                            ('ibm', 400, false, null)`);
})

afterAll(async () => {
    await db.end();
})

describe('GET /companies', () => {
    test('Get a list of companies', async () => {
        const response = await request(app).get('/companies');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ companies: [
            {code: "apple", name: "Apple Computer"},
            {code: "ibm", name: "IBM"},
          ] })
    })
})

describe('GET /companies/:code', () => {
    test('Get a single company by code', async () => {
        const response = await request(app).get('/companies/apple');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ companies: {
            code: "apple",
            name: "Apple Computer",
            description: "Maker of OSX."
        } });
    });

    test('Returns 404 if no company code if found', async () => {
        const response = await request(app).get('/companies/google');
        expect(response.statusCode).toBe(404);
    })
})

describe('POST /companies', () => {
    test('Add a new company', async () => {
        const response = await request(app).post('/companies').send({code: "google", name: "Google", description: "Great"});
        expect(response.body).toEqual(
            {
                "company": {
                    code: "google",
                    name: "Google",
                    description: "Great"
                }
            }
        )
    })
})

describe('PATCH /companies', () => {
    test('Update a company', async () => {
        const response = await request(app).patch('/companies/apple').send({name: "Apple Computer", description: "Awesome!"});
        expect(response.body).toEqual(
            {
                "company": {
                    code: "apple",
                    name: "Apple Computer",
                    description: "Awesome!"
                }
            }
        )
    })

    test('Returns 404 if no company code if found', async () => {
        const response = await request(app).patch('/companies/google');
        expect(response.statusCode).toBe(404);
    })
})

describe('DELETE /companies', () => {
    test('Delete a company', async () => {
        const response = await request(app).delete('/companies/apple')
        expect(response.body).toEqual({"msg": "DELETED"})
    })

    test('Returns 404 if no company code if found', async () => {
        const response = await request(app).delete('/companies/google');
        expect(response.statusCode).toBe(404);
    })
})

