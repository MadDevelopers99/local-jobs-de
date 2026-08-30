require('dotenv').config();
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const path = require('path');
const { Pool: PgPool } = require('pg');

const { attachUser } = require('./middleware/auth');
const { avatarColorFor, initialsFor, companyTypeLabel, COMPANY_TYPES, JOB_CATEGORIES, EMPLOYMENT_TYPES } = require('./lib/constants');
const { COUNTRIES, countryName } = require('./lib/countries-data');

const app = express();
app.locals.avatarColorFor = avatarColorFor;
app.locals.initialsFor = initialsFor;
app.locals.companyTypeLabel = companyTypeLabel;
app.locals.COMPANY_TYPES = COMPANY_TYPES;
app.locals.JOB_CATEGORIES = JOB_CATEGORIES;
app.locals.EMPLOYMENT_TYPES = EMPLOYMENT_TYPES;
app.locals.countryName = countryName;
app.locals.COUNTRIES = COUNTRIES;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(session({
  store: new pgSession({
    pool: new PgPool({ connectionString: process.env.DATABASE_URL }),
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }, // 30 days
}));

app.use(attachUser);

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/business'));
app.use('/', require('./routes/jobs'));
app.use('/', require('./routes/cv'));

// pages that stay static mockups (messages, saved-jobs, alerts) — nothing else in the
// project root is served, so .env / server.js / views / prisma schema stay private.
app.use(express.static(path.join(__dirname, 'static-pages')));

app.use((req, res) => {
  res.status(404).send('Page not found — <a href="/">back to homepage</a>');
});

const PORT = process.env.PORT || 8793;
app.listen(PORT, () => console.log(`LocalJobs.de running on port ${PORT}`));
