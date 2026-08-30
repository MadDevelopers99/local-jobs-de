const express = require('express');
const bcrypt = require('bcrypt');
const prisma = require('../lib/db');

const router = express.Router();

router.get('/register.html', (req, res) => {
  if (req.currentUser) return res.redirect('/');
  res.render('auth/register', { active: null, error: null, form: {}, next: req.query.next || '' });
});

router.post('/register.html', async (req, res) => {
  const { firstName, lastName, email, phone, password, passwordConfirm, next } = req.body;
  const fail = (error) => res.render('auth/register', { active: null, error, form: req.body, next: next || '' });

  if (!firstName || !lastName || !email || !password) return fail('Please fill in all required fields.');
  if (password.length < 6) return fail('Password must be at least 6 characters long.');
  if (password !== passwordConfirm) return fail('Passwords do not match.');

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (existing) return fail('An account with this email address already exists.');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase().trim(),
      passwordHash,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone ? phone.trim() : null,
    },
  });

  req.session.userId = user.id;
  res.redirect(next && next.startsWith('/') ? next : '/');
});

router.get('/login.html', (req, res) => {
  if (req.currentUser) return res.redirect('/');
  res.render('auth/login', { active: null, error: null, email: '', next: req.query.next || '' });
});

router.post('/login.html', async (req, res) => {
  const { email, password, next } = req.body;
  const fail = (error) => res.render('auth/login', { active: null, error, email: email || '', next: next || '' });

  if (!email || !password) return fail('Please enter email and password.');

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) return fail('Email or password is incorrect.');

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return fail('Email or password is incorrect.');

  req.session.userId = user.id;
  res.redirect(next && next.startsWith('/') ? next : '/');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
