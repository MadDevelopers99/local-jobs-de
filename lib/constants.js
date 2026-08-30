// Shared taxonomies used by job posting forms, search filters, and views.

// Every category, with a small stroke-icon (lucide-style path data, 24x24
// viewBox) used on the homepage category grid. `popular: true` categories
// get a homepage tile; the full list is always available in the jobs
// search filter and the post-job form's dropdown.
const CATEGORY_DEFS = [
  { name: 'Food & Hospitality', popular: true, icon: '<path d="M3 2v7a4 4 0 0 0 4 4v9"/><path d="M7 2v7"/><path d="M11 2v7"/><path d="M17 2c-2 2-2 5-2 8 0 3 2 4 2 4v9"/>' },
  { name: 'Retail & Sales', popular: true, icon: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>' },
  { name: 'IT & Software', popular: true, icon: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>' },
  { name: 'Warehouse & Logistics', popular: true, icon: '<path d="M21 8 12 3 3 8l9 5 9-5z"/><path d="M3 8v10l9 5 9-5V8"/><path d="M12 13v10"/>' },
  { name: 'Office & Admin', popular: true, icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 4v5"/>' },
  { name: 'Healthcare & Medical', popular: true, icon: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>' },
  { name: 'Skilled Trades', popular: true, icon: '<path d="M14.7 6.3a4 4 0 1 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-3-3z"/>' },
  { name: 'Customer Service', popular: true, icon: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>' },
  { name: 'Web Development', popular: false, icon: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>' },
  { name: 'Education & Training', popular: false, icon: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>' },
  { name: 'Finance & Accounting', popular: false, icon: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
  { name: 'Marketing & Advertising', popular: false, icon: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>' },
  { name: 'Construction', popular: false, icon: '<path d="M2 20h20"/><path d="M4 20V10l8-6 8 6v10"/><path d="M9 20v-6h6v6"/>' },
  { name: 'Manufacturing', popular: false, icon: '<path d="M2 20h20"/><path d="M4 20V8l5 3V8l5 3V8l5 3v9"/>' },
  { name: 'Transportation & Delivery', popular: false, icon: '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>' },
  { name: 'Engineering', popular: false, icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>' },
  { name: 'Human Resources', popular: false, icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
  { name: 'Design & Creative', popular: false, icon: '<circle cx="13.5" cy="6.5" r=".6"/><circle cx="17.5" cy="10.5" r=".6"/><circle cx="8.5" cy="7.5" r=".6"/><circle cx="6.5" cy="12.5" r=".6"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>' },
  { name: 'Legal', popular: false, icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/>' },
  { name: 'Cleaning', popular: false, icon: '<path d="M4 22h16"/><path d="M12 2v13"/><path d="M8 8l4-4 4 4"/><circle cx="12" cy="18" r="3"/>' },
];

const JOB_CATEGORIES = CATEGORY_DEFS.map((c) => c.name);
const POPULAR_CATEGORIES = CATEGORY_DEFS.filter((c) => c.popular);
const CATEGORY_ICONS = Object.fromEntries(CATEGORY_DEFS.map((c) => [c.name, c.icon]));

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
  JOB_CATEGORIES, POPULAR_CATEGORIES, CATEGORY_ICONS, EMPLOYMENT_TYPES, COMPANY_TYPES,
  companyTypeLabel, avatarColorFor, initialsFor,
};
