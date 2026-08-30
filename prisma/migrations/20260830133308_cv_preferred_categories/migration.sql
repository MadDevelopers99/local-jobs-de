-- Lets a job seeker tag which job categories they're interested in, so the
-- home page can recommend matching listings.
ALTER TABLE "CvProfile" ADD COLUMN "preferredCategories" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
