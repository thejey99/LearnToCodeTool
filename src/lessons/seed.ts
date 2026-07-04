import type { Lesson } from '../types';
import { JS_LESSONS } from './js';
import { TS_LESSONS } from './ts';
import { PY_LESSONS } from './py';

export const SEED_LESSONS: Lesson[] = [
  ...JS_LESSONS,
  ...TS_LESSONS,
  ...PY_LESSONS,
];
