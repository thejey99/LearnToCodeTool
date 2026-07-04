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
];
