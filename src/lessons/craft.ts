import type { LessonDraft } from '../types';

export const CRAFT_LESSONS: LessonDraft[] = [
  {
    id: 'craft-01-git',
    title: 'Git: The Mental Model',
    language: 'javascript',
    kind: 'reading',
    module: 'Version Control',
    difficulty: 3,
    concepts: ['git', 'commits', 'branches', 'merge'],
    instructions: `Git is the one tool you are guaranteed to use every day, in every job. Most people learn four commands by rote and then panic when something unusual happens. The cure is a mental model.

### What a commit is

A commit is a **snapshot** of your whole project, plus a pointer to its parent. Not a diff — a full snapshot (stored efficiently). The chain of parents is your history.

A **branch** is nothing but a movable label pointing at one commit. Creating a branch is instant because it writes 40 bytes. This is why branching in git is cheap and branching in older tools was not.

\`HEAD\` is a label pointing at where you currently are.

### The three areas

\`\`\`
working directory  →  staging area  →  repository
     (your edits)      (git add)       (git commit)
\`\`\`

The staging area exists so you can commit *some* of your changes — the fix without the debug prints. \`git add -p\` walks you through hunk by hunk, and using it well is a visible sign of experience.

### The commands, grouped by intent

\`\`\`bash
git status                    # what state am I in? run this constantly
git add -p                    # stage selected changes
git commit -m "message"       # snapshot
git log --oneline --graph     # see the shape of history

git switch -c feature/thing   # new branch
git switch main               # move between branches
git merge feature/thing       # bring the work in

git fetch                     # download without changing anything
git pull                      # fetch + merge
git push -u origin branch     # publish
\`\`\`

### The recovery cases, which are what people actually panic about

\`\`\`bash
git restore file.js               # discard uncommitted changes to a file
git restore --staged file.js      # unstage, keep the edit
git commit --amend                # fix the last commit (only if unpushed)
git revert <sha>                  # a NEW commit undoing an old one — safe on shared branches
git reset --hard <sha>            # rewrite history — destroys work, never on shared branches
git reflog                        # every position HEAD has held; how you recover "lost" commits
\`\`\`

\`git reflog\` is the safety net. Almost nothing committed is truly lost for at least 30 days, and knowing that turns git from frightening into forgiving.

### Merge or rebase

**Merge** creates a commit joining two histories — honest, non-destructive, slightly noisy. **Rebase** replays your commits on top of another branch — a clean straight line, but it rewrites commit identities.

The rule that keeps you out of trouble: *rebase your own unpublished work, merge anything others may have pulled.* Rewriting shared history forces everyone else to repair their clones.

### Commit messages

\`\`\`
Fix rate calculation for multi-night stays

The nightly rate was applied once instead of per night, so any
booking over one night was under-charged. Multiply by nights.

Fixes #412
\`\`\`

Imperative mood, a summary under about 50 characters, then a blank line, then *why*. The diff already shows what changed; the message exists to explain the reasoning to whoever is reading it in two years — often you.

### Merge conflicts

\`\`\`
<<<<<<< HEAD
const rate = 200;
=======
const rate = 250;
>>>>>>> feature/pricing
\`\`\`

Above the \`=======\` is your side, below it is theirs. Edit the file into what it should actually be, delete all three markers, \`git add\` it, and continue. A conflict is not an error — it is git declining to guess.`,
  },
  {
    id: 'craft-02-git-quiz',
    title: 'Checkpoint: Git Under Pressure',
    language: 'javascript',
    kind: 'quiz',
    module: 'Version Control',
    difficulty: 3,
    concepts: ['git', 'recovery', 'workflow'],
    instructions: `The git questions you get asked are almost always recovery scenarios, because that is where understanding shows.`,
    quiz: [
      {
        id: 'q1',
        prompt: 'You committed to `main` but meant to work on a branch. Nothing is pushed. What do you do?',
        choices: [
          'Delete the repository and start again',
          'Create a branch at the current commit, then move main back with git reset',
          'git revert the commit',
          'Nothing can be done',
        ],
        answerIndex: 1,
        explanation:
          '`git switch -c feature/x` puts a branch label at your current commit, then `git switch main && git reset --hard origin/main` moves main back. Since nothing was pushed, rewriting local history is completely safe.',
      },
      {
        id: 'q2',
        prompt: 'A bad commit is already pushed and colleagues have pulled it. How do you undo it?',
        choices: [
          'git reset --hard and force push',
          'git revert, which adds a new commit undoing it',
          'Delete the branch',
          'git commit --amend',
        ],
        answerIndex: 1,
        explanation:
          '`git revert`. It undoes the change by adding a new commit, leaving history intact. Reset plus force-push rewrites history everyone else has, which breaks their clones — the cardinal sin of shared branches.',
      },
      {
        id: 'q3',
        prompt: 'What is a branch, technically?',
        choices: [
          'A copy of the whole project directory',
          'A movable pointer to a commit',
          'A folder inside .git',
          'A diff against main',
        ],
        answerIndex: 1,
        explanation:
          'A movable pointer — a file containing a commit hash. That is why creating one is instantaneous regardless of project size, and why having twenty branches costs nothing.',
      },
      {
        id: 'q4',
        prompt: 'You think you deleted a commit with a bad reset. What is your first move?',
        choices: ['git reflog', 'Restore from backup', 'git fsck --lost-found', 'Ask a colleague to re-push'],
        answerIndex: 0,
        explanation:
          '`git reflog` lists every position HEAD has occupied, including the one you "lost". Find the hash, `git reset --hard <sha>` or branch from it. Commits survive for around 30 days before garbage collection.',
      },
      {
        id: 'q5',
        prompt: 'When is rebasing the wrong choice?',
        choices: [
          'When your branch has more than 5 commits',
          'When the commits have been pushed and others may have pulled them',
          'When you have merge conflicts',
          'Rebasing is always wrong',
        ],
        answerIndex: 1,
        explanation:
          'On shared history. Rebase creates new commits with new hashes; anyone who already has the old ones ends up with a divergent, confusing history. Rebase your own unpublished work freely, merge anything public.',
      },
      {
        id: 'q6',
        prompt: 'What is the staging area for?',
        choices: [
          'Backing up files',
          'Choosing which changes go into the next commit',
          'Storing merge conflicts',
          'Nothing — it is legacy',
        ],
        answerIndex: 1,
        explanation:
          'Composing a commit deliberately. It lets you commit the fix without the stray debug logging, so history stays reviewable. `git add -p` stages selectively, hunk by hunk.',
      },
    ],
  },
  {
    id: 'craft-03-code-review',
    title: 'Code Review',
    language: 'javascript',
    kind: 'reading',
    module: 'Working With People',
    difficulty: 3,
    concepts: ['code-review', 'communication', 'pull-requests'],
    instructions: `Every professional change gets reviewed before it ships. As a junior you will be on the receiving end constantly, and how you handle it shapes your reputation faster than your code does.

### Making a pull request that gets approved quickly

**Keep it small.** A 100-line PR gets thorough comments. A 2,000-line PR gets "looks good to me", which means nobody read it. Small PRs are reviewed faster, more usefully, and revert more safely.

**Write the description for a reader who lacks your context**: what changed, why, how you verified it, and anything you are unsure about. Flagging your own uncertainty is a strength — it directs attention where it is useful.

**Review it yourself first.** Read your own diff before requesting review. You will find the leftover console.log every time.

### Taking feedback

The comments are about the code, not about you. This is genuinely hard at first and it does become automatic.

- If you agree: fix it, and say so briefly.
- If you disagree: say why, with reasoning. "I used a Map here because this lookup runs inside a loop over 10k items" is a good reply. Reviewers are often wrong, and pushing back with evidence earns respect.
- If you do not understand: ask. Nobody thinks less of "could you say more about what you'd prefer here?"
- If it is bikeshedding about formatting: that is what a linter and formatter are for. Automate the argument away.

### Giving feedback

**Distinguish severity.** Say which is which:

- *blocking* — a bug, a security hole, data loss
- *suggestion* — a real improvement, author's call
- *nit* — style preference, take it or leave it

**Ask rather than command.** "What happens if \`items\` is empty here?" invites thinking. "This is wrong" invites defensiveness — and occasionally you are the one who is wrong.

**Say what is good.** A review that only ever finds fault is demoralising and, over time, gets ignored.

### What to actually look for

1. Does it do what the ticket asked?
2. Edge cases: empty, null, one, huge, concurrent.
3. Error handling: what happens when this fails?
4. Security: user input concatenated into a query, secrets in the diff, missing authorisation check.
5. Tests: is the new behaviour covered, and would the test fail if the code were wrong?
6. Readability: will this be clear in a year?

Notice that naming and formatting are near the bottom, and correctness and security are at the top. Junior reviewers invert that list.`,
  },
  {
    id: 'craft-04-security',
    title: 'Security Basics You Are Expected to Know',
    language: 'javascript',
    module: 'Working With People',
    difficulty: 4,
    concepts: ['security', 'xss', 'injection', 'secrets', 'validation'],
    instructions: `Nobody expects a junior to be a security engineer. Everybody expects you not to introduce the well-known holes. These are the ones that come up in reviews and interviews.

### 1. Injection — never build queries or commands from strings

\`\`\`js
db.query("SELECT * FROM users WHERE email = '" + email + "'");   // vulnerable
db.query("SELECT * FROM users WHERE email = ?", [email]);         // safe
\`\`\`

Parameterised queries send the statement and the data on separate channels, so input can never be parsed as code. The same principle applies to shell commands and to anything else that parses text.

### 2. XSS — never inject untrusted text as HTML

\`\`\`js
el.innerHTML = userComment;      // a <script> in the comment now runs
el.textContent = userComment;    // safe: it becomes text
\`\`\`

React escapes by default; \`dangerouslySetInnerHTML\` is named that way deliberately.

### 3. Never trust the client

Client-side validation is for user experience. Server-side validation is for security. Anyone can call your API directly with curl, so **every** rule must be enforced on the server — including "is this user allowed to do this", which is the check most often forgotten.

### 4. Secrets do not belong in the repository

API keys, passwords and tokens go in environment variables, never in source. Committing a secret means rotating it — deleting the commit is not enough, because the history and every clone still have it.

Also remember: anything in front-end code is public. There is no such thing as a secret in a browser bundle.

### 5. Never store passwords, even hashed with the wrong thing

Use a purpose-built password hash — bcrypt, argon2, scrypt — via a library. Not SHA-256, which is fast and therefore easy to brute-force. Not encryption, which is reversible. And never plain text.

### 6. Authentication is not authorisation

*Authentication* is who you are. *Authorisation* is what you may do. Checking that someone is logged in and then trusting the \`userId\` they sent you is a real, common, catastrophic bug:

\`\`\`js
// vulnerable: any logged-in user can read any order
app.get("/orders/:id", requireLogin, (req, res) => res.json(getOrder(req.params.id)));

// correct: the record must belong to the caller
const order = getOrder(req.params.id);
if (order.userId !== req.user.id) return res.status(404).end();
\`\`\`

## YOUR TASK

Fix \`renderComment(comment)\`, which currently builds HTML by concatenation and would execute any script a commenter includes.

Write \`escapeHtml(text)\` that replaces the five dangerous characters with their HTML entities, then use it. This is what every template engine does for you — writing it once makes the mechanism concrete.

| Character | Entity |
| --- | --- |
| \`&\` | \`&amp;\` |
| \`<\` | \`&lt;\` |
| \`>\` | \`&gt;\` |
| \`"\` | \`&quot;\` |
| \`'\` | \`&#39;\` |

Escape the ampersand **first**, or you will double-escape the entities you just inserted.`,
    starterCode: `function escapeHtml(text) {
}

// Vulnerable: a comment containing <script> would run.
function renderComment(comment) {
  return "<div class='comment'>" + comment.author + ": " + comment.body + "</div>";
}
`,
    testCode: `test("escapeHtml handles the five characters", () => {
  expect(escapeHtml("<")).toBe("&lt;");
  expect(escapeHtml(">")).toBe("&gt;");
  expect(escapeHtml('"')).toBe("&quot;");
  expect(escapeHtml("'")).toBe("&#39;");
  expect(escapeHtml("&")).toBe("&amp;");
});

test("escapeHtml does not double-escape", () => {
  expect(escapeHtml("a & b")).toBe("a &amp; b");
  expect(escapeHtml("<a>")).toBe("&lt;a&gt;");
});

test("escapeHtml leaves ordinary text alone", () => {
  expect(escapeHtml("hello world")).toBe("hello world");
  expect(escapeHtml("")).toBe("");
});

test("renderComment neutralises a script tag", () => {
  const html = renderComment({ author: "Mallory", body: "<script>steal()</script>" });
  expect(html).not.toContain("<script>");
  expect(html).toContain("&lt;script&gt;");
});

test("renderComment escapes the author too", () => {
  const html = renderComment({ author: "<img onerror=x>", body: "hi" });
  expect(html).not.toContain("<img");
});

test("renderComment still shows ordinary comments", () => {
  const html = renderComment({ author: "Ada", body: "Nice work" });
  expect(html).toContain("Ada");
  expect(html).toContain("Nice work");
});`,
    hints: [
      'Chain five `.replace(/x/g, ...)` calls, ampersand first.',
      'The `g` flag matters — without it only the first occurrence is replaced.',
      'In `renderComment`, wrap both `comment.author` and `comment.body` in `escapeHtml`.',
    ],
    solution: `function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderComment(comment) {
  return (
    "<div class='comment'>" +
    escapeHtml(comment.author) +
    ": " +
    escapeHtml(comment.body) +
    "</div>"
  );
}
`,
  },
  {
    id: 'craft-05-clean-code',
    title: 'Code Other People Can Read',
    language: 'javascript',
    module: 'Craft',
    difficulty: 3,
    concepts: ['refactoring', 'naming', 'functions', 'readability'],
    instructions: `Code is read far more often than it is written, usually by someone with none of your context — frequently you, months later. Readability is not decoration; it is the main cost driver in software.

### Names carry the weight

\`\`\`js
const d = u.filter(x => x.a > 30);            // meaningless
const adults = users.filter(u => u.age > 30); // says what it is
\`\`\`

Say what a thing *is*, not what type it has. Booleans read as questions: \`isActive\`, \`hasPermission\`. Functions start with verbs: \`calculateTotal\`, \`fetchUser\`. Short names are fine for short lives — \`i\` in a three-line loop is clearer than \`indexOfCurrentElement\`.

### Magic numbers

\`\`\`js
if (user.age > 17) { ... }                 // 17 means what?
const MINIMUM_AGE = 18;
if (user.age >= MINIMUM_AGE) { ... }       // and the off-by-one is now visible
\`\`\`

Naming the constant did not just document it — it exposed a bug.

### One function, one job

If you cannot name a function without using "and", it is doing two things. The usual seam is *decide* versus *do*: keep the decision pure and testable, and let a thin caller perform the effect.

### Nesting is a smell

\`\`\`js
// arrow-shaped
function process(order) {
  if (order) {
    if (order.items.length > 0) {
      if (order.paid) {
        return ship(order);
      }
    }
  }
  return null;
}

// guard clauses: the happy path is the last line, unindented
function process(order) {
  if (!order) return null;
  if (order.items.length === 0) return null;
  if (!order.paid) return null;
  return ship(order);
}
\`\`\`

### Comments explain why, not what

\`\`\`js
i++;  // increment i                              ← noise
// The API rejects the whole batch above 100, so we chunk.   ← valuable
\`\`\`

If a comment explains *what* the code does, the code should have been clearer instead. Reasons, constraints and links to tickets are what cannot be recovered from the source.

### Delete code

Commented-out blocks and "just in case" helpers are clutter. Git remembers everything; you do not need to.

## YOUR TASK

Refactor \`p(o)\` — a working but unreadable function — into \`calculateOrderTotal(order)\`.

Behaviour to preserve exactly: sum \`price * qty\` across items; apply a 10% discount when the subtotal is over 100; add 20% tax; round to 2 decimals. Return 0 for an empty or missing order.

Use guard clauses, named constants and a clear structure. The tests check behaviour; the point of the exercise is the shape of what you write.`,
    starterCode: `// Works. Unreadable. Rewrite it as calculateOrderTotal(order).
function p(o) {
  let t = 0;
  if (o) {
    if (o.i) {
      for (let x = 0; x < o.i.length; x++) {
        t = t + o.i[x].p * o.i[x].q;
      }
      if (t > 100) {
        t = t * 0.9;
      }
      t = t * 1.2;
    }
  }
  return Math.round(t * 100) / 100;
}

function calculateOrderTotal(order) {
}
`,
    testCode: `test("totals a simple order", () => {
  const order = { i: [{ p: 10, q: 2 }] };
  expect(calculateOrderTotal(order)).toBe(24);
});

test("applies the discount above 100", () => {
  const order = { i: [{ p: 100, q: 2 }] };
  expect(calculateOrderTotal(order)).toBe(216);
});

test("does not discount at exactly 100", () => {
  const order = { i: [{ p: 50, q: 2 }] };
  expect(calculateOrderTotal(order)).toBe(120);
});

test("handles missing and empty orders", () => {
  expect(calculateOrderTotal(null)).toBe(0);
  expect(calculateOrderTotal(undefined)).toBe(0);
  expect(calculateOrderTotal({})).toBe(0);
  expect(calculateOrderTotal({ i: [] })).toBe(0);
});

test("rounds to two decimals", () => {
  const order = { i: [{ p: 9.99, q: 1 }] };
  expect(calculateOrderTotal(order)).toBe(11.99);
});

test("matches the original implementation on random orders", () => {
  for (let n = 0; n < 50; n++) {
    const items = Array.from({ length: 1 + Math.floor(Math.random() * 4) }, () => ({
      p: Math.round(Math.random() * 8000) / 100,
      q: 1 + Math.floor(Math.random() * 3),
    }));
    const order = { i: items };
    expect(calculateOrderTotal(order)).toBe(p(order));
  }
});`,
    hints: [
      'Start with the guards: no order, or no items, returns 0.',
      'Name the rules: `DISCOUNT_THRESHOLD = 100`, `DISCOUNT_RATE = 0.1`, `TAX_RATE = 0.2`.',
      'Watch the boundary — the original discounts only when the subtotal is strictly greater than 100.',
    ],
    solution: `// The original is kept so the equivalence test can compare against it.
function p(o) {
  let t = 0;
  if (o) {
    if (o.i) {
      for (let x = 0; x < o.i.length; x++) {
        t = t + o.i[x].p * o.i[x].q;
      }
      if (t > 100) {
        t = t * 0.9;
      }
      t = t * 1.2;
    }
  }
  return Math.round(t * 100) / 100;
}

const DISCOUNT_THRESHOLD = 100;
const DISCOUNT_RATE = 0.1;
const TAX_RATE = 0.2;

function calculateOrderTotal(order) {
  const items = order?.i;
  if (!items || items.length === 0) return 0;

  const subtotal = items.reduce((sum, item) => sum + item.p * item.q, 0);
  const discounted =
    subtotal > DISCOUNT_THRESHOLD ? subtotal * (1 - DISCOUNT_RATE) : subtotal;
  const withTax = discounted * (1 + TAX_RATE);

  return Math.round(withTax * 100) / 100;
}
`,
  },
  {
    id: 'craft-06-system-design',
    title: 'System Design for Juniors',
    language: 'javascript',
    kind: 'reading',
    module: 'Craft',
    difficulty: 4,
    concepts: ['system-design', 'architecture', 'scaling', 'trade-offs'],
    instructions: `You will not be asked to design a distributed database as a junior. You may well be asked "how would you build a URL shortener" — and what is being measured is whether you can structure a conversation about trade-offs.

### The method

**1. Ask questions before designing anything.** How many users? Read-heavy or write-heavy? How fresh must data be? What must never be lost? Jumping straight to a diagram is the most common failure, and asking two good clarifying questions beats a fast answer.

**2. Sketch the boxes.** Client → API → database, plus a cache and a queue if warranted. Start simple and add only what a stated requirement forces.

**3. Define the data model.** Tables and key access patterns. Most designs live or die here.

**4. Walk one request end to end.** "A user submits a URL: the API validates it, generates a short code, writes it, returns it." Concrete beats abstract.

**5. Then discuss scale.** What breaks first at 100× traffic, and what would you do about it?

### The vocabulary you are expected to have

**Vertical vs horizontal scaling** — a bigger machine, or more machines. Vertical is simpler and hits a ceiling; horizontal needs statelessness and a load balancer.

**Stateless services** — keep session state out of the app server (in a token or a shared store) so any instance can serve any request. This is what makes horizontal scaling possible.

**Caching** — store the results of expensive work close to where they are needed. The hard part is never storing; it is *invalidation*, deciding when the cached copy has become a lie.

**Queues** — for work that need not happen during the request. Sending an email, generating a report, resizing an image. The request returns fast and the work happens reliably behind it.

**Database indexes and replicas** — indexes for query speed, read replicas to spread read load. Note that replication introduces lag, so a read straight after a write may not see it.

**CAP, honestly** — when the network between your machines fails, you get to keep either consistency or availability, not both. A bank picks consistency; a social feed picks availability. It only bites during partitions.

### The senior-sounding moves

- Say what you are optimising for, and what you are giving up. Every design is a trade.
- Give rough numbers. "10,000 users, a few requests a day each — that is well under 1 request per second, so a single server is fine" is a strong answer, and it demonstrates you will not over-engineer.
- Identify the bottleneck before proposing a fix.
- Be willing to say "I would measure that rather than guess."

The trap is proposing microservices, Kafka and Kubernetes for something a single database would serve for years. Recognising that a simple design is sufficient is a senior signal, not a junior one.`,
  },
  {
    id: 'craft-07-professional-quiz',
    title: 'Checkpoint: The Job, Not the Code',
    language: 'javascript',
    kind: 'quiz',
    module: 'Craft',
    difficulty: 3,
    concepts: ['professionalism', 'estimation', 'communication', 'ci-cd'],
    instructions: `The parts of the job that no tutorial covers and every interview probes.`,
    quiz: [
      {
        id: 'q1',
        prompt: 'You are two days into a three-day task and realise it will take a week. When do you say something?',
        choices: [
          'Immediately',
          'At the three-day deadline',
          'When it is finished',
          'Only if someone asks',
        ],
        answerIndex: 0,
        explanation:
          'Immediately. Early notice lets people re-plan; late notice removes their options. Nobody is upset by a revised estimate with a reason — they are upset by a surprise on the deadline. Bring the new estimate and what changed.',
      },
      {
        id: 'q2',
        prompt: 'You have been stuck on the same bug for three hours. What is the professional move?',
        choices: [
          'Keep going — asking looks weak',
          'Ask, with what you have tried and what you expected',
          'Silently switch to another task',
          'Rewrite the module from scratch',
        ],
        answerIndex: 1,
        explanation:
          'Ask, well. Most teams have an informal rule of 30 to 60 minutes before raising it. A good question — what you tried, what you expected, what happened — takes a colleague two minutes and shows you did the work. Silence for three hours costs the team more than the question would have.',
      },
      {
        id: 'q3',
        prompt: 'What is the main purpose of continuous integration?',
        choices: [
          'To deploy to production automatically',
          'To run tests and checks on every change so problems surface within minutes',
          'To replace code review',
          'To generate documentation',
        ],
        answerIndex: 1,
        explanation:
          'Fast, automatic feedback on every change. The value is in shrinking the gap between introducing a problem and learning about it. Continuous deployment — actually shipping automatically — is a separate step some teams take and others do not.',
      },
      {
        id: 'q4',
        prompt: 'A reviewer asks you to change something you believe is correct as written. What do you do?',
        choices: [
          'Change it silently to avoid conflict',
          'Explain your reasoning and ask what they are seeing',
          'Ignore the comment and merge',
          'Escalate to a manager',
        ],
        answerIndex: 1,
        explanation:
          'Explain and ask. Reviews are a technical conversation, not an instruction. "I chose a Map because this runs inside a loop over 10k items — what were you seeing?" either teaches them something or teaches you something. Silent compliance wastes the review, and silent merging destroys trust.',
      },
      {
        id: 'q5',
        prompt: 'Your change broke production. What is the first priority?',
        choices: [
          'Find who reviewed it',
          'Restore service — usually by reverting',
          'Write a post-mortem',
          'Add tests',
        ],
        answerIndex: 1,
        explanation:
          'Stop the bleeding. Revert or roll back first, diagnose afterwards with the pressure off. Then a blameless post-mortem asking what in the system allowed it through — good teams fix the process, not the person.',
      },
      {
        id: 'q6',
        prompt: 'A ticket says "make the dashboard faster". What is the best first step?',
        choices: [
          'Add caching everywhere',
          'Measure to find what is actually slow',
          'Rewrite it in a faster framework',
          'Add more server memory',
        ],
        answerIndex: 1,
        explanation:
          'Measure. Optimising without profiling means guessing, and the guess is usually wrong — the culprit is frequently one N+1 query rather than the code you suspected. "I would profile it first" is close to a correct answer to every performance question.',
      },
      {
        id: 'q7',
        prompt: 'You inherit a codebase with no tests and are asked to change one function. What do you do?',
        choices: [
          'Refactor the whole file while you are in there',
          'Write a test capturing the current behaviour, then change it',
          'Change it and hope',
          'Refuse until tests exist',
        ],
        answerIndex: 1,
        explanation:
          'Pin the existing behaviour with a test first, then change it. That gives you a safety net for exactly the code you are touching and leaves the codebase better by one test. Refactoring everything in an unrelated PR makes the change unreviewable.',
      },
    ],
  },
];
