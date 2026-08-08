import type { LessonDraft } from '../types';

export const BACKEND_LESSONS: LessonDraft[] = [
  {
    id: 'be-01-http',
    title: 'HTTP: The Conversation',
    language: 'javascript',
    kind: 'reading',
    module: 'The Protocol',
    difficulty: 3,
    concepts: ['http', 'methods', 'status-codes', 'headers'],
    instructions: `Every web request is a text conversation with a fixed shape. Knowing that shape is assumed knowledge for any back-end role, and most front-end ones.

\`\`\`
GET /api/bookings/42 HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJ...
Accept: application/json
\`\`\`

\`\`\`
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=60

{"id":42,"guest":"Ada","nights":3}
\`\`\`

A method, a path, headers, an optional body. A status, headers, a body. That is all it is.

### Methods, and what they promise

| Method | Purpose | Safe? | Idempotent? |
| --- | --- | --- | --- |
| GET | read | yes | yes |
| POST | create, or "do something" | no | **no** |
| PUT | replace entirely | no | yes |
| PATCH | update partially | no | no |
| DELETE | remove | no | yes |

**Safe** means it changes nothing — so a GET must never modify data. Crawlers and browsers pre-fetch GETs, and a GET that deletes something will eventually be triggered by a robot.

**Idempotent** means doing it twice has the same effect as doing it once. DELETE twice leaves the thing deleted. POST twice creates two records — which is why only POST needs special handling for retries.

### Status codes worth knowing cold

- **2xx succeeded** — 200 OK, 201 Created (return the new resource's location), 204 No Content
- **3xx redirect** — 301 permanent, 302 temporary, 304 Not Modified (your cached copy is still good)
- **4xx the caller's fault** — 400 malformed, 401 not authenticated, 403 authenticated but not allowed, 404 not found, 409 conflict, 422 well-formed but semantically invalid, 429 too many requests
- **5xx the server's fault** — 500 unhandled, 502 bad gateway, 503 unavailable, 504 gateway timeout

The 401/403 distinction is asked constantly: **401 means we do not know who you are; 403 means we know and you still may not.**

Getting the class right matters operationally, not pedantically: 4xx tells the client to change something, 5xx tells it the request might succeed if retried. Returning 200 with \`{"error": "..."}\` inside breaks every piece of monitoring and retry logic you will ever use.

### Stateless

HTTP remembers nothing between requests. Any continuity — who you are, what is in your basket — must be carried in each request, usually as a cookie or a token. That constraint is what allows a load balancer to send your next request to a different server entirely, and it is why "stateless services" is the first thing said in every scaling discussion.`,
  },
  {
    id: 'be-02-rest',
    title: 'Designing a REST API',
    language: 'javascript',
    kind: 'quiz',
    module: 'The Protocol',
    difficulty: 4,
    concepts: ['rest', 'api-design', 'resources', 'versioning'],
    instructions: `REST models your API as **resources** — nouns — that you act on with HTTP methods, rather than as a list of remote functions.

\`\`\`
GET    /bookings          list
POST   /bookings          create
GET    /bookings/42       read one
PATCH  /bookings/42       update some fields
DELETE /bookings/42       remove
GET    /guests/7/bookings this guest's bookings
\`\`\`

Compare the anti-pattern, which encodes the verb in the path: \`/getBooking\`, \`/createBooking\`, \`/deleteBookingById\`. The method already says what you are doing.

Conventions that make an API feel professional:

- **Plural nouns**, consistently. \`/bookings\`, never \`/booking\` and \`/guests\` in the same API.
- **Filtering, sorting and paging in the query string**: \`/bookings?status=confirmed&sort=-created&page=2&limit=50\`. Always paginate lists — an endpoint that returns everything works until it does not.
- **Version from day one**: \`/v1/bookings\`. Changing a live API without a version is how you break every client at once.
- **A consistent error envelope**, so clients can parse failures generically.

Answer the questions below; the next lesson has you implement the routing.`,
    quiz: [
      {
        id: 'q1',
        prompt: 'Which is the best URL for retrieving booking 42?',
        choices: ['GET /getBooking?id=42', 'GET /bookings/42', 'POST /booking/read', 'GET /api?action=booking&id=42'],
        answerIndex: 1,
        explanation:
          '`GET /bookings/42`. The noun identifies the resource and the method supplies the verb. Putting the action in the path duplicates what the method already expresses and makes caching and tooling less useful.',
      },
      {
        id: 'q2',
        prompt: 'A request has a valid token but the user is not allowed to see this record. Which status?',
        choices: ['400', '401', '403', '404'],
        answerIndex: 2,
        explanation:
          '403 Forbidden — we know who you are and you still may not. 401 means unauthenticated. Some APIs deliberately return 404 instead of 403 to avoid revealing that a record exists, which is a legitimate choice for sensitive resources.',
      },
      {
        id: 'q3',
        prompt: 'A POST creates a resource successfully. What should it return?',
        choices: ['200 with no body', '201 with the created resource', '204', '302 redirect'],
        answerIndex: 1,
        explanation:
          '201 Created, with the new resource in the body and usually a Location header pointing at it. That saves the client an immediate follow-up GET, and the status distinguishes creation from a plain successful read.',
      },
      {
        id: 'q4',
        prompt: 'Why paginate list endpoints even when the table is small today?',
        choices: [
          'It looks more professional',
          'Because "small today" becomes large later, and by then clients depend on the unbounded shape',
          'REST requires it',
          'It makes queries simpler',
        ],
        answerIndex: 1,
        explanation:
          'Because adding pagination later is a breaking change for every client. An endpoint returning all rows works fine at 500 records and takes down the service at 5 million — and by then you cannot change the contract without a version bump.',
      },
      {
        id: 'q5',
        prompt: 'A client sends well-formed JSON, but `nights` is -3. Which status fits best?',
        choices: ['500', '422 (or 400)', '404', '204'],
        answerIndex: 1,
        explanation:
          '422 Unprocessable Entity — the syntax parsed but the content is invalid. 400 is a widely accepted alternative. What it must not be is 500: nothing went wrong on the server, and a 5xx tells monitoring you have a bug and tells clients to retry.',
      },
      {
        id: 'q6',
        prompt: 'You must change a response field that existing clients read. What is the responsible approach?',
        choices: [
          'Change it and email the users',
          'Add the new field alongside the old, deprecate the old, and remove it in the next version',
          'Change it at the weekend',
          'Return both shapes at random',
        ],
        answerIndex: 1,
        explanation:
          'Additive change, then deprecation. Adding a field breaks nobody; removing or renaming one breaks everyone who reads it. Ship both, announce a timeline, and drop the old field in a new version once clients have migrated.',
      },
    ],
  },
  {
    id: 'be-03-router',
    title: 'Build a Router',
    language: 'javascript',
    module: 'Building a Service',
    difficulty: 5,
    concepts: ['routing', 'path-params', 'http', 'server-internals'],
    instructions: `Express, Fastify, Flask and the rest all do the same core job: take a method and a path, find the handler that matches, and extract the parameters. Writing one removes the mystery.

\`\`\`js
router.add("GET", "/bookings/:id", handler);
router.handle("GET", "/bookings/42");
// → handler({ params: { id: "42" } })
\`\`\`

### Matching

Split both the registered pattern and the incoming path on \`/\`. They must have the same number of segments. Then compare segment by segment: a segment starting with \`:\` matches anything and captures it as a parameter; anything else must match exactly.

\`\`\`
pattern  ["bookings", ":id"]
path     ["bookings", "42"]
                       ↑ captured as params.id = "42"
\`\`\`

Note that parameters are always **strings** — \`"42"\`, not \`42\`. Forgetting to convert is a real bug: \`id === 42\` is false when \`id\` is \`"42"\`.

### The responses a router owes you

- no path matches → **404**
- the path matches but not for this method → **405 Method Not Allowed**, which is more useful to a client than a 404
- otherwise, call the handler

Returning 405 rather than 404 for a wrong method is a small detail that signals you have thought about the protocol.

## YOUR TASK

Implement \`createRouter()\` returning an object with:

- \`add(method, pattern, handler)\`
- \`handle(method, path)\` returning \`{ status, body }\`

Rules:

- a match calls \`handler({ params })\` and returns \`{ status: 200, body: <whatever the handler returned> }\`
- no matching path → \`{ status: 404, body: { error: "Not Found" } }\`
- path matches under a different method → \`{ status: 405, body: { error: "Method Not Allowed" } }\`
- if the handler throws → \`{ status: 500, body: { error: "Internal Server Error" } }\`
- routes are matched in the order they were added
- methods are case-insensitive; trailing slashes are ignored`,
    starterCode: `function createRouter() {
  const routes = [];

  return {
    add(method, pattern, handler) {
    },

    handle(method, path) {
    },
  };
}
`,
    testCode: `function build() {
  const r = createRouter();
  r.add("GET", "/bookings", () => [{ id: 1 }]);
  r.add("GET", "/bookings/:id", ({ params }) => ({ id: params.id }));
  r.add("POST", "/bookings", () => ({ created: true }));
  r.add("GET", "/guests/:guestId/bookings/:id", ({ params }) => params);
  r.add("GET", "/boom", () => { throw new Error("kaboom"); });
  return r;
}

test("matches a static route", () => {
  expect(build().handle("GET", "/bookings")).toEqual({ status: 200, body: [{ id: 1 }] });
});

test("captures a path parameter as a string", () => {
  expect(build().handle("GET", "/bookings/42")).toEqual({ status: 200, body: { id: "42" } });
});

test("captures several parameters", () => {
  expect(build().handle("GET", "/guests/7/bookings/42")).toEqual({
    status: 200,
    body: { guestId: "7", id: "42" },
  });
});

test("distinguishes methods on the same path", () => {
  expect(build().handle("POST", "/bookings").body).toEqual({ created: true });
});

test("unknown paths are 404", () => {
  expect(build().handle("GET", "/nope")).toEqual({ status: 404, body: { error: "Not Found" } });
});

test("a known path with the wrong method is 405", () => {
  expect(build().handle("DELETE", "/bookings")).toEqual({
    status: 405,
    body: { error: "Method Not Allowed" },
  });
});

test("segment counts must match", () => {
  expect(build().handle("GET", "/bookings/42/extra").status).toBe(404);
});

test("methods are case-insensitive and trailing slashes are ignored", () => {
  expect(build().handle("get", "/bookings/").status).toBe(200);
});

test("a throwing handler becomes a 500", () => {
  expect(build().handle("GET", "/boom")).toEqual({
    status: 500,
    body: { error: "Internal Server Error" },
  });
});`,
    hints: [
      'Write a helper that splits a path into segments and drops empty ones — that handles both leading and trailing slashes.',
      'Matching returns either the params object or `null`, so an empty `{}` for a static route is still a match. Do not use a falsy check on the object.',
      'Track whether any route matched the path but not the method, so you can choose between 405 and 404 at the end.',
    ],
    solution: `function createRouter() {
  const routes = [];

  const segments = (path) => path.split("/").filter(Boolean);

  function matchParams(patternParts, pathParts) {
    if (patternParts.length !== pathParts.length) return null;
    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      const p = patternParts[i];
      if (p.startsWith(":")) params[p.slice(1)] = pathParts[i];
      else if (p !== pathParts[i]) return null;
    }
    return params;
  }

  return {
    add(method, pattern, handler) {
      routes.push({
        method: method.toUpperCase(),
        parts: segments(pattern),
        handler,
      });
      return this;
    },

    handle(method, path) {
      const wanted = method.toUpperCase();
      const pathParts = segments(path);
      let pathMatched = false;

      for (const route of routes) {
        const params = matchParams(route.parts, pathParts);
        if (params === null) continue;
        pathMatched = true;
        if (route.method !== wanted) continue;

        try {
          return { status: 200, body: route.handler({ params }) };
        } catch {
          return { status: 500, body: { error: "Internal Server Error" } };
        }
      }

      return pathMatched
        ? { status: 405, body: { error: "Method Not Allowed" } }
        : { status: 404, body: { error: "Not Found" } };
    },
  };
}
`,
  },
  {
    id: 'be-04-validation',
    title: 'Validation and Error Responses',
    language: 'javascript',
    module: 'Building a Service',
    difficulty: 4,
    concepts: ['validation', 'error-envelopes', 'status-codes', 'api-contracts'],
    instructions: `Never trust a request body. Anyone can send anything to your endpoint — a browser is just one client, and \`curl\` is another.

### Validate at the boundary

Check the input once, at the edge, and let everything inside the system assume valid data. Scattering \`if (!x) return\` throughout the business logic is how code becomes unreadable.

### Report every problem at once

\`\`\`json
{
  "error": "Validation failed",
  "details": [
    { "field": "guest",  "message": "guest is required" },
    { "field": "nights", "message": "nights must be a positive integer" }
  ]
}
\`\`\`

Not one error at a time. A form that reveals its problems one by one across four round trips is a bad experience, and it is entirely a back-end decision.

### A consistent envelope

Every error from your API should have the same shape, so clients can write one handler instead of one per endpoint. Pick a shape, document it, never deviate.

Also: never leak internals. A stack trace or a raw SQL error in a response tells an attacker about your schema and your versions. Log the detail server-side, return something generic with a correlation id.

### Status, again

- missing or malformed fields → **400**
- correct shape but invalid values → **422** (400 is an accepted alternative)
- conflicts with existing state, such as a double booking → **409**

## YOUR TASK

Write \`validateBooking(body)\` returning \`{ valid: true, value }\` or \`{ valid: false, errors: [...] }\`, and \`createBooking(body)\` returning an HTTP-shaped \`{ status, body }\`.

Rules for \`validateBooking\`:

- \`guest\` — required, a non-empty string after trimming
- \`nights\` — required, an integer of 1 or more
- \`roomId\` — required, an integer of 1 or more
- \`notes\` — optional; if present it must be a string of at most 200 characters
- collect **all** failures, in the field order above
- each error is \`{ field, message }\` where message is \`"<field> is invalid"\`
- \`value\` contains the four fields with \`guest\` trimmed and \`notes\` defaulted to \`""\`

\`createBooking\` returns \`{ status: 422, body: { error: "Validation failed", details: errors } }\` on failure, and \`{ status: 201, body: { id: 1, ...value } }\` on success.`,
    starterCode: `function validateBooking(body) {
}

function createBooking(body) {
}
`,
    testCode: `test("accepts a valid booking", () => {
  const result = validateBooking({ guest: "Ada", nights: 2, roomId: 3 });
  expect(result.valid).toBe(true);
  expect(result.value).toEqual({ guest: "Ada", nights: 2, roomId: 3, notes: "" });
});

test("trims the guest name", () => {
  expect(validateBooking({ guest: "  Ada  ", nights: 1, roomId: 1 }).value.guest).toBe("Ada");
});

test("rejects a missing guest", () => {
  const result = validateBooking({ nights: 2, roomId: 3 });
  expect(result.valid).toBe(false);
  expect(result.errors).toEqual([{ field: "guest", message: "guest is invalid" }]);
});

test("rejects a whitespace-only guest", () => {
  expect(validateBooking({ guest: "   ", nights: 1, roomId: 1 }).valid).toBe(false);
});

test("rejects bad nights", () => {
  expect(validateBooking({ guest: "A", nights: 0, roomId: 1 }).valid).toBe(false);
  expect(validateBooking({ guest: "A", nights: 1.5, roomId: 1 }).valid).toBe(false);
  expect(validateBooking({ guest: "A", nights: "2", roomId: 1 }).valid).toBe(false);
});

test("collects every error, in field order", () => {
  const result = validateBooking({ nights: -1 });
  expect(result.errors).toEqual([
    { field: "guest", message: "guest is invalid" },
    { field: "nights", message: "nights is invalid" },
    { field: "roomId", message: "roomId is invalid" },
  ]);
});

test("notes are optional but validated when present", () => {
  expect(validateBooking({ guest: "A", nights: 1, roomId: 1, notes: "hi" }).value.notes).toBe("hi");
  expect(validateBooking({ guest: "A", nights: 1, roomId: 1, notes: 5 }).valid).toBe(false);
  expect(validateBooking({ guest: "A", nights: 1, roomId: 1, notes: "x".repeat(201) }).valid).toBe(false);
});

test("createBooking returns 201 with the created record", () => {
  expect(createBooking({ guest: "Ada", nights: 2, roomId: 3 })).toEqual({
    status: 201,
    body: { id: 1, guest: "Ada", nights: 2, roomId: 3, notes: "" },
  });
});

test("createBooking returns 422 with the details", () => {
  const response = createBooking({ nights: 0 });
  expect(response.status).toBe(422);
  expect(response.body.error).toBe("Validation failed");
  expect(response.body.details).toHaveLength(3);
});

test("createBooking survives a non-object body", () => {
  expect(createBooking(null).status).toBe(422);
});`,
    hints: [
      '`Number.isInteger(n) && n >= 1` covers the numeric rules, and rejects strings and floats at the same time.',
      'Push into an `errors` array in the required order rather than returning at the first problem.',
      'Guard the top: `const input = body ?? {}` so a null body validates as "everything missing" instead of throwing.',
    ],
    solution: `function validateBooking(body) {
  const input = body ?? {};
  const errors = [];
  const fail = (field) => errors.push({ field, message: field + " is invalid" });

  const guest = typeof input.guest === "string" ? input.guest.trim() : "";
  if (guest === "") fail("guest");

  if (!Number.isInteger(input.nights) || input.nights < 1) fail("nights");
  if (!Number.isInteger(input.roomId) || input.roomId < 1) fail("roomId");

  const hasNotes = input.notes !== undefined && input.notes !== null;
  if (hasNotes && (typeof input.notes !== "string" || input.notes.length > 200)) {
    fail("notes");
  }

  if (errors.length > 0) return { valid: false, errors };

  return {
    valid: true,
    value: {
      guest,
      nights: input.nights,
      roomId: input.roomId,
      notes: hasNotes ? input.notes : "",
    },
  };
}

function createBooking(body) {
  const result = validateBooking(body);

  if (!result.valid) {
    return {
      status: 422,
      body: { error: "Validation failed", details: result.errors },
    };
  }

  return { status: 201, body: { id: 1, ...result.value } };
}
`,
  },
  {
    id: 'be-05-rate-limit',
    title: 'Rate Limiting and Idempotency',
    language: 'javascript',
    module: 'Running a Service',
    difficulty: 5,
    concepts: ['rate-limiting', 'idempotency', 'resilience', 'sliding-window'],
    instructions: `Two mechanisms that protect a live service, both of which come up in system-design conversations.

### Rate limiting

Without a limit, one misbehaving client — or one retry loop — can consume all your capacity. The response is **429 Too Many Requests**, ideally with a \`Retry-After\` header.

The simplest correct approach is a **sliding window**: keep the timestamps of a client's recent requests, discard anything older than the window, and allow the request if fewer than the limit remain.

\`\`\`js
const recent = timestamps.filter((t) => now - t < windowMs);
if (recent.length >= limit) return false;
recent.push(now);
\`\`\`

Compare with a **fixed window** (a counter reset every minute), which is cheaper but allows a burst of double the limit across a boundary — the last second of one window plus the first second of the next.

### Idempotency keys

The async track established that retrying a POST can duplicate a real-world effect. The industry solution, used by every payment API:

The client generates a unique key and sends it with the request. The server records the key with the response it produced. If the same key arrives again, it returns the **stored** response instead of doing the work a second time.

\`\`\`
POST /payments
Idempotency-Key: 7f3c-...
\`\`\`

Now a client can retry freely after a timeout without any risk of double-charging, which is the only way retries are safe on a non-idempotent operation.

## YOUR TASK

1. \`createRateLimiter({ limit, windowMs, now })\` returning \`{ allow(clientId) }\` — \`true\` if the client is under the limit within a sliding window, \`false\` otherwise. Each client is tracked separately, and \`now\` is injected so tests can control the clock.
2. \`createIdempotentStore()\` returning \`{ run(key, fn) }\` — calls \`fn()\` and remembers its result for that key; a repeat key returns the stored result without calling \`fn\` again. A missing key means no caching at all.`,
    starterCode: `function createRateLimiter({ limit, windowMs, now = Date.now }) {
}

function createIdempotentStore() {
}
`,
    testCode: `test("allows requests up to the limit", () => {
  let clock = 1000;
  const rl = createRateLimiter({ limit: 3, windowMs: 1000, now: () => clock });
  expect(rl.allow("a")).toBe(true);
  expect(rl.allow("a")).toBe(true);
  expect(rl.allow("a")).toBe(true);
  expect(rl.allow("a")).toBe(false);
});

test("clients are tracked separately", () => {
  let clock = 1000;
  const rl = createRateLimiter({ limit: 1, windowMs: 1000, now: () => clock });
  expect(rl.allow("a")).toBe(true);
  expect(rl.allow("b")).toBe(true);
  expect(rl.allow("a")).toBe(false);
});

test("the window slides", () => {
  let clock = 1000;
  const rl = createRateLimiter({ limit: 2, windowMs: 1000, now: () => clock });
  expect(rl.allow("a")).toBe(true);
  expect(rl.allow("a")).toBe(true);
  expect(rl.allow("a")).toBe(false);
  clock = 2100;
  expect(rl.allow("a")).toBe(true);
});

test("old entries expire individually, not all at once", () => {
  let clock = 1000;
  const rl = createRateLimiter({ limit: 2, windowMs: 1000, now: () => clock });
  rl.allow("a");
  clock = 1500;
  rl.allow("a");
  clock = 2100;
  expect(rl.allow("a")).toBe(true);
  expect(rl.allow("a")).toBe(false);
});

test("the idempotent store runs the work once per key", () => {
  const store = createIdempotentStore();
  let calls = 0;
  const charge = () => { calls++; return { id: calls }; };

  expect(store.run("k1", charge)).toEqual({ id: 1 });
  expect(store.run("k1", charge)).toEqual({ id: 1 });
  expect(calls).toBe(1);
});

test("different keys do different work", () => {
  const store = createIdempotentStore();
  let calls = 0;
  const charge = () => { calls++; return { id: calls }; };

  store.run("k1", charge);
  store.run("k2", charge);
  expect(calls).toBe(2);
});

test("a missing key means no caching", () => {
  const store = createIdempotentStore();
  let calls = 0;
  const charge = () => { calls++; return calls; };

  expect(store.run(null, charge)).toBe(1);
  expect(store.run(null, charge)).toBe(2);
});`,
    hints: [
      'Keep a `Map` from client id to an array of timestamps.',
      'On each call, filter out timestamps older than `now() - windowMs` *before* comparing against the limit, and store the filtered array back.',
      'The idempotent store is a `Map` from key to result; check `has` before calling `fn`, and skip the whole mechanism when the key is null or undefined.',
    ],
    solution: `function createRateLimiter({ limit, windowMs, now = Date.now }) {
  const hits = new Map();

  return {
    allow(clientId) {
      const current = now();
      const recent = (hits.get(clientId) ?? []).filter(
        (t) => current - t < windowMs
      );

      if (recent.length >= limit) {
        hits.set(clientId, recent);
        return false;
      }

      recent.push(current);
      hits.set(clientId, recent);
      return true;
    },
  };
}

function createIdempotentStore() {
  const results = new Map();

  return {
    run(key, fn) {
      if (key === null || key === undefined) return fn();
      if (results.has(key)) return results.get(key);
      const result = fn();
      results.set(key, result);
      return result;
    },
  };
}
`,
  },
];
