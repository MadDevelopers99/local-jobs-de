// A CV is "complete enough to apply with" when it has a name, a way to reach the
// person, and at least one experience or education entry.
function isCvComplete(cvProfile) {
  if (!cvProfile) return false;
  const hasContact = Boolean(cvProfile.fullName && (cvProfile.phone || cvProfile.email));
  const hasHistory = (cvProfile.experience?.length || 0) > 0 || (cvProfile.education?.length || 0) > 0;
  return hasContact && hasHistory;
}

// A plain-data snapshot of a CV, stored on each Application so later CV edits
// don't retroactively change what was actually submitted.
function snapshotCv(cvProfile) {
  if (!cvProfile) return null;
  return {
    fullName: cvProfile.fullName,
    headline: cvProfile.headline,
    summary: cvProfile.summary,
    phone: cvProfile.phone,
    email: cvProfile.email,
    address: cvProfile.address,
    templateChoice: cvProfile.templateChoice,
    experience: (cvProfile.experience || []).map((e) => ({
      jobTitle: e.jobTitle, company: e.company, startDate: e.startDate, endDate: e.endDate,
      current: e.current, description: e.description,
    })),
    education: (cvProfile.education || []).map((e) => ({
      degree: e.degree, institution: e.institution, startDate: e.startDate, endDate: e.endDate,
      description: e.description,
    })),
    skills: (cvProfile.skills || []).map((s) => ({ name: s.name, level: s.level })),
    languages: (cvProfile.languages || []).map((l) => ({ name: l.name, level: l.level })),
    snapshotAt: new Date().toISOString(),
  };
}

const MONTHS_DE = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

function fmtMonthYear(value) {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return MONTHS_DE[d.getMonth()] + ' ' + d.getFullYear();
}

// Normalizes either a live CvProfile (with Date fields, from Prisma) or a
// stored JSON snapshot (with ISO date strings) into the same plain shape,
// with dates pre-formatted, so the CV template views don't care which one
// they were handed.
function normalizeCv(source) {
  if (!source) return null;
  return {
    fullName: source.fullName || '',
    headline: source.headline || '',
    summary: source.summary || '',
    phone: source.phone || '',
    email: source.email || '',
    address: source.address || '',
    templateChoice: source.templateChoice || 'template1',
    experience: (source.experience || []).map((e) => ({
      jobTitle: e.jobTitle, company: e.company, description: e.description,
      period: (fmtMonthYear(e.startDate) || '—') + ' – ' + (e.current ? 'Heute' : (fmtMonthYear(e.endDate) || '—')),
    })),
    education: (source.education || []).map((e) => ({
      degree: e.degree, institution: e.institution, description: e.description,
      period: [fmtMonthYear(e.startDate), fmtMonthYear(e.endDate)].filter(Boolean).join(' – '),
    })),
    skills: (source.skills || []).map((s) => ({ name: s.name, level: s.level })),
    languages: (source.languages || []).map((l) => ({ name: l.name, level: l.level })),
  };
}

module.exports = { isCvComplete, snapshotCv, normalizeCv };
