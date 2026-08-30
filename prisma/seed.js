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
    data: { email: 'demo@localjobs.de', passwordHash, firstName: 'Demo', lastName: 'Employer' },
  });

  const companies = [
    { name: 'Augustiner Restaurant', contact: '+49 89 123456', email: 'jobs@augustiner-demo.de', website: 'https://augustiner.de', foundedDate: new Date('1328-01-01'), totalEmployees: 120, companyType: 'PRIVATE', country: 'DE' },
    { name: 'REWE Group', contact: '+49 89 234567', email: 'careers@rewe-demo.de', website: 'https://rewe.de', foundedDate: new Date('1927-01-01'), totalEmployees: 5000, companyType: 'PUBLIC', country: 'DE' },
    { name: 'DHL Germany', contact: '+49 89 345678', email: 'jobs@dhl-demo.de', website: 'https://dhl.de', foundedDate: new Date('1969-01-01'), totalEmployees: 8000, companyType: 'PUBLIC', country: 'DE' },
    { name: 'Hofbräuhaus Munich', contact: '+49 89 456789', email: 'jobs@hofbraeuhaus-demo.de', website: 'https://hofbraeuhaus.de', foundedDate: new Date('1589-01-01'), totalEmployees: 200, companyType: 'LOCAL', country: 'DE' },
    { name: 'EisZimmer', contact: '+49 89 567890', email: 'jobs@eiszimmer-demo.de', website: null, foundedDate: new Date('2015-01-01'), totalEmployees: 15, companyType: 'LOCAL', country: 'DE' },
    { name: "L'Osteria Munich", contact: '+49 89 678901', email: 'jobs@losteria-demo.de', website: 'https://losteria.de', foundedDate: new Date('1999-01-01'), totalEmployees: 300, companyType: 'PRIVATE', country: 'DE' },
    { name: 'City of Munich — Citizens\' Office', contact: '+49 89 789012', email: 'jobs@muenchen-demo.de', website: 'https://muenchen.de', foundedDate: new Date('1158-01-01'), totalEmployees: 12000, companyType: 'GOVERNMENT', country: 'DE' },
  ];

  const createdCompanies = [];
  for (const c of companies) {
    createdCompanies.push(await prisma.company.create({ data: { ...c, ownerId: demoOwner.id } }));
  }
  const [augustiner, rewe, dhl, hofbrau, eiszimmer, losteria, city] = createdCompanies;

  const jobs = [
    { companyId: augustiner.id, title: 'Kitchen Assistant', category: 'Food & Hospitality', employmentType: 'Mini Job', country: 'DE', city: 'Munich', salaryMin: 14, salaryMax: 14, description: 'Help prepare dishes and keep the kitchen area running smoothly, before and after service.', responsibilities: 'Help prepare dishes\nPrep and clean-up in the kitchen\nCleaning and maintaining work areas', requirements: 'Some kitchen experience preferred\nReliability and teamwork\nNo German language skills required' },
    { companyId: augustiner.id, title: 'Server / Waitstaff', category: 'Food & Hospitality', employmentType: 'Part-Time', country: 'DE', city: 'Munich', salaryMin: 15, salaryMax: 16, description: 'Friendly, attentive service for our guests in a traditional restaurant.', responsibilities: 'Serving guests\nTaking orders\nHandling payments', requirements: 'Service experience preferred\nFriendly demeanor' },
    { companyId: rewe.id, title: 'Sales Assistant', category: 'Retail & Sales', employmentType: 'Part-Time', country: 'DE', city: 'Munich', salaryMin: 13.5, salaryMax: 13.5, description: 'Customer advice and checkout duties at our Munich store.', responsibilities: 'Restocking shelves\nCustomer advice\nCheckout duties', requirements: 'Friendly demeanor\nSome retail experience preferred' },
    { companyId: dhl.id, title: 'Warehouse Assistant', category: 'Warehouse & Logistics', employmentType: 'Full-Time', country: 'DE', city: 'Munich', salaryMin: 15, salaryMax: 15, description: 'Picking and loading packages at our logistics center.', responsibilities: 'Order picking\nLoading\nQuality checks', requirements: 'Physically fit\nReliability' },
    { companyId: hofbrau.id, title: 'Kitchen Assistant', category: 'Food & Hospitality', employmentType: 'Part-Time', country: 'DE', city: 'Munich', salaryMin: 15, salaryMax: 15, description: 'Join the kitchen team at the historic Hofbräuhaus.', responsibilities: 'Preparing dishes\nCleaning', requirements: 'Experience preferred' },
    { companyId: eiszimmer.id, title: 'Dishwasher', category: 'Food & Hospitality', employmentType: 'Mini Job', country: 'DE', city: 'Munich', salaryMin: 13, salaryMax: 13, description: 'Washing dishes and cleaning kitchen equipment at our ice cream café.', responsibilities: 'Dishwashing\nKitchen cleaning', requirements: 'No prior experience needed' },
    { companyId: losteria.id, title: 'Server', category: 'Food & Hospitality', employmentType: 'Part-Time', country: 'DE', city: 'Munich', salaryMin: 14.5, salaryMax: 14.5, description: 'Service at our Italian restaurant in the heart of Munich.', responsibilities: 'Serving guests\nTaking orders', requirements: 'Friendly demeanor\nTeamwork' },
    { companyId: city.id, title: 'Citizens\' Office Clerk', category: 'Office & Admin', employmentType: 'Full-Time', country: 'DE', city: 'Munich', salaryMin: 18, salaryMax: 22, description: 'Handling citizen requests at the City of Munich Citizens\' Office.', responsibilities: 'Customer advice\nProcessing applications\nData maintenance', requirements: 'Completed commercial training\nGood German language skills' },
  ];

  for (const j of jobs) {
    await prisma.job.create({ data: j });
  }

  console.log(`Seeded 1 demo owner, ${createdCompanies.length} companies, ${jobs.length} jobs.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
