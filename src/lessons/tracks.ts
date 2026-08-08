import type { Track, TrackId } from '../types';

/**
 * The curriculum is organised as tracks, ordered roughly the way a working
 * developer accumulates these skills. `requires` gates a track behind real
 * progress in its prerequisites rather than behind a strict lesson-by-lesson
 * chain across the whole app.
 */
export const TRACKS: Track[] = [
  {
    id: 'foundations',
    title: 'Programming Foundations',
    blurb: 'Variables, logic, loops, functions, arrays — the universal core.',
    rationale:
      'Every language you will ever use is a re-spelling of these eight ideas. Learn them once, properly, and the second language takes days instead of months.',
    icon: '🧱',
    color: '#f1e05a',
    level: 'Beginner',
    outcomes: [
      'Read a piece of code and predict what it prints',
      'Break a problem into variables, conditions and loops',
      'Write and call your own functions',
    ],
  },
  {
    id: 'js-deep',
    title: 'JavaScript in Depth',
    blurb: 'Closures, array methods, objects, classes, modules, error handling.',
    rationale:
      'This is the gap between "finished a tutorial" and "can be handed a ticket". Professional JavaScript is written with map/filter/reduce, destructuring and proper error handling, and interviewers probe closures and references specifically because they separate the two groups.',
    icon: '⚡',
    color: '#f7df1e',
    level: 'Intermediate',
    requires: ['foundations'],
    outcomes: [
      'Transform data with map, filter and reduce instead of manual loops',
      'Explain closures, scope and reference semantics under questioning',
      'Model a domain with classes and modules',
      'Fail loudly and deliberately with custom errors',
    ],
  },
  {
    id: 'types',
    title: 'TypeScript',
    blurb: 'Annotations, interfaces, unions, generics, narrowing, and why teams insist on it.',
    rationale:
      'Most professional front-end and Node work is TypeScript now. Types are how large codebases stay editable by people who did not write them.',
    icon: '🛡️',
    color: '#3178c6',
    level: 'Intermediate',
    requires: ['foundations'],
    outcomes: [
      'Model data with interfaces, unions and generics',
      'Use discriminated unions to make invalid states unrepresentable',
      'Read the type signatures in real library documentation',
    ],
  },
  {
    id: 'async',
    title: 'Asynchronous JavaScript',
    blurb: 'The event loop, promises, async/await, concurrency and failure.',
    rationale:
      'Real software waits — on networks, disks and users. Async bugs are the ones that reach production, because they only appear under timing you did not test.',
    icon: '⏳',
    color: '#a371f7',
    level: 'Intermediate',
    requires: ['js-deep'],
    outcomes: [
      'Predict the output order of interleaved sync and async code',
      'Write async/await with correct error handling',
      'Run work in parallel with Promise.all and handle partial failure',
      'Implement retry with backoff, timeouts and cancellation',
    ],
  },
  {
    id: 'testing',
    title: 'Testing & Debugging',
    blurb: 'Unit tests, TDD, edge cases, refactoring safely, reading a stack trace.',
    rationale:
      'On a real team you will spend more time changing existing code than writing new code, and tests are what make that safe. "Do you write tests?" is asked in almost every interview.',
    icon: '🧪',
    color: '#3fb950',
    level: 'Intermediate',
    requires: ['js-deep'],
    outcomes: [
      'Write unit tests that actually catch regressions',
      'Work test-first: red, green, refactor',
      'Find the edge cases a specification leaves out',
      'Debug from a stack trace instead of by guessing',
    ],
  },
  {
    id: 'frontend',
    title: 'Front-End Engineering',
    blurb: 'DOM, events, state, forms, fetch, rendering, accessibility, storage.',
    rationale:
      'Frameworks change every few years; the browser underneath does not. Understanding state, rendering and events directly is what makes React or anything after it make sense.',
    icon: '🖥️',
    color: '#58a6ff',
    level: 'Intermediate',
    requires: ['js-deep'],
    outcomes: [
      'Build an interactive interface from state, not from patching the DOM',
      'Load and render remote data, including the loading and error states',
      'Handle forms and validation',
      'Build interfaces a keyboard and screen reader can use',
    ],
  },
  {
    id: 'games',
    title: 'Build Games',
    blurb: 'Clicker, Snake, Breakout and Memory Match — from an empty canvas.',
    rationale:
      'Games teach the game loop, state machines, collision maths and animation. They are also the projects people actually finish, because you can see them working.',
    icon: '🎮',
    color: '#f0883e',
    level: 'Intermediate',
    requires: ['foundations'],
    outcomes: [
      'Drive animation with a game loop',
      'Model game state and transitions',
      'Draw and animate on a canvas',
    ],
  },
  {
    id: 'python',
    title: 'Python',
    blurb: 'A second language: syntax, comprehensions, classes, files and errors.',
    rationale:
      'Python is the default language of data, scripting, automation and back-end services. Learning a second language is also what turns syntax knowledge into transferable understanding.',
    icon: '🐍',
    color: '#3572A5',
    level: 'Beginner',
    requires: ['foundations'],
    outcomes: [
      'Write idiomatic Python, not JavaScript with different punctuation',
      'Use comprehensions, slicing and the standard library',
      'Model with classes and handle exceptions properly',
    ],
  },
  {
    id: 'data',
    title: 'Data & SQL',
    blurb: 'Real queries against a real database: joins, aggregates, indexes, modelling.',
    rationale:
      'Almost every application is a database with a user interface attached. SQL has outlived every framework built on top of it, and being fluent in it is one of the highest-leverage skills you can carry between jobs.',
    icon: '🗄️',
    color: '#e38c00',
    level: 'Intermediate',
    requires: ['foundations'],
    outcomes: [
      'Query, filter, group and join across tables',
      'Design a schema with sensible keys and relationships',
      'Reason about why a query is slow',
    ],
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    blurb: 'Big-O, hash maps, stacks, queues, linked lists, trees, graphs, sorting, recursion, DP.',
    rationale:
      'Two reasons, in this order: it is how you develop judgement about which approach will hold up under real data, and it is what technical interviews are made of.',
    icon: '🧠',
    color: '#a371f7',
    level: 'Advanced',
    requires: ['js-deep'],
    outcomes: [
      'Analyse time and space complexity out loud',
      'Reach for the right structure — map, set, stack, queue, heap — by reflex',
      'Solve problems with recursion, two pointers, sliding windows and BFS/DFS',
      'Recognise and write a dynamic-programming solution',
    ],
  },
  {
    id: 'backend',
    title: 'Back-End & APIs',
    blurb: 'HTTP, REST design, JSON, status codes, auth, caching, idempotency.',
    rationale:
      'The interface between services is where most production incidents are born. You can reason about HTTP semantics without a server in front of you, and this track does exactly that.',
    icon: '🔌',
    color: '#39c5cf',
    level: 'Advanced',
    requires: ['async'],
    outcomes: [
      'Design a REST resource model and pick correct status codes',
      'Implement request routing, validation and error envelopes',
      'Explain authentication, sessions and tokens',
      'Reason about retries, idempotency and rate limits',
    ],
  },
  {
    id: 'craft',
    title: 'Working as an Engineer',
    blurb: 'Git, code review, system design, security, CI/CD, estimation, reading code.',
    rationale:
      'This is the part no tutorial covers and every junior is judged on. Writing the code is maybe a third of the job; the rest is version control, review, communication and not shipping a vulnerability.',
    icon: '🛠️',
    color: '#d29922',
    level: 'Professional',
    requires: ['testing'],
    outcomes: [
      'Use git confidently, including the recovery cases',
      'Give and take a code review without friction',
      'Sketch a system design and defend the trade-offs',
      'Spot the common security holes before review does',
    ],
  },
  {
    id: 'interview',
    title: 'Interview Preparation',
    blurb: 'Classic problems under test, complexity analysis, and how to talk while you code.',
    rationale:
      'The hiring process is its own skill, separate from the job. Here you solve the recurring problems against hidden tests and practise narrating the trade-offs the way an interviewer wants to hear them.',
    icon: '🎯',
    color: '#f85149',
    level: 'Professional',
    requires: ['dsa'],
    outcomes: [
      'Solve the standard interview problems from scratch',
      'State the complexity of your solution and improve it on request',
      'Handle the behavioural and system-design rounds',
    ],
  },
];

export const TRACK_ORDER: TrackId[] = TRACKS.map((t) => t.id);

export const TRACK_BY_ID: Record<TrackId, Track> = Object.fromEntries(
  TRACKS.map((t) => [t.id, t])
) as Record<TrackId, Track>;
