import type { Lesson } from '../types';

export const GAME_LESSONS: Lesson[] = [
  // ══════════ GAME 1: Guess the Number (console) ══════════
  {
    id: 'game-guess-js',
    order: 29,
    title: 'Game: Guess the Number (JS)',
    language: 'javascript',
    instructions:
      'Your first game! Since the terminal can\u2019t take typed input mid-run, the "player" will be a list of guesses we feed in — the game logic is the real lesson here, and it\u2019s the same logic every guessing game uses.\n\nNEW TOOL: Math.random() gives a random decimal between 0 and 1. To get a whole number from 1 to 10:\n\nconst secret = Math.floor(Math.random() * 10) + 1;\n\n(Math.floor chops off decimals; the * 10 scales it; the + 1 shifts 0-9 to 1-10.)\n\nBut random secrets can\u2019t be auto-checked, so for THIS assignment the secret is fixed at 7 — swap in the random line afterward in the sandbox to play for real.\n\nNEW TOOL: break exits a loop immediately. Perfect for "stop once they\u2019ve won."\n\nfor (const g of guesses) {\n  if (g === secret) {\n    // win! then break\n  }\n}\n\nYOUR TASK\nThe starter has secret = 7 and a guesses array. Loop over the guesses. For each one print:\n- "Too low" if the guess is under the secret\n- "Too high" if over\n- "You got it in N tries!" if equal — then break\n\nTrack the try count with a counter that increases every loop pass (start attempts at 0 and ++ it at the top of the loop).\n\nExpected output:\nToo low\nToo high\nToo low\nYou got it in 4 tries!',
    starterCode:
      'const secret = 7;\nconst guesses = [3, 9, 5, 7];\nlet attempts = 0;\n\nfor (const g of guesses) {\n  attempts++;\n  // compare g to secret: too low / too high / win + break\n}\n',
    expectedOutput: ['Too low', 'Too high', 'Too low', 'You got it in 4 tries!'],
  },
  {
    id: 'game-guess-py',
    order: 30,
    title: 'Game: Guess the Number (Python)',
    language: 'python',
    instructions:
      'Same game, Python spelling — a perfect translation exercise.\n\nThe pieces map one-to-one:\n- for g in guesses:  replaces the JS for...of\n- elif replaces else if\n- break works identically\n- attempts += 1 (Python has no ++ operator!)\n- f-strings for the win message\n\nRandom numbers in Python, for when you play in the sandbox later:\n\nimport random\nsecret = random.randint(1, 10)   # inclusive on both ends\n\n(import loads a module — Python\u2019s standard library ships with dice, dates, math and much more. randint is friendlier than the JS dance: both ends included, no flooring.)\n\nYOUR TASK\nSecret is fixed at 7 again. Loop the guesses and print:\n- "Too low" / "Too high" / "You got it in N tries!" then break\n\nExpected output:\nToo low\nToo high\nToo low\nYou got it in 4 tries!',
    starterCode:
      'secret = 7\nguesses = [3, 9, 5, 7]\nattempts = 0\n\nfor g in guesses:\n    attempts += 1\n    # compare g to secret\n',
    expectedOutput: ['Too low', 'Too high', 'Too low', 'You got it in 4 tries!'],
  },

  // ══════════ GAME 2: Clicker (first web game, staged) ══════════
  {
    id: 'game-clicker-1',
    order: 31,
    title: 'Clicker Game 1: The Page',
    language: 'javascript',
    kind: 'web',
    instructions:
      'Time to escape the terminal. From here on you write COMPLETE WEB PAGES, and the output pane becomes a live browser — your games will be genuinely playable.\n\nA web page is an HTML document. HTML is a tree of TAGS:\n\n<!DOCTYPE html>\n<html>\n<head>\n  <title>My Game</title>\n</head>\n<body>\n  <h1>Hello</h1>\n  <p>Some text</p>\n</body>\n</html>\n\n- <head> holds invisible setup (title, styles)\n- <body> holds everything visible\n- <h1> is a big heading, <p> a paragraph, <button> a clickable button\n- Most tags open <p> and close </p> around their content\n\nTwo tags matter most for games:\n\n<button>Click me</button>\n<div id="score">0</div>\n\nA div is a plain box for anything. The id attribute gives an element a unique name so JavaScript can find it later — that\u2019s the bridge between HTML and code, coming next lesson.\n\nYOUR TASK\nBuild the skeleton of a cookie-clicker style game. In the body:\n1. An <h1> that says: Cookie Clicker\n2. A div with id="score" containing 0\n3. A <button> with id="clicker" that says: Click!\n\nHit Run to see your page render. The check looks for all three elements.',
    starterCode:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Cookie Clicker</title>\n</head>\n<body>\n  <!-- your h1, score div, and button here -->\n</body>\n</html>\n',
    webCheck:
      "document.querySelector('h1') !== null && document.querySelector('#score') !== null && document.querySelector('#clicker') !== null",
  },
  {
    id: 'game-clicker-2',
    order: 32,
    title: 'Clicker Game 2: Making It Work',
    language: 'javascript',
    kind: 'web',
    instructions:
      'Now the magic: JavaScript lives inside a page via the <script> tag (put it at the END of the body, so the elements exist before the code runs):\n\n<body>\n  ...elements...\n  <script>\n    // your JavaScript here\n  </script>\n</body>\n\nTHE THREE MOVES OF ALL WEB GAMES:\n\n1. FIND an element:\n   const btn = document.querySelector("#clicker");\n   (querySelector takes "#name" for ids — same # as CSS)\n\n2. LISTEN for events:\n   btn.addEventListener("click", () => {\n     // runs every time the button is clicked\n   });\n   The () => { } is an ARROW FUNCTION — a compact unnamed function. Read it as "when clicked, do this."\n\n3. CHANGE the page:\n   scoreDiv.textContent = score;\n   (textContent is the text inside an element — read it or overwrite it)\n\nThat\u2019s the whole loop: find, listen, change. Every game from Clicker to Snake is these three moves arranged differently.\n\nYOUR TASK\nStarting from your page (starter includes it):\n1. In a script at the end of body, create let score = 0\n2. Find the button and the score div\n3. On button click: increase score by 1 and write it into the score div\n\nRun it, then CLICK YOUR BUTTON and watch the number climb. The check verifies clicking actually increments the score.',
    starterCode:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Cookie Clicker</title>\n</head>\n<body>\n  <h1>Cookie Clicker</h1>\n  <div id="score">0</div>\n  <button id="clicker">Click!</button>\n\n  <script>\n    let score = 0;\n    // find elements, add click listener, update score + display\n  </script>\n</body>\n</html>\n',
    webCheck:
      "(function(){ var b=document.querySelector('#clicker'); var s=document.querySelector('#score'); if(!b||!s) return false; var before=s.textContent; b.click(); b.click(); return s.textContent.trim()==='2' || (parseInt(s.textContent)===parseInt(before)+2); })()",
  },
  {
    id: 'game-clicker-3',
    order: 33,
    title: 'Clicker Game 3: Style and Juice',
    language: 'javascript',
    kind: 'web',
    instructions:
      'A working game deserves to look like one. CSS (styles) lives in a <style> tag in the head:\n\n<style>\n  body {\n    background: #1a1a2e;\n    color: white;\n    font-family: sans-serif;\n    text-align: center;\n  }\n  button {\n    font-size: 24px;\n    padding: 16px 32px;\n    border-radius: 12px;\n    cursor: pointer;\n  }\n</style>\n\nEach block is selector { property: value; } — "make body elements have this background," etc. Selectors: tag names select all of that tag, #name selects the element with that id.\n\nGames also love "juice" — small rewards for interaction. Two easy ones:\n\nMILESTONES (you know if/else already):\nif (score === 10) {\n  msg.textContent = "10! You\u2019re on fire!";\n}\n\nGROWING TEXT:\nscoreDiv.style.fontSize = (20 + score) + "px";\n(Any CSS property can be set from JS via .style)\n\nYOUR TASK\nUpgrade your clicker:\n1. Add a <style> block: give the body a background color, centered text, and make the button big and rounded\n2. Add a div with id="msg" to the body\n3. In the script: when score reaches exactly 10, put the text "On fire!" into the msg div\n\nThe check clicks your button 10 times and looks for the message. This one is yours to decorate — colors and fonts are all you.',
    starterCode:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Cookie Clicker</title>\n  <style>\n    /* your styles */\n  </style>\n</head>\n<body>\n  <h1>Cookie Clicker</h1>\n  <div id="score">0</div>\n  <div id="msg"></div>\n  <button id="clicker">Click!</button>\n\n  <script>\n    let score = 0;\n    const btn = document.querySelector("#clicker");\n    const scoreDiv = document.querySelector("#score");\n    const msg = document.querySelector("#msg");\n\n    btn.addEventListener("click", () => {\n      score++;\n      scoreDiv.textContent = score;\n      // milestone check here\n    });\n  </script>\n</body>\n</html>\n',
    webCheck:
      "(function(){ var b=document.querySelector('#clicker'); var m=document.querySelector('#msg'); if(!b||!m) return false; for(var i=0;i<10;i++){ b.click(); } return m.textContent.toLowerCase().indexOf('fire')!==-1; })()",
  },
  // ══════════ GAME 3: Snake (canvas, staged) ══════════
  {
    id: 'game-snake-1',
    order: 34,
    title: 'Snake 1: The Canvas',
    language: 'javascript',
    kind: 'web',
    instructions:
      'Buttons and divs got us a clicker, but real 2D games draw pixels. Meet <canvas> — a blank rectangle you paint with JavaScript:\n\n<canvas id="game" width="300" height="300"></canvas>\n\nTo draw on it, you grab its CONTEXT — the object holding all the drawing tools:\n\nconst canvas = document.querySelector("#game");\nconst ctx = canvas.getContext("2d");\n\nThen paint rectangles:\n\nctx.fillStyle = "lime";        // choose a color\nctx.fillRect(x, y, width, height);   // paint a rectangle\n\nCanvas coordinates start at the TOP-LEFT corner: x grows rightward, y grows DOWNWARD (this surprises everyone — it\u2019s upside-down from math class).\n\nSnake lives on a GRID. Our canvas is 300×300 and we\u2019ll use 15×15 cells of 20 pixels each. Converting a grid cell to pixels is just multiplication:\n\nconst CELL = 20;\nctx.fillRect(col * CELL, row * CELL, CELL, CELL);   // paints cell (col, row)\n\nYOUR TASK\n1. The starter has the canvas and context ready. Paint the whole canvas black first:\n   ctx.fillStyle = "black"; ctx.fillRect(0, 0, 300, 300);\n2. Then paint a lime cell at grid position column 7, row 7 (the center)\n3. And a red cell at column 3, row 10\n\nRun it — you should see a black board with a lime square and a red square. That red square will be food someday.',
    starterCode:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Snake</title>\n  <style>\n    body { background: #1a1a2e; display: flex; justify-content: center; padding-top: 20px; }\n    canvas { border: 2px solid #444; }\n  </style>\n</head>\n<body>\n  <canvas id="game" width="300" height="300"></canvas>\n\n  <script>\n    const canvas = document.querySelector("#game");\n    const ctx = canvas.getContext("2d");\n    const CELL = 20;\n\n    // 1. paint the board black\n    // 2. lime cell at col 7, row 7\n    // 3. red cell at col 3, row 10\n  </script>\n</body>\n</html>\n',
    webCheck:
      "(function(){ var c=document.querySelector('#game'); if(!c) return false; var ctx=c.getContext('2d'); var center=ctx.getImageData(7*20+10,7*20+10,1,1).data; var food=ctx.getImageData(3*20+10,10*20+10,1,1).data; var corner=ctx.getImageData(1,1,1,1).data; var isLime=center[1]>150&&center[0]<150; var isRed=food[0]>150&&food[1]<100; var isDark=corner[0]<60&&corner[1]<60&&corner[2]<60; return isLime&&isRed&&isDark; })()",
  },
  {
    id: 'game-snake-2',
    order: 35,
    title: 'Snake 2: Movement and the Game Loop',
    language: 'javascript',
    kind: 'web',
    instructions:
      'Games feel alive because of the GAME LOOP: a function that runs over and over, many times per second, each time updating positions and redrawing everything from scratch.\n\nsetInterval(tick, 150);   // call tick() every 150 milliseconds\n\nfunction tick() {\n  // 1. move things\n  // 2. wipe the canvas\n  // 3. redraw everything\n}\n\nWipe-and-redraw feels wasteful but it\u2019s how every 2D game works — like a flipbook, each frame drawn fresh.\n\nThe snake itself is an ARRAY of segments, each an object with a col and row. The head is index 0:\n\nlet snake = [{ col: 7, row: 7 }];\nlet dir = { col: 1, row: 0 };   // moving right: col +1 per tick\n\nMOVING = add a new head one cell ahead, remove the tail:\n\nconst head = { col: snake[0].col + dir.col, row: snake[0].row + dir.row };\nsnake.unshift(head);   // unshift = push onto the FRONT\nsnake.pop();           // pop = remove from the END\n\nSTEERING = listen for arrow keys on the whole page:\n\ndocument.addEventListener("keydown", (e) => {\n  if (e.key === "ArrowUp") dir = { col: 0, row: -1 };\n  // ...and the other three arrows\n});\n\n(Remember: up is row MINUS one — y grows downward.)\n\nYOUR TASK\nComplete the tick function and the key listener in the starter:\n1. In tick: build the new head from dir, unshift it, pop the tail\n2. Wipe the board black, then draw every segment lime with a for...of loop\n3. In the key listener: handle all four arrow keys\n\nRun it — your square glides right. Click the canvas once (to give it focus), then steer with arrows. It runs off the edge and disappears; walls come in lesson 4.',
    starterCode:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Snake</title>\n  <style>\n    body { background: #1a1a2e; display: flex; justify-content: center; padding-top: 20px; }\n    canvas { border: 2px solid #444; }\n  </style>\n</head>\n<body>\n  <canvas id="game" width="300" height="300"></canvas>\n\n  <script>\n    const canvas = document.querySelector("#game");\n    const ctx = canvas.getContext("2d");\n    const CELL = 20;\n\n    let snake = [{ col: 7, row: 7 }];\n    let dir = { col: 1, row: 0 };\n\n    document.addEventListener("keydown", (e) => {\n      // set dir for ArrowUp, ArrowDown, ArrowLeft, ArrowRight\n    });\n\n    function tick() {\n      // 1. new head from dir, unshift, pop\n      // 2. wipe black\n      // 3. draw each segment lime\n    }\n\n    setInterval(tick, 150);\n  </script>\n</body>\n</html>\n',
    webCheck:
      "(function(){ if(typeof snake==='undefined'||typeof tick!=='function') return false; var startCol=snake[0].col; tick(); tick(); return snake[0].col===startCol+2*dir.col||snake[0].row!==7; })()",
  },
  {
    id: 'game-snake-3',
    order: 36,
    title: 'Snake 3: Food and Growing',
    language: 'javascript',
    kind: 'web',
    instructions:
      'Now the snake eats. Three additions:\n\nFOOD is just a position, placed randomly on the 15×15 grid:\n\nlet food = randomFood();\n\nfunction randomFood() {\n  return {\n    col: Math.floor(Math.random() * 15),\n    row: Math.floor(Math.random() * 15),\n  };\n}\n\nEATING is a comparison in tick, right after building the new head: if the head landed on the food, the snake GROWS. And here\u2019s the elegant trick — growing means simply NOT popping the tail that turn:\n\nsnake.unshift(head);\nif (head.col === food.col && head.row === food.row) {\n  score++;\n  food = randomFood();   // respawn elsewhere\n} else {\n  snake.pop();           // only shrink when nothing was eaten\n}\n\n(That && is the AND operator — true only when BOTH sides are true. Its sibling || is OR.)\n\nSCORE goes in a div above the canvas, updated the same way as the clicker: scoreDiv.textContent = score.\n\nYOUR TASK\nStarting from your lesson-2 code (starter includes a working version):\n1. Add the food variable and randomFood function\n2. In tick: implement eat-or-pop as shown, and draw the food red each frame\n3. Add a score div (id="score") above the canvas and keep it updated\n\nRun and play — chase the red square, watch yourself grow and the score climb.',
    starterCode:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Snake</title>\n  <style>\n    body { background: #1a1a2e; color: white; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; padding-top: 12px; }\n    canvas { border: 2px solid #444; }\n  </style>\n</head>\n<body>\n  <div id="score">0</div>\n  <canvas id="game" width="300" height="300"></canvas>\n\n  <script>\n    const canvas = document.querySelector("#game");\n    const ctx = canvas.getContext("2d");\n    const scoreDiv = document.querySelector("#score");\n    const CELL = 20;\n\n    let snake = [{ col: 7, row: 7 }];\n    let dir = { col: 1, row: 0 };\n    let score = 0;\n    // let food = randomFood();\n\n    // function randomFood() { ... }\n\n    document.addEventListener("keydown", (e) => {\n      if (e.key === "ArrowUp") dir = { col: 0, row: -1 };\n      if (e.key === "ArrowDown") dir = { col: 0, row: 1 };\n      if (e.key === "ArrowLeft") dir = { col: -1, row: 0 };\n      if (e.key === "ArrowRight") dir = { col: 1, row: 0 };\n    });\n\n    function tick() {\n      const head = { col: snake[0].col + dir.col, row: snake[0].row + dir.row };\n      snake.unshift(head);\n      // eat-or-pop goes here (replace the plain pop below)\n      snake.pop();\n\n      ctx.fillStyle = "black";\n      ctx.fillRect(0, 0, 300, 300);\n      // draw food red here\n      ctx.fillStyle = "lime";\n      for (const seg of snake) {\n        ctx.fillRect(seg.col * CELL, seg.row * CELL, CELL, CELL);\n      }\n    }\n\n    setInterval(tick, 150);\n  </script>\n</body>\n</html>\n',
    webCheck:
      "(function(){ if(typeof snake==='undefined'||typeof food==='undefined'||typeof randomFood!=='function'||typeof tick!=='function') return false; food={col:snake[0].col+dir.col,row:snake[0].row+dir.row}; var lenBefore=snake.length; var scoreBefore=score; tick(); return snake.length===lenBefore+1&&score===scoreBefore+1; })()",
  },
  {
    id: 'game-snake-4',
    order: 37,
    title: 'Snake 4: Death and Game Over',
    language: 'javascript',
    kind: 'web',
    instructions:
      'A game you can\u2019t lose is a screensaver. Two ways to die in Snake:\n\n1. HITTING A WALL — the new head leaves the 15×15 grid:\n\nif (head.col < 0 || head.col > 14 || head.row < 0 || head.row > 14) {\n  return gameOver();\n}\n\n2. HITTING YOURSELF — the new head lands on an existing segment. Arrays have a perfect method for "does any item match?":\n\nconst hitSelf = snake.some(seg => seg.col === head.col && seg.row === head.row);\nif (hitSelf) return gameOver();\n\n(.some runs your arrow function against each item and returns true if ANY passes. Check this BEFORE unshifting the new head.)\n\nGAME OVER stops the loop. setInterval returns an id you can cancel:\n\nconst timer = setInterval(tick, 150);\n\nfunction gameOver() {\n  clearInterval(timer);\n  ctx.fillStyle = "white";\n  ctx.font = "30px sans-serif";\n  ctx.fillText("Game Over", 70, 150);   // draws text at x, y\n}\n\nThe return before gameOver() matters — it exits tick immediately so the dead snake doesn\u2019t keep moving that frame.\n\nYOUR TASK\nStarting from your lesson-3 game (starter has it complete):\n1. Store the interval id in a const timer\n2. At the TOP of tick, after computing head: wall check, then self check — each returning gameOver()\n3. Write gameOver: stop the timer, draw "Game Over" on the canvas\n\nRun it and play a full game: eat, grow, steer, and finally crash. You\u2019ve built Snake — the same game that shipped on a billion Nokia phones — from an empty canvas.',
    starterCode:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Snake</title>\n  <style>\n    body { background: #1a1a2e; color: white; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; padding-top: 12px; }\n    canvas { border: 2px solid #444; }\n  </style>\n</head>\n<body>\n  <div id="score">0</div>\n  <canvas id="game" width="300" height="300"></canvas>\n\n  <script>\n    const canvas = document.querySelector("#game");\n    const ctx = canvas.getContext("2d");\n    const scoreDiv = document.querySelector("#score");\n    const CELL = 20;\n\n    let snake = [{ col: 7, row: 7 }];\n    let dir = { col: 1, row: 0 };\n    let score = 0;\n    let food = randomFood();\n\n    function randomFood() {\n      return {\n        col: Math.floor(Math.random() * 15),\n        row: Math.floor(Math.random() * 15),\n      };\n    }\n\n    document.addEventListener("keydown", (e) => {\n      if (e.key === "ArrowUp") dir = { col: 0, row: -1 };\n      if (e.key === "ArrowDown") dir = { col: 0, row: 1 };\n      if (e.key === "ArrowLeft") dir = { col: -1, row: 0 };\n      if (e.key === "ArrowRight") dir = { col: 1, row: 0 };\n    });\n\n    function tick() {\n      const head = { col: snake[0].col + dir.col, row: snake[0].row + dir.row };\n\n      // 1. wall check → return gameOver()\n      // 2. self check with .some → return gameOver()\n\n      snake.unshift(head);\n      if (head.col === food.col && head.row === food.row) {\n        score++;\n        scoreDiv.textContent = score;\n        food = randomFood();\n      } else {\n        snake.pop();\n      }\n\n      ctx.fillStyle = "black";\n      ctx.fillRect(0, 0, 300, 300);\n      ctx.fillStyle = "red";\n      ctx.fillRect(food.col * CELL, food.row * CELL, CELL, CELL);\n      ctx.fillStyle = "lime";\n      for (const seg of snake) {\n        ctx.fillRect(seg.col * CELL, seg.row * CELL, CELL, CELL);\n      }\n    }\n\n    const timer = setInterval(tick, 150);\n\n    // function gameOver() { ... }\n  </script>\n</body>\n</html>\n',
    webCheck:
      "(function(){ if(typeof tick!=='function'||typeof gameOver!=='function'||typeof snake==='undefined') return false; snake=[{col:14,row:7}]; dir={col:1,row:0}; var lenBefore=1; tick(); return snake.length===lenBefore; })()",
  },
];
