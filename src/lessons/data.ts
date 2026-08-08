import type { LessonDraft } from '../types';

/**
 * Every SQL lesson gets a freshly built in-memory database seeded with this
 * schema, so a mistaken UPDATE or DROP never leaks into the next attempt.
 */
const HOTEL_DB = `
CREATE TABLE guests (
  id      INTEGER PRIMARY KEY,
  name    TEXT NOT NULL,
  country TEXT NOT NULL
);

CREATE TABLE rooms (
  id     INTEGER PRIMARY KEY,
  number INTEGER NOT NULL,
  type   TEXT NOT NULL,
  rate   INTEGER NOT NULL
);

CREATE TABLE bookings (
  id       INTEGER PRIMARY KEY,
  guest_id INTEGER NOT NULL REFERENCES guests(id),
  room_id  INTEGER NOT NULL REFERENCES rooms(id),
  nights   INTEGER NOT NULL,
  status   TEXT NOT NULL
);

INSERT INTO guests (id, name, country) VALUES
  (1, 'Ada Lovelace', 'UK'),
  (2, 'Alan Turing', 'UK'),
  (3, 'Grace Hopper', 'USA'),
  (4, 'Katherine Johnson', 'USA'),
  (5, 'Tim Berners-Lee', 'UK');

INSERT INTO rooms (id, number, type, rate) VALUES
  (1, 101, 'Standard', 120),
  (2, 102, 'Standard', 120),
  (3, 201, 'Deluxe', 200),
  (4, 202, 'Deluxe', 200),
  (5, 301, 'Suite', 350);

INSERT INTO bookings (id, guest_id, room_id, nights, status) VALUES
  (1, 1, 3, 3, 'confirmed'),
  (2, 2, 1, 2, 'confirmed'),
  (3, 3, 5, 5, 'confirmed'),
  (4, 1, 1, 1, 'cancelled'),
  (5, 4, 4, 2, 'confirmed'),
  (6, 3, 2, 4, 'pending');
`;

const SCHEMA_NOTE = `
### The database

Every lesson in this track runs against the same three tables:

\`\`\`
guests    id, name, country
rooms     id, number, type, rate
bookings  id, guest_id, room_id, nights, status
\`\`\`

\`bookings.guest_id\` points at \`guests.id\` and \`bookings.room_id\` at \`rooms.id\`. Statuses are \`confirmed\`, \`cancelled\` or \`pending\`.

Results print as a header row followed by the rows, values separated by \` | \`. Your output must match exactly, so **use the column aliases the task asks for**.
`;

export const DATA_LESSONS: LessonDraft[] = [
  {
    id: 'sql-01-select',
    title: 'SELECT: Asking for Data',
    language: 'sql',
    kind: 'sql',
    module: 'Querying',
    difficulty: 2,
    concepts: ['select', 'from', 'columns'],
    sqlSetup: HOTEL_DB,
    instructions: `SQL is a language for asking a database questions. Unlike everything else in this app, you do not tell it *how* to get the answer — you describe the answer you want and the database works out the plan. That declarative style is why SQL has outlived every framework built on top of it.

\`\`\`sql
SELECT name, country
FROM guests;
\`\`\`

\`SELECT\` lists the columns you want; \`FROM\` names the table. \`SELECT *\` gives you every column, which is handy while exploring and a bad habit in application code — it drags back data you do not need and breaks silently when someone adds a column.

Conventions worth adopting now: keywords in capitals, one clause per line, and a semicolon at the end. Nobody enforces it, everybody does it.

Rename a column in the output with \`AS\`:

\`\`\`sql
SELECT name AS guest_name FROM guests;
\`\`\`
${SCHEMA_NOTE}
## YOUR TASK

Select the \`number\`, \`type\` and \`rate\` columns from \`rooms\`, in that order.`,
    starterCode: `-- Select number, type and rate from the rooms table
`,
    expectedOutput: [
      'number | type | rate',
      '101 | Standard | 120',
      '102 | Standard | 120',
      '201 | Deluxe | 200',
      '202 | Deluxe | 200',
      '301 | Suite | 350',
    ],
    hints: [
      'The shape is `SELECT columns FROM table;`',
      'List the three column names separated by commas, in the order the task gives them.',
    ],
    solution: `SELECT number, type, rate
FROM rooms;
`,
  },
  {
    id: 'sql-02-where',
    title: 'WHERE and ORDER BY',
    language: 'sql',
    kind: 'sql',
    module: 'Querying',
    difficulty: 2,
    concepts: ['where', 'order-by', 'filtering'],
    sqlSetup: HOTEL_DB,
    instructions: `\`WHERE\` filters rows; \`ORDER BY\` sorts them.

\`\`\`sql
SELECT name, country
FROM guests
WHERE country = 'UK'
ORDER BY name;
\`\`\`

### Comparison in SQL

\`\`\`sql
WHERE rate = 200            -- single equals, not ==
WHERE rate <> 200           -- not equal (!= also works)
WHERE rate BETWEEN 100 AND 250
WHERE type IN ('Deluxe', 'Suite')
WHERE name LIKE 'A%'        -- % matches any run of characters
WHERE country IS NULL       -- never  = NULL
\`\`\`

That last one is a genuine trap. \`NULL\` means *unknown*, so \`NULL = NULL\` is not true — it is unknown. Comparisons with NULL must use \`IS NULL\` and \`IS NOT NULL\`.

Strings use single quotes. Double quotes mean something else in standard SQL (an identifier), so reaching for them is a common early mistake.

### Sorting

\`\`\`sql
ORDER BY rate DESC          -- highest first; ASC is the default
ORDER BY rate DESC, number  -- ties broken by the second column
\`\`\`

Without \`ORDER BY\` a database makes **no promise** about row order. It may look stable in testing and change once the data grows or the query plan does. If order matters, say so.
${SCHEMA_NOTE}
## YOUR TASK

Select \`number\` and \`rate\` from \`rooms\` where the rate is 200 or more, most expensive first, breaking ties by room number ascending.`,
    starterCode: `-- Rooms costing 200 or more, priciest first
`,
    expectedOutput: ['number | rate', '301 | 350', '201 | 200', '202 | 200'],
    hints: [
      'The clause order is fixed: SELECT, then FROM, then WHERE, then ORDER BY.',
      '"200 or more" is `rate >= 200`.',
      'Two sort keys go in one ORDER BY, separated by a comma: `ORDER BY rate DESC, number`.',
    ],
    solution: `SELECT number, rate
FROM rooms
WHERE rate >= 200
ORDER BY rate DESC, number;
`,
  },
  {
    id: 'sql-03-aggregates',
    title: 'Aggregates and GROUP BY',
    language: 'sql',
    kind: 'sql',
    module: 'Summarising',
    difficulty: 3,
    concepts: ['group-by', 'count', 'sum', 'avg', 'aggregates'],
    sqlSetup: HOTEL_DB,
    instructions: `Aggregate functions collapse many rows into one value:

\`\`\`sql
SELECT COUNT(*), SUM(rate), AVG(rate), MIN(rate), MAX(rate)
FROM rooms;
\`\`\`

On their own they produce a single row for the whole table. \`GROUP BY\` splits the table into buckets first and applies the aggregate to each:

\`\`\`sql
SELECT country, COUNT(*) AS guests
FROM guests
GROUP BY country;
\`\`\`

One output row per distinct country.

### The rule that catches everyone

Every column in your \`SELECT\` must either be **in the \`GROUP BY\`** or be **inside an aggregate**. Asking for \`name\` alongside \`GROUP BY country\` is meaningless — which of the five names should it show? Strict databases reject it outright; SQLite quietly picks one, which is worse.

### COUNT(\\*) versus COUNT(column)

\`COUNT(*)\` counts rows. \`COUNT(column)\` counts rows where that column is **not NULL**. The difference is how you count "how many of these actually have a value", and it is the key to the LEFT JOIN lesson coming up.

### HAVING

\`WHERE\` filters rows *before* grouping; \`HAVING\` filters groups *after*:

\`\`\`sql
SELECT country, COUNT(*) AS guests
FROM guests
GROUP BY country
HAVING COUNT(*) > 1;
\`\`\`
${SCHEMA_NOTE}
## YOUR TASK

For each room \`type\`, show the type, the number of rooms as \`rooms\`, and the average rate as \`avg_rate\`. Sort by type alphabetically.`,
    starterCode: `-- One row per room type: how many, and the average rate
`,
    expectedOutput: [
      'type | rooms | avg_rate',
      'Deluxe | 2 | 200',
      'Standard | 2 | 120',
      'Suite | 1 | 350',
    ],
    hints: [
      'The aliases matter for the header row: `COUNT(*) AS rooms` and `AVG(rate) AS avg_rate`.',
      '`GROUP BY type` goes after FROM and before ORDER BY.',
      '`type` is allowed in the SELECT because it is the column you grouped by.',
    ],
    solution: `SELECT type, COUNT(*) AS rooms, AVG(rate) AS avg_rate
FROM rooms
GROUP BY type
ORDER BY type;
`,
  },
  {
    id: 'sql-04-joins',
    title: 'JOIN: Combining Tables',
    language: 'sql',
    kind: 'sql',
    module: 'Relationships',
    difficulty: 4,
    concepts: ['join', 'foreign-keys', 'relationships'],
    sqlSetup: HOTEL_DB,
    instructions: `Real data is split across tables so each fact is stored exactly once. \`bookings\` does not repeat the guest's name; it stores a \`guest_id\` pointing at \`guests\`. That pointer is a **foreign key**, and storing each fact once is called normalisation — it means a guest changing their name is one update, not thousands.

\`JOIN\` puts the pieces back together:

\`\`\`sql
SELECT guests.name, bookings.nights
FROM bookings
JOIN guests ON guests.id = bookings.guest_id;
\`\`\`

Read it as: for each booking, find the guest whose \`id\` matches its \`guest_id\`, and treat the two rows as one wide row.

### Aliases keep it readable

\`\`\`sql
SELECT g.name, r.number, b.nights
FROM bookings b
JOIN guests g ON g.id = b.guest_id
JOIN rooms  r ON r.id = b.room_id
WHERE b.status = 'confirmed';
\`\`\`

You can join as many tables as you need; each \`JOIN\` adds one \`ON\` condition explaining how it connects.

### The mistake that hurts

Forget the \`ON\` condition and you get a **cross join** — every row paired with every row. 1,000 bookings and 1,000 guests silently becomes a million rows. If a query returns far more rows than expected, a missing or wrong join condition is the first thing to check.
${SCHEMA_NOTE}
## YOUR TASK

For every **confirmed** booking show the guest's \`name\`, the room's \`number\`, and the booking's \`nights\`. Order by the booking id.`,
    starterCode: `-- Guest name, room number and nights for confirmed bookings
`,
    expectedOutput: [
      'name | number | nights',
      'Ada Lovelace | 201 | 3',
      'Alan Turing | 101 | 2',
      'Grace Hopper | 301 | 5',
      'Katherine Johnson | 202 | 2',
    ],
    hints: [
      'Start `FROM bookings b`, then join both other tables to it.',
      'Two joins are needed: one to `guests` on `guest_id`, one to `rooms` on `room_id`.',
      'Because `number` exists only in rooms and `name` only in guests, the aliases in the SELECT are `g.name`, `r.number`, `b.nights`.',
    ],
    solution: `SELECT g.name, r.number, b.nights
FROM bookings b
JOIN guests g ON g.id = b.guest_id
JOIN rooms r ON r.id = b.room_id
WHERE b.status = 'confirmed'
ORDER BY b.id;
`,
  },
  {
    id: 'sql-05-left-join',
    title: 'LEFT JOIN: Keeping the Rows With Nothing',
    language: 'sql',
    kind: 'sql',
    module: 'Relationships',
    difficulty: 4,
    concepts: ['left-join', 'null', 'outer-join'],
    sqlSetup: HOTEL_DB,
    instructions: `A plain \`JOIN\` keeps only rows that match on **both** sides. Guests who never booked anything simply vanish from the result — and often those are exactly the rows the question is about.

\`LEFT JOIN\` keeps every row from the left table, filling the right-hand columns with \`NULL\` where there is no match:

\`\`\`sql
SELECT g.name, b.id
FROM guests g
LEFT JOIN bookings b ON b.guest_id = g.id;
\`\`\`

Every guest appears. Those with no bookings get \`NULL\` for \`b.id\`.

That makes "find the ones with none" expressible:

\`\`\`sql
... LEFT JOIN bookings b ON b.guest_id = g.id
WHERE b.id IS NULL;
\`\`\`

### The condition that must go in ON, not WHERE

Counting only *confirmed* bookings per guest:

\`\`\`sql
-- WRONG: the WHERE runs after the join and deletes the NULL rows,
-- turning this back into an inner join
LEFT JOIN bookings b ON b.guest_id = g.id
WHERE b.status = 'confirmed'

-- RIGHT: the condition is part of what counts as a match
LEFT JOIN bookings b ON b.guest_id = g.id AND b.status = 'confirmed'
\`\`\`

This distinction is a favourite interview question, and the reason is that getting it wrong produces a plausible-looking result with rows quietly missing.

### Counting the nothing

\`COUNT(*)\` would count the NULL placeholder row as 1. \`COUNT(b.id)\` counts only real matches, giving a correct 0.
${SCHEMA_NOTE}
## YOUR TASK

List every guest's \`name\` alongside how many **confirmed** bookings they have, as \`bookings\`. Guests with none must appear with 0. Order by guest id.`,
    starterCode: `-- Every guest, with their confirmed booking count (0 included)
`,
    expectedOutput: [
      'name | bookings',
      'Ada Lovelace | 1',
      'Alan Turing | 1',
      'Grace Hopper | 1',
      'Katherine Johnson | 1',
      'Tim Berners-Lee | 0',
    ],
    hints: [
      'Guests is the left table, so start `FROM guests g LEFT JOIN bookings b`.',
      'The status filter belongs in the ON clause with `AND`, or Tim disappears.',
      'Use `COUNT(b.id)`, not `COUNT(*)`, so the no-match row counts as 0.',
    ],
    solution: `SELECT g.name, COUNT(b.id) AS bookings
FROM guests g
LEFT JOIN bookings b ON b.guest_id = g.id AND b.status = 'confirmed'
GROUP BY g.id, g.name
ORDER BY g.id;
`,
  },
  {
    id: 'sql-06-report',
    title: 'Putting It Together: A Revenue Report',
    language: 'sql',
    kind: 'sql',
    module: 'Relationships',
    difficulty: 5,
    concepts: ['joins', 'aggregates', 'having', 'reporting'],
    sqlSetup: HOTEL_DB,
    instructions: `Time to write the kind of query you would actually be asked for at work: a figure someone in the business wants, pulled from three tables at once.

Everything you need is already covered — this lesson is about composing it.

### Calculated columns

Arithmetic works on columns, and the result can be aggregated:

\`\`\`sql
SELECT SUM(b.nights * r.rate) AS revenue
FROM bookings b
JOIN rooms r ON r.id = b.room_id;
\`\`\`

Revenue is not stored anywhere. It is derived, at query time, from nights and rate — which is exactly right, because storing a derived value is how databases end up disagreeing with themselves.

### The order the database evaluates clauses

Not the order you write them. This is worth memorising:

\`\`\`
FROM / JOIN   →  assemble the rows
WHERE         →  filter individual rows
GROUP BY      →  form the buckets
HAVING        →  filter the buckets
SELECT        →  compute the output columns
ORDER BY      →  sort
\`\`\`

It explains two things that puzzle beginners: why \`WHERE\` cannot use an aggregate (the groups do not exist yet), and why in many databases \`ORDER BY\` *can* use a \`SELECT\` alias while \`WHERE\` cannot.
${SCHEMA_NOTE}
## YOUR TASK

Total confirmed revenue by guest country.

- revenue is \`nights * rate\`, summed
- confirmed bookings only
- one row per \`country\`, with the total as \`revenue\`
- include only countries whose revenue is above 700
- highest revenue first`,
    starterCode: `-- Confirmed revenue per country, over 700, biggest first
`,
    expectedOutput: ['country | revenue', 'USA | 2150', 'UK | 840'],
    hints: [
      'Three tables: bookings joined to guests (for country) and to rooms (for rate).',
      'Group by `g.country`, and put the 700 threshold in HAVING because it filters groups, not rows.',
      'HAVING can repeat the aggregate: `HAVING SUM(b.nights * r.rate) > 700`.',
    ],
    solution: `SELECT g.country, SUM(b.nights * r.rate) AS revenue
FROM bookings b
JOIN guests g ON g.id = b.guest_id
JOIN rooms r ON r.id = b.room_id
WHERE b.status = 'confirmed'
GROUP BY g.country
HAVING SUM(b.nights * r.rate) > 700
ORDER BY revenue DESC;
`,
  },
  {
    id: 'sql-07-quiz',
    title: 'Checkpoint: Schema Design and Performance',
    language: 'sql',
    kind: 'quiz',
    module: 'Design & Performance',
    difficulty: 4,
    concepts: ['indexes', 'normalisation', 'n-plus-one', 'sql-injection', 'transactions'],
    instructions: `The queries are only half of database work. The other half — schema design, indexes, and the failure modes — is what gets discussed in interviews and what causes outages.

Key ideas to hold in mind while answering:

- An **index** is a sorted lookup structure on a column. It turns a full-table scan into a targeted seek, at the cost of extra storage and slower writes. Index what you filter and join on, not everything.
- The **N+1 query problem**: fetch 100 orders, then loop and fetch each order's customer — 101 round trips where one join would do. It is the most common performance bug in application code, and it is invisible in testing with 5 rows.
- **SQL injection** happens when user input is concatenated into a query string. The fix is parameterised queries, always, with no exceptions for "trusted" input.
- A **transaction** groups statements so that either all of them apply or none do. Moving money needs one.`,
    quiz: [
      {
        id: 'q1',
        prompt: 'A query filtering on `email` is slow on a table of 10 million users. First thing to try?',
        choices: [
          'Add an index on email',
          'Add more RAM',
          'Split the table in half',
          'Rewrite it with SELECT *',
        ],
        answerIndex: 0,
        explanation:
          'Add an index on email. Without one the database scans every row; with one it seeks straight to the match. The trade-off is slightly slower inserts and extra disk — usually a bargain for a column you filter on constantly.',
      },
      {
        id: 'q2',
        prompt: 'Why not simply index every column?',
        choices: [
          'Databases forbid more than five indexes',
          'Every index costs storage and slows down every write',
          'Indexes break joins',
          'It has no downside',
        ],
        answerIndex: 1,
        explanation:
          'Each index must be updated on every insert, update and delete, and consumes storage. Over-indexing turns a write-heavy table sluggish. Index the columns you actually filter, join or sort on.',
      },
      {
        id: 'q3',
        prompt: 'Your code fetches 100 orders, then loops fetching each order’s customer. What is this called and what is the fix?',
        choices: [
          'A deadlock — add a transaction',
          'The N+1 query problem — use a JOIN or a single batched query',
          'A race condition — add a lock',
          'Normalisation — denormalise the table',
        ],
        answerIndex: 1,
        explanation:
          'N+1. One query becomes 101 round trips, each with its own latency. A JOIN, or one query with `WHERE customer_id IN (...)`, replaces the loop. It never shows up with test data and is brutal in production.',
      },
      {
        id: 'q4',
        prompt: "What is wrong with `\"SELECT * FROM users WHERE name = '\" + input + \"'\"`?",
        choices: [
          'Nothing, if you validate the input first',
          'It is open to SQL injection — use a parameterised query',
          'It is only a style issue',
          'It is slow',
        ],
        answerIndex: 1,
        explanation:
          'SQL injection. Input containing a quote can end the string and append arbitrary SQL. Parameterised queries send the statement and the values separately so input can never be parsed as code. Escaping by hand is not an acceptable substitute.',
      },
      {
        id: 'q5',
        prompt: 'Why store `guest_id` in bookings rather than repeating the guest’s name in every booking row?',
        choices: [
          'To save disk space only',
          'So each fact lives in one place — a name change is one update, not thousands',
          'Because SQL forbids text columns',
          'It makes queries simpler',
        ],
        answerIndex: 1,
        explanation:
          'One fact, one place. Duplicated data drifts out of sync the moment something changes, and there is no way to tell which copy is right. Note the honest trade-off: normalisation means more joins, and reporting systems often denormalise deliberately for read speed.',
      },
      {
        id: 'q6',
        prompt: 'Transferring money debits one account and credits another. What guarantees you never lose the money in between?',
        choices: [
          'An index',
          'A transaction, so both statements commit or neither does',
          'Running the queries quickly',
          'A foreign key',
        ],
        answerIndex: 1,
        explanation:
          'A transaction. BEGIN, both statements, COMMIT — and if anything fails, ROLLBACK leaves the database as it was. Without one, a crash between the two statements destroys money. This is the A in ACID: atomicity.',
      },
      {
        id: 'q7',
        prompt: 'You want the count of confirmed bookings per guest, with zero for guests who have none. Where does the status condition go?',
        choices: [
          'In WHERE',
          'In the ON clause of the LEFT JOIN',
          'In HAVING',
          'Either WHERE or ON — they behave identically',
        ],
        answerIndex: 1,
        explanation:
          'In the ON clause. A WHERE runs after the join and discards the NULL rows the LEFT JOIN created, silently converting it back into an inner join and dropping every zero-booking guest. Putting the condition in ON makes it part of what counts as a match.',
      },
    ],
  },
];
