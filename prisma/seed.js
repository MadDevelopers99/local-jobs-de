const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: 'demo@localjobs.de' } });
  if (existing) {
    console.log('Seed data already present, skipping.');
    return;
  }

  const passwordHash = await bcrypt.hash('demo1234', 10);
  const demoOwner = await prisma.user.create({
    data: { email: 'demo@localjobs.de', passwordHash, firstName: 'Demo', lastName: 'Arbeitgeber' },
  });

  const companies = [
    { name: 'Restaurant Augustiner', contact: '+49 89 123456', email: 'jobs@augustiner-demo.de', website: 'https://augustiner.de', foundedDate: new Date('1328-01-01'), totalEmployees: 120, companyType: 'PRIVATE', country: 'DE' },
    { name: 'REWE Group', contact: '+49 89 234567', email: 'karriere@rewe-demo.de', website: 'https://rewe.de', foundedDate: new Date('1927-01-01'), totalEmployees: 5000, companyType: 'PUBLIC', country: 'DE' },
    { name: 'DHL Deutschland', contact: '+49 89 345678', email: 'jobs@dhl-demo.de', website: 'https://dhl.de', foundedDate: new Date('1969-01-01'), totalEmployees: 8000, companyType: 'PUBLIC', country: 'DE' },
    { name: 'Hofbräuhaus München', contact: '+49 89 456789', email: 'jobs@hofbraeuhaus-demo.de', website: 'https://hofbraeuhaus.de', foundedDate: new Date('1589-01-01'), totalEmployees: 200, companyType: 'LOCAL', country: 'DE' },
    { name: 'EisZimmer', contact: '+49 89 567890', email: 'jobs@eiszimmer-demo.de', website: null, foundedDate: new Date('2015-01-01'), totalEmployees: 15, companyType: 'LOCAL', country: 'DE' },
    { name: "L'Osteria München", contact: '+49 89 678901', email: 'jobs@losteria-demo.de', website: 'https://losteria.de', foundedDate: new Date('1999-01-01'), totalEmployees: 300, companyType: 'PRIVATE', country: 'DE' },
    { name: 'Stadt München — Bürgerbüro', contact: '+49 89 789012', email: 'jobs@muenchen-demo.de', website: 'https://muenchen.de', foundedDate: new Date('1158-01-01'), totalEmployees: 12000, companyType: 'GOVERNMENT', country: 'DE' },
  ];

  const createdCompanies = [];
  for (const c of companies) {
    createdCompanies.push(await prisma.company.create({ data: { ...c, ownerId: demoOwner.id } }));
  }
  const [augustiner, rewe, dhl, hofbrau, eiszimmer, losteria, stadt] = createdCompanies;

  const jobs = [
    { companyId: augustiner.id, title: 'Küchenhilfe (m/w/d)', category: 'Gastronomie', employmentType: 'Minijob', country: 'DE', city: 'München', salaryMin: 14, salaryMax: 14, description: 'Unterstützung bei der Zubereitung von Speisen sowie Vor- und Nachbereitung des Küchenbereichs.', responsibilities: 'Unterstützung bei der Zubereitung von Speisen\nVor- und Nachbereitung der Küche\nReinigung und Pflege der Arbeitsbereiche', requirements: 'Erste Erfahrung in der Küche von Vorteil\nZuverlässigkeit und Teamfähigkeit\nDeutschkenntnisse nicht erforderlich' },
    { companyId: augustiner.id, title: 'Kellner / Servicekraft (m/w/d)', category: 'Gastronomie', employmentType: 'Teilzeit', country: 'DE', city: 'München', salaryMin: 15, salaryMax: 16, description: 'Freundlicher und aufmerksamer Service für unsere Gäste im traditionsreichen Restaurant.', responsibilities: 'Bedienung der Gäste\nAufnahme von Bestellungen\nKassieren', requirements: 'Erfahrung im Service von Vorteil\nFreundliches Auftreten' },
    { companyId: rewe.id, title: 'Verkäufer (m/w/d)', category: 'Verkauf', employmentType: 'Teilzeit', country: 'DE', city: 'München', salaryMin: 13.5, salaryMax: 13.5, description: 'Beratung und Kassieren in unserer Filiale in München.', responsibilities: 'Warenverräumung\nKundenberatung\nKassiertätigkeiten', requirements: 'Freundliches Auftreten\nErste Erfahrung im Einzelhandel von Vorteil' },
    { companyId: dhl.id, title: 'Lagerhelfer (m/w/d)', category: 'Lager & Logistik', employmentType: 'Vollzeit', country: 'DE', city: 'München', salaryMin: 15, salaryMax: 15, description: 'Kommissionierung und Verladung von Paketen im Logistikzentrum.', responsibilities: 'Kommissionierung\nVerladung\nQualitätskontrolle', requirements: 'Körperliche Belastbarkeit\nZuverlässigkeit' },
    { companyId: hofbrau.id, title: 'Küchenhilfe (m/w/d)', category: 'Gastronomie', employmentType: 'Teilzeit', country: 'DE', city: 'München', salaryMin: 15, salaryMax: 15, description: 'Mitarbeit in der traditionsreichen Küche des Hofbräuhauses.', responsibilities: 'Vorbereitung von Speisen\nReinigung', requirements: 'Erfahrung von Vorteil' },
    { companyId: eiszimmer.id, title: 'Spüler (m/w/d)', category: 'Gastronomie', employmentType: 'Minijob', country: 'DE', city: 'München', salaryMin: 13, salaryMax: 13, description: 'Spülen und Reinigung der Küchenausstattung im Eiscafé.', responsibilities: 'Spülen\nReinigung der Küche', requirements: 'Keine Vorerfahrung nötig' },
    { companyId: losteria.id, title: 'Servicekraft (m/w/d)', category: 'Gastronomie', employmentType: 'Teilzeit', country: 'DE', city: 'München', salaryMin: 14.5, salaryMax: 14.5, description: 'Service in unserem italienischen Restaurant im Herzen Münchens.', responsibilities: 'Bedienung der Gäste\nBestellaufnahme', requirements: 'Freundliches Auftreten\nTeamfähigkeit' },
    { companyId: stadt.id, title: 'Sachbearbeiter Bürgerbüro (m/w/d)', category: 'Büro & Admin', employmentType: 'Vollzeit', country: 'DE', city: 'München', salaryMin: 18, salaryMax: 22, description: 'Bearbeitung von Anliegen der Bürger im Bürgerbüro der Stadt München.', responsibilities: 'Kundenberatung\nBearbeitung von Anträgen\nDatenpflege', requirements: 'Abgeschlossene kaufmännische Ausbildung\nGute Deutschkenntnisse' },
  ];

  for (const j of jobs) {
    await prisma.job.create({ data: j });
  }

  console.log(`Seeded 1 demo owner, ${createdCompanies.length} companies, ${jobs.length} jobs.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
