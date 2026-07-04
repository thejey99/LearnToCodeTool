import type { Lesson } from '../types';

export const TS_LESSONS: Lesson[] = [
  {
    id: 'ts-01-what-is-ts',
    order: 13,
    title: 'What TypeScript Is',
    language: 'typescript',
    instructions:
      'Good news: you already know most of TypeScript.\n\nTypeScript IS JavaScript — every line you wrote in the last track is valid TypeScript — plus one addition: TYPE ANNOTATIONS. You can label what kind of data a variable holds:\n\nlet city: string = "Charleston";\nlet rooms: number = 120;\nlet open: boolean = true;\n\nThe pattern is name: type. The three basic types are string, number, and boolean — exactly the kinds of data you met in the JS track.\n\nWhy bother? Because the labels let mistakes be caught BEFORE the program runs:\n\nlet rooms: number = 120;\nrooms = "lots";   // ✘ error: "lots" is not a number\n\nIn plain JavaScript that bug hides until the moment the code runs — maybe in front of a user. TypeScript flags it while you\u2019re still typing. On big projects (like the ones this app is built from), that safety net is why TypeScript took over the industry.\n\nWhen the code actually runs, the type labels are stripped away and pure JavaScript executes. Types exist for YOU, not the computer.\n\nYOUR TASK\n1. Declare hotel as a string with the value "Surfside"\n2. Declare floors as a number with the value 6\n3. Print: Surfside has 6 floors\n\nUse concatenation like before: hotel + " has " + floors + " floors"',
    starterCode:
      '// declare hotel (string) and floors (number), then print\n',
    expectedOutput: ['Surfside has 6 floors'],
  },
  {
    id: 'ts-02-inference',
    order: 14,
    title: 'Type Inference',
    language: 'typescript',
    instructions:
      'Here\u2019s a secret: you usually don\u2019t write the annotations yourself.\n\nconst city = "Charleston";\n\nTypeScript looks at the value and INFERS the type — city is a string, no label needed. The protection still applies: try to reassign a number into it and TypeScript objects.\n\nSo when DO you write annotations?\n\n1. When declaring a variable without a value yet:\n   let winner: string;   // will be filled in later\n\n2. On function parameters — TypeScript can\u2019t guess what callers will pass:\n   function double(n: number) { return n * 2; }\n\nThat second case is the big one. In the JS track your revpar(adr, occupancy) function would happily accept revpar("hello", true) and produce nonsense. With parameter types, that call becomes an error before running.\n\nYou can also annotate what a function RETURNS, after the parentheses:\n\nfunction double(n: number): number {\n  return n * 2;\n}\n\nUsually inference figures the return type out, but writing it is good documentation.\n\nYOUR TASK\nComplete the function nightlyTotal(rate: number, nights: number): number so it returns rate times nights. The starter code calls it with (199, 3).\n\nExpected output:\n597',
    starterCode:
      'function nightlyTotal(rate: number, nights: number): number {\n  // return rate times nights\n}\n\nconsole.log(nightlyTotal(199, 3));\n',
    expectedOutput: ['597'],
  },
  {
    id: 'ts-03-arrays-types',
    order: 15,
    title: 'Typed Arrays',
    language: 'typescript',
    instructions:
      'Arrays get types too. The syntax is the item type followed by square brackets:\n\nconst rates: number[] = [199, 219, 249];\nconst names: string[] = ["Alice", "Bob"];\n\nRead number[] as "an array of numbers." Now TypeScript polices the contents:\n\nrates.push(299);      // ✔ fine, it\u2019s a number\nrates.push("cheap");  // ✘ error: a string can\u2019t enter a number[]\n\n(.push adds an item to the end of an array — a handy method you\u2019ll use constantly.)\n\nAs with variables, inference usually handles it: const rates = [199, 219] is already known to be number[]. Annotations earn their keep on EMPTY arrays, where there\u2019s nothing to infer from:\n\nconst sold: number[] = [];   // starts empty, will hold numbers\n\nWithout the annotation, TypeScript can\u2019t know what the empty array is for.\n\nYOUR TASK\nThe starter code declares an empty number[] named picks.\n1. Push the numbers 7, 14, and 21 into it (three .push calls, or one: picks.push(7, 14, 21))\n2. Print the array\u2019s length\n3. Use a for...of loop to print each number on its own line\n\nExpected output:\n3\n7\n14\n21',
    starterCode:
      'const picks: number[] = [];\n\n// push 7, 14, 21 — then print length, then loop\n',
    expectedOutput: ['3', '7', '14', '21'],
  },
  {
    id: 'ts-04-objects',
    order: 16,
    title: 'Objects',
    language: 'typescript',
    instructions:
      'An OBJECT groups related values under one name, each value labeled with a key:\n\nconst guest = {\n  name: "Alice",\n  nights: 3,\n};\n\nCurly braces create it; each entry is key: value, separated by commas. Where an array is a numbered list, an object is a labeled bundle.\n\nRead values with a dot:\n\nguest.name     // "Alice"\nguest.nights   // 3\n\nAnd combine with what you know — objects work in template strings. Backticks (the key left of 1 on your keyboard) plus ${ } embed values in text, cleaner than concatenation:\n\nconsole.log(`${guest.name} is staying ${guest.nights} nights`);\n\nAnything inside ${ } is evaluated as code — variables, math, dot access — and dropped into the string.\n\nYOUR TASK\nCreate an object room with two keys: number set to 204, and rate set to 219. Then print, using a template string:\n\nRoom 204 costs $219\n\nMind the literal dollar sign in the text — it\u2019s just a character, only ${ with a brace starts an embed.',
    starterCode:
      '// create the room object, then print with a template string\n',
    expectedOutput: ['Room 204 costs $219'],
  },
  {
    id: 'ts-05-interfaces',
    order: 17,
    title: 'Interfaces',
    language: 'typescript',
    instructions:
      'Objects are where TypeScript really shines. An INTERFACE describes the shape an object must have:\n\ninterface Guest {\n  name: string;\n  nights: number;\n}\n\nconst g: Guest = {\n  name: "Alice",\n  nights: 3,\n};\n\nNow TypeScript enforces the shape. Missing a key? Error. Extra unexpected key? Error. nights set to a string? Error. Any object claiming to be a Guest must match exactly.\n\nThis matters most with functions. Compare:\n\nfunction describe(guest: Guest): string {\n  return `${guest.name}, ${guest.nights} nights`;\n}\n\nInside describe, TypeScript KNOWS guest has a .name and a .nights and their types — so it can autocomplete them as you type and catch typos like guest.nmae instantly. In a big codebase, interfaces are the contracts that keep hundreds of files agreeing with each other.\n\nInterface names are capitalized by convention (Guest, not guest) to distinguish them from variables.\n\nYOUR TASK\n1. Define an interface Room with two fields: num (number) and rate (number)\n2. Complete the function describeRoom(room: Room) so it RETURNS the string: Room <num> at $<rate>/night\n3. The starter code creates a Room and prints the function\u2019s result\n\nExpected output:\nRoom 310 at $249/night',
    starterCode:
      'interface Room {\n  // define num and rate\n}\n\nfunction describeRoom(room: Room): string {\n  // return the description with a template string\n}\n\nconst r: Room = { num: 310, rate: 249 };\nconsole.log(describeRoom(r));\n',
    expectedOutput: ['Room 310 at $249/night'],
  },
  {
    id: 'ts-06-unions',
    order: 18,
    title: 'Union Types',
    language: 'typescript',
    instructions:
      'Sometimes a value can legitimately be one of several types. A UNION type says so with a pipe:\n\nlet id: string | number;\nid = 42;        // ✔\nid = "A-42";    // ✔\nid = true;      // ✘ boolean isn\u2019t in the union\n\nEven more useful: unions of specific VALUES, called literal unions:\n\ntype Status = "vacant" | "occupied" | "dirty";\n\nlet room: Status = "vacant";   // ✔\nroom = "ocupied";              // ✘ typo caught instantly!\n\n(type creates a reusable name for any type, the way interface does for object shapes.)\n\nThis turns a whole category of bugs — misspelled status strings, invalid states — into instant errors. Your editor even autocompletes the allowed values. Compare that to plain JavaScript, where "ocupied" would silently flow through the program until something downstream mysteriously misbehaved.\n\nYOUR TASK\nThe starter code defines a Status type and a function label(s: Status). Complete the function using if/else if/else so it returns:\n- "Ready to sell" when s is "vacant"\n- "Guest inside" when s is "occupied"\n- "Needs housekeeping" otherwise\n\nExpected output:\nReady to sell\nNeeds housekeeping',
    starterCode:
      'type Status = "vacant" | "occupied" | "dirty";\n\nfunction label(s: Status): string {\n  // if/else if/else returning the right string\n}\n\nconsole.log(label("vacant"));\nconsole.log(label("dirty"));\n',
    expectedOutput: ['Ready to sell', 'Needs housekeeping'],
  },
  {
    id: 'ts-07-generics',
    order: 19,
    title: 'Generics',
    language: 'typescript',
    instructions:
      'Final concept, and the trickiest — take it slow.\n\nSuppose you want a function that returns the first item of ANY array. What type do you write?\n\nfunction first(items: number[]): number   // only works for numbers\nfunction first(items: string[]): string   // now only strings...\n\nWriting one version per type is absurd. GENERICS solve it with a type placeholder:\n\nfunction first<T>(items: T[]): T {\n  return items[0];\n}\n\nThe <T> declares "this function works for some type T, to be determined by whoever calls it." Then:\n\nfirst([10, 20, 30])        // T becomes number, returns number\nfirst(["a", "b"])          // T becomes string, returns string\n\nOne function, fully type-safe for every type, and TypeScript infers T automatically from what you pass — you never write first<number>(...) by hand.\n\nYou\u2019ve been using generics all along without knowing: number[] is secretly Array<number>, and this app\u2019s React code is full of things like useState<Lesson>. Reading <T> as "of T" makes most library code click.\n\nYOUR TASK\nWrite a generic function last<T>(items: T[]): T that returns the FINAL element of an array. Remember from the JS track: the last index is items.length - 1.\n\nThe starter code calls it with a number array and a string array.\n\nExpected output:\n30\ncherry',
    starterCode:
      'function last<T>(items: T[]): T {\n  // return the final element\n}\n\nconsole.log(last([10, 20, 30]));\nconsole.log(last(["apple", "banana", "cherry"]));\n',
    expectedOutput: ['30', 'cherry'],
  },
];
