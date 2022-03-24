const express = require('express');
const ExpressError = require('../expressError');
const router = express.Router()
const db = require('../db')

router.get('/', async(req, res, next) => {
    try {
        const results = await db.query(`
            SELECT  i.title, c.code
            FROM companies AS c
            JOIN companies_industries AS ci
            ON c.code = ci.company_code
            JOIN industries AS i
            ON i.id = ci.industry_id`);
        return res.json({ industries: results.rows })
    } catch (e) {
        return next(e)
    }
})

module.exports = router
