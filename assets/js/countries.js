// LocalJobs.de — country selector (all ISO 3166-1 countries, German names)
const LJ_COUNTRIES_RAW = [
  ['AF', 'Afghanistan'], ['EG', 'Ägypten'], ['AL', 'Albanien'], ['DZ', 'Algerien'],
  ['AD', 'Andorra'], ['AO', 'Angola'], ['AG', 'Antigua und Barbuda'], ['GQ', 'Äquatorialguinea'],
  ['AR', 'Argentinien'], ['AM', 'Armenien'], ['AZ', 'Aserbaidschan'], ['ET', 'Äthiopien'],
  ['AU', 'Australien'], ['BS', 'Bahamas'], ['BH', 'Bahrain'], ['BD', 'Bangladesch'],
  ['BB', 'Barbados'], ['BY', 'Belarus'], ['BE', 'Belgien'], ['BZ', 'Belize'],
  ['BJ', 'Benin'], ['BT', 'Bhutan'], ['BO', 'Bolivien'], ['BA', 'Bosnien und Herzegowina'],
  ['BW', 'Botswana'], ['BR', 'Brasilien'], ['BN', 'Brunei'], ['BG', 'Bulgarien'],
  ['BF', 'Burkina Faso'], ['BI', 'Burundi'], ['CL', 'Chile'], ['CN', 'China'],
  ['CR', 'Costa Rica'], ['CI', 'Elfenbeinküste'], ['DK', 'Dänemark'], ['DE', 'Deutschland'],
  ['DM', 'Dominica'], ['DO', 'Dominikanische Republik'], ['DJ', 'Dschibuti'], ['EC', 'Ecuador'],
  ['SV', 'El Salvador'], ['ER', 'Eritrea'], ['EE', 'Estland'], ['SZ', 'Eswatini'],
  ['FJ', 'Fidschi'], ['FI', 'Finnland'], ['FR', 'Frankreich'], ['GA', 'Gabun'],
  ['GM', 'Gambia'], ['GE', 'Georgien'], ['GH', 'Ghana'], ['GD', 'Grenada'],
  ['GR', 'Griechenland'], ['GT', 'Guatemala'], ['GN', 'Guinea'], ['GW', 'Guinea-Bissau'],
  ['GY', 'Guyana'], ['HT', 'Haiti'], ['HN', 'Honduras'], ['IN', 'Indien'],
  ['ID', 'Indonesien'], ['IQ', 'Irak'], ['IR', 'Iran'], ['IE', 'Irland'],
  ['IS', 'Island'], ['IL', 'Israel'], ['IT', 'Italien'], ['JM', 'Jamaika'],
  ['JP', 'Japan'], ['YE', 'Jemen'], ['JO', 'Jordanien'], ['KH', 'Kambodscha'],
  ['CM', 'Kamerun'], ['CA', 'Kanada'], ['CV', 'Kap Verde'], ['KZ', 'Kasachstan'],
  ['QA', 'Katar'], ['KE', 'Kenia'], ['KG', 'Kirgisistan'], ['KI', 'Kiribati'],
  ['CO', 'Kolumbien'], ['KM', 'Komoren'], ['CD', 'Kongo (Demokratische Republik)'], ['CG', 'Kongo (Republik)'],
  ['HR', 'Kroatien'], ['CU', 'Kuba'], ['KW', 'Kuwait'], ['LA', 'Laos'],
  ['LS', 'Lesotho'], ['LV', 'Lettland'], ['LB', 'Libanon'], ['LR', 'Liberia'],
  ['LY', 'Libyen'], ['LI', 'Liechtenstein'], ['LT', 'Litauen'], ['LU', 'Luxemburg'],
  ['MG', 'Madagaskar'], ['MW', 'Malawi'], ['MY', 'Malaysia'], ['MV', 'Malediven'],
  ['ML', 'Mali'], ['MT', 'Malta'], ['MA', 'Marokko'], ['MH', 'Marshallinseln'],
  ['MR', 'Mauretanien'], ['MU', 'Mauritius'], ['MX', 'Mexiko'], ['FM', 'Mikronesien'],
  ['MD', 'Moldau'], ['MC', 'Monaco'], ['MN', 'Mongolei'], ['ME', 'Montenegro'],
  ['MZ', 'Mosambik'], ['MM', 'Myanmar'], ['NA', 'Namibia'], ['NR', 'Nauru'],
  ['NP', 'Nepal'], ['NZ', 'Neuseeland'], ['NI', 'Nicaragua'], ['NL', 'Niederlande'],
  ['NE', 'Niger'], ['NG', 'Nigeria'], ['KP', 'Nordkorea'], ['MK', 'Nordmazedonien'],
  ['NO', 'Norwegen'], ['OM', 'Oman'], ['AT', 'Österreich'], ['TL', 'Osttimor'],
  ['PK', 'Pakistan'], ['PW', 'Palau'], ['PS', 'Palästina'], ['PA', 'Panama'],
  ['PG', 'Papua-Neuguinea'], ['PY', 'Paraguay'], ['PE', 'Peru'], ['PH', 'Philippinen'],
  ['PL', 'Polen'], ['PT', 'Portugal'], ['RW', 'Ruanda'], ['RO', 'Rumänien'],
  ['RU', 'Russland'], ['SB', 'Salomonen'], ['ZM', 'Sambia'], ['WS', 'Samoa'],
  ['SM', 'San Marino'], ['ST', 'São Tomé und Príncipe'], ['SA', 'Saudi-Arabien'], ['SE', 'Schweden'],
  ['CH', 'Schweiz'], ['SN', 'Senegal'], ['RS', 'Serbien'], ['SC', 'Seychellen'],
  ['SL', 'Sierra Leone'], ['ZW', 'Simbabwe'], ['SG', 'Singapur'], ['SK', 'Slowakei'],
  ['SI', 'Slowenien'], ['SO', 'Somalia'], ['ES', 'Spanien'], ['LK', 'Sri Lanka'],
  ['KN', 'St. Kitts und Nevis'], ['LC', 'St. Lucia'], ['VC', 'St. Vincent und die Grenadinen'], ['ZA', 'Südafrika'],
  ['KR', 'Südkorea'], ['SD', 'Sudan'], ['SS', 'Südsudan'], ['SR', 'Suriname'],
  ['SY', 'Syrien'], ['TJ', 'Tadschikistan'], ['TW', 'Taiwan'], ['TZ', 'Tansania'],
  ['TH', 'Thailand'], ['TG', 'Togo'], ['TO', 'Tonga'], ['TT', 'Trinidad und Tobago'],
  ['TD', 'Tschad'], ['CZ', 'Tschechien'], ['TN', 'Tunesien'], ['TR', 'Türkei'],
  ['TM', 'Turkmenistan'], ['TV', 'Tuvalu'], ['UG', 'Uganda'], ['UA', 'Ukraine'],
  ['HU', 'Ungarn'], ['UY', 'Uruguay'], ['UZ', 'Usbekistan'], ['VU', 'Vanuatu'],
  ['VA', 'Vatikanstadt'], ['VE', 'Venezuela'], ['AE', 'Vereinigte Arabische Emirate'], ['US', 'Vereinigte Staaten'],
  ['GB', 'Vereinigtes Königreich'], ['VN', 'Vietnam'], ['CF', 'Zentralafrikanische Republik'], ['CY', 'Zypern'],
];

// real flag images (not emoji) — Windows/many browsers render flag emoji as plain
// letters instead of flags, so we use the "flag-icons" CSS sprite library instead.
function ljFlagHtml(code) {
  return '<span class="fi fi-' + code.toLowerCase() + '"></span>';
}

const LJ_COUNTRIES = LJ_COUNTRIES_RAW
  .map(([code, name]) => ({ code, name }))
  .sort((a, b) => a.name.localeCompare(b.name, 'de'));

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

  let selectedCode = localStorage.getItem('lj_country_code') || defaultCode;

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
    )).join('') : '<div class="empty-state" style="padding:30px 10px">Kein Land gefunden</div>';

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
