const express = require('express');
const prisma = require('../lib/db');
const { requireLogin } = require('../middleware/auth');
const { JOB_CATEGORIES, EMPLOYMENT_TYPES, COMPANY_TYPES } = require('../lib/constants');

const router = express.Router();

// ---------- add / register a business ----------
router.get('/add-business.html', requireLogin, (req, res) => {
  res.render('business/register', { active: 'employer', error: null, form: {} });
});

router.post('/add-business.html', requireLogin, async (req, res) => {
  const { name, contact, email, website, foundedDate, totalEmployees, companyType, country } = req.body;
  const fail = (error) => res.render('business/register', { active: 'employer', error, form: req.body });

  if (!name || !contact || !email || !companyType || !country) {
    return fail('Bitte fülle alle Pflichtfelder aus.');
  }
  if (!COMPANY_TYPES.some((c) => c.value === companyType)) return fail('Ungültiger Unternehmenstyp.');

  const company = await prisma.company.create({
    data: {
      ownerId: req.currentUser.id,
      name: name.trim(),
      contact: contact.trim(),
      email: email.trim(),
      website: website ? website.trim() : null,
      foundedDate: foundedDate ? new Date(foundedDate) : null,
      totalEmployees: totalEmployees ? parseInt(totalEmployees, 10) : null,
      companyType,
      country,
    },
  });

  res.redirect('/employer/dashboard.html?companyId=' + company.id);
});

// ---------- employer dashboard ----------
router.get('/employer/dashboard.html', requireLogin, async (req, res) => {
  const companies = await prisma.company.findMany({ where: { ownerId: req.currentUser.id }, orderBy: { createdAt: 'asc' } });
  if (companies.length === 0) return res.redirect('/add-business.html');

  const requestedId = parseInt(req.query.companyId, 10);
  const company = companies.find((c) => c.id === requestedId) || companies[0];

  const jobs = await prisma.job.findMany({
    where: { companyId: company.id },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { applications: true } } },
  });

  const activeJobs = jobs.length;
  const totalApplications = jobs.reduce((sum, j) => sum + j._count.applications, 0);

  const recentApplications = await prisma.application.findMany({
    where: { job: { companyId: company.id } },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { applicant: true, job: true },
  });

  res.render('employer/dashboard', {
    active: 'employer', companies, company, jobs, activeJobs, totalApplications, recentApplications,
  });
});

// ---------- post a job ----------
router.get('/employer/post-job.html', requireLogin, async (req, res) => {
  const companies = await prisma.company.findMany({ where: { ownerId: req.currentUser.id }, orderBy: { createdAt: 'asc' } });
  if (companies.length === 0) return res.redirect('/add-business.html');
  const requestedId = parseInt(req.query.companyId, 10);
  const company = companies.find((c) => c.id === requestedId) || companies[0];

  res.render('employer/post-job', {
    active: 'employer', companies, company, error: null, form: {},
    JOB_CATEGORIES, EMPLOYMENT_TYPES,
  });
});

router.post('/employer/post-job.html', requireLogin, async (req, res) => {
  const companies = await prisma.company.findMany({ where: { ownerId: req.currentUser.id } });
  if (companies.length === 0) return res.redirect('/add-business.html');

  const companyId = parseInt(req.body.companyId, 10);
  const company = companies.find((c) => c.id === companyId);
  if (!company) return res.status(403).send('Kein Zugriff auf dieses Unternehmen.');

  const {
    title, category, employmentType, country, city,
    salaryMin, salaryMax, description, responsibilities, requirements,
  } = req.body;

  const fail = (error) => res.render('employer/post-job', {
    active: 'employer', companies, company, error, form: req.body, JOB_CATEGORIES, EMPLOYMENT_TYPES,
  });

  if (!title || !category || !employmentType || !country || !description) {
    return fail('Bitte fülle alle Pflichtfelder aus.');
  }

  const job = await prisma.job.create({
    data: {
      companyId: company.id,
      title: title.trim(),
      category,
      employmentType,
      country,
      city: city ? city.trim() : null,
      salaryMin: salaryMin ? parseInt(salaryMin, 10) : null,
      salaryMax: salaryMax ? parseInt(salaryMax, 10) : null,
      description: description.trim(),
      responsibilities: responsibilities ? responsibilities.trim() : null,
      requirements: requirements ? requirements.trim() : null,
    },
  });

  res.redirect('/job-details.html?id=' + job.id);
});

// ---------- applicants for one job ----------
router.get('/employer/applicants.html', requireLogin, async (req, res) => {
  const jobId = parseInt(req.query.jobId, 10);
  const job = await prisma.job.findUnique({ where: { id: jobId }, include: { company: true } });
  if (!job || job.company.ownerId !== req.currentUser.id) {
    return res.status(404).send('Stellenanzeige nicht gefunden.');
  }

  const applications = await prisma.application.findMany({
    where: { jobId },
    orderBy: { createdAt: 'desc' },
    include: { applicant: true },
  });

  res.render('employer/applicants', { active: 'employer', job, applications });
});

module.exports = router;
