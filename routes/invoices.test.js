const { Test } = require('supertest');
const request = require('supertest');
const app = require('../app');
const db = require('../db');

beforeEach(async () => {
    await db.query('DELETE FROM invoices');
    await db.query('DELETE FROM companies');
    await db.query("SELECT setval('invoices_id_seq', 1, false)");

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

describe('GET /invoices', () => {
    test('Get a list of invoices', async () => {
        const response = await request(app).get('/invoices');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            "invoices": [
                {id: 1, comp_code: "apple"},
                {id: 2, comp_code: "apple"},
                {id: 3, comp_code: "apple"},
                {id: 4, comp_code: "ibm"}
            ]
        })
    })
})

describe('GET /:id', () => {
    test('Get a single invoice by id', async () => {
        const response = await request(app).get('/invoices/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            "invoice": {
                "id": 1,
                "amt": 100,
                "paid": false,
                "add_date": "2022-03-24T05:00:00.000Z",
                "paid_date": null,
                "company": {
                    "code": "apple",
                    "name": "Apple Computer",
                    "description": "Maker of OSX."
                }
            }
        })
    });

    test('Returns 404 if no company code if found', async () => {
        const response = await request(app).get('/invoices/0');
        expect(response.statusCode).toBe(404);
    })
})

describe('POST /invoices', () => {
    test('Add a new invoice', async () => {
        const response = await request(app).post('/invoices').send({amt: 700, comp_code: "apple"});
        expect(response.body).toEqual({
            "invoice": {
                "comp_code": "apple",
                "amt": 700,
                "paid": false,
                "add_date": "2022-03-24T05:00:00.000Z",
                "paid_date": null
            }
        })
    })
})

describe('PATCH /invoices/:id', () => {
    test('Update a invoice', async () => {
        const response = await request(app).patch('/invoices/1').send({amt: 700, paid: false});
        expect(response.body).toEqual(
            {
                "invoice": {
                    "id": 1,
                    "comp_code": "apple",
                    "amt": 700,
                    "paid": false,
                    "add_date": expect.any(String),
                    "paid_date": null
                }
            }
        )
    })

    test('Returns 404 if no company code if found', async () => {
        const response = await request(app).patch('/invoives/0');
        expect(response.statusCode).toBe(404);
    })
})

describe('DELETE /invoices/:id', () => {
    test('Delete a invoice', async () => {
        const response = await request(app).delete('/invoices/1')
        expect(response.body).toEqual({"msg": "DELETED"})
    })

    test('Returns 404 if no company code if found', async () => {
        const response = await request(app).delete('/invoices/0');
        expect(response.statusCode).toBe(404);
    })
})
