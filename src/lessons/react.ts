import type { LessonDraft } from '../types';

/**
 * React lessons compile the learner's JSX with Sucrase and mount it with the
 * real React 18 development build inside the preview iframe.
 *
 * Two conventions the lesson text explains:
 *   - the component named `App` is what gets rendered
 *   - hooks are pre-imported, standing in for `import { useState } from "react"`
 */
export const REACT_LESSONS: LessonDraft[] = [
  {
    id: 'react-01-components',
    title: 'Components and JSX',
    language: 'javascript',
    kind: 'react',
    module: 'Components',
    difficulty: 3,
    concepts: ['jsx', 'components', 'props'],
    instructions: `A React component is a **function that returns markup**. That is the entire idea; everything else is detail.

\`\`\`jsx
function Greeting() {
  return <h2>Hello!</h2>;
}
\`\`\`

The markup is **JSX** — not a string, and not HTML. It compiles to ordinary function calls:

\`\`\`jsx
<h2 className="title">Hello!</h2>
// becomes
React.createElement("h2", { className: "title" }, "Hello!")
\`\`\`

Knowing that removes most of the mystery. JSX is a value: you can put it in a variable, return it from an \`if\`, or hold an array of it.

### The rules that trip everyone up

- **\`className\`, not \`class\`** — \`class\` is a reserved word in JavaScript. Likewise \`htmlFor\` instead of \`for\`.
- **Every tag closes.** \`<img />\`, \`<br />\`, no exceptions.
- **One root element.** Wrap siblings in a \`<div>\`, or in \`<>…</>\` (a fragment) when you do not want an extra element.
- **\`{ }\` escapes back into JavaScript.** Anything inside is an expression: \`{name}\`, \`{2 + 2}\`, \`{user.email}\`. Statements do not fit — no \`if\` or \`for\` inside the braces.
- **Component names are capitalised.** \`<greeting />\` compiles to the HTML tag \`"greeting"\`; \`<Greeting />\` refers to your function. This is a real, silent bug.

### Props

Props are the arguments. The caller passes attributes; the component receives one object:

\`\`\`jsx
function Greeting(props) {
  return <h2>Hello, {props.name}!</h2>;
}

<Greeting name="Ada" />
\`\`\`

Destructuring in the parameter list is the normal style, and doubles as documentation:

\`\`\`jsx
function Greeting({ name, excited = false }) {
  return <h2>Hello, {name}{excited ? "!" : "."}</h2>;
}
\`\`\`

Props are **read-only**. A component may never modify what it was given — that is what makes a tree of components predictable.

> In this track, the component called \`App\` is what gets mounted, and the hooks are already imported for you. In a real project you would write \`import { useState } from "react";\` at the top of the file.

## YOUR TASK

1. \`Greeting({ name })\` — returns an \`<h2>\` reading \`Hello, <name>!\`
2. \`App\` — returns a \`<div>\` containing three \`Greeting\`s, for \`Ada\`, \`Alan\` and \`Grace\`, in that order`,
    starterCode: `function Greeting(props) {
  // return an h2 greeting props.name
}

function App() {
  return (
    <div>
      {/* render three Greeting components here */}
    </div>
  );
}
`,
    webCheck: `(function () {
  var hs = document.querySelectorAll('#root h2');
  if (hs.length !== 3) return false;
  var texts = [].map.call(hs, function (h) { return h.textContent.trim(); });
  return texts[0] === 'Hello, Ada!'
      && texts[1] === 'Hello, Alan!'
      && texts[2] === 'Hello, Grace!';
})()`,
    hints: [
      'The body is a single `return` of JSX: `return <h2>Hello, {props.name}!</h2>;`',
      'Note where the braces go — `{props.name}` is inside the text, and the exclamation mark is outside them.',
      'In `App`, use the component three times with a `name` attribute: `<Greeting name="Ada" />`.',
    ],
    solution: `function Greeting({ name }) {
  return <h2>Hello, {name}!</h2>;
}

function App() {
  return (
    <div>
      <Greeting name="Ada" />
      <Greeting name="Alan" />
      <Greeting name="Grace" />
    </div>
  );
}
`,
  },
  {
    id: 'react-02-lists-keys',
    title: 'Lists, Keys and Conditional Rendering',
    language: 'javascript',
    kind: 'react',
    module: 'Components',
    difficulty: 4,
    concepts: ['lists', 'keys', 'conditional-rendering', 'map'],
    instructions: `Rendering a list is \`map\` — the same \`map\` from the JavaScript track, producing JSX instead of strings.

\`\`\`jsx
<ul>
  {tasks.map((task) => (
    <li key={task.id}>{task.title}</li>
  ))}
</ul>
\`\`\`

### Keys

That \`key\` is not decoration. React re-renders by comparing the new tree with the old one, and for a list it needs to know which item is which. The key is that identity.

Without keys, React matches items **by position**. Delete the first of three items and React concludes that item 1 changed text, item 2 changed text, and item 3 was removed — instead of "item 1 was removed". With plain text you get away with it. With inputs, focus or animation, state ends up attached to the wrong row, and it looks like a haunting.

Rules:

- Use a **stable id from your data**, not the array index. Index keys break exactly when the list reorders, which is when keys matter.
- The key must be unique among siblings, and goes on the **outermost** element inside the \`map\`.

React warns in the console when you forget. This lesson's check reads that warning, so a missing key genuinely fails.

### Conditional rendering

\`\`\`jsx
{isLoggedIn && <Dashboard />}          // render, or render nothing
{isLoggedIn ? <Dashboard /> : <Login />}  // one or the other
\`\`\`

One trap with \`&&\`: a **number** on the left renders itself. \`{items.length && <List />}\` puts a literal \`0\` on the page when the list is empty. Write \`{items.length > 0 && <List />}\`.

Also useful: \`false\`, \`null\` and \`undefined\` render nothing at all, so returning \`null\` from a component is a legitimate "render nothing".

## YOUR TASK

Using the provided \`TASKS\`:

1. Render a \`<ul>\` with one \`<li className="task">\` per task, containing its \`title\`
2. Completed tasks get \`className="task done"\`
3. Render \`<p id="summary">\` showing how many are **not** done, as \`"2 left"\`
4. Give every item a proper \`key\` — the check fails if React warns about it`,
    starterCode: `const TASKS = [
  { id: 1, title: "Learn JSX", done: true },
  { id: 2, title: "Render a list", done: false },
  { id: 3, title: "Understand keys", done: false },
];

function App() {
  return (
    <div>
      <ul>
        {/* one li per task */}
      </ul>
      {/* the summary paragraph */}
    </div>
  );
}
`,
    webCheck: `(function () {
  var items = document.querySelectorAll('#root li.task');
  if (items.length !== 3) return false;
  if (!items[0].classList.contains('done')) return false;
  if (items[1].classList.contains('done')) return false;
  if (items[1].textContent.indexOf('Render a list') === -1) return false;
  var summary = document.querySelector('#summary');
  if (!summary || summary.textContent.trim() !== '2 left') return false;
  return !window.__reactWarnings.some(function (w) {
    return w.indexOf('unique "key"') !== -1;
  });
})()`,
    hints: [
      'Inside the `<ul>`, `{TASKS.map((task) => ( ... ))}` returns one `<li>` per task.',
      'Build the class from the data: `className={task.done ? "task done" : "task"}`.',
      'The count is `TASKS.filter((t) => !t.done).length`, and the key goes on the `<li>`: `key={task.id}`.',
    ],
    solution: `const TASKS = [
  { id: 1, title: "Learn JSX", done: true },
  { id: 2, title: "Render a list", done: false },
  { id: 3, title: "Understand keys", done: false },
];

function App() {
  const remaining = TASKS.filter((task) => !task.done).length;

  return (
    <div>
      <ul>
        {TASKS.map((task) => (
          <li key={task.id} className={task.done ? "task done" : "task"}>
            {task.title}
          </li>
        ))}
      </ul>
      <p id="summary">{remaining} left</p>
    </div>
  );
}
`,
  },
  {
    id: 'react-03-usestate',
    title: 'useState',
    language: 'javascript',
    kind: 'react',
    module: 'State',
    difficulty: 4,
    concepts: ['usestate', 'hooks', 're-rendering', 'event-handlers'],
    instructions: `A component re-runs whenever its state changes, and returns fresh markup. **State** is the value that survives between those runs.

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
\`\`\`

\`useState\` returns a pair: the current value and a function to change it. The array destructuring is just convention — \`[thing, setThing]\` is what every codebase uses.

### What actually happens on a click

1. \`setCount\` tells React the value has changed
2. React calls \`Counter()\` again — the whole function, from the top
3. This time \`useState\` hands back the **new** value
4. React compares the returned markup with the previous markup and updates only what differs

So the component function runs many times. Anything you want to persist across those runs has to be state; a plain \`let\` inside the component is recreated every render and lost.

And the reverse trap: **never write to state directly.**

\`\`\`jsx
count = count + 1;              // nothing happens; React does not know
items.push(newItem);            // same, and now the data is corrupted
setItems([...items, newItem]);  // correct
\`\`\`

This is exactly the immutable-update pattern from the JavaScript track. React compares by identity to decide what changed, so mutating in place is invisible to it.

### Updating from the previous value

\`\`\`jsx
setCount(count + 1);          // uses the value from this render
setCount((c) => c + 1);       // uses whatever the latest value is
\`\`\`

The functional form matters when several updates happen before a re-render, or inside a callback that captured an old value. When your new state is derived from the old state, prefer it.

### Events

\`onClick\`, \`onChange\`, \`onSubmit\` — camelCase, and they take a **function**, not a call:

\`\`\`jsx
onClick={handleClick}        // correct
onClick={handleClick()}      // calls it immediately during render
onClick={() => remove(id)}   // correct way to pass an argument
\`\`\`

## YOUR TASK

Build a counter in \`App\`:

- \`<span id="count">\` showing the current value, starting at \`0\`
- \`<button id="inc">\` adds 1
- \`<button id="dec">\` subtracts 1, but never below 0
- \`<button id="reset">\` sets it back to 0`,
    starterCode: `function App() {
  // const [count, setCount] = useState(0);

  return (
    <div>
      <p>
        Count: <span id="count">0</span>
      </p>
      {/* inc, dec and reset buttons */}
    </div>
  );
}
`,
    webCheck: `(async function () {
  var $ = function (s) { return document.querySelector(s); };
  var tick = function () { return new Promise(function (r) { setTimeout(r, 40); }); };

  var count = $('#count'), inc = $('#inc'), dec = $('#dec'), reset = $('#reset');
  if (!count || !inc || !dec || !reset) return false;
  var read = function () { return $('#count').textContent.trim(); };

  if (read() !== '0') return false;

  for (var i = 0; i < 3; i++) { inc.click(); await tick(); }
  if (read() !== '3') return false;

  for (var j = 0; j < 5; j++) { dec.click(); await tick(); }
  if (read() !== '0') return false;

  inc.click(); await tick();
  if (read() !== '1') return false;

  reset.click(); await tick();
  return read() === '0';
})()`,
    hints: [
      'Declare the state at the top of the component: `const [count, setCount] = useState(0);` and render `{count}` inside the span.',
      'Each button needs an `onClick` holding a function: `onClick={() => setCount(count + 1)}`.',
      'For the floor, use `Math.max(0, count - 1)` so it stops at zero rather than going negative.',
    ],
    solution: `function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>
        Count: <span id="count">{count}</span>
      </p>
      <button id="inc" onClick={() => setCount((c) => c + 1)}>+1</button>{" "}
      <button id="dec" onClick={() => setCount((c) => Math.max(0, c - 1))}>-1</button>{" "}
      <button id="reset" onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
`,
  },
  {
    id: 'react-04-forms',
    title: 'Controlled Inputs',
    language: 'javascript',
    kind: 'react',
    module: 'State',
    difficulty: 4,
    concepts: ['controlled-components', 'forms', 'derived-state'],
    instructions: `A **controlled input** takes its value from state and reports every change back to state:

\`\`\`jsx
const [name, setName] = useState("");

<input value={name} onChange={(e) => setName(e.target.value)} />
\`\`\`

React is now the single source of truth. The DOM cannot hold a value React does not know about, which means validating, formatting, clearing or pre-filling are all just state changes.

Set \`value\` without \`onChange\` and the field appears frozen — React keeps resetting it to the state value. That is not a bug; it is the loop working with a missing half, and React warns about it.

### Derive, do not duplicate

The most common state mistake in React is storing things you could calculate:

\`\`\`jsx
// worse: two pieces of state that can disagree
const [name, setName] = useState("");
const [isValid, setIsValid] = useState(false);

// better: one piece of state, the rest derived on each render
const [name, setName] = useState("");
const isValid = name.trim().length > 0;
\`\`\`

The rule: **if you can compute it from existing state or props, do not store it.** Duplicated state gets out of sync, and every bug that begins "the button says enabled but the form is empty" is this.

### Forms

\`\`\`jsx
<form onSubmit={(e) => { e.preventDefault(); save(name); }}>
\`\`\`

\`preventDefault\` stops the browser reloading the page — the same call as in the front-end track.

## YOUR TASK

In \`App\`:

- an \`<input id="name">\` controlled by state, starting empty
- \`<p id="preview">\` showing \`Hello, <name>!\`, or \`Hello, stranger!\` when the field is empty or only whitespace
- \`<button id="submit">\` that is **disabled** whenever the field is empty or whitespace

\`isValid\` must be derived, not stored.`,
    starterCode: `function App() {
  // const [name, setName] = useState("");

  return (
    <div>
      {/* controlled input with id="name" */}
      <p id="preview">Hello, stranger!</p>
      {/* submit button, disabled when there is no name */}
    </div>
  );
}
`,
    webCheck: `(async function () {
  var $ = function (s) { return document.querySelector(s); };
  var tick = function () { return new Promise(function (r) { setTimeout(r, 50); }); };

  var input = $('#name'), preview = $('#preview'), submit = $('#submit');
  if (!input || !preview || !submit) return false;

  // React overrides the value setter, so type the way a user would.
  var type = function (el, value) {
    var setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;
    setter.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };

  if (preview.textContent.trim() !== 'Hello, stranger!') return false;
  if (!submit.disabled) return false;

  type(input, 'Ada'); await tick();
  if ($('#preview').textContent.trim() !== 'Hello, Ada!') return false;
  if ($('#submit').disabled) return false;
  if ($('#name').value !== 'Ada') return false;

  type($('#name'), '   '); await tick();
  if ($('#preview').textContent.trim() !== 'Hello, stranger!') return false;
  if (!$('#submit').disabled) return false;

  type($('#name'), ''); await tick();
  return $('#preview').textContent.trim() === 'Hello, stranger!' && $('#submit').disabled;
})()`,
    hints: [
      'The input needs both halves: `value={name}` and `onChange={(e) => setName(e.target.value)}`.',
      'Derive rather than store: `const trimmed = name.trim();` then use `trimmed` for both the greeting and the disabled state.',
      '`disabled={trimmed === ""}` — and remember the preview must fall back to "stranger" for whitespace too.',
    ],
    solution: `function App() {
  const [name, setName] = useState("");
  const trimmed = name.trim();

  return (
    <div>
      <input
        id="name"
        value={name}
        placeholder="Your name"
        onChange={(e) => setName(e.target.value)}
      />
      <p id="preview">Hello, {trimmed === "" ? "stranger" : trimmed}!</p>
      <button id="submit" disabled={trimmed === ""}>
        Save
      </button>
    </div>
  );
}
`,
  },
  {
    id: 'react-05-lifting-state',
    title: 'Lifting State Up',
    language: 'javascript',
    kind: 'react',
    module: 'State',
    difficulty: 5,
    concepts: ['lifting-state', 'props', 'callbacks', 'composition'],
    instructions: `When two components need the same data, the data does not belong to either of them. It belongs to their closest common parent, and gets passed **down as props** while changes travel **up as callbacks**.

\`\`\`jsx
function App() {
  const [tasks, setTasks] = useState(INITIAL);

  function toggle(id) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={toggle} />
      ))}
    </ul>
  );
}

function TaskItem({ task, onToggle }) {
  return (
    <li onClick={() => onToggle(task.id)}>{task.title}</li>
  );
}
\`\`\`

\`TaskItem\` owns nothing. It receives what to show and what to call, and that is the whole contract — which makes it trivial to reuse, and trivial to test.

This one-way flow is what people mean by React being predictable: to find out why something on screen looks the way it does, you walk *up* the tree to whoever owns that state. There is exactly one place to look.

### The trade

Passing props through several layers to reach a deep component is called **prop drilling**, and past three or four levels it gets tedious. That is what Context and state libraries exist for. Reach for them when drilling actually hurts, not before — an unnecessary global store is a much bigger problem than one extra prop.

### Note the update again

\`\`\`jsx
setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
\`\`\`

Map over the list, replace the one that matches, leave the rest identical. Third time this pattern has appeared — in the JavaScript track, in the front-end track, and now here. It is the single most-used state update in React.

## YOUR TASK

- \`App\` owns the task list in state and renders \`TaskItem\` for each
- \`TaskItem({ task, onToggle })\` renders \`<li className="task">\` (plus \`done\` when completed) and calls \`onToggle(task.id)\` when clicked
- \`<p id="summary">\` shows \`"2 left"\`, updating as tasks toggle
- \`TaskItem\` must hold **no state of its own**`,
    starterCode: `const INITIAL = [
  { id: 1, title: "Learn JSX", done: true },
  { id: 2, title: "Render a list", done: false },
  { id: 3, title: "Lift state up", done: false },
];

function TaskItem({ task, onToggle }) {
  // render an li; clicking it should call onToggle(task.id)
}

function App() {
  // const [tasks, setTasks] = useState(INITIAL);

  return (
    <div>
      <ul>{/* one TaskItem per task */}</ul>
      {/* summary */}
    </div>
  );
}
`,
    webCheck: `(async function () {
  var tick = function () { return new Promise(function (r) { setTimeout(r, 50); }); };
  var items = function () { return document.querySelectorAll('#root li.task'); };
  var summary = function () { return document.querySelector('#summary'); };

  if (items().length !== 3) return false;
  if (!items()[0].classList.contains('done')) return false;
  if (items()[1].classList.contains('done')) return false;
  if (!summary() || summary().textContent.trim() !== '2 left') return false;

  items()[1].click(); await tick();
  if (!items()[1].classList.contains('done')) return false;
  if (summary().textContent.trim() !== '1 left') return false;

  items()[0].click(); await tick();
  if (items()[0].classList.contains('done')) return false;
  if (summary().textContent.trim() !== '2 left') return false;

  items()[2].click(); await tick();
  return summary().textContent.trim() === '1 left'
      && !window.__reactWarnings.some(function (w) {
           return w.indexOf('unique "key"') !== -1;
         });
})()`,
    hints: [
      '`TaskItem` is a pure display component: it returns an `<li>` with an `onClick` that calls `onToggle(task.id)`.',
      'The toggle lives in `App` and produces a new array: `tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))`.',
      'Derive the summary from state on every render — `tasks.filter((t) => !t.done).length` — rather than storing a separate count.',
    ],
    solution: `const INITIAL = [
  { id: 1, title: "Learn JSX", done: true },
  { id: 2, title: "Render a list", done: false },
  { id: 3, title: "Lift state up", done: false },
];

function TaskItem({ task, onToggle }) {
  return (
    <li
      className={task.done ? "task done" : "task"}
      onClick={() => onToggle(task.id)}
    >
      {task.title}
    </li>
  );
}

function App() {
  const [tasks, setTasks] = useState(INITIAL);

  function toggle(id) {
    setTasks((current) =>
      current.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  const remaining = tasks.filter((task) => !task.done).length;

  return (
    <div>
      <ul>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={toggle} />
        ))}
      </ul>
      <p id="summary">{remaining} left</p>
    </div>
  );
}
`,
  },
  {
    id: 'react-06-useeffect',
    title: 'useEffect and Cleanup',
    language: 'javascript',
    kind: 'react',
    module: 'Effects',
    difficulty: 5,
    concepts: ['useeffect', 'cleanup', 'dependencies', 'lifecycle'],
    instructions: `Rendering must be pure: given the same props and state, a component returns the same markup and touches nothing else. Timers, subscriptions, network requests and direct DOM access are **side effects**, and they go in \`useEffect\`.

\`\`\`jsx
useEffect(() => {
  const id = setInterval(() => setSeconds((s) => s + 1), 1000);
  return () => clearInterval(id);      // cleanup
}, []);
\`\`\`

Three parts, and all three matter.

### The dependency array

\`\`\`jsx
useEffect(fn);              // after every render — usually a mistake
useEffect(fn, []);          // once, after the first render
useEffect(fn, [userId]);    // whenever userId changes
\`\`\`

The array is not a "run once" switch; it is a list of the values the effect reads. React re-runs the effect when any of them change. Leave out a value the effect uses and it keeps seeing an old one — the **stale closure**, the classic React bug.

### Cleanup is the half people skip

The function you return runs before the effect re-runs, and when the component unmounts. Without it, intervals keep firing, listeners accumulate and memory leaks:

\`\`\`jsx
useEffect(() => {
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}, []);
\`\`\`

This lesson's check inspects whether the interval was actually cleared, so forgetting the cleanup genuinely fails.

> In development, React 18's Strict Mode deliberately mounts, unmounts and remounts each component to expose missing cleanup. If something breaks on the second mount, the cleanup is wrong — that is the tool working, not a bug.

### Do not reach for it too readily

\`useEffect\` is not for computing values from state — derive those during render, as the forms lesson showed. It is for **synchronising with something outside React**. If nothing outside React is involved, you probably do not need an effect.

## YOUR TASK

- \`Timer\` — shows \`<span id="seconds">\` counting up every 100ms, starting at 0, using \`useEffect\` with a **cleanup** that clears the interval
- \`App\` — holds a \`visible\` boolean, renders \`Timer\` only when true, and has \`<button id="toggle">\` to flip it

The check confirms the counter advances, that unmounting clears the interval, and that remounting starts from 0 again.`,
    starterCode: `function Timer() {
  // const [seconds, setSeconds] = useState(0);
  // useEffect with setInterval every 100ms, and a cleanup that clears it

  return (
    <p>
      Seconds: <span id="seconds">0</span>
    </p>
  );
}

function App() {
  // const [visible, setVisible] = useState(true);

  return (
    <div>
      <button id="toggle">Toggle</button>
      {/* render Timer only when visible */}
    </div>
  );
}
`,
    webCheck: `(async function () {
  var $ = function (s) { return document.querySelector(s); };
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  var toggle = $('#toggle');
  if (!toggle || !$('#seconds')) return false;

  await wait(400);
  var ticked = parseInt($('#seconds').textContent.trim(), 10);
  if (!(ticked >= 3)) return false;

  toggle.click(); await wait(80);
  if ($('#seconds')) return false;
  if (window.__timers.active !== 0) return false;

  toggle.click(); await wait(60);
  var restarted = $('#seconds');
  if (!restarted) return false;
  return parseInt(restarted.textContent.trim(), 10) <= 1;
})()`,
    hints: [
      'The interval updates state functionally so it never depends on a captured value: `setSeconds((s) => s + 1)`.',
      '`setInterval` returns an id — return a cleanup from the effect that clears it: `return () => clearInterval(id);`',
      'In `App`, `{visible && <Timer />}` renders it conditionally, and the button flips the boolean with `setVisible((v) => !v)`.',
    ],
    solution: `function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 100);
    return () => clearInterval(id);
  }, []);

  return (
    <p>
      Seconds: <span id="seconds">{seconds}</span>
    </p>
  );
}

function App() {
  const [visible, setVisible] = useState(true);

  return (
    <div>
      <button id="toggle" onClick={() => setVisible((v) => !v)}>
        Toggle
      </button>
      {visible && <Timer />}
    </div>
  );
}
`,
  },
  {
    id: 'react-07-data-fetching',
    title: 'Fetching Data',
    language: 'javascript',
    kind: 'react',
    module: 'Effects',
    difficulty: 5,
    concepts: ['data-fetching', 'loading-states', 'async', 'useeffect'],
    instructions: `The four states from the front-end track — loading, error, empty, success — arrive here as React state, and the shape barely changes.

\`\`\`jsx
const [status, setStatus] = useState("loading");
const [items, setItems] = useState([]);
const [error, setError] = useState(null);

useEffect(() => {
  let cancelled = false;

  async function load() {
    setStatus("loading");
    try {
      const data = await api.fetchItems();
      if (!cancelled) { setItems(data); setStatus("success"); }
    } catch (err) {
      if (!cancelled) { setError(err.message); setStatus("error"); }
    }
  }

  load();
  return () => { cancelled = true; };
}, []);
\`\`\`

Two things there are worth dwelling on.

### The effect callback cannot be async

\`useEffect(async () => …)\` is wrong: an async function returns a promise, and React expects the return value to be the **cleanup function**. Define an async function inside and call it, as above.

### The cancelled flag

This is the race condition from the async track, in its React form. A request started for one set of props can resolve after the component has moved on — or unmounted. The cleanup flips \`cancelled\`, and the handlers check it before touching state. Without it you get results for the wrong query, and in older React a warning about updating an unmounted component.

\`AbortController\` is the stronger version, actually cancelling the request rather than ignoring the answer.

> Real projects use TanStack Query or SWR rather than hand-rolling this, because caching, retries and deduplication are a lot of work to get right. Knowing what those libraries do for you is the reason to write it once by hand.

## YOUR TASK

A \`fakeApi\` is provided; it takes about 150ms and fails while \`shouldFail\` is true.

In \`App\`:

- while loading, render \`<p id="status">Loading…</p>\`
- on failure, render \`<p id="status">Error: <message></p>\` **and** a \`<button id="retry">\`
- on success with items, render one \`<li className="item">\` each and no status paragraph
- on success with no items, render \`<p id="status">No items</p>\`
- the retry button re-runs the request`,
    starterCode: `const fakeApi = {
  shouldFail: true,
  items: ["Alpha", "Beta", "Gamma"],
  load() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (fakeApi.shouldFail) reject(new Error("Network down"));
        else resolve(fakeApi.items);
      }, 150);
    });
  },
};

function App() {
  // status / items / error state, plus a useEffect that loads

  return <div>{/* branch on the status */}</div>;
}
`,
    webCheck: `(async function () {
  var $ = function (s) { return document.querySelector(s); };
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  // The initial request is already in flight and set to fail.
  await wait(400);
  var status = $('#status');
  if (!status || status.textContent.indexOf('Error') === -1) return false;

  var retry = $('#retry');
  if (!retry) return false;

  fakeApi.shouldFail = false;
  retry.click();
  await wait(60);
  if (!$('#status') || $('#status').textContent.indexOf('Loading') === -1) return false;

  await wait(400);
  if (document.querySelectorAll('#root li.item').length !== 3) return false;
  return !$('#status');
})()`,
    hints: [
      'Model it with one `status` string — `"loading" | "error" | "success"` — rather than separate booleans that can contradict each other.',
      'Put the loading routine in its own function so both the effect and the retry button can call it.',
      'Render by branching on status: early-return the loading paragraph, then the error paragraph plus retry button, then the empty case, then the list.',
    ],
    solution: `const fakeApi = {
  shouldFail: true,
  items: ["Alpha", "Beta", "Gamma"],
  load() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (fakeApi.shouldFail) reject(new Error("Network down"));
        else resolve(fakeApi.items);
      }, 150);
    });
  },
};

function App() {
  const [status, setStatus] = useState("loading");
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      setError(null);
      try {
        const data = await fakeApi.load();
        if (!cancelled) {
          setItems(data);
          setStatus("success");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setStatus("error");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  if (status === "loading") {
    return <p id="status">Loading…</p>;
  }

  if (status === "error") {
    return (
      <div>
        <p id="status">Error: {error}</p>
        <button id="retry" onClick={() => setAttempt((n) => n + 1)}>
          Retry
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return <p id="status">No items</p>;
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item} className="item">
          {item}
        </li>
      ))}
    </ul>
  );
}
`,
  },
  {
    id: 'react-08-reducer',
    title: 'Reducers: The Testable Part of React',
    language: 'javascript',
    module: 'Structure',
    difficulty: 5,
    concepts: ['usereducer', 'reducers', 'pure-functions', 'state-machines'],
    instructions: `When state updates get complicated — several fields that change together, transitions with rules — \`useState\` scattered across handlers stops scaling. A **reducer** puts every transition in one place.

\`\`\`jsx
function reducer(state, action) {
  switch (action.type) {
    case "increment": return { ...state, count: state.count + 1 };
    case "reset":     return { ...state, count: 0 };
    default:          return state;
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 });

<button onClick={() => dispatch({ type: "increment" })}>+1</button>
\`\`\`

Components stop describing *how* state changes and start describing *what happened*. Every rule lives in the reducer, so you read one function to know every way the state can move.

### Why this lesson is test-graded

A reducer is a **pure function**: state in, action in, new state out. No hooks, no DOM, no React at all.

That makes it the part of a React application you can test properly — call it with a state and an action, assert on the result, done. This is exactly the "separate the decision from the effect" lesson from the Testing track, and it is why teams push logic into reducers: not because \`useReducer\` is fashionable, but because the interesting behaviour becomes testable in isolation.

So this lesson has no preview. You are writing the reducer, and a test suite is checking it.

### The rules a reducer must obey

1. **Pure.** No fetching, no timers, no random values, no \`Date.now()\`. Same inputs, same output, every time.
2. **Never mutate.** Return a new object; do not touch the one you were given.
3. **Unknown actions return the state unchanged**, not \`undefined\`.

## YOUR TASK

\`cartReducer(state, action)\` over state shaped \`{ items: [{ id, name, price, qty }] }\`:

- \`{ type: "add", item }\` — append the item, or if that id is present, increase its \`qty\` by the incoming item's \`qty\`
- \`{ type: "remove", id }\` — drop that item
- \`{ type: "setQty", id, qty }\` — set the quantity; a qty of 0 or less removes the item
- \`{ type: "clear" }\` — empty the cart
- anything else — return the state **unchanged and identical**

Also \`cartTotal(state)\` — the sum of \`price * qty\`, rounded to 2 decimals.`,
    starterCode: `function cartReducer(state, action) {
}

function cartTotal(state) {
}
`,
    testCode: `const EMPTY = { items: [] };
const APPLE = { id: 1, name: "Apple", price: 0.5, qty: 2 };
const BREAD = { id: 2, name: "Bread", price: 2.25, qty: 1 };
const FULL = { items: [APPLE, BREAD] };

test("add appends a new item", () => {
  expect(cartReducer(EMPTY, { type: "add", item: APPLE })).toEqual({ items: [APPLE] });
});

test("add increases the quantity of an existing item", () => {
  const next = cartReducer(FULL, { type: "add", item: { ...APPLE, qty: 3 } });
  expect(next.items[0].qty).toBe(5);
  expect(next.items).toHaveLength(2);
});

test("add does not mutate the previous state", () => {
  cartReducer(FULL, { type: "add", item: { ...APPLE, qty: 3 } });
  expect(FULL.items[0].qty).toBe(2);
  expect(APPLE.qty).toBe(2);
});

test("remove drops the matching item", () => {
  expect(cartReducer(FULL, { type: "remove", id: 1 })).toEqual({ items: [BREAD] });
});

test("remove of an unknown id changes nothing", () => {
  expect(cartReducer(FULL, { type: "remove", id: 99 }).items).toHaveLength(2);
});

test("setQty updates the quantity", () => {
  const next = cartReducer(FULL, { type: "setQty", id: 2, qty: 4 });
  expect(next.items[1].qty).toBe(4);
  expect(next.items[0].qty).toBe(2);
});

test("setQty of zero or less removes the item", () => {
  expect(cartReducer(FULL, { type: "setQty", id: 1, qty: 0 }).items).toEqual([BREAD]);
  expect(cartReducer(FULL, { type: "setQty", id: 1, qty: -2 }).items).toEqual([BREAD]);
});

test("clear empties the cart", () => {
  expect(cartReducer(FULL, { type: "clear" })).toEqual({ items: [] });
});

test("an unknown action returns the very same state object", () => {
  expect(cartReducer(FULL, { type: "nonsense" })).toBe(FULL);
});

test("the reducer is pure — same input, same output", () => {
  const a = cartReducer(FULL, { type: "remove", id: 1 });
  const b = cartReducer(FULL, { type: "remove", id: 1 });
  expect(a).toEqual(b);
});

test("cartTotal sums price times quantity", () => {
  expect(cartTotal(FULL)).toBe(3.25);
  expect(cartTotal(EMPTY)).toBe(0);
});

test("cartTotal rounds to two decimals", () => {
  expect(cartTotal({ items: [{ id: 1, name: "x", price: 0.1, qty: 3 }] })).toBe(0.3);
});`,
    hints: [
      'A `switch` on `action.type` with a `default` that returns `state` untouched — returning `state` itself is what makes the identity test pass.',
      'For `add`, check `state.items.some((i) => i.id === action.item.id)` first, then either map to bump the qty or spread to append.',
      '`setQty` is two cases: a qty of 0 or less behaves exactly like `remove`, otherwise map and replace that one item with `{ ...item, qty: action.qty }`.',
    ],
    solution: `function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, qty: i.qty + action.item.qty } : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.item] };
    }

    case "remove":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };

    case "setQty":
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: action.qty } : i
        ),
      };

    case "clear":
      return { ...state, items: [] };

    default:
      return state;
  }
}

function cartTotal(state) {
  const total = state.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return Math.round(total * 100) / 100;
}
`,
  },
  {
    id: 'react-09-custom-hooks',
    title: 'Custom Hooks',
    language: 'javascript',
    kind: 'react',
    module: 'Structure',
    difficulty: 5,
    concepts: ['custom-hooks', 'reuse', 'abstraction'],
    instructions: `A custom hook is a function whose name starts with \`use\` and that calls other hooks. That is the entire specification — there is no special syntax and no registration.

\`\`\`jsx
function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);

  return {
    count,
    increment: () => setCount((c) => c + 1),
    decrement: () => setCount((c) => Math.max(0, c - 1)),
    reset: () => setCount(initial),
  };
}

function App() {
  const { count, increment, reset } = useCounter();
  …
}
\`\`\`

### What they are for

Components mix two things: **stateful logic** and **markup**. Custom hooks extract the first so the second stays readable, and so the logic can be reused without copying it.

Crucially, each component calling a hook gets its **own independent state**. Hooks share behaviour, not data — the mistake people make coming from global stores.

### The rules of hooks, and the reason

1. Only call hooks at the **top level** — never inside conditions, loops or nested functions.
2. Only call them from components or other hooks.

The reason is unglamorous: React tracks hooks **by call order**, not by name. First \`useState\`, second \`useState\`, and so on. Wrap one in an \`if\` and the order changes between renders, so React hands back the wrong state. That is why the linter rule is not a style preference.

\`\`\`jsx
if (loggedIn) {
  const [name, setName] = useState("");   // breaks the ordering
}
\`\`\`

Put the condition inside the hook's *result*, not around the hook.

## YOUR TASK

1. \`useCounter(initial = 0)\` — returns \`{ count, increment, decrement, reset }\`, where \`decrement\` never goes below 0 and \`reset\` returns to \`initial\`
2. \`App\` — uses **two independent counters** and renders:
   - \`<span id="a">\` / buttons \`#aInc\`, \`#aDec\`
   - \`<span id="b">\` / button \`#bInc\`
   - \`<button id="resetAll">\` resetting both

Counter *a* starts at 0, counter *b* at 10. The check confirms the two do not share state.`,
    starterCode: `function useCounter(initial = 0) {
  // useState here, and return the value plus the three actions
}

function App() {
  // const a = useCounter(0);
  // const b = useCounter(10);

  return (
    <div>
      <p>A: <span id="a">0</span></p>
      <p>B: <span id="b">10</span></p>
      {/* aInc, aDec, bInc and resetAll buttons */}
    </div>
  );
}
`,
    webCheck: `(async function () {
  var $ = function (s) { return document.querySelector(s); };
  var tick = function () { return new Promise(function (r) { setTimeout(r, 40); }); };

  if (typeof useCounter !== 'function') return false;

  var need = ['#a', '#b', '#aInc', '#aDec', '#bInc', '#resetAll'];
  for (var i = 0; i < need.length; i++) if (!$(need[i])) return false;

  var a = function () { return $('#a').textContent.trim(); };
  var b = function () { return $('#b').textContent.trim(); };

  if (a() !== '0' || b() !== '10') return false;

  $('#aInc').click(); await tick();
  $('#aInc').click(); await tick();
  if (a() !== '2') return false;
  if (b() !== '10') return false;

  $('#bInc').click(); await tick();
  if (b() !== '11') return false;
  if (a() !== '2') return false;

  for (var j = 0; j < 5; j++) { $('#aDec').click(); await tick(); }
  if (a() !== '0') return false;

  $('#aInc').click(); await tick();
  $('#resetAll').click(); await tick();
  return a() === '0' && b() === '10';
})()`,
    hints: [
      'The hook is an ordinary function: call `useState(initial)` inside it and return an object holding the count and three functions.',
      'Use the functional updater everywhere — `setCount((c) => c + 1)` — so the actions never capture a stale value.',
      'In `App`, calling `useCounter` twice gives two entirely separate states; `resetAll` just calls both `reset` functions.',
    ],
    solution: `function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);

  return {
    count,
    increment: () => setCount((c) => c + 1),
    decrement: () => setCount((c) => Math.max(0, c - 1)),
    reset: () => setCount(initial),
  };
}

function App() {
  const a = useCounter(0);
  const b = useCounter(10);

  return (
    <div>
      <p>A: <span id="a">{a.count}</span></p>
      <p>B: <span id="b">{b.count}</span></p>

      <button id="aInc" onClick={a.increment}>A +1</button>{" "}
      <button id="aDec" onClick={a.decrement}>A -1</button>{" "}
      <button id="bInc" onClick={b.increment}>B +1</button>{" "}
      <button
        id="resetAll"
        onClick={() => {
          a.reset();
          b.reset();
        }}
      >
        Reset both
      </button>
    </div>
  );
}
`,
  },
  {
    id: 'react-10-quiz',
    title: 'Checkpoint: How React Thinks',
    language: 'javascript',
    kind: 'quiz',
    module: 'Structure',
    difficulty: 4,
    concepts: ['rendering', 'keys', 'hooks', 'review'],
    instructions: `React interviews are mostly about the model rather than the API: when things re-render, why keys exist, and what a hook is actually doing.`,
    quiz: [
      {
        id: 'q1',
        prompt: 'What happens when you call `setCount(count + 1)`?',
        choices: [
          '`count` is updated immediately on the next line',
          'React schedules a re-render, and the component function runs again with the new value',
          'The DOM is edited directly',
          'Nothing until the next click',
        ],
        answerIndex: 1,
        explanation:
          'React schedules a re-render. The `count` variable in the current render is a const and never changes — reading it right after the setter still gives the old value. The new value arrives when the function runs again and `useState` returns it.',
      },
      {
        id: 'q2',
        prompt: 'Why does React warn when a list item has no `key`?',
        choices: [
          'For accessibility',
          'Without a key React matches items by position, so state can attach to the wrong row',
          'Keys make rendering faster in all cases',
          'It is required by JSX syntax',
        ],
        answerIndex: 1,
        explanation:
          'Keys give items identity across renders. Without them React matches by position, so removing the first of three items looks like "two items changed text and one was removed". With inputs, focus or animation, state ends up on the wrong row.',
      },
      {
        id: 'q3',
        prompt: 'Why is the array index a poor choice of key?',
        choices: [
          'It is a number rather than a string',
          'It changes when the list reorders, which is exactly when identity matters',
          'React forbids it',
          'It makes the list render twice',
        ],
        answerIndex: 1,
        explanation:
          'An index describes position, not identity. Insert at the front and every index shifts, so React believes every item changed. For a list that never reorders it is harmless; a stable id from your data always works.',
      },
      {
        id: 'q4',
        prompt: 'What does the dependency array of `useEffect` control?',
        choices: [
          'How many times the effect may run in total',
          'Which values React watches to decide whether to re-run the effect',
          'The order effects run in',
          'Whether the effect is asynchronous',
        ],
        answerIndex: 1,
        explanation:
          'It lists the values the effect reads. React re-runs the effect when any of them change. Omitting a value the effect uses gives you a stale closure — the effect keeps seeing the value from the render it was created in.',
      },
      {
        id: 'q5',
        prompt: 'What is the function returned from a `useEffect` callback for?',
        choices: [
          'It is the effect itself',
          'Cleanup — it runs before the effect re-runs and when the component unmounts',
          'It provides the new state',
          'It is ignored',
        ],
        answerIndex: 1,
        explanation:
          'Cleanup. Clear intervals, remove listeners, cancel subscriptions there. Skipping it leaks timers and listeners, which is why Strict Mode deliberately double-mounts in development to expose the omission.',
      },
      {
        id: 'q6',
        prompt: 'Why can hooks not be called inside an `if`?',
        choices: [
          'It is a style rule with no technical basis',
          'React identifies hooks by call order, so a changing order returns the wrong state',
          'Conditions make rendering slow',
          'The compiler cannot parse it',
        ],
        answerIndex: 1,
        explanation:
          'React tracks hooks positionally — first useState, second useState — not by name. A conditional hook changes that order between renders and React hands back the wrong slot. Put the condition inside the hook’s result, not around the call.',
      },
      {
        id: 'q7',
        prompt: 'You have `name` in state and also store `isValid` in state. What is the problem?',
        choices: [
          'Nothing — this is normal',
          'isValid is derivable from name, so two sources of truth can disagree',
          'State cannot hold booleans',
          'It causes an infinite loop',
        ],
        answerIndex: 1,
        explanation:
          'Duplicated state drifts. If it can be computed from existing state or props, compute it during render — `const isValid = name.trim() !== ""`. Every "the button says enabled but the form is empty" bug is this.',
      },
      {
        id: 'q8',
        prompt: 'Why is a reducer the easiest part of a React app to test?',
        choices: [
          'Because useReducer has a test mode',
          'Because it is a pure function: state and action in, new state out, no React involved',
          'Because reducers cannot contain bugs',
          'Because it runs on the server',
        ],
        answerIndex: 1,
        explanation:
          'It is pure. No hooks, no DOM, no rendering — call it with a state and an action and assert on the result. This is why teams push logic into reducers: the interesting behaviour becomes testable in isolation, exactly as the Testing track argued.',
      },
    ],
  },
];
