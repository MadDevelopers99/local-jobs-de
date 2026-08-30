// Server-side companion to assets/js/countries.js (same ISO 3166-1 list,
// English names) — kept as a separate small CommonJS module since the
// client-side file is a plain browser script, not something Node can
// require() directly.
const COUNTRIES_RAW = [
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

const COUNTRIES = COUNTRIES_RAW
  .map(([code, name]) => ({ code, name }))
  .sort((a, b) => a.name.localeCompare(b.name, 'en'));

const BY_CODE = Object.fromEntries(COUNTRIES.map((c) => [c.code, c.name]));

function countryName(code) {
  return BY_CODE[code] || code;
}

module.exports = { COUNTRIES, countryName };
