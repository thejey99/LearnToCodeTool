import type { LessonAugmentation } from './builder';

/**
 * Hints, worked solutions, chapter names and skill tags for the lessons that
 * were written before the engine supported them. Keeping them here means the
 * original lesson files stay readable as pure prose-and-task content.
 */
export const LEGACY_SUPPORT: Record<string, LessonAugmentation> = {
  // ── Foundations ───────────────────────────────────────────
  'js-01-hello': {
    module: 'First Steps',
    difficulty: 1,
    concepts: ['console.log', 'strings'],
    hints: [
      'The instruction is `console.log(...)`. Whatever goes between the parentheses is what appears in the terminal.',
      'Text needs quotes around it. Without them JavaScript tries to read your words as commands.',
      'Copy the phrase exactly, including the comma and the exclamation mark.',
    ],
    solution: 'console.log("Hello, World!");\n',
  },
  'js-02-comments': {
    module: 'First Steps',
    difficulty: 1,
    concepts: ['comments'],
    hints: [
      'One of the three lines in the starter is a real instruction wearing a disguise.',
      'Deleting the two slashes at the front of a line brings it back to life.',
    ],
    solution: '// This line does nothing\nconsole.log("Comments are ignored");\n// Neither does this one\n',
  },
  'js-03-numbers-strings': {
    module: 'First Steps',
    difficulty: 1,
    concepts: ['types', 'concatenation', 'operators'],
    hints: [
      'The first line needs numbers, which have no quotes: `2 + 3`.',
      'The second line needs strings, which do: `"2" + "3"`.',
      'Put the expression directly inside the parentheses — no variables needed.',
    ],
    solution: 'console.log(2 + 3);\nconsole.log("2" + "3");\n',
  },
  'js-04-variables': {
    module: 'Storing Data',
    difficulty: 2,
    concepts: ['variables', 'const', 'let', 'concatenation'],
    hints: [
      'Two declarations first: `const city = "Charleston";` and `let rooms = 120;`',
      'Then build the sentence by gluing four pieces: the city, the words " has ", the number, and the words " rooms".',
      'Watch the spaces inside the quoted pieces — `"has"` and `" has "` produce different output.',
    ],
    solution:
      'const city = "Charleston";\nlet rooms = 120;\nconsole.log(city + " has " + rooms + " rooms");\n',
  },
  'js-05-math': {
    module: 'Storing Data',
    difficulty: 2,
    concepts: ['arithmetic', 'variables'],
    hints: [
      'Multiplication uses `*`.',
      'Store the result first: `const total = nights * rate;`',
      'Then print `"Total: " + total`.',
    ],
    solution:
      'const nights = 3;\nconst rate = 199;\nconst total = nights * rate;\nconsole.log("Total: " + total);\n',
  },
  'js-06-reassignment': {
    module: 'Storing Data',
    difficulty: 2,
    concepts: ['reassignment', 'let', 'compound-operators'],
    hints: [
      '`rooms -= 3;` is the short form of `rooms = rooms - 3;` — either works.',
      'Print the variable itself, not a sentence: `console.log(rooms);`',
    ],
    solution: 'let rooms = 10;\nrooms -= 3;\nconsole.log(rooms);\n',
  },
  'js-07-booleans': {
    module: 'Logic & Decisions',
    difficulty: 2,
    concepts: ['booleans', 'comparison', 'strict-equality'],
    hints: [
      'A comparison can go straight inside `console.log(...)`.',
      'The second one compares a number to a string: `10 === "10"`. Triple equals also compares the type, so this is false.',
    ],
    solution: 'console.log(10 > 5);\nconsole.log(10 === "10");\n',
  },
  'js-08-if-else': {
    module: 'Logic & Decisions',
    difficulty: 2,
    concepts: ['if-else', 'conditions'],
    hints: [
      '"70 or higher" is `score >= 70`, not `score > 70`.',
      'The shape is `if (condition) { ... } else { ... }` with a `console.log` inside each branch.',
    ],
    solution:
      'const score = 85;\n\nif (score >= 70) {\n  console.log("Pass");\n} else {\n  console.log("Fail");\n}\n',
  },
  'js-09-loops': {
    module: 'Repetition',
    difficulty: 2,
    concepts: ['for-loop', 'counters'],
    hints: [
      'Counting down means the condition is a lower bound: `i >= 1`.',
      'And the step subtracts: `i--`.',
      'The `Liftoff!` line goes after the closing brace, so it runs once rather than five times.',
    ],
    solution:
      'for (let i = 5; i >= 1; i--) {\n  console.log(i);\n}\n\nconsole.log("Liftoff!");\n',
  },
  'js-10-accumulator': {
    module: 'Repetition',
    difficulty: 2,
    concepts: ['accumulator', 'for-loop'],
    hints: [
      'Inside the loop the whole job is one line: `total += i;`',
      'The print goes after the loop. Inside, it would print ten times.',
    ],
    solution:
      'let total = 0;\n\nfor (let i = 1; i <= 10; i++) {\n  total += i;\n}\n\nconsole.log(total);\n',
  },
  'js-11-functions': {
    module: 'Functions & Collections',
    difficulty: 2,
    concepts: ['functions', 'parameters', 'return'],
    hints: [
      'The body is a single line beginning with `return`.',
      '`return adr * occupancy;` — the parameters are already named for you.',
      'Do not add a `console.log` inside the function; the starter already logs the returned value.',
    ],
    solution:
      'function revpar(adr, occupancy) {\n  return adr * occupancy;\n}\n\nconsole.log(revpar(200, 0.75));\n',
  },
  'js-12-arrays': {
    module: 'Functions & Collections',
    difficulty: 2,
    concepts: ['arrays', 'for-of', 'length'],
    hints: [
      '`rates.length` is a property, so there are no parentheses after it.',
      'The loop is `for (const rate of rates) { ... }`.',
    ],
    solution:
      'const rates = [199, 219, 249];\n\nconsole.log(rates.length);\n\nfor (const rate of rates) {\n  console.log(rate);\n}\n',
  },

  // ── TypeScript ────────────────────────────────────────────
  'ts-01-what-is-ts': {
    module: 'TypeScript Basics',
    difficulty: 2,
    concepts: ['type-annotations'],
    hints: [
      'The pattern is `name: type = value`.',
      '`let hotel: string = "Surfside";` and `let floors: number = 6;`',
    ],
    solution:
      'let hotel: string = "Surfside";\nlet floors: number = 6;\nconsole.log(hotel + " has " + floors + " floors");\n',
  },
  'ts-02-inference': {
    module: 'TypeScript Basics',
    difficulty: 2,
    concepts: ['type-inference', 'function-types'],
    hints: [
      'The signature is already written; only the body is missing.',
      '`return rate * nights;`',
    ],
    solution:
      'function nightlyTotal(rate: number, nights: number): number {\n  return rate * nights;\n}\n\nconsole.log(nightlyTotal(199, 3));\n',
  },
  'ts-03-arrays-types': {
    module: 'TypeScript Basics',
    difficulty: 2,
    concepts: ['typed-arrays', 'push'],
    hints: [
      '`picks.push(7, 14, 21);` does all three in one call.',
      'Then `console.log(picks.length);` and a `for...of` loop.',
    ],
    solution:
      'const picks: number[] = [];\n\npicks.push(7, 14, 21);\n\nconsole.log(picks.length);\n\nfor (const p of picks) {\n  console.log(p);\n}\n',
  },
  'ts-04-objects': {
    module: 'Shapes & Contracts',
    difficulty: 2,
    concepts: ['objects', 'template-literals'],
    hints: [
      'The object is `const room = { number: 204, rate: 219 };`',
      'Template strings use backticks, not quotes, and embed values with `${ }`.',
      'The dollar sign in "costs $219" is just a character — only `${` starts an embed.',
    ],
    solution:
      'const room = {\n  number: 204,\n  rate: 219,\n};\n\nconsole.log(`Room ${room.number} costs $${room.rate}`);\n',
  },
  'ts-05-interfaces': {
    module: 'Shapes & Contracts',
    difficulty: 3,
    concepts: ['interfaces', 'object-types'],
    hints: [
      'Inside the interface, each field is `name: type;` on its own line.',
      'The function body returns a template string: `` `Room ${room.num} at $${room.rate}/night` ``',
    ],
    solution:
      'interface Room {\n  num: number;\n  rate: number;\n}\n\nfunction describeRoom(room: Room): string {\n  return `Room ${room.num} at $${room.rate}/night`;\n}\n\nconst r: Room = { num: 310, rate: 249 };\nconsole.log(describeRoom(r));\n',
  },
  'ts-06-unions': {
    module: 'Advanced Types',
    difficulty: 3,
    concepts: ['union-types', 'literal-types'],
    hints: [
      'Compare with `===` against each literal value in turn.',
      'The final case needs no comparison — `else` catches "dirty".',
    ],
    solution:
      'type Status = "vacant" | "occupied" | "dirty";\n\nfunction label(s: Status): string {\n  if (s === "vacant") {\n    return "Ready to sell";\n  } else if (s === "occupied") {\n    return "Guest inside";\n  } else {\n    return "Needs housekeeping";\n  }\n}\n\nconsole.log(label("vacant"));\nconsole.log(label("dirty"));\n',
  },
  'ts-07-generics': {
    module: 'Advanced Types',
    difficulty: 3,
    concepts: ['generics'],
    hints: [
      'The last index of any array is `items.length - 1`.',
      '`return items[items.length - 1];` — and it works for every T because you never touch the item itself.',
    ],
    solution:
      'function last<T>(items: T[]): T {\n  return items[items.length - 1];\n}\n\nconsole.log(last([10, 20, 30]));\nconsole.log(last(["apple", "banana", "cherry"]));\n',
  },

  // ── Python ────────────────────────────────────────────────
  'py-01-hello': {
    module: 'Python Basics',
    difficulty: 1,
    concepts: ['print', 'strings'],
    hints: ['`print("...")` — no semicolon, and the comment marker is `#`.'],
    solution: 'print("Hello from Python!")\n',
  },
  'py-02-variables': {
    module: 'Python Basics',
    difficulty: 1,
    concepts: ['variables', 'arithmetic'],
    hints: [
      'No `const` or `let` — assignment alone creates the variable.',
      '`total = nights * rate`, then `print(total)`.',
    ],
    solution: 'nights = 3\nrate = 199\ntotal = nights * rate\nprint(total)\n',
  },
  'py-03-fstrings': {
    module: 'Python Basics',
    difficulty: 2,
    concepts: ['f-strings'],
    hints: [
      'The `f` goes immediately before the opening quote.',
      'You can do the maths inside the braces: `{adr * occupancy}`.',
    ],
    solution:
      'occupancy = 0.85\nadr = 210\nprint(f"RevPAR is {adr * occupancy}")\n',
  },
  'py-04-indentation': {
    module: 'Control Flow',
    difficulty: 2,
    concepts: ['if-else', 'indentation'],
    hints: [
      'The `if` line ends with a colon, and the body is indented four spaces.',
      'No parentheses around the condition, and `else:` sits back at the outer level.',
    ],
    solution:
      'score = 85\n\nif score >= 70:\n    print("Pass")\nelse:\n    print("Fail")\n',
  },
  'py-05-lists': {
    module: 'Collections',
    difficulty: 2,
    concepts: ['lists', 'for-in', 'len'],
    hints: [
      '`len()` wraps around the list — `len(rates)`, not `rates.length`.',
      'The loop is `for rate in rates:` with the body indented.',
    ],
    solution:
      'rates = [199, 219, 249]\n\nprint(len(rates))\n\nfor rate in rates:\n    print(rate)\n',
  },
  'py-06-accumulator': {
    module: 'Collections',
    difficulty: 2,
    concepts: ['accumulator', 'range'],
    hints: [
      '`range(1, 11)` produces 1 through 10 — the end value is excluded.',
      'The print goes back at the left margin so it runs once, after the loop.',
    ],
    solution:
      'total = 0\n\nfor i in range(1, 11):\n    total += i\n\nprint(total)\n',
  },
  'py-07-functions': {
    module: 'Functions & Dicts',
    difficulty: 2,
    concepts: ['functions', 'return'],
    hints: [
      'Replace the `pass` placeholder with your `return` line.',
      '`return sold / available * 100`',
    ],
    solution:
      'def occupancy_pct(sold, available):\n    return sold / available * 100\n\nprint(occupancy_pct(90, 120))\n',
  },
  'py-08-dicts': {
    module: 'Functions & Dicts',
    difficulty: 2,
    concepts: ['dictionaries', 'f-strings'],
    hints: [
      'Dictionary keys are quoted strings, and access uses square brackets.',
      'Inside an f-string, use single quotes for the key so they do not collide with the outer double quotes.',
    ],
    solution:
      'room = {"num": 204, "rate": 219}\nprint(f"Room {room[\'num\']} costs ${room[\'rate\']}")\n',
  },
  'py-09-capstone': {
    module: 'Capstone',
    difficulty: 3,
    concepts: ['lists', 'dictionaries', 'accumulator', 'formatting'],
    hints: [
      'Looping over a list of dicts gives you one dict per pass: `for room in rooms:`',
      'Accumulate inside the same loop — one pass does both jobs.',
      'The format spec goes after a colon inside the braces: `{avg:.2f}`.',
    ],
    solution:
      'rooms = [\n    {"num": 101, "rate": 199},\n    {"num": 102, "rate": 219},\n    {"num": 103, "rate": 249},\n]\n\ntotal = 0\n\nfor room in rooms:\n    print(f"Room {room[\'num\']}: ${room[\'rate\']}")\n    total += room["rate"]\n\navg = total / len(rooms)\nprint(f"Average rate: ${avg:.2f}")\n',
  },

  // ── Games ─────────────────────────────────────────────────
  'game-guess-js': {
    module: 'Console Games',
    difficulty: 3,
    concepts: ['loops', 'conditions', 'break'],
    hints: [
      'Three branches: less than, greater than, equal.',
      'The win message needs the counter inside it, and `break` immediately after.',
    ],
    solution:
      'const secret = 7;\nconst guesses = [3, 9, 5, 7];\nlet attempts = 0;\n\nfor (const g of guesses) {\n  attempts++;\n  if (g < secret) {\n    console.log("Too low");\n  } else if (g > secret) {\n    console.log("Too high");\n  } else {\n    console.log("You got it in " + attempts + " tries!");\n    break;\n  }\n}\n',
  },
  'game-guess-py': {
    module: 'Console Games',
    difficulty: 3,
    concepts: ['loops', 'conditions', 'break', 'translation'],
    hints: [
      'Same logic, Python spelling: `elif`, colons, four-space indents.',
      'The win line is an f-string: `f"You got it in {attempts} tries!"`',
    ],
    solution:
      'secret = 7\nguesses = [3, 9, 5, 7]\nattempts = 0\n\nfor g in guesses:\n    attempts += 1\n    if g < secret:\n        print("Too low")\n    elif g > secret:\n        print("Too high")\n    else:\n        print(f"You got it in {attempts} tries!")\n        break\n',
  },
  'game-clicker-1': {
    module: 'Cookie Clicker',
    difficulty: 2,
    concepts: ['html', 'elements', 'ids'],
    hints: [
      'Three elements go inside `<body>`: an `<h1>`, a `<div>`, and a `<button>`.',
      'The id is an attribute inside the opening tag: `<div id="score">0</div>`.',
    ],
    solution:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Cookie Clicker</title>\n</head>\n<body>\n  <h1>Cookie Clicker</h1>\n  <div id="score">0</div>\n  <button id="clicker">Click!</button>\n</body>\n</html>\n',
  },
  'game-clicker-2': {
    module: 'Cookie Clicker',
    difficulty: 3,
    concepts: ['dom', 'events', 'state'],
    hints: [
      'Find both elements first with `document.querySelector("#clicker")` and `"#score"`.',
      'Inside the click handler you need two statements: increase the score, then write it into the div.',
      '`scoreDiv.textContent = score;` — assigning to textContent replaces what is displayed.',
    ],
    solution:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Cookie Clicker</title>\n</head>\n<body>\n  <h1>Cookie Clicker</h1>\n  <div id="score">0</div>\n  <button id="clicker">Click!</button>\n\n  <script>\n    let score = 0;\n    const btn = document.querySelector("#clicker");\n    const scoreDiv = document.querySelector("#score");\n\n    btn.addEventListener("click", () => {\n      score++;\n      scoreDiv.textContent = score;\n    });\n  </script>\n</body>\n</html>\n',
  },
  'game-clicker-3': {
    module: 'Cookie Clicker',
    difficulty: 3,
    concepts: ['css', 'dom', 'conditions'],
    hints: [
      'The milestone check goes inside the click handler, after the score increases.',
      '`if (score === 10) { msg.textContent = "On fire!"; }`',
    ],
    solution:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Cookie Clicker</title>\n  <style>\n    body { background: #1a1a2e; color: white; font-family: sans-serif; text-align: center; }\n    button { font-size: 24px; padding: 16px 32px; border-radius: 12px; cursor: pointer; }\n    #score { font-size: 40px; margin: 16px; }\n  </style>\n</head>\n<body>\n  <h1>Cookie Clicker</h1>\n  <div id="score">0</div>\n  <div id="msg"></div>\n  <button id="clicker">Click!</button>\n\n  <script>\n    let score = 0;\n    const btn = document.querySelector("#clicker");\n    const scoreDiv = document.querySelector("#score");\n    const msg = document.querySelector("#msg");\n\n    btn.addEventListener("click", () => {\n      score++;\n      scoreDiv.textContent = score;\n      if (score === 10) {\n        msg.textContent = "On fire!";\n      }\n    });\n  </script>\n</body>\n</html>\n',
  },
  'game-snake-1': {
    module: 'Snake',
    difficulty: 3,
    concepts: ['canvas', 'coordinates', 'grid'],
    hints: [
      'Paint the background first, or it will cover the squares you drew.',
      'A grid cell at column c, row r starts at pixel `c * CELL, r * CELL`.',
    ],
    solution:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Snake</title>\n  <style>\n    body { background: #1a1a2e; display: flex; justify-content: center; padding-top: 20px; }\n    canvas { border: 2px solid #444; }\n  </style>\n</head>\n<body>\n  <canvas id="game" width="300" height="300"></canvas>\n\n  <script>\n    const canvas = document.querySelector("#game");\n    const ctx = canvas.getContext("2d");\n    const CELL = 20;\n\n    ctx.fillStyle = "black";\n    ctx.fillRect(0, 0, 300, 300);\n\n    ctx.fillStyle = "lime";\n    ctx.fillRect(7 * CELL, 7 * CELL, CELL, CELL);\n\n    ctx.fillStyle = "red";\n    ctx.fillRect(3 * CELL, 10 * CELL, CELL, CELL);\n  </script>\n</body>\n</html>\n',
  },
  'game-snake-2': {
    module: 'Snake',
    difficulty: 4,
    concepts: ['game-loop', 'arrays', 'events'],
    hints: [
      'The new head is the old head plus the direction, on both axes.',
      '`unshift` adds to the front, `pop` removes from the end — together they move the snake without changing its length.',
      'Up is `row: -1`, because y grows downward on a canvas.',
    ],
    solution:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Snake</title>\n  <style>\n    body { background: #1a1a2e; display: flex; justify-content: center; padding-top: 20px; }\n    canvas { border: 2px solid #444; }\n  </style>\n</head>\n<body>\n  <canvas id="game" width="300" height="300"></canvas>\n\n  <script>\n    const canvas = document.querySelector("#game");\n    const ctx = canvas.getContext("2d");\n    const CELL = 20;\n\n    let snake = [{ col: 7, row: 7 }];\n    let dir = { col: 1, row: 0 };\n\n    document.addEventListener("keydown", (e) => {\n      if (e.key === "ArrowUp") dir = { col: 0, row: -1 };\n      if (e.key === "ArrowDown") dir = { col: 0, row: 1 };\n      if (e.key === "ArrowLeft") dir = { col: -1, row: 0 };\n      if (e.key === "ArrowRight") dir = { col: 1, row: 0 };\n    });\n\n    function tick() {\n      const head = { col: snake[0].col + dir.col, row: snake[0].row + dir.row };\n      snake.unshift(head);\n      snake.pop();\n\n      ctx.fillStyle = "black";\n      ctx.fillRect(0, 0, 300, 300);\n      ctx.fillStyle = "lime";\n      for (const seg of snake) {\n        ctx.fillRect(seg.col * CELL, seg.row * CELL, CELL, CELL);\n      }\n    }\n\n    setInterval(tick, 150);\n  </script>\n</body>\n</html>\n',
  },
  'game-snake-3': {
    module: 'Snake',
    difficulty: 4,
    concepts: ['game-state', 'collision', 'random'],
    hints: [
      'Growing is simply not popping the tail on the turn you eat.',
      'The eat check compares both coordinates, joined with `&&`.',
      'Draw the food before the snake so the snake appears on top of it.',
    ],
    solution:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Snake</title>\n  <style>\n    body { background: #1a1a2e; color: white; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; padding-top: 12px; }\n    canvas { border: 2px solid #444; }\n  </style>\n</head>\n<body>\n  <div id="score">0</div>\n  <canvas id="game" width="300" height="300"></canvas>\n\n  <script>\n    const canvas = document.querySelector("#game");\n    const ctx = canvas.getContext("2d");\n    const scoreDiv = document.querySelector("#score");\n    const CELL = 20;\n\n    let snake = [{ col: 7, row: 7 }];\n    let dir = { col: 1, row: 0 };\n    let score = 0;\n\n    function randomFood() {\n      return {\n        col: Math.floor(Math.random() * 15),\n        row: Math.floor(Math.random() * 15),\n      };\n    }\n\n    let food = randomFood();\n\n    document.addEventListener("keydown", (e) => {\n      if (e.key === "ArrowUp") dir = { col: 0, row: -1 };\n      if (e.key === "ArrowDown") dir = { col: 0, row: 1 };\n      if (e.key === "ArrowLeft") dir = { col: -1, row: 0 };\n      if (e.key === "ArrowRight") dir = { col: 1, row: 0 };\n    });\n\n    function tick() {\n      const head = { col: snake[0].col + dir.col, row: snake[0].row + dir.row };\n      snake.unshift(head);\n\n      if (head.col === food.col && head.row === food.row) {\n        score++;\n        scoreDiv.textContent = score;\n        food = randomFood();\n      } else {\n        snake.pop();\n      }\n\n      ctx.fillStyle = "black";\n      ctx.fillRect(0, 0, 300, 300);\n      ctx.fillStyle = "red";\n      ctx.fillRect(food.col * CELL, food.row * CELL, CELL, CELL);\n      ctx.fillStyle = "lime";\n      for (const seg of snake) {\n        ctx.fillRect(seg.col * CELL, seg.row * CELL, CELL, CELL);\n      }\n    }\n\n    setInterval(tick, 150);\n  </script>\n</body>\n</html>\n',
  },
  'game-snake-4': {
    module: 'Snake',
    difficulty: 4,
    concepts: ['game-over', 'collision', 'array-some'],
    hints: [
      'Both checks belong before `unshift`, so the dead head never joins the snake.',
      'The grid is 15 cells wide, so valid columns are 0 to 14.',
      '`return gameOver();` both stops this frame and runs the ending.',
    ],
    solution:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Snake</title>\n  <style>\n    body { background: #1a1a2e; color: white; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; padding-top: 12px; }\n    canvas { border: 2px solid #444; }\n  </style>\n</head>\n<body>\n  <div id="score">0</div>\n  <canvas id="game" width="300" height="300"></canvas>\n\n  <script>\n    const canvas = document.querySelector("#game");\n    const ctx = canvas.getContext("2d");\n    const scoreDiv = document.querySelector("#score");\n    const CELL = 20;\n\n    let snake = [{ col: 7, row: 7 }];\n    let dir = { col: 1, row: 0 };\n    let score = 0;\n\n    function randomFood() {\n      return {\n        col: Math.floor(Math.random() * 15),\n        row: Math.floor(Math.random() * 15),\n      };\n    }\n\n    let food = randomFood();\n\n    document.addEventListener("keydown", (e) => {\n      if (e.key === "ArrowUp") dir = { col: 0, row: -1 };\n      if (e.key === "ArrowDown") dir = { col: 0, row: 1 };\n      if (e.key === "ArrowLeft") dir = { col: -1, row: 0 };\n      if (e.key === "ArrowRight") dir = { col: 1, row: 0 };\n    });\n\n    function gameOver() {\n      clearInterval(timer);\n      ctx.fillStyle = "white";\n      ctx.font = "30px sans-serif";\n      ctx.fillText("Game Over", 70, 150);\n    }\n\n    function tick() {\n      const head = { col: snake[0].col + dir.col, row: snake[0].row + dir.row };\n\n      if (head.col < 0 || head.col > 14 || head.row < 0 || head.row > 14) {\n        return gameOver();\n      }\n      if (snake.some((seg) => seg.col === head.col && seg.row === head.row)) {\n        return gameOver();\n      }\n\n      snake.unshift(head);\n      if (head.col === food.col && head.row === food.row) {\n        score++;\n        scoreDiv.textContent = score;\n        food = randomFood();\n      } else {\n        snake.pop();\n      }\n\n      ctx.fillStyle = "black";\n      ctx.fillRect(0, 0, 300, 300);\n      ctx.fillStyle = "red";\n      ctx.fillRect(food.col * CELL, food.row * CELL, CELL, CELL);\n      ctx.fillStyle = "lime";\n      for (const seg of snake) {\n        ctx.fillRect(seg.col * CELL, seg.row * CELL, CELL, CELL);\n      }\n    }\n\n    const timer = setInterval(tick, 150);\n  </script>\n</body>\n</html>\n',
  },
  'game-breakout-1': {
    module: 'Breakout',
    difficulty: 3,
    concepts: ['velocity', 'animation', 'requestAnimationFrame'],
    hints: [
      'Moving is two lines: add vx to x, add vy to y.',
      'Bouncing is flipping a sign: `ball.vx = -ball.vx;`',
      'Only the ceiling flips vy here — the floor is deliberately left open.',
    ],
    solution:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Breakout</title>\n  <style>\n    body { background: #1a1a2e; display: flex; justify-content: center; padding-top: 20px; }\n    canvas { border: 2px solid #444; }\n  </style>\n</head>\n<body>\n  <canvas id="game" width="300" height="400"></canvas>\n\n  <script>\n    const canvas = document.querySelector("#game");\n    const ctx = canvas.getContext("2d");\n\n    let ball = { x: 150, y: 200, vx: 3, vy: -3 };\n\n    function tick() {\n      ball.x += ball.vx;\n      ball.y += ball.vy;\n\n      if (ball.x < 8 || ball.x > 292) ball.vx = -ball.vx;\n      if (ball.y < 8) ball.vy = -ball.vy;\n\n      ctx.fillStyle = "black";\n      ctx.fillRect(0, 0, 300, 400);\n      ctx.fillStyle = "white";\n      ctx.beginPath();\n      ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2);\n      ctx.fill();\n\n      requestAnimationFrame(tick);\n    }\n\n    requestAnimationFrame(tick);\n  </script>\n</body>\n</html>\n',
  },
  'game-breakout-2': {
    module: 'Breakout',
    difficulty: 4,
    concepts: ['input', 'collision', 'coordinates'],
    hints: [
      'The mouse listener converts screen coordinates to canvas coordinates by subtracting the canvas position.',
      'The paddle bounce needs the `ball.vy > 0` guard, or the ball sticks to the paddle.',
      'The reset assigns a whole new ball object.',
    ],
    solution:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Breakout</title>\n  <style>\n    body { background: #1a1a2e; display: flex; justify-content: center; padding-top: 20px; }\n    canvas { border: 2px solid #444; }\n  </style>\n</head>\n<body>\n  <canvas id="game" width="300" height="400"></canvas>\n\n  <script>\n    const canvas = document.querySelector("#game");\n    const ctx = canvas.getContext("2d");\n\n    let ball = { x: 150, y: 200, vx: 3, vy: -3 };\n    let paddleX = 120;\n    const PADDLE_W = 60, PADDLE_H = 10;\n\n    canvas.addEventListener("mousemove", (e) => {\n      const rect = canvas.getBoundingClientRect();\n      paddleX = e.clientX - rect.left - PADDLE_W / 2;\n    });\n\n    function tick() {\n      ball.x += ball.vx;\n      ball.y += ball.vy;\n\n      if (ball.x < 8 || ball.x > 292) ball.vx = -ball.vx;\n      if (ball.y < 8) ball.vy = -ball.vy;\n\n      if (ball.vy > 0 && ball.y > 377 && ball.x > paddleX && ball.x < paddleX + PADDLE_W) {\n        ball.vy = -ball.vy;\n      }\n\n      if (ball.y > 410) {\n        ball = { x: 150, y: 200, vx: 3, vy: -3 };\n      }\n\n      ctx.fillStyle = "black";\n      ctx.fillRect(0, 0, 300, 400);\n      ctx.fillStyle = "white";\n      ctx.beginPath();\n      ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2);\n      ctx.fill();\n      ctx.fillRect(paddleX, 385, PADDLE_W, PADDLE_H);\n\n      requestAnimationFrame(tick);\n    }\n\n    requestAnimationFrame(tick);\n  </script>\n</body>\n</html>\n',
  },
  'game-breakout-3': {
    module: 'Breakout',
    difficulty: 5,
    concepts: ['nested-loops', 'collision', 'win-conditions'],
    hints: [
      'The nested loop runs the inner loop completely for each pass of the outer one.',
      '`continue` skips a dead brick without leaving the loop.',
      'Check the win condition after the collision loop, so the final brick counts.',
    ],
    solution:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Breakout</title>\n  <style>\n    body { background: #1a1a2e; display: flex; justify-content: center; padding-top: 20px; }\n    canvas { border: 2px solid #444; }\n  </style>\n</head>\n<body>\n  <canvas id="game" width="300" height="400"></canvas>\n\n  <script>\n    const canvas = document.querySelector("#game");\n    const ctx = canvas.getContext("2d");\n\n    let ball = { x: 150, y: 250, vx: 3, vy: -3 };\n    let paddleX = 120;\n    const PADDLE_W = 60, PADDLE_H = 10;\n    let score = 0;\n    let lives = 3;\n    let stopped = false;\n\n    let bricks = [];\n    for (let row = 0; row < 4; row++) {\n      for (let col = 0; col < 6; col++) {\n        bricks.push({ x: col * 50, y: row * 20 + 30, alive: true });\n      }\n    }\n\n    const colors = ["#f85149", "#f0883e", "#3fb950", "#58a6ff"];\n\n    canvas.addEventListener("mousemove", (e) => {\n      const rect = canvas.getBoundingClientRect();\n      paddleX = e.clientX - rect.left - PADDLE_W / 2;\n    });\n\n    function endGame(text) {\n      stopped = true;\n      ctx.fillStyle = "white";\n      ctx.font = "30px sans-serif";\n      ctx.fillText(text, 75, 200);\n    }\n\n    function tick() {\n      if (stopped) return;\n\n      ball.x += ball.vx;\n      ball.y += ball.vy;\n\n      if (ball.x < 8 || ball.x > 292) ball.vx = -ball.vx;\n      if (ball.y < 8) ball.vy = -ball.vy;\n\n      if (ball.vy > 0 && ball.y > 377 && ball.x > paddleX && ball.x < paddleX + PADDLE_W) {\n        ball.vy = -ball.vy;\n      }\n\n      if (ball.y > 410) {\n        lives--;\n        if (lives === 0) return endGame("Game Over");\n        ball = { x: 150, y: 250, vx: 3, vy: -3 };\n      }\n\n      for (const b of bricks) {\n        if (!b.alive) continue;\n        if (ball.x > b.x && ball.x < b.x + 50 && ball.y > b.y && ball.y < b.y + 20) {\n          b.alive = false;\n          ball.vy = -ball.vy;\n          score++;\n        }\n      }\n\n      if (score === 24) return endGame("You Win!");\n\n      ctx.fillStyle = "black";\n      ctx.fillRect(0, 0, 300, 400);\n\n      for (const b of bricks) {\n        if (!b.alive) continue;\n        ctx.fillStyle = colors[Math.floor((b.y - 30) / 20)];\n        ctx.fillRect(b.x + 1, b.y + 1, 48, 18);\n      }\n\n      ctx.fillStyle = "white";\n      ctx.beginPath();\n      ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2);\n      ctx.fill();\n      ctx.fillRect(paddleX, 385, PADDLE_W, PADDLE_H);\n      ctx.font = "14px sans-serif";\n      ctx.fillText("Score: " + score + "  Lives: " + lives, 8, 396);\n\n      requestAnimationFrame(tick);\n    }\n\n    requestAnimationFrame(tick);\n  </script>\n</body>\n</html>\n',
  },
  'game-memory-1': {
    module: 'Memory Match',
    difficulty: 3,
    concepts: ['createElement', 'dataset', 'css-grid'],
    hints: [
      'Four steps per card: create it, set its class, set its text, append it.',
      '`card.dataset.emoji = emoji;` stores the answer on the element itself.',
      'The grid needs `display: grid` and `grid-template-columns: repeat(4, 70px)`.',
    ],
    solution:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Memory Match</title>\n  <style>\n    body { background: #1a1a2e; color: white; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; padding-top: 16px; }\n    #board { display: grid; grid-template-columns: repeat(4, 70px); gap: 8px; }\n    .card { width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; font-size: 32px; cursor: pointer; background: #30363d; border-radius: 8px; user-select: none; }\n  </style>\n</head>\n<body>\n  <h1>Memory Match</h1>\n  <div id="board"></div>\n\n  <script>\n    const board = document.querySelector("#board");\n    const EMOJI = ["\\u{1F40D}", "\\u{1F3AE}", "\\u{1F36A}", "\\u{1F680}", "\\u{1F419}", "\\u{1F3B2}", "\\u{1F9E0}", "\\u2B50"];\n    let deck = [...EMOJI, ...EMOJI];\n    deck.sort(() => Math.random() - 0.5);\n\n    for (const emoji of deck) {\n      const card = document.createElement("div");\n      card.className = "card";\n      card.textContent = "?";\n      card.dataset.emoji = emoji;\n      board.appendChild(card);\n    }\n  </script>\n</body>\n</html>\n',
  },
  'game-memory-2': {
    module: 'Memory Match',
    difficulty: 5,
    concepts: ['state-machine', 'setTimeout', 'events'],
    hints: [
      'Start with the two guards and `return` early — everything after them can assume a legal click.',
      'After revealing, `if (flipped.length === 2)` decides between the match branch and the flip-back branch.',
      'In the match branch, empty `flipped` immediately. In the mismatch branch, empty it inside the setTimeout.',
    ],
    solution:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Memory Match</title>\n  <style>\n    body { background: #1a1a2e; color: white; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; padding-top: 16px; }\n    #board { display: grid; grid-template-columns: repeat(4, 70px); gap: 8px; }\n    .card { width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; font-size: 32px; cursor: pointer; background: #30363d; border-radius: 8px; user-select: none; }\n    .done { background: #1f6feb33; opacity: 0.7; }\n  </style>\n</head>\n<body>\n  <h1>Memory Match</h1>\n  <div id="status"></div>\n  <div id="board"></div>\n\n  <script>\n    const board = document.querySelector("#board");\n    const status = document.querySelector("#status");\n    const EMOJI = ["\\u{1F40D}", "\\u{1F3AE}", "\\u{1F36A}", "\\u{1F680}", "\\u{1F419}", "\\u{1F3B2}", "\\u{1F9E0}", "\\u2B50"];\n    let deck = [...EMOJI, ...EMOJI];\n    deck.sort(() => Math.random() - 0.5);\n\n    let flipped = [];\n    let pairs = 0;\n\n    for (const emoji of deck) {\n      const card = document.createElement("div");\n      card.className = "card";\n      card.textContent = "?";\n      card.dataset.emoji = emoji;\n\n      card.addEventListener("click", () => {\n        if (card.classList.contains("done")) return;\n        if (flipped.length === 2) return;\n        if (flipped.includes(card)) return;\n\n        card.textContent = card.dataset.emoji;\n        flipped.push(card);\n\n        if (flipped.length === 2) {\n          if (flipped[0].dataset.emoji === flipped[1].dataset.emoji) {\n            flipped[0].classList.add("done");\n            flipped[1].classList.add("done");\n            flipped = [];\n            pairs++;\n            if (pairs === 8) status.textContent = "You win!";\n          } else {\n            setTimeout(() => {\n              flipped[0].textContent = "?";\n              flipped[1].textContent = "?";\n              flipped = [];\n            }, 800);\n          }\n        }\n      });\n\n      board.appendChild(card);\n    }\n  </script>\n</body>\n</html>\n',
  },
};
