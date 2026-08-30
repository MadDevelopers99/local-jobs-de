-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('PRIVATE', 'PUBLIC', 'GOVERNMENT', 'LOCAL');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "foundedDate" TIMESTAMP(3),
    "totalEmployees" INTEGER,
    "companyType" "CompanyType" NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "employmentType" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "salaryCurrency" TEXT NOT NULL DEFAULT 'EUR',
    "description" TEXT NOT NULL,
    "responsibilities" TEXT,
    "requirements" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "applicantId" INTEGER NOT NULL,
    "cvSnapshot" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CvProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "fullName" TEXT,
    "headline" TEXT,
    "summary" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "templateChoice" TEXT NOT NULL DEFAULT 'template1',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CvProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CvExperience" (
    "id" SERIAL NOT NULL,
    "cvProfileId" INTEGER NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "current" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CvExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CvEducation" (
    "id" SERIAL NOT NULL,
    "cvProfileId" INTEGER NOT NULL,
    "degree" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CvEducation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CvSkill" (
    "id" SERIAL NOT NULL,
    "cvProfileId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "CvSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CvLanguage" (
    "id" SERIAL NOT NULL,
    "cvProfileId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'Gut',

    CONSTRAINT "CvLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Company_ownerId_idx" ON "Company"("ownerId");

-- CreateIndex
CREATE INDEX "Job_companyId_idx" ON "Job"("companyId");

-- CreateIndex
CREATE INDEX "Job_country_idx" ON "Job"("country");

-- CreateIndex
CREATE INDEX "Job_category_idx" ON "Job"("category");

-- CreateIndex
CREATE INDEX "Application_jobId_idx" ON "Application"("jobId");

-- CreateIndex
CREATE INDEX "Application_applicantId_idx" ON "Application"("applicantId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_jobId_applicantId_key" ON "Application"("jobId", "applicantId");

-- CreateIndex
CREATE UNIQUE INDEX "CvProfile_userId_key" ON "CvProfile"("userId");

-- CreateIndex
CREATE INDEX "CvExperience_cvProfileId_idx" ON "CvExperience"("cvProfileId");

-- CreateIndex
CREATE INDEX "CvEducation_cvProfileId_idx" ON "CvEducation"("cvProfileId");

-- CreateIndex
CREATE INDEX "CvSkill_cvProfileId_idx" ON "CvSkill"("cvProfileId");

-- CreateIndex
CREATE INDEX "CvLanguage_cvProfileId_idx" ON "CvLanguage"("cvProfileId");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CvProfile" ADD CONSTRAINT "CvProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CvExperience" ADD CONSTRAINT "CvExperience_cvProfileId_fkey" FOREIGN KEY ("cvProfileId") REFERENCES "CvProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CvEducation" ADD CONSTRAINT "CvEducation_cvProfileId_fkey" FOREIGN KEY ("cvProfileId") REFERENCES "CvProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CvSkill" ADD CONSTRAINT "CvSkill_cvProfileId_fkey" FOREIGN KEY ("cvProfileId") REFERENCES "CvProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CvLanguage" ADD CONSTRAINT "CvLanguage_cvProfileId_fkey" FOREIGN KEY ("cvProfileId") REFERENCES "CvProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
