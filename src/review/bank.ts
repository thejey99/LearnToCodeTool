import { SEED_LESSONS } from '../lessons/seed';
import { PREDICT_DRAFTS } from './predict-items';
import type { ReviewItem } from '../types';

/**
 * The review bank is assembled, not authored twice.
 *
 * Every checkpoint quiz question in the curriculum already carries a prompt,
 * choices and an explanation, and until now each was shown exactly once and
 * then never again. Recycling them into the spaced-repetition schedule turns
 * ~90 questions of existing, already-validated material into review items for
 * free; the typed-recall items in predict-items.ts are the only new content.
 */

/** A tag that describes the lesson format rather than anything learnable. */
const NON_CONCEPT_TAGS = new Set(['review']);

function meaningfulConcepts(concepts: string[]): string[] {
  return concepts.filter((c) => !NON_CONCEPT_TAGS.has(c));
}

const MCQ_ITEMS: ReviewItem[] = SEED_LESSONS.flatMap((lesson) =>
  (lesson.quiz ?? []).map<ReviewItem>((question) => ({
    id: `mcq:${lesson.id}:${question.id}`,
    kind: 'mcq',
    lessonId: lesson.id,
    prompt: question.prompt,
    explanation: question.explanation,
    concepts: meaningfulConcepts(lesson.concepts),
    choices: question.choices,
    answerIndex: question.answerIndex,
  }))
);

const PREDICT_ITEMS: ReviewItem[] = PREDICT_DRAFTS.map<ReviewItem>((draft) => ({
  id: draft.id,
  kind: 'predict',
  lessonId: draft.lessonId,
  prompt: 'What does this print?',
  explanation: draft.explanation,
  concepts: meaningfulConcepts(draft.concepts),
  code: draft.code,
  language: draft.language,
  expected: draft.expected,
}));

export const REVIEW_BANK: ReviewItem[] = [...MCQ_ITEMS, ...PREDICT_ITEMS];

export const BANK_BY_ID = new Map(REVIEW_BANK.map((item) => [item.id, item]));

/**
 * Shuffles an item's choices so the answer is not always in the same place.
 *
 * Without this, re-serving a question you have seen before tests your memory
 * of *where* the answer sat rather than what it was — the exact failure mode
 * that makes multiple choice a weak form of retrieval practice.
 */
export function shuffledChoices(
  item: ReviewItem,
  seed: number
): { choices: string[]; answerIndex: number } {
  const choices = item.choices ?? [];
  const answer = choices[item.answerIndex ?? 0];

  const order = choices.map((choice, index) => ({ choice, index }));
  let state = seed || 1;
  for (let i = order.length - 1; i > 0; i--) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    const j = Math.floor((Math.abs(state) / 2 ** 31) * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  const shuffled = order.map((entry) => entry.choice);
  return { choices: shuffled, answerIndex: shuffled.indexOf(answer) };
}
