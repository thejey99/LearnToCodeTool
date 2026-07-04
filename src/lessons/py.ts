import type { Lesson } from '../types';

export const PY_LESSONS: Lesson[] = [
  {
    id: 'py-01-hello',
    order: 20,
    title: 'Python: A New Language',
    language: 'python',
    instructions:
      'Welcome to your second programming language!\n\nHere\u2019s the encouraging truth: you already know how to program. Variables, loops, conditions, functions — those CONCEPTS are universal. Learning Python is just learning new spelling for ideas you already own.\n\nFirst differences you\u2019ll notice coming from JavaScript:\n\n1. Printing is print(), not console.log():\n   print("Hello")\n\n2. No semicolons. Lines just end.\n\n3. Comments use # instead of //:\n   # this is a Python comment\n\n4. Strings work the same — quotes required, single or double both fine.\n\nOne practical note for this app: the first time you run Python in a session, the engine takes a few seconds to boot (a whole Python interpreter loads into your browser). Every run after that is instant.\n\nYOUR TASK\nPrint exactly:\n\nHello from Python!',
    starterCode: '# Print your message\n',
    expectedOutput: ['Hello from Python!'],
  },
  {
    id: 'py-02-variables',
    order: 21,
    title: 'Python Variables',
    language: 'python',
    instructions:
      'Python variables need no keyword at all — no const, no let. Just assign:\n\ncity = "Charleston"\nrooms = 120\n\nThat\u2019s it. Python figures out the type from the value, like TypeScript inference but invisible.\n\nThe flip side: Python has no const. Any variable can be reassigned at any time, and nothing stops you. The convention for "please treat this as constant" is ALL_CAPS naming:\n\nTAX_RATE = 0.08   # signal to humans: don\u2019t change this\n\nNaming style differs too. JavaScript uses camelCase (totalRevenue); Python uses snake_case (total_revenue) — lowercase with underscores. The languages\u2019 communities take their conventions seriously, so match the style of whichever language you\u2019re in.\n\nMath operators are the ones you know: + - * / % **\n\nYOUR TASK\n1. Create nights holding 3\n2. Create rate holding 199\n3. Create total holding their product\n4. Print the total by itself\n\nExpected output:\n597',
    starterCode:
      '# create nights, rate, and total — then print total\n',
    expectedOutput: ['597'],
  },
  {
    id: 'py-03-fstrings',
    order: 22,
    title: 'f-strings',
    language: 'python',
    instructions:
      'Remember JavaScript template literals — backticks with ${ }? Python\u2019s version is the F-STRING: put an f before the opening quote, then embed values with { }:\n\nname = "Ada"\nprint(f"Hi {name}")        # Hi Ada\nprint(f"Twice 21 is {21 * 2}")   # Twice 21 is 42\n\nThe f is what activates the braces — forget it and Python prints the braces literally: Hi {name}. That\u2019s the #1 f-string bug.\n\nAnything inside { } is evaluated: variables, math, function calls.\n\nOne more thing to know before the task — Python division ALWAYS produces a decimal (called a float):\n\nprint(10 / 2)    # 5.0, not 5\n\nJavaScript would print 5; Python prints 5.0. Neither is wrong, they just have different rules about number display. Keep it in mind whenever a Python answer has a surprising .0 attached.\n\nYOUR TASK\nHotels compute RevPAR as ADR × occupancy.\n1. Set occupancy to 0.85\n2. Set adr to 210\n3. Print, using ONE f-string with the math inside the braces:\n\nRevPAR is 178.5',
    starterCode:
      'occupancy = 0.85\nadr = 210\n# print using an f-string\n',
    expectedOutput: ['RevPAR is 178.5'],
  },
  {
    id: 'py-04-indentation',
    order: 23,
    title: 'Indentation and if',
    language: 'python',
    instructions:
      'Here is THE defining feature of Python. JavaScript marks code blocks with curly braces:\n\nif (x > 5) {\n  ...\n}\n\nPython uses INDENTATION instead. The spaces at the start of a line are not decoration — they ARE the structure:\n\nif x > 5:\n    print("big")\n    print("still inside the if")\nprint("outside the if — always runs")\n\nRules:\n- The if line ends with a colon :\n- Everything indented below it belongs to the if\n- The block ends when indentation returns to the previous level\n- Standard indent is 4 spaces; be consistent or Python raises IndentationError\n\nelse and elif (Python\u2019s "else if") follow the same shape:\n\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelse:\n    print("Try again")\n\nAlso: no parentheses needed around the condition, and equality is == (two equals — Python has no ===; its == already respects types).\n\nYOUR TASK\nThe starter sets score to 85. Write an if/else printing "Pass" when score is 70 or higher, "Fail" otherwise. Watch your colons and your 4-space indents.\n\nExpected output:\nPass',
    starterCode:
      'score = 85\n\n# if score is 70 or more print "Pass", else print "Fail"\n',
    expectedOutput: ['Pass'],
  },
  {
    id: 'py-05-lists',
    order: 24,
    title: 'Lists',
    language: 'python',
    instructions:
      'Python\u2019s version of the array is the LIST — same square brackets, same zero-based indexing:\n\nrates = [199, 219, 249]\nrates[0]       # 199\nlen(rates)     # 3\n\nTwo renames from JavaScript:\n- Length is the len() FUNCTION wrapped around the list, not a .length property\n- Adding to the end is .append(), not .push():\n  rates.append(299)\n\nLooping is where Python gets beautiful. The for...of you learned becomes simply for...in:\n\nfor rate in rates:\n    print(rate)\n\nColon, indent, done. Read it aloud: "for each rate in rates."\n\nAnd counting loops? Python has no three-part for(;;) loop at all. Instead there\u2019s range():\n\nfor i in range(1, 6):\n    print(i)          # 1, 2, 3, 4, 5\n\nCareful: range(1, 6) stops BEFORE 6. The end value is excluded — start is included, stop is not. range(5) alone means 0 through 4.\n\nYOUR TASK\nThe starter has a list of rates.\n1. Print how many there are with len()\n2. Loop and print each on its own line\n\nExpected output:\n3\n199\n219\n249',
    starterCode:
      'rates = [199, 219, 249]\n\n# print the length, then loop and print each rate\n',
    expectedOutput: ['3', '199', '219', '249'],
  },
  {
    id: 'py-06-accumulator',
    order: 25,
    title: 'The Accumulator, Again',
    language: 'python',
    instructions:
      'The accumulator pattern from the JS track translates directly — variable before the loop, update it inside:\n\ntotal = 0\nfor i in range(1, 4):\n    total += i\nprint(total)    # 6\n\nSame walk-through as before: total starts at 0, gains 1, then 2, then 3. The += shorthand works identically in Python.\n\nNotice how much the pattern transcends language. The SHAPE — initialize, loop, update, use — is identical; only range() and indentation changed. This is why learning your second language is so much faster than your first, and your third faster still.\n\nOne Python bonus while we\u2019re here: the built-in sum() can total a list directly — sum([1, 2, 3]) is 6. Real Python code uses it constantly. But write the loop yourself in this lesson; the pattern matters more than the shortcut, because it generalizes to problems sum() can\u2019t touch (counting matches, finding maximums, building strings).\n\nYOUR TASK\nUse an accumulator loop to add the numbers 1 through 10, then print the total.\n\nHint: to INCLUDE 10, your range must stop at 11.\n\nExpected output:\n55',
    starterCode:
      'total = 0\n\n# loop with range and add each number to total\n\n# print total\n',
    expectedOutput: ['55'],
  },
  {
    id: 'py-07-functions',
    order: 26,
    title: 'Python Functions',
    language: 'python',
    instructions:
      'Functions in Python use def, a colon, and indentation:\n\ndef double(n):\n    return n * 2\n\nprint(double(5))    # 10\n\nEverything you know holds: parameters receive what callers pass, return sends the answer back, and returning is not printing. Just no braces, no function keyword, no type annotations required.\n\nMulti-parameter functions, same as ever:\n\ndef area(w, h):\n    return w * h\n\nOne genuinely new trick — DEFAULT values. Give a parameter a fallback and callers may omit it:\n\ndef greet(name, greeting="Hello"):\n    return f"{greeting}, {name}!"\n\ngreet("Ada")             # Hello, Ada!\ngreet("Ada", "Howdy")    # Howdy, Ada!\n\nYOUR TASK\nWrite occupancy_pct(sold, available) that returns the occupancy percentage: sold divided by available, times 100.\n\nThe starter calls it with (90, 120). Remember Python division yields floats, so the answer prints with a decimal.\n\nExpected output:\n75.0',
    starterCode:
      'def occupancy_pct(sold, available):\n    # return the percentage\n    pass\n\nprint(occupancy_pct(90, 120))\n',
    expectedOutput: ['75.0'],
  },
  {
    id: 'py-08-dicts',
    order: 27,
    title: 'Dictionaries',
    language: 'python',
    instructions:
      'Python\u2019s answer to the JavaScript object is the DICTIONARY:\n\nguest = {\n    "name": "Alice",\n    "nights": 3,\n}\n\nAlmost identical — except the keys are quoted strings, and access uses square brackets instead of a dot:\n\nguest["name"]      # "Alice"\nguest["nights"]    # 3\n\n(Dot access like guest.name does NOT work on dicts — that\u2019s the JavaScript habit to unlearn here.)\n\nAdd or change entries by assigning to a key:\n\nguest["room"] = 204        # new key\nguest["nights"] = 4        # updated value\n\nAnd dicts pair perfectly with f-strings — one care point: use the OTHER quote style inside the braces so the quotes don\u2019t collide:\n\nprint(f"{guest['name']} is staying {guest['nights']} nights")\n\nDouble quotes outside, single quotes inside. (JavaScript objects needed no quotes at all in dot access, so this is new friction — everyone fumbles it once.)\n\nYOUR TASK\nCreate a dict room with keys "num" set to 204 and "rate" set to 219. Print, using an f-string:\n\nRoom 204 costs $219',
    starterCode:
      '# create the room dict, then print with an f-string\n',
    expectedOutput: ['Room 204 costs $219'],
  },
  {
    id: 'py-09-capstone',
    order: 28,
    title: 'Capstone: Rate Report',
    language: 'python',
    instructions:
      'Time to combine everything from this track — no new concepts, just assembly. This is what real programming feels like: small known pieces composed into something useful.\n\nYou\u2019ll build a mini rate report. The starter gives you a list of dictionaries — a structure you\u2019ll meet constantly in real data work (every CSV row, every database record, every API response looks like this):\n\nrooms = [\n    {"num": 101, "rate": 199},\n    {"num": 102, "rate": 219},\n    {"num": 103, "rate": 249},\n]\n\nYou need: a loop over the list, dictionary access inside f-strings, an accumulator for the total, and division for the average.\n\nYOUR TASK\n1. Loop over rooms, printing for each: Room <num>: $<rate>\n2. While looping, accumulate the rates into a total\n3. After the loop, compute the average (total divided by len(rooms))\n4. Print: Average rate: $222.33\n\nFor that last line, round to 2 decimals with an f-string format spec — put :.2f after the value inside the braces:\n\nprint(f"Average rate: ${avg:.2f}")\n\nExpected output:\nRoom 101: $199\nRoom 102: $219\nRoom 103: $249\nAverage rate: $222.33',
    starterCode:
      'rooms = [\n    {"num": 101, "rate": 199},\n    {"num": 102, "rate": 219},\n    {"num": 103, "rate": 249},\n]\n\ntotal = 0\n\n# 1-2. loop: print each room line and accumulate\n\n# 3-4. compute average and print it rounded to 2 decimals\n',
    expectedOutput: [
      'Room 101: $199',
      'Room 102: $219',
      'Room 103: $249',
      'Average rate: $222.33',
    ],
  },
];
