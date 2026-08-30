const express = require('express');
const prisma = require('../lib/db');
const { requireLogin } = require('../middleware/auth');
const { isCvComplete, normalizeCv } = require('../lib/cv');

const router = express.Router();

const CV_INCLUDE = {
  experience: { orderBy: { sortOrder: 'asc' } },
  education: { orderBy: { sortOrder: 'asc' } },
  skills: true,
  languages: true,
};

async function getOrCreateCvProfile(userId) {
  let profile = await prisma.cvProfile.findUnique({ where: { userId }, include: CV_INCLUDE });
  if (!profile) {
    profile = await prisma.cvProfile.create({ data: { userId }, include: CV_INCLUDE });
  }
  return profile;
}

// ---------- builder ----------
router.get('/cv-builder.html', requireLogin, async (req, res) => {
  const cvProfile = await getOrCreateCvProfile(req.currentUser.id);
  res.render('cv/builder', {
    active: 'cv', cvProfile, complete: isCvComplete(cvProfile),
    returnToApply: req.query.returnToApply || null, saved: req.query.saved === '1',
  });
});

router.post('/cv-builder.html/profile', requireLogin, async (req, res) => {
  const { fullName, headline, summary, phone, email, address, templateChoice, returnToApply } = req.body;
  const profile = await getOrCreateCvProfile(req.currentUser.id);
  await prisma.cvProfile.update({
    where: { id: profile.id },
    data: { fullName, headline, summary, phone, email, address, templateChoice: templateChoice || 'template1' },
  });
  res.redirect('/cv-builder.html' + (returnToApply ? '?returnToApply=' + returnToApply : '?saved=1'));
});

router.post('/cv-builder.html/experience/add', requireLogin, async (req, res) => {
  const profile = await getOrCreateCvProfile(req.currentUser.id);
  const { jobTitle, company, startDate, endDate, current, description, returnToApply } = req.body;
  if (jobTitle && company) {
    await prisma.cvExperience.create({
      data: {
        cvProfileId: profile.id, jobTitle, company, description: description || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        current: current === 'on',
      },
    });
  }
  res.redirect('/cv-builder.html' + (returnToApply ? '?returnToApply=' + returnToApply : ''));
});

router.post('/cv-builder.html/experience/:id/delete', requireLogin, async (req, res) => {
  const profile = await getOrCreateCvProfile(req.currentUser.id);
  await prisma.cvExperience.deleteMany({ where: { id: parseInt(req.params.id, 10), cvProfileId: profile.id } });
  res.redirect('/cv-builder.html' + (req.body.returnToApply ? '?returnToApply=' + req.body.returnToApply : ''));
});

router.post('/cv-builder.html/education/add', requireLogin, async (req, res) => {
  const profile = await getOrCreateCvProfile(req.currentUser.id);
  const { degree, institution, startDate, endDate, description, returnToApply } = req.body;
  if (degree && institution) {
    await prisma.cvEducation.create({
      data: {
        cvProfileId: profile.id, degree, institution, description: description || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });
  }
  res.redirect('/cv-builder.html' + (returnToApply ? '?returnToApply=' + returnToApply : ''));
});

router.post('/cv-builder.html/education/:id/delete', requireLogin, async (req, res) => {
  const profile = await getOrCreateCvProfile(req.currentUser.id);
  await prisma.cvEducation.deleteMany({ where: { id: parseInt(req.params.id, 10), cvProfileId: profile.id } });
  res.redirect('/cv-builder.html' + (req.body.returnToApply ? '?returnToApply=' + req.body.returnToApply : ''));
});

router.post('/cv-builder.html/skill/add', requireLogin, async (req, res) => {
  const profile = await getOrCreateCvProfile(req.currentUser.id);
  const { name, level, returnToApply } = req.body;
  if (name) {
    await prisma.cvSkill.create({ data: { cvProfileId: profile.id, name, level: parseInt(level, 10) || 3 } });
  }
  res.redirect('/cv-builder.html' + (returnToApply ? '?returnToApply=' + returnToApply : ''));
});

router.post('/cv-builder.html/skill/:id/delete', requireLogin, async (req, res) => {
  const profile = await getOrCreateCvProfile(req.currentUser.id);
  await prisma.cvSkill.deleteMany({ where: { id: parseInt(req.params.id, 10), cvProfileId: profile.id } });
  res.redirect('/cv-builder.html' + (req.body.returnToApply ? '?returnToApply=' + req.body.returnToApply : ''));
});

router.post('/cv-builder.html/language/add', requireLogin, async (req, res) => {
  const profile = await getOrCreateCvProfile(req.currentUser.id);
  const { name, level, returnToApply } = req.body;
  if (name) {
    await prisma.cvLanguage.create({ data: { cvProfileId: profile.id, name, level: level || 'Gut' } });
  }
  res.redirect('/cv-builder.html' + (returnToApply ? '?returnToApply=' + returnToApply : ''));
});

router.post('/cv-builder.html/language/:id/delete', requireLogin, async (req, res) => {
  const profile = await getOrCreateCvProfile(req.currentUser.id);
  await prisma.cvLanguage.deleteMany({ where: { id: parseInt(req.params.id, 10), cvProfileId: profile.id } });
  res.redirect('/cv-builder.html' + (req.body.returnToApply ? '?returnToApply=' + req.body.returnToApply : ''));
});

// ---------- printable CV views ----------
router.get('/cv/preview.html', requireLogin, async (req, res) => {
  const profile = await getOrCreateCvProfile(req.currentUser.id);
  const template = req.query.template || profile.templateChoice || 'template1';
  res.render('cv/' + safeTemplate(template), { cv: normalizeCv(profile), readOnly: false });
});

router.get('/cv/application.html', requireLogin, async (req, res) => {
  const applicationId = parseInt(req.query.applicationId, 10);
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: { include: { company: true } }, applicant: true },
  });
  if (!application) return res.status(404).send('Bewerbung nicht gefunden.');

  const isOwner = application.applicantId === req.currentUser.id;
  const isEmployer = application.job.company.ownerId === req.currentUser.id;
  if (!isOwner && !isEmployer) return res.status(403).send('Kein Zugriff auf diesen Lebenslauf.');

  const snapshot = application.cvSnapshot;
  const template = req.query.template || snapshot.templateChoice || 'template1';
  res.render('cv/' + safeTemplate(template), { cv: normalizeCv(snapshot), readOnly: true, application });
});

function safeTemplate(name) {
  return ['template1', 'template2', 'template3'].includes(name) ? name : 'template1';
}

module.exports = router;
