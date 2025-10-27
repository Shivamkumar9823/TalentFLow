// src/seedData.js

import { faker } from '@faker-js/faker';
import { db } from './db';

const STAGES = ["applied", "screen", "tech", "offer", "hired", "rejected"];



function createMockJob(index) {
  const title = faker.person.jobTitle();
  const slug = title.toLowerCase().replace(/\s/g, '-').replace(/[^\w-]+/g, '');
  const tags = faker.helpers.arrayElements(['React', 'Node.js', 'Testing', 'DevOps', 'Design'], { min: 1, max: 3 });
  return {
    id: faker.string.uuid(),
    title: title,
    slug: slug,
    status: faker.helpers.arrayElement(['active', 'archived']),
    tags: tags,
    order: index, 
    createdAt: Date.now(),
  };
}



function createMockCandidate(jobId) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const name = `${firstName} ${lastName}`;
  return {
    id: faker.string.uuid(),
    jobId: jobId,
    name: name,
    email: faker.internet.email({ firstName, lastName }),
    stage: faker.helpers.arrayElement(STAGES),

    phone: faker.phone.number('###-###-####'),
    location: faker.location.city(),
    appliedDate: faker.date.recent({ days: 60 }).toISOString(),
  };
}



function createMockAssessment(jobTitle) {
    const questionTypes = ["single-choice", "multi-choice", "short text", "long text", "numeric with range"];
    const questions = Array.from({ length: 12 }, () => ({
        id: faker.string.uuid(),
        type: faker.helpers.arrayElement(questionTypes),
        label: faker.lorem.sentence({ min: 5, max: 10 }),
        required: faker.datatype.boolean(), 
    }));
    return {
        title: `Technical Screening for ${jobTitle}`,
        sections: [{ title: "Core Competencies", questions }]
    };
}



export async function seedDatabase() {
  const jobsCount = await db.jobs.count();
  if (jobsCount > 0) {
    console.log('Database already seeded. State restored from IndexedDB.');
    return;
  }

  console.log('Seeding database with initial data...');
  
  try {
    const jobs = Array.from({ length: 25 }, (_, i) => createMockJob(i + 1));
    await db.jobs.bulkPut(jobs);
    const jobIds = jobs.map(j => j.id);

    const candidates = Array.from({ length: 1000 }, () => {
      const jobId = faker.helpers.arrayElement(jobIds); 
      return createMockCandidate(jobId);
    });
    await db.candidates.bulkPut(candidates);

    const assessments = jobIds.slice(0, 3).map(jobId => ({
      jobId: jobId,
      structure: createMockAssessment(jobs.find(j => j.id === jobId)?.title),
    }));
    await db.assessments.bulkPut(assessments);

    console.log('Database seeding complete!');
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}