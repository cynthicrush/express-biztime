\c biztime

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS companies_industries;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries (
  id serial PRIMARY KEY,
  title TEXT UNIQUE
);

CREATE TABLE companies_industries (
  company_code TEXT NOT NULL REFERENCES companies,
  industry_id INTEGER NOT NULL REFERENCES industries,
  PRIMARY KEY(company_code, industry_id)
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industries (title)
VALUES ('Consumer electronics'),
       ('Technology Company');

INSERT INTO companies_industries
VALUES ('apple', 1),
       ('ibm', 2);

-- SELECT c.code, i.title
-- FROM companies AS c
-- JOIN companies_industries AS ci
-- ON c.code = ci.company_code
-- JOIN industries AS i
-- ON i.id = ci.industry_id

