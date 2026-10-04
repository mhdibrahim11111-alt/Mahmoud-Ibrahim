import { Part } from '../types';
import { partExamsData } from './partExamsData';
import { part1 } from './parts/part1';
import { part2 } from './parts/part2';
import { part3 } from './parts/part3';
import { part4 } from './parts/part4';
import { part5 } from './parts/part5';
import { part6 } from './parts/part6';

export const bookParts: Part[] = [
  part1,
  part2,
  part3,
  part4,
  part5,
  part6,
];

// Attach Part Comprehensive Exams & Capstone Challenges & Summaries
bookParts.forEach((part) => {
  if (partExamsData[part.id]) {
    part.summary = partExamsData[part.id];
    part.comprehensiveExam = partExamsData[part.id];
  }
});
