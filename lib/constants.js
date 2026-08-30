// Shared taxonomies used by job posting forms, search filters, and views.

const JOB_CATEGORIES = [
  'Food & Hospitality',
  'Retail & Sales',
  'Warehouse & Logistics',
  'Office & Admin',
  'Skilled Trades',
  'Cleaning',
];

const EMPLOYMENT_TYPES = ['Mini Job', 'Part-Time', 'Full-Time', 'Temporary', 'Working Student'];

const COMPANY_TYPES = [
  { value: 'PRIVATE', label: 'Private Company' },
  { value: 'PUBLIC', label: 'Publicly Traded Company' },
  { value: 'GOVERNMENT', label: 'Government Institution' },
  { value: 'LOCAL', label: 'Local Business' },
];

function companyTypeLabel(value) {
  return COMPANY_TYPES.find((c) => c.value === value)?.label || value;
}

// No logo uploads in this app — every company gets a deterministic initials
// avatar instead (same idea as the hand-drawn mock logos this replaced).
const AVATAR_PALETTE = ['#16a34a', '#cc0000', '#0b3d91', '#7a1f1f', '#38bdf8', '#a855f7', '#ea580c', '#0f766e'];

function avatarColorFor(name) {
  const str = String(name || '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function initialsFor(name) {
  const parts = String(name || '?').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

module.exports = {
  JOB_CATEGORIES, EMPLOYMENT_TYPES, COMPANY_TYPES, companyTypeLabel, avatarColorFor, initialsFor,
};
