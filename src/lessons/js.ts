import type { Lesson } from '../types';

export const JS_LESSONS: Lesson[] = [
  {
    id: 'js-01-hello',
    order: 1,
    title: 'Hello, World!',
    language: 'javascript',
    instructions:
      'Welcome to programming!\n\nA program is just a list of instructions the computer follows from top to bottom. You write the instructions, hit Run, and the computer obeys — exactly, literally, and without guessing what you meant. That literalness is why beginners hit errors: the computer does what you TYPED, not what you INTENDED.\n\nYour very first instruction is console.log(). It prints something to the terminal (the output panel). Whatever you put between the parentheses gets displayed.\n\nText in code is called a STRING, and it must be wrapped in quotes:\n\nconsole.log("like this");\n\nThe quotes tell the computer "this is text, not code." Forget them and the computer tries to interpret your words as commands — and fails.\n\nNotice the semicolon at the end. It marks the end of an instruction, like a period ends a sentence. JavaScript often forgives a missing one, but ending every statement with ; is a good habit.\n\nYOUR TASK\nPrint exactly:\n\nHello, World!\n\nCapitalization and punctuation matter — "hello world" is not the same string. This exact phrase has been every programmer\u2019s first program since 1972. Welcome to the club.',
    starterCode: '// Print your first message below\n',
    expectedOutput: ['Hello, World!'],
  },
  {
    id: 'js-02-comments',
    order: 2,
    title: 'Comments',
    language: 'javascript',
    instructions:
      'See the line in the editor that starts with two slashes? That\u2019s a COMMENT.\n\n// anything after two slashes on a line is ignored\n\nComments are notes for humans. The computer skips them entirely. Programmers use them to explain WHY code does something, leave reminders, or temporarily disable a line without deleting it (called "commenting out").\n\n/* You can also write\n   multi-line comments\n   between slash-star and star-slash */\n\nA useful trick while learning: if a lesson\u2019s starter code has instructions in comments, you can leave them in place — they never affect the output.\n\nYOUR TASK\nThe starter code below has three lines: two comments and one console.log that is commented out. Fix it so the program prints:\n\nComments are ignored\n\nYou can either delete the // in front of the console.log line, or write a fresh console.log yourself. Both work — the terminal only cares about what actually runs.',
    starterCode:
      '// This line does nothing\n// console.log("Comments are ignored");\n// Neither does this one\n',
    expectedOutput: ['Comments are ignored'],
  },
  {
    id: 'js-03-numbers-strings',
    order: 3,
    title: 'Numbers vs. Strings',
    language: 'javascript',
    instructions:
      'JavaScript treats numbers and text differently, and the difference bites every beginner at least once.\n\nNUMBERS are written without quotes: 5, 199, 3.14\nSTRINGS are written with quotes: "5", "hello"\n\nThe + symbol does two different jobs depending on what it\u2019s given:\n\n2 + 3        → 5      (numbers: it adds)\n"2" + "3"    → "23"   (strings: it glues them together)\n\nGluing strings together is called CONCATENATION. It\u2019s useful — "Hello, " + "John" makes "Hello, John" — but it causes bugs when you THINK you have numbers and actually have strings. "10" + 5 gives "105", not 15.\n\nThis is why paying attention to quotes matters: they change what your data IS, not just how it looks.\n\nYOUR TASK\nPrint two lines using two console.log statements:\n1. The result of adding the NUMBERS 2 and 3\n2. The result of concatenating the STRINGS "2" and "3"\n\nExpected output:\n5\n23',
    starterCode:
      '// Line 1: add two numbers\nconsole.log( );\n\n// Line 2: concatenate two strings\nconsole.log( );\n',
    expectedOutput: ['5', '23'],
  },
  {
    id: 'js-04-variables',
    order: 4,
    title: 'Variables',
    language: 'javascript',
    instructions:
      'A VARIABLE is a named box that stores a value. Instead of repeating a value everywhere, you store it once and refer to it by name.\n\nconst city = "Charleston";\nconsole.log(city);   // prints: Charleston\n\nBreak that first line down:\n- const — the keyword that creates the variable\n- city — the name you chose\n- = — the assignment operator ("put the thing on the right into the box on the left")\n- "Charleston" — the value\n\nThere are two keywords for creating variables:\n- const: the box is sealed — you cannot put a new value in later. Use this by default.\n- let: the box can be refilled later. Use it only when you know the value must change.\n\nNaming rules: no spaces, can\u2019t start with a digit, and capitalization matters (rooms and Rooms are different variables). The convention in JavaScript is camelCase: totalRevenue, guestName.\n\nYOUR TASK\n1. Create a const named city holding the string "Charleston"\n2. Create a let named rooms holding the number 120\n3. Print them in a sentence using concatenation:\n\nCharleston has 120 rooms\n\nHint: city + " has " + rooms + " rooms" — note the spaces inside the quoted pieces.',
    starterCode:
      '// 1. create city\n// 2. create rooms\n// 3. print the sentence\n',
    expectedOutput: ['Charleston has 120 rooms'],
  },
  {
    id: 'js-05-math',
    order: 5,
    title: 'Doing Math',
    language: 'javascript',
    instructions:
      'JavaScript has the math operators you\u2019d expect, plus a couple you might not:\n\n+   add\n-   subtract\n*   multiply (there is no × key in code)\n/   divide\n%   remainder ("modulo") — 10 % 3 is 1, because 10 ÷ 3 is 3 remainder 1\n**  exponent — 2 ** 3 is 8\n\nNormal order of operations applies (multiplication before addition), and parentheses override it, just like in school: (2 + 3) * 4 is 20.\n\nThe real power move is doing math with VARIABLES:\n\nconst nights = 3;\nconst rate = 199;\nconst total = nights * rate;   // 597\n\nThe computer looks up each variable\u2019s value and calculates. Change rate once at the top, and every calculation using it updates. That\u2019s the whole point of variables.\n\nYOUR TASK\nA guest stays 3 nights at a rate of 199 per night.\n1. Create const nights = 3\n2. Create const rate = 199\n3. Create const total that multiplies them\n4. Print: Total: 597\n\nUse concatenation: "Total: " + total',
    starterCode:
      'const nights = 3;\nconst rate = 199;\n// create total, then print "Total: 597"\n',
    expectedOutput: ['Total: 597'],
  },
  {
    id: 'js-06-reassignment',
    order: 6,
    title: 'Changing a Variable',
    language: 'javascript',
    instructions:
      'Variables made with let can be given new values. This is called REASSIGNMENT:\n\nlet score = 0;\nscore = 10;        // box now holds 10\nscore = score + 5; // box now holds 15\n\nThat last line looks strange mathematically, but remember: = means "put the right side into the left side," not "equals." The computer first calculates score + 5 (which is 15), THEN stores it back into score.\n\nUpdating a variable based on its own value is so common there are shortcuts:\n\nscore += 5;   // same as: score = score + 5\nscore -= 2;   // subtract 2\nscore *= 3;   // multiply by 3\n\nTry reassigning a const and the program crashes with "Assignment to constant variable" — that error is const doing its job, protecting a value that was never supposed to change.\n\nYOUR TASK\nYour hotel starts the day with 10 rooms available, then sells 3.\n1. Create let rooms = 10\n2. Subtract 3 from it using -= (or the long form)\n3. Print the variable\n\nExpected output:\n7',
    starterCode: 'let rooms = 10;\n// subtract 3, then print rooms\n',
    expectedOutput: ['7'],
  },
  {
    id: 'js-07-booleans',
    order: 7,
    title: 'True or False',
    language: 'javascript',
    instructions:
      'Besides numbers and strings, there\u2019s a third basic type: the BOOLEAN. It has exactly two possible values: true and false (no quotes — they\u2019re not strings).\n\nBooleans usually come from COMPARISONS:\n\n10 > 5     → true     (greater than)\n10 < 5     → false    (less than)\n10 >= 10   → true     (greater than or equal)\n5 !== 3    → true     (not equal)\n5 === 5    → true     (equal)\n\nNote the triple equals. In JavaScript:\n=     assignment (puts a value in a variable)\n===   comparison (asks "are these the same?")\n\nTriple equals also checks TYPE. The number 10 and the string "10" look alike but are different kinds of data, so 10 === "10" is false. (You may see == in old code — it ignores types and causes subtle bugs. Always use ===.)\n\nYOUR TASK\nPrint the result of two comparisons, one per line:\n1. Is 10 greater than 5?\n2. Is the number 10 strictly equal to the string "10"?\n\nExpected output:\ntrue\nfalse\n\nPut the comparison directly inside console.log — e.g. console.log(10 > 5);',
    starterCode:
      '// print the two comparison results\nconsole.log( );\nconsole.log( );\n',
    expectedOutput: ['true', 'false'],
  },
  {
    id: 'js-08-if-else',
    order: 8,
    title: 'Making Decisions',
    language: 'javascript',
    instructions:
      'Programs get interesting when they react differently to different situations. That\u2019s the IF statement:\n\nif (condition) {\n  // runs only when condition is true\n} else {\n  // runs only when condition is false\n}\n\nThe condition goes in parentheses and is anything that produces a boolean — usually a comparison. The curly braces { } wrap the block of code that belongs to each branch.\n\nconst temperature = 95;\nif (temperature > 90) {\n  console.log("Turn on the AC");\n} else {\n  console.log("Nice day");\n}\n\nYou can chain more conditions with else if:\n\nif (score >= 90) {\n  console.log("A");\n} else if (score >= 80) {\n  console.log("B");\n} else {\n  console.log("Try again");\n}\n\nThe computer checks each condition top to bottom and runs ONLY the first branch that matches.\n\nYOUR TASK\nA student passes with a score of 70 or higher.\nThe starter code sets score to 85. Write an if/else that prints "Pass" when score is 70 or above, and "Fail" otherwise.\n\nExpected output:\nPass\n\n(Your code should still be correct if score were changed to 50 — the else branch would print Fail.)',
    starterCode:
      'const score = 85;\n\n// if score is 70 or more, print "Pass"\n// otherwise print "Fail"\n',
    expectedOutput: ['Pass'],
  },
  {
    id: 'js-09-loops',
    order: 9,
    title: 'Loops',
    language: 'javascript',
    instructions:
      'Loops repeat code so you don\u2019t have to copy-paste it. The classic FOR loop:\n\nfor (let i = 1; i <= 3; i++) {\n  console.log(i);\n}\n\nThe parentheses hold three parts, separated by semicolons:\n1. let i = 1  — START: create a counter, begin at 1\n2. i <= 3     — CONDITION: keep looping while this is true\n3. i++        — STEP: after each round, add 1 (i++ is shorthand for i += 1)\n\nSo this prints 1, 2, 3 and stops — once i becomes 4, the condition fails and the loop ends.\n\nLoops can also count DOWN. Start high, check a lower bound, and subtract:\n\nfor (let i = 3; i >= 1; i--) { ... }   // 3, 2, 1\n\nOne warning: if the condition never becomes false (say, i++ when checking i >= 1), the loop runs forever. This app kills runaway code after 5 seconds with a timeout error — if you see it, check your loop\u2019s step and condition.\n\nYOUR TASK\nPrint a rocket-launch countdown: the numbers 5 down to 1, one per line, then the word Liftoff! after the loop.\n\nExpected output:\n5\n4\n3\n2\n1\nLiftoff!',
    starterCode:
      '// count down from 5 to 1\nfor (let i = 5; /* condition */; /* step */) {\n  console.log(i);\n}\n\n// then print "Liftoff!"\n',
    expectedOutput: ['5', '4', '3', '2', '1', 'Liftoff!'],
  },
  {
    id: 'js-10-accumulator',
    order: 10,
    title: 'Loops That Build Up',
    language: 'javascript',
    instructions:
      'The most useful loop pattern in all of programming: the ACCUMULATOR. You create a variable before the loop, then update it every pass:\n\nlet total = 0;\nfor (let i = 1; i <= 3; i++) {\n  total += i;\n}\nconsole.log(total);   // 6, because 1 + 2 + 3\n\nWalk through it:\n- Before the loop: total is 0\n- Pass 1: i is 1, total becomes 0 + 1 = 1\n- Pass 2: i is 2, total becomes 1 + 2 = 3\n- Pass 3: i is 3, total becomes 3 + 3 = 6\n- Loop ends, we print 6\n\nTwo details beginners miss:\n1. total must be created OUTSIDE the loop. Inside, it would restart at 0 every pass.\n2. It must be let, not const — it gets reassigned constantly.\n\nThis exact pattern computes sums, counts matches, builds strings, finds maximums — you\u2019ll use it forever.\n\nYOUR TASK\nUse an accumulator loop to add up the numbers 1 through 10, then print the total after the loop.\n\nExpected output:\n55',
    starterCode:
      'let total = 0;\n\nfor (let i = 1; i <= 10; i++) {\n  // add i to total\n}\n\n// print total\n',
    expectedOutput: ['55'],
  },
  {
    id: 'js-11-functions',
    order: 11,
    title: 'Functions',
    language: 'javascript',
    instructions:
      'A FUNCTION is a named, reusable chunk of code. Define it once, call it as many times as you want.\n\nfunction double(n) {\n  return n * 2;\n}\n\nconsole.log(double(5));    // 10\nconsole.log(double(21));   // 42\n\nAnatomy:\n- function — the keyword\n- double — the name\n- (n) — the PARAMETER: a placeholder variable that receives whatever value you pass in\n- return — sends a result back OUT of the function to whoever called it\n\nWhen you write double(5), the value 5 flows into n, the body computes n * 2, and return hands back 10. The call expression double(5) then simply BECOMES 10 wherever it was written.\n\nreturn is not print. A function can return a value silently — nothing appears in the terminal unless something console.logs it. That\u2019s why the starter code wraps the call in console.log.\n\nFunctions can take multiple parameters, separated by commas: function area(w, h) { return w * h; }\n\nYOUR TASK\nHotels measure revenue per available room: RevPAR = ADR × occupancy.\nComplete the function revpar(adr, occupancy) so it returns adr multiplied by occupancy. The starter code already calls it with (200, 0.75).\n\nExpected output:\n150',
    starterCode:
      'function revpar(adr, occupancy) {\n  // return the result\n}\n\nconsole.log(revpar(200, 0.75));\n',
    expectedOutput: ['150'],
  },
  {
    id: 'js-12-arrays',
    order: 12,
    title: 'Arrays',
    language: 'javascript',
    instructions:
      'An ARRAY is an ordered list of values in one variable:\n\nconst rates = [199, 219, 249];\n\nSquare brackets create it; commas separate the items. Arrays can hold numbers, strings, booleans — anything, including a mix.\n\nAccess items by POSITION, which starts at 0 (yes, zero — this trips everyone up once):\n\nrates[0]        // 199 — the FIRST item\nrates[1]        // 219\nrates[2]        // 249\nrates.length    // 3 — how many items\n\nThe cleanest way to visit every item is for...of:\n\nfor (const rate of rates) {\n  console.log(rate);\n}\n\nRead it as "for each rate of the rates list." No counter to manage, no off-by-one mistakes — it just walks the list front to back.\n\nYOUR TASK\nThe starter code has an array of three nightly rates.\n1. Print how many rates there are (use .length)\n2. Then print each rate on its own line using a for...of loop\n\nExpected output:\n3\n199\n219\n249',
    starterCode:
      'const rates = [199, 219, 249];\n\n// 1. print the length\n\n// 2. loop and print each rate\n',
    expectedOutput: ['3', '199', '219', '249'],
  },
];
