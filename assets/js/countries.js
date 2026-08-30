// LocalJobs.de — country selector (all ISO 3166-1 countries, English names)
const LJ_COUNTRIES_RAW = [
  ['AF', 'Afghanistan'], ['EG', 'Egypt'], ['AL', 'Albania'], ['DZ', 'Algeria'],
  ['AD', 'Andorra'], ['AO', 'Angola'], ['AG', 'Antigua and Barbuda'], ['GQ', 'Equatorial Guinea'],
  ['AR', 'Argentina'], ['AM', 'Armenia'], ['AZ', 'Azerbaijan'], ['ET', 'Ethiopia'],
  ['AU', 'Australia'], ['BS', 'Bahamas'], ['BH', 'Bahrain'], ['BD', 'Bangladesh'],
  ['BB', 'Barbados'], ['BY', 'Belarus'], ['BE', 'Belgium'], ['BZ', 'Belize'],
  ['BJ', 'Benin'], ['BT', 'Bhutan'], ['BO', 'Bolivia'], ['BA', 'Bosnia and Herzegovina'],
  ['BW', 'Botswana'], ['BR', 'Brazil'], ['BN', 'Brunei'], ['BG', 'Bulgaria'],
  ['BF', 'Burkina Faso'], ['BI', 'Burundi'], ['CL', 'Chile'], ['CN', 'China'],
  ['CR', 'Costa Rica'], ['CI', "Côte d'Ivoire"], ['DK', 'Denmark'], ['DE', 'Germany'],
  ['DM', 'Dominica'], ['DO', 'Dominican Republic'], ['DJ', 'Djibouti'], ['EC', 'Ecuador'],
  ['SV', 'El Salvador'], ['ER', 'Eritrea'], ['EE', 'Estonia'], ['SZ', 'Eswatini'],
  ['FJ', 'Fiji'], ['FI', 'Finland'], ['FR', 'France'], ['GA', 'Gabon'],
  ['GM', 'Gambia'], ['GE', 'Georgia'], ['GH', 'Ghana'], ['GD', 'Grenada'],
  ['GR', 'Greece'], ['GT', 'Guatemala'], ['GN', 'Guinea'], ['GW', 'Guinea-Bissau'],
  ['GY', 'Guyana'], ['HT', 'Haiti'], ['HN', 'Honduras'], ['IN', 'India'],
  ['ID', 'Indonesia'], ['IQ', 'Iraq'], ['IR', 'Iran'], ['IE', 'Ireland'],
  ['IS', 'Iceland'], ['IL', 'Israel'], ['IT', 'Italy'], ['JM', 'Jamaica'],
  ['JP', 'Japan'], ['YE', 'Yemen'], ['JO', 'Jordan'], ['KH', 'Cambodia'],
  ['CM', 'Cameroon'], ['CA', 'Canada'], ['CV', 'Cape Verde'], ['KZ', 'Kazakhstan'],
  ['QA', 'Qatar'], ['KE', 'Kenya'], ['KG', 'Kyrgyzstan'], ['KI', 'Kiribati'],
  ['CO', 'Colombia'], ['KM', 'Comoros'], ['CD', 'Congo (Democratic Republic)'], ['CG', 'Congo (Republic)'],
  ['HR', 'Croatia'], ['CU', 'Cuba'], ['KW', 'Kuwait'], ['LA', 'Laos'],
  ['LS', 'Lesotho'], ['LV', 'Latvia'], ['LB', 'Lebanon'], ['LR', 'Liberia'],
  ['LY', 'Libya'], ['LI', 'Liechtenstein'], ['LT', 'Lithuania'], ['LU', 'Luxembourg'],
  ['MG', 'Madagascar'], ['MW', 'Malawi'], ['MY', 'Malaysia'], ['MV', 'Maldives'],
  ['ML', 'Mali'], ['MT', 'Malta'], ['MA', 'Morocco'], ['MH', 'Marshall Islands'],
  ['MR', 'Mauritania'], ['MU', 'Mauritius'], ['MX', 'Mexico'], ['FM', 'Micronesia'],
  ['MD', 'Moldova'], ['MC', 'Monaco'], ['MN', 'Mongolia'], ['ME', 'Montenegro'],
  ['MZ', 'Mozambique'], ['MM', 'Myanmar'], ['NA', 'Namibia'], ['NR', 'Nauru'],
  ['NP', 'Nepal'], ['NZ', 'New Zealand'], ['NI', 'Nicaragua'], ['NL', 'Netherlands'],
  ['NE', 'Niger'], ['NG', 'Nigeria'], ['KP', 'North Korea'], ['MK', 'North Macedonia'],
  ['NO', 'Norway'], ['OM', 'Oman'], ['AT', 'Austria'], ['TL', 'Timor-Leste'],
  ['PK', 'Pakistan'], ['PW', 'Palau'], ['PS', 'Palestine'], ['PA', 'Panama'],
  ['PG', 'Papua New Guinea'], ['PY', 'Paraguay'], ['PE', 'Peru'], ['PH', 'Philippines'],
  ['PL', 'Poland'], ['PT', 'Portugal'], ['RW', 'Rwanda'], ['RO', 'Romania'],
  ['RU', 'Russia'], ['SB', 'Solomon Islands'], ['ZM', 'Zambia'], ['WS', 'Samoa'],
  ['SM', 'San Marino'], ['ST', 'São Tomé and Príncipe'], ['SA', 'Saudi Arabia'], ['SE', 'Sweden'],
  ['CH', 'Switzerland'], ['SN', 'Senegal'], ['RS', 'Serbia'], ['SC', 'Seychelles'],
  ['SL', 'Sierra Leone'], ['ZW', 'Zimbabwe'], ['SG', 'Singapore'], ['SK', 'Slovakia'],
  ['SI', 'Slovenia'], ['SO', 'Somalia'], ['ES', 'Spain'], ['LK', 'Sri Lanka'],
  ['KN', 'St Kitts and Nevis'], ['LC', 'St Lucia'], ['VC', 'St Vincent and the Grenadines'], ['ZA', 'South Africa'],
  ['KR', 'South Korea'], ['SD', 'Sudan'], ['SS', 'South Sudan'], ['SR', 'Suriname'],
  ['SY', 'Syria'], ['TJ', 'Tajikistan'], ['TW', 'Taiwan'], ['TZ', 'Tanzania'],
  ['TH', 'Thailand'], ['TG', 'Togo'], ['TO', 'Tonga'], ['TT', 'Trinidad and Tobago'],
  ['TD', 'Chad'], ['CZ', 'Czechia'], ['TN', 'Tunisia'], ['TR', 'Turkey'],
  ['TM', 'Turkmenistan'], ['TV', 'Tuvalu'], ['UG', 'Uganda'], ['UA', 'Ukraine'],
  ['HU', 'Hungary'], ['UY', 'Uruguay'], ['UZ', 'Uzbekistan'], ['VU', 'Vanuatu'],
  ['VA', 'Vatican City'], ['VE', 'Venezuela'], ['AE', 'United Arab Emirates'], ['US', 'United States'],
  ['GB', 'United Kingdom'], ['VN', 'Vietnam'], ['CF', 'Central African Republic'], ['CY', 'Cyprus'],
];

// real flag images (not emoji) — Windows/many browsers render flag emoji as plain
// letters instead of flags, so we use the "flag-icons" CSS sprite library instead.
function ljFlagHtml(code) {
  return '<span class="fi fi-' + code.toLowerCase() + '"></span>';
}

const LJ_COUNTRIES = LJ_COUNTRIES_RAW
  .map(([code, name]) => ({ code, name }))
  .sort((a, b) => a.name.localeCompare(b.name, 'en'));

function ljInitCountrySelector({
  triggerId = 'countryTrigger',
  modalId = 'countryModal',
  searchId = 'countrySearchInput',
  listId = 'countryList',
  flagDisplayId = 'countryFlagDisplay',
  nameDisplayId = 'countryNameDisplay',
  defaultCode = 'DE',
  onSelect = null,
} = {}) {
  const trigger = document.getElementById(triggerId);
  const modal = document.getElementById(modalId);
  const searchInput = document.getElementById(searchId);
  const listEl = document.getElementById(listId);
  const flagDisplay = document.getElementById(flagDisplayId);
  const nameDisplay = document.getElementById(nameDisplayId);
  if (!modal || !listEl) return;

  // defaultCode reflects what the server already resolved (lj_country cookie,
  // or an IP-based guess on a brand-new visit) — trust it over any stale
  // localStorage value from before cookie-based persistence existed.
  let selectedCode = defaultCode;

  function renderList(filterText) {
    const q = (filterText || '').trim().toLowerCase();
    const items = q
      ? LJ_COUNTRIES.filter(c => c.name.toLowerCase().includes(q))
      : LJ_COUNTRIES;

    listEl.innerHTML = items.length ? items.map(c => (
      '<button type="button" class="country-row' + (c.code === selectedCode ? ' selected' : '') + '" data-code="' + c.code + '" data-name="' + c.name + '">' +
        ljFlagHtml(c.code) +
        '<span class="name">' + c.name + '</span>' +
        (c.code === selectedCode
          ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'
          : '') +
      '</button>'
    )).join('') : '<div class="empty-state" style="padding:30px 10px">No country found</div>';

    listEl.querySelectorAll('.country-row').forEach(row => {
      row.addEventListener('click', () => selectCountry(row.dataset.code, row.dataset.name));
    });
  }

  function updateDisplay() {
    const c = LJ_COUNTRIES.find(c => c.code === selectedCode) || LJ_COUNTRIES.find(c => c.code === defaultCode);
    if (flagDisplay) flagDisplay.className = 'fi fi-' + c.code.toLowerCase();
    if (nameDisplay) nameDisplay.textContent = c.name;
  }

  function selectCountry(code, name) {
    selectedCode = code;
    localStorage.setItem('lj_country_code', code);
    localStorage.setItem('lj_country_name', name);
    // 1 year, readable by server-side routes too so search results and the
    // homepage stay in sync with what was picked here
    document.cookie = 'lj_country=' + code + ';path=/;max-age=' + (60 * 60 * 24 * 365) + ';samesite=lax';
    updateDisplay();
    modal.classList.remove('open');
    if (typeof onSelect === 'function') onSelect({ code, name });
  }

  trigger?.addEventListener('click', () => {
    modal.classList.add('open');
    renderList('');
    if (searchInput) { searchInput.value = ''; setTimeout(() => searchInput.focus(), 50); }
  });

  searchInput?.addEventListener('input', () => renderList(searchInput.value));

  updateDisplay();
}
