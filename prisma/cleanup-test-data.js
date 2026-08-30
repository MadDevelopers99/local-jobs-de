// One-off: removes the throwaway accounts/companies/jobs created while
// end-to-end testing (their emails start with "testuser"/"applicant"), so the
// production database only has the real seed content when the site launches.
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const testUsers = await prisma.user.findMany({
    where: { OR: [{ email: { startsWith: 'testuser' } }, { email: { startsWith: 'applicant' } }] },
  });
  const userIds = testUsers.map((u) => u.id);
  if (userIds.length === 0) {
    console.log('No test users found, nothing to clean up.');
    return;
  }

  const testCompanies = await prisma.company.findMany({ where: { ownerId: { in: userIds } } });
  const companyIds = testCompanies.map((c) => c.id);

  const delApps = await prisma.application.deleteMany({ where: { applicantId: { in: userIds } } });
  const delJobs = await prisma.job.deleteMany({ where: { companyId: { in: companyIds } } });
  const delCompanies = await prisma.company.deleteMany({ where: { id: { in: companyIds } } });
  const delCv = await prisma.cvProfile.deleteMany({ where: { userId: { in: userIds } } });
  const delUsers = await prisma.user.deleteMany({ where: { id: { in: userIds } } });

  console.log({ applications: delApps.count, jobs: delJobs.count, companies: delCompanies.count, cvProfiles: delCv.count, users: delUsers.count });
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
