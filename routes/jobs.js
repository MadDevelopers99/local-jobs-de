const express = require('express');
const prisma = require('../lib/db');
const { requireLogin } = require('../middleware/auth');
const { JOB_CATEGORIES, POPULAR_CATEGORIES, COMPANY_TYPES, companyTypeLabel } = require('../lib/constants');
const { countryName } = require('../lib/countries-data');
const { isCvComplete, snapshotCv } = require('../lib/cv');

const router = express.Router();

// ---------- home page ----------
router.get(['/', '/index.html'], async (req, res) => {
  const country = req.effectiveCountry;

  const [categoryCounts, jobsInCountry, totalJobs, totalCompanies] = await Promise.all([
    Promise.all(JOB_CATEGORIES.map(async (cat) => ({
      name: cat,
      count: await prisma.job.count({ where: { category: cat } }),
    }))),
    prisma.job.findMany({
      where: { country }, orderBy: { createdAt: 'desc' }, take: 4,
      include: { company: true, _count: { select: { applications: true } } },
    }),
    prisma.job.count(),
    prisma.company.count(),
  ]);

  // fall back to global latest jobs if this country has none yet, so the
  // homepage is never an empty "Latest Jobs" section for a new market
  const recentJobs = jobsInCountry.length > 0 ? jobsInCountry : await prisma.job.findMany({
    orderBy: { createdAt: 'desc' }, take: 4, include: { company: true, _count: { select: { applications: true } } },
  });

  let recommendedJobs = [];
  if (req.currentUser) {
    const cvProfile = await prisma.cvProfile.findUnique({ where: { userId: req.currentUser.id } });
    if (cvProfile?.preferredCategories?.length) {
      const recommendedInclude = { company: true, _count: { select: { applications: true } } };
      recommendedJobs = await prisma.job.findMany({
        where: { category: { in: cvProfile.preferredCategories }, country },
        orderBy: { createdAt: 'desc' }, take: 4, include: recommendedInclude,
      });
      // widen to any country if there's nothing matching close to home yet
      if (recommendedJobs.length === 0) {
        recommendedJobs = await prisma.job.findMany({
          where: { category: { in: cvProfile.preferredCategories } },
          orderBy: { createdAt: 'desc' }, take: 4, include: recommendedInclude,
        });
      }
    }
  }

  res.render('index', {
    active: 'home', categoryCounts, recentJobs, recommendedJobs, totalJobs, totalCompanies,
    JOB_CATEGORIES, POPULAR_CATEGORIES,
    country: { code: country, name: countryName(country) },
  });
});

// ---------- job search / listing ----------
router.get('/jobs.html', async (req, res) => {
  const { q, kat, category, type, sort } = req.query;
  const cat = category || kat; // category-card links use ?kat=, the compact search bar uses ?category=
  // no ?land= at all means "first arrival" -> use the detected/saved country;
  // land=ALL is the explicit "show every country" choice from the selector
  const land = 'land' in req.query ? req.query.land : req.effectiveCountry;

  const where = {};
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { company: { is: { name: { contains: q, mode: 'insensitive' } } } },
    ];
  }
  if (land && land !== 'ALL') where.country = land;
  if (cat) where.category = { equals: cat, mode: 'insensitive' };
  if (type) where.company = { ...(where.company || {}), is: { ...(where.company?.is || {}), companyType: type } };

  let orderBy = { createdAt: 'desc' };
  if (sort === 'salary') orderBy = { salaryMax: 'desc' };

  const jobs = await prisma.job.findMany({
    where, orderBy,
    include: { company: true, _count: { select: { applications: true } } },
  });

  res.render('jobs', {
    active: 'jobs', jobs, JOB_CATEGORIES, COMPANY_TYPES, companyTypeLabel,
    effectiveCountry: req.effectiveCountry,
    filters: { q: q || '', land: land || '', category: cat || '', type: type || '', sort: sort || '' },
  });
});

// ---------- job details ----------
router.get('/job-details.html', async (req, res) => {
  const id = parseInt(req.query.id, 10);
  const job = id && await prisma.job.findUnique({
    where: { id },
    include: { company: true, _count: { select: { applications: true } } },
  });
  if (!job) return res.status(404).send('Job listing not found — <a href="/jobs.html">back to job search</a>');

  const similarJobs = await prisma.job.findMany({
    where: { category: job.category, id: { not: job.id } },
    take: 2, orderBy: { createdAt: 'desc' },
    include: { company: true, _count: { select: { applications: true } } },
  });

  let alreadyApplied = false;
  if (req.currentUser) {
    const existing = await prisma.application.findUnique({
      where: { jobId_applicantId: { jobId: job.id, applicantId: req.currentUser.id } },
    });
    alreadyApplied = Boolean(existing);
  }

  res.render('job-details', {
    active: 'jobs', job, similarJobs, alreadyApplied, companyTypeLabel,
    applied: req.query.applied === '1',
  });
});

// ---------- apply ----------
router.post('/apply.html', requireLogin, async (req, res) => {
  const jobId = parseInt(req.body.jobId, 10);
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return res.status(404).send('Job listing not found.');

  const cvProfile = await prisma.cvProfile.findUnique({
    where: { userId: req.currentUser.id },
    include: { experience: true, education: true, skills: true, languages: true },
  });

  if (!isCvComplete(cvProfile)) {
    return res.redirect('/cv-builder.html?returnToApply=' + jobId);
  }

  const existing = await prisma.application.findUnique({
    where: { jobId_applicantId: { jobId, applicantId: req.currentUser.id } },
  });
  if (!existing) {
    await prisma.application.create({
      data: {
        jobId,
        applicantId: req.currentUser.id,
        cvSnapshot: snapshotCv(cvProfile),
      },
    });
  }

  res.redirect('/job-details.html?id=' + jobId + '&applied=1');
});

// ---------- company profile ----------
router.get('/company.html', async (req, res) => {
  const id = parseInt(req.query.id, 10);
  const company = id && await prisma.company.findUnique({
    where: { id },
    include: {
      jobs: { orderBy: { createdAt: 'desc' }, include: { _count: { select: { applications: true } } } },
    },
  });
  if (!company) return res.status(404).send('Company not found — <a href="/jobs.html">back to job search</a>');

  res.render('company', { active: null, company, companyTypeLabel });
});

module.exports = router;
