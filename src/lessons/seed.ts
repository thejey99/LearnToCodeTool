import type { Lesson } from '../types';

export const SEED_LESSONS: Lesson[] = [
  // ── JavaScript track ──────────────────────────────
  {
    id: 'js-01-hello',
    order: 1,
    title: 'Hello, World!',
    language: 'javascript',
    instructions:
      'Welcome to Code Lab!\n\nEvery programmer starts here. Use console.log() to print a message to the terminal.\n\nYour task: print exactly:\n\nHello, World!\n\nThen hit Run.',
    starterCode: '// Print your first message below\n',
    expectedOutput: ['Hello, World!'],
  },
  {
    id: 'js-02-variables',
    order: 2,
    title: 'Variables',
    language: 'javascript',
    instructions:
      'Variables store values you can reuse.\n\nconst makes a variable that cannot be reassigned.\nlet makes one that can.\n\nYour task:\n1. Create a const named city with the value "Charleston"\n2. Create a let named rooms with the value 120\n3. Print: <city> has <rooms> rooms\n\nExpected output is shown below the instructions. Template literals help: `${city} has ${rooms} rooms`',
    starterCode:
      '// 1. const city = ...\n// 2. let rooms = ...\n// 3. console.log(...)\n',
    expectedOutput: ['Charleston has 120 rooms'],
  },
  {
    id: 'js-03-loops',
    order: 3,
    title: 'Loops',
    language: 'javascript',
    instructions:
      'Loops repeat work so you do not have to.\n\nA for loop has three parts: start, condition, step.\n\nfor (let i = 1; i <= 3; i++) { ... }\n\nYour task: print the numbers 1 through 5, one per line.',
    starterCode: 'for (let i = 1; i <= 5; i++) {\n  // print i here\n}\n',
    expectedOutput: ['1', '2', '3', '4', '5'],
  },
  {
    id: 'js-04-functions',
    order: 4,
    title: 'Functions',
    language: 'javascript',
    instructions:
      'Functions package logic you can call by name.\n\nfunction double(n) {\n  return n * 2;\n}\n\nYour task: write a function revpar(adr, occupancy) that returns adr multiplied by occupancy, then print revpar(200, 0.75).',
    starterCode:
      'function revpar(adr, occupancy) {\n  // return the result\n}\n\nconsole.log(revpar(200, 0.75));\n',
    expectedOutput: ['150'],
  },

  // ── TypeScript track ──────────────────────────────
  {
    id: 'ts-01-types',
    order: 5,
    title: 'Your First Types',
    language: 'typescript',
    instructions:
      'TypeScript is JavaScript plus type annotations.\n\nlet name: string = "Ada";\nlet age: number = 36;\n\nYour task:\n1. Declare hotel as a string with value "Surfside"\n2. Declare floors as a number with value 6\n3. Print: <hotel> has <floors> floors',
    starterCode:
      '// Add type annotations to your declarations\n\nconsole.log(/* your template literal */);\n',
    expectedOutput: ['Surfside has 6 floors'],
  },
  {
    id: 'ts-02-interfaces',
    order: 6,
    title: 'Interfaces',
    language: 'typescript',
    instructions:
      'Interfaces describe the shape of an object.\n\ninterface Room {\n  number: number;\n  type: string;\n}\n\nYour task: define an interface Guest with fields name (string) and nights (number). Create a guest object for "Alice" staying 3 nights, then print: Alice is staying 3 nights',
    starterCode:
      'interface Guest {\n  // define the fields\n}\n\nconst guest: Guest = {\n  // fill in\n};\n\nconsole.log(`${guest.name} is staying ${guest.nights} nights`);\n',
    expectedOutput: ['Alice is staying 3 nights'],
  },
  {
    id: 'ts-03-generics',
    order: 7,
    title: 'Generics',
    language: 'typescript',
    instructions:
      'Generics let functions work with any type while staying type-safe.\n\nfunction first<T>(items: T[]): T {\n  return items[0];\n}\n\nYour task: write a function last<T>(items: T[]): T that returns the final element, then print last([10, 20, 30]).',
    starterCode:
      'function last<T>(items: T[]): T {\n  // return the last element\n}\n\nconsole.log(last([10, 20, 30]));\n',
    expectedOutput: ['30'],
  },

  // ── Python track ──────────────────────────────────
  {
    id: 'py-01-hello',
    order: 8,
    title: 'Python: Hello',
    language: 'python',
    instructions:
      'Python uses print() instead of console.log().\n\nYour task: print exactly:\n\nHello from Python!',
    starterCode: '# Print your message\n',
    expectedOutput: ['Hello from Python!'],
  },
  {
    id: 'py-02-fstrings',
    order: 9,
    title: 'f-strings',
    language: 'python',
    instructions:
      'Python f-strings embed values in text:\n\nname = "Ada"\nprint(f"Hi {name}")\n\nYour task:\n1. Set occupancy to 0.85\n2. Set adr to 210\n3. Print: RevPAR is 178.5\n\nHint: multiply inside the f-string: f"RevPAR is {adr * occupancy}"',
    starterCode: 'occupancy = 0.85\nadr = 210\n# print the result\n',
    expectedOutput: ['RevPAR is 178.5'],
  },
  {
    id: 'py-03-lists',
    order: 10,
    title: 'Lists and Loops',
    language: 'python',
    instructions:
      'Python for loops walk directly over a list:\n\nfor item in items:\n    print(item)\n\nYour task: loop over the rates list and print each one on its own line.',
    starterCode: 'rates = [199, 219, 249]\n# loop and print each rate\n',
    expectedOutput: ['199', '219', '249'],
  },
  {
    id: 'py-04-functions',
    order: 11,
    title: 'Python Functions',
    language: 'python',
    instructions:
      'Functions in Python use def and indentation:\n\ndef greet(name):\n    return f"Hello, {name}"\n\nYour task: write occupancy_pct(sold, available) that returns the occupancy as a percentage (sold / available * 100), then print occupancy_pct(90, 120).',
    starterCode:
      'def occupancy_pct(sold, available):\n    # return the percentage\n    pass\n\nprint(occupancy_pct(90, 120))\n',
    expectedOutput: ['75.0'],
  },

  // ── Sandbox ───────────────────────────────────────
  {
    id: 'sandbox-js',
    order: 12,
    title: 'JS Sandbox (free play)',
    language: 'javascript',
    instructions:
      'No checks here — write anything and run it. Any error-free run marks this complete.',
    starterCode: '// Your playground\nconsole.log("experiment away");\n',
  },
  {
    id: 'sandbox-py',
    order: 13,
    title: 'Python Sandbox (free play)',
    language: 'python',
    instructions:
      'Open Python playground. Any error-free run marks this complete.',
    starterCode: '# Your playground\nprint("experiment away")\n',
  },
];
