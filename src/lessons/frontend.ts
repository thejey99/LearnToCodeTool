import type { LessonDraft } from '../types';

export const FRONTEND_LESSONS: LessonDraft[] = [
  {
    id: 'fe-01-dom',
    title: 'The DOM as a Data Structure',
    language: 'javascript',
    kind: 'web',
    module: 'The Browser',
    difficulty: 3,
    concepts: ['dom', 'queryselector', 'classlist', 'attributes'],
    instructions: `The DOM is a tree of objects representing your page. HTML is the text you shipped; the DOM is the living structure the browser built from it, and JavaScript changes the DOM, not the HTML.

### Finding elements

\`\`\`js
document.querySelector("#score")        // first match, CSS selector syntax
document.querySelectorAll(".card")      // all matches (a NodeList, not an array)
[...document.querySelectorAll(".card")] // spread it when you want array methods
\`\`\`

One selector API for everything beats memorising \`getElementById\`, \`getElementsByClassName\` and friends.

### Changing them

\`\`\`js
el.textContent = "Hello";          // safe: text stays text
el.innerHTML = userInput;          // dangerous: parses HTML, executes scripts
el.classList.add("active");
el.classList.toggle("open", isOpen);   // second argument forces on or off
el.dataset.userId = "42";              // becomes data-user-id="42"
el.setAttribute("aria-expanded", "true");
\`\`\`

\`classList\` beats assigning \`className\` because it does not stomp on classes someone else set. And \`textContent\` versus \`innerHTML\` is the XSS distinction from the Security lesson — it matters every single time.

### Creating and removing

\`\`\`js
const li = document.createElement("li");
li.textContent = item.name;
list.append(li);
li.remove();
\`\`\`

> Touching the DOM is comparatively slow. Build up what you need first and insert once, rather than appending inside a tight loop.

## YOUR TASK

The page has a list container and three buttons. In the script:

1. Create a \`<li class="task">\` for every item in the \`TASKS\` array, with the task text as its \`textContent\`, and append them all to \`#list\`.
2. Give each \`li\` a \`data-id\` matching the task's id (use \`dataset\`).
3. Add the class \`done\` to any task whose \`done\` field is true.

The check verifies the count, the classes and the data attributes.`,
    starterCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #0d1117; color: #c9d1d9; font-family: sans-serif; padding: 20px; }
    ul { list-style: none; padding: 0; }
    .task { padding: 10px 14px; background: #161b22; border-radius: 6px; margin-bottom: 6px; }
    .done { opacity: 0.5; text-decoration: line-through; }
  </style>
</head>
<body>
  <h1>Tasks</h1>
  <ul id="list"></ul>

  <script>
    const TASKS = [
      { id: 1, text: "Learn the DOM", done: true },
      { id: 2, text: "Handle events", done: false },
      { id: 3, text: "Render from state", done: false },
    ];

    const list = document.querySelector("#list");

    // Build one li per task: class "task", the text, data-id, and "done" where needed
  </script>
</body>
</html>
`,
    webCheck:
      "(function(){var items=document.querySelectorAll('#list .task');if(items.length!==3)return false;var ok=true;items.forEach(function(li,i){if(li.dataset.id!==String(i+1))ok=false;});if(!ok)return false;if(!items[0].classList.contains('done'))return false;if(items[1].classList.contains('done'))return false;return items[1].textContent.indexOf('Handle events')!==-1;})()",
    hints: [
      'Loop the array with `for (const task of TASKS)`.',
      '`li.className = "task"` then `li.textContent = task.text` and `li.dataset.id = task.id`.',
      'Add the extra class conditionally: `if (task.done) li.classList.add("done");`',
    ],
    solution: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #0d1117; color: #c9d1d9; font-family: sans-serif; padding: 20px; }
    ul { list-style: none; padding: 0; }
    .task { padding: 10px 14px; background: #161b22; border-radius: 6px; margin-bottom: 6px; }
    .done { opacity: 0.5; text-decoration: line-through; }
  </style>
</head>
<body>
  <h1>Tasks</h1>
  <ul id="list"></ul>

  <script>
    const TASKS = [
      { id: 1, text: "Learn the DOM", done: true },
      { id: 2, text: "Handle events", done: false },
      { id: 3, text: "Render from state", done: false },
    ];

    const list = document.querySelector("#list");

    for (const task of TASKS) {
      const li = document.createElement("li");
      li.className = "task";
      li.textContent = task.text;
      li.dataset.id = task.id;
      if (task.done) li.classList.add("done");
      list.append(li);
    }
  </script>
</body>
</html>
`,
  },
  {
    id: 'fe-02-events',
    title: 'Events and Delegation',
    language: 'javascript',
    kind: 'web',
    module: 'The Browser',
    difficulty: 4,
    concepts: ['events', 'bubbling', 'delegation', 'event-object'],
    instructions: `An event fires on the deepest element involved and then **bubbles** upward through its ancestors. Every listener along the way sees it.

\`\`\`js
button.addEventListener("click", (event) => {
  event.target;            // the element actually clicked
  event.currentTarget;     // the element the listener is attached to
  event.preventDefault();  // stop the browser's default action
  event.stopPropagation(); // stop the bubbling (use sparingly)
});
\`\`\`

The \`target\` / \`currentTarget\` distinction is the whole basis of the next idea.

### Event delegation

Attaching a listener to every item is wasteful, and it breaks the moment you add an item later — the new element has no listener.

Instead, attach **one** listener to the container and work out what was clicked:

\`\`\`js
list.addEventListener("click", (event) => {
  const item = event.target.closest(".task");
  if (!item) return;                     // clicked the padding, not an item
  toggle(item.dataset.id);
});
\`\`\`

\`closest\` walks up from the clicked element until it finds a match, which handles clicks that land on something *inside* the item. One listener, works for items that do not exist yet, less memory. This is how frameworks do it internally, and it is a strong thing to know in an interview.

### preventDefault

Forms reload the page on submit; links navigate. Stop that when you are handling it yourself:

\`\`\`js
form.addEventListener("submit", (e) => { e.preventDefault(); /* ... */ });
\`\`\`

## YOUR TASK

Wire up the task list using **one** delegated listener on \`#list\`:

- clicking a task toggles the class \`done\` on that \`<li>\`
- \`#count\` always shows the number of tasks *not* done, as a plain number
- update the count immediately on load as well

Clicks that miss a task must not throw.`,
    starterCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #0d1117; color: #c9d1d9; font-family: sans-serif; padding: 20px; }
    ul { list-style: none; padding: 0; max-width: 320px; }
    .task { padding: 10px 14px; background: #161b22; border-radius: 6px; margin-bottom: 6px; cursor: pointer; }
    .done { opacity: 0.5; text-decoration: line-through; }
  </style>
</head>
<body>
  <h1>Tasks — <span id="count">0</span> left</h1>
  <ul id="list">
    <li class="task" data-id="1">Learn the DOM</li>
    <li class="task" data-id="2">Handle events</li>
    <li class="task" data-id="3">Render from state</li>
  </ul>

  <script>
    const list = document.querySelector("#list");
    const count = document.querySelector("#count");

    function updateCount() {
      // set count.textContent to the number of tasks without the "done" class
    }

    // ONE listener on the list, using event.target.closest(".task")

    updateCount();
  </script>
</body>
</html>
`,
    webCheck:
      "(function(){var c=document.querySelector('#count');var items=document.querySelectorAll('#list .task');if(!c||items.length!==3)return false;if(c.textContent.trim()!=='3')return false;items[0].click();if(!items[0].classList.contains('done'))return false;if(c.textContent.trim()!=='2')return false;items[0].click();if(items[0].classList.contains('done'))return false;if(c.textContent.trim()!=='3')return false;document.querySelector('#list').click();return c.textContent.trim()==='3';})()",
    hints: [
      'Count with a selector: `document.querySelectorAll("#list .task:not(.done)").length`.',
      'In the listener, bail out early when `closest` finds nothing: `if (!item) return;`.',
      '`item.classList.toggle("done")` flips it, then call `updateCount()`.',
    ],
    solution: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #0d1117; color: #c9d1d9; font-family: sans-serif; padding: 20px; }
    ul { list-style: none; padding: 0; max-width: 320px; }
    .task { padding: 10px 14px; background: #161b22; border-radius: 6px; margin-bottom: 6px; cursor: pointer; }
    .done { opacity: 0.5; text-decoration: line-through; }
  </style>
</head>
<body>
  <h1>Tasks — <span id="count">0</span> left</h1>
  <ul id="list">
    <li class="task" data-id="1">Learn the DOM</li>
    <li class="task" data-id="2">Handle events</li>
    <li class="task" data-id="3">Render from state</li>
  </ul>

  <script>
    const list = document.querySelector("#list");
    const count = document.querySelector("#count");

    function updateCount() {
      count.textContent = document.querySelectorAll("#list .task:not(.done)").length;
    }

    list.addEventListener("click", (event) => {
      const item = event.target.closest(".task");
      if (!item) return;
      item.classList.toggle("done");
      updateCount();
    });

    updateCount();
  </script>
</body>
</html>
`,
  },
  {
    id: 'fe-03-state-render',
    title: 'State In, Interface Out',
    language: 'javascript',
    kind: 'web',
    module: 'Building Interfaces',
    difficulty: 5,
    concepts: ['state', 'rendering', 'single-source-of-truth', 'react-thinking'],
    instructions: `This is the idea that makes React — and every framework after it — make sense. Learn it here, in plain JavaScript, and the frameworks become syntax.

### The problem with patching the DOM

Beginner UI code edits the page directly at every event: add a class here, update a count there, remove a node somewhere else. Each handler must know about every part of the screen its change touches. With five features that is twenty interactions to keep straight, and the bugs are always the same — two parts of the page disagreeing about what is true.

### The alternative

Keep the truth in **one plain data structure**, and write **one function** that turns that data into the interface:

\`\`\`js
let state = { tasks: [...], filter: "all" };

function render() {
  list.innerHTML = "";
  for (const task of visible(state)) list.append(taskElement(task));
  count.textContent = state.tasks.filter((t) => !t.done).length;
}

function setState(changes) {
  state = { ...state, ...changes };
  render();
}
\`\`\`

Now every handler does exactly one thing: change the data and call \`setState\`. It never touches the DOM. The screen cannot disagree with the data, because the screen is *derived from* the data.

\`\`\`js
function toggle(id) {
  setState({
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
  });
}
\`\`\`

Notice that this is exactly the immutable-update pattern from the JavaScript track. That was not a coincidence.

### What frameworks add

Re-rendering everything is fine for a list of ten and wasteful for a table of ten thousand. React's contribution is to compute the *difference* and touch only what changed — but the mental model, state in and interface out, is identical. Understanding it here is why React later feels obvious rather than magical.

## YOUR TASK

Build a filterable task list from a single state object.

- \`state.tasks\` holds \`{ id, text, done }\`; \`state.filter\` is \`"all"\`, \`"active"\` or \`"done"\`
- \`render()\` rebuilds \`#list\` from state and updates \`#count\` with the number of unfinished tasks
- clicking a task toggles it **by updating state**, never by touching the element
- the three filter buttons set \`state.filter\` and re-render
- the active filter button gets the class \`active\`

The check drives the interface through several state changes and verifies the display follows.`,
    starterCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #0d1117; color: #c9d1d9; font-family: sans-serif; padding: 20px; }
    ul { list-style: none; padding: 0; max-width: 340px; }
    .task { padding: 10px 14px; background: #161b22; border-radius: 6px; margin-bottom: 6px; cursor: pointer; }
    .done { opacity: 0.5; text-decoration: line-through; }
    button { background: #21262d; color: #c9d1d9; border: 1px solid #30363d; border-radius: 6px; padding: 6px 12px; margin-right: 6px; cursor: pointer; }
    button.active { background: #1f6feb; color: white; }
  </style>
</head>
<body>
  <h1>Tasks — <span id="count">0</span> left</h1>

  <div id="filters">
    <button data-filter="all">All</button>
    <button data-filter="active">Active</button>
    <button data-filter="done">Done</button>
  </div>

  <ul id="list"></ul>

  <script>
    let state = {
      tasks: [
        { id: 1, text: "Learn the DOM", done: true },
        { id: 2, text: "Handle events", done: false },
        { id: 3, text: "Render from state", done: false },
      ],
      filter: "all",
    };

    const list = document.querySelector("#list");
    const count = document.querySelector("#count");
    const filters = document.querySelector("#filters");

    function setState(changes) {
      state = { ...state, ...changes };
      render();
    }

    function visibleTasks() {
      // return the tasks matching state.filter
    }

    function render() {
      // rebuild #list from visibleTasks(), update #count,
      // and mark the active filter button
    }

    list.addEventListener("click", (event) => {
      // find the task, then update state — do not touch the element
    });

    filters.addEventListener("click", (event) => {
      // set state.filter from the button's data-filter
    });

    render();
  </script>
</body>
</html>
`,
    webCheck:
      "(function(){var list=document.querySelector('#list');var count=document.querySelector('#count');if(!list||!count)return false;var items=list.querySelectorAll('.task');if(items.length!==3)return false;if(count.textContent.trim()!=='2')return false;items[1].click();if(count.textContent.trim()!=='1')return false;if(typeof state==='undefined'||!state.tasks[1].done)return false;var activeBtn=document.querySelector('#filters button[data-filter=\"active\"]');activeBtn.click();if(state.filter!=='active')return false;if(list.querySelectorAll('.task').length!==1)return false;if(!activeBtn.classList.contains('active'))return false;var allBtn=document.querySelector('#filters button[data-filter=\"all\"]');allBtn.click();return list.querySelectorAll('.task').length===3&&allBtn.classList.contains('active');})()",
    hints: [
      '`visibleTasks` is a filter over `state.tasks`: all, then `!t.done` for active, then `t.done` for done.',
      'Start `render` with `list.innerHTML = ""` so you rebuild rather than accumulate, then append one li per visible task with the `done` class where needed.',
      'In the click handler, map over `state.tasks` producing a new array and hand it to `setState` — the render redraws everything for you.',
    ],
    solution: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #0d1117; color: #c9d1d9; font-family: sans-serif; padding: 20px; }
    ul { list-style: none; padding: 0; max-width: 340px; }
    .task { padding: 10px 14px; background: #161b22; border-radius: 6px; margin-bottom: 6px; cursor: pointer; }
    .done { opacity: 0.5; text-decoration: line-through; }
    button { background: #21262d; color: #c9d1d9; border: 1px solid #30363d; border-radius: 6px; padding: 6px 12px; margin-right: 6px; cursor: pointer; }
    button.active { background: #1f6feb; color: white; }
  </style>
</head>
<body>
  <h1>Tasks — <span id="count">0</span> left</h1>

  <div id="filters">
    <button data-filter="all">All</button>
    <button data-filter="active">Active</button>
    <button data-filter="done">Done</button>
  </div>

  <ul id="list"></ul>

  <script>
    let state = {
      tasks: [
        { id: 1, text: "Learn the DOM", done: true },
        { id: 2, text: "Handle events", done: false },
        { id: 3, text: "Render from state", done: false },
      ],
      filter: "all",
    };

    const list = document.querySelector("#list");
    const count = document.querySelector("#count");
    const filters = document.querySelector("#filters");

    function setState(changes) {
      state = { ...state, ...changes };
      render();
    }

    function visibleTasks() {
      if (state.filter === "active") return state.tasks.filter((t) => !t.done);
      if (state.filter === "done") return state.tasks.filter((t) => t.done);
      return state.tasks;
    }

    function render() {
      list.innerHTML = "";
      for (const task of visibleTasks()) {
        const li = document.createElement("li");
        li.className = task.done ? "task done" : "task";
        li.textContent = task.text;
        li.dataset.id = task.id;
        list.append(li);
      }

      count.textContent = state.tasks.filter((t) => !t.done).length;

      for (const button of filters.querySelectorAll("button")) {
        button.classList.toggle("active", button.dataset.filter === state.filter);
      }
    }

    list.addEventListener("click", (event) => {
      const item = event.target.closest(".task");
      if (!item) return;
      const id = Number(item.dataset.id);
      setState({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
      });
    });

    filters.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      setState({ filter: button.dataset.filter });
    });

    render();
  </script>
</body>
</html>
`,
  },
  {
    id: 'fe-04-async-ui',
    title: 'Loading, Error, Empty',
    language: 'javascript',
    kind: 'web',
    module: 'Building Interfaces',
    difficulty: 5,
    concepts: ['async-ui', 'loading-states', 'error-handling', 'fetch'],
    instructions: `Every interface that loads remote data has **four** states, and beginners build one.

1. **Loading** — the request is in flight
2. **Error** — it failed, and the user needs to know and be able to retry
3. **Empty** — it succeeded and there is nothing to show, which is not an error
4. **Success** — the data

Shipping only the fourth is why so many pages show a blank rectangle forever when something goes wrong. Reviewers and interviewers both notice whether you thought about the other three; "what does this show while it is loading, and what if it fails?" is a standard code-review question.

### Model it in state

\`\`\`js
let state = { status: "idle", items: [], error: null };

async function load() {
  setState({ status: "loading", error: null });
  try {
    const items = await api.fetchItems();
    setState({ status: "success", items });
  } catch (err) {
    setState({ status: "error", error: err.message });
  }
}
\`\`\`

And render branches once on the status:

\`\`\`js
if (state.status === "loading") return renderSpinner();
if (state.status === "error")   return renderError(state.error);
if (state.items.length === 0)   return renderEmpty();
return renderList(state.items);
\`\`\`

One place to look, no combination of flags that can contradict itself. Note what this avoids: separate \`isLoading\` and \`hasError\` booleans can both be true at once, which is a state that should not exist.

### Detail that catches people out

\`fetch\` only rejects on a *network* failure. A 404 or a 500 resolves normally, so you must check \`response.ok\` yourself:

\`\`\`js
const response = await fetch(url);
if (!response.ok) throw new Error(\`Request failed: \${response.status}\`);
const data = await response.json();
\`\`\`

## YOUR TASK

The page provides \`fakeApi.load()\`, which takes about 200ms and fails when \`fakeApi.shouldFail\` is true.

Build the full cycle:

- \`#status\` shows \`Loading…\` while in flight
- on failure it shows \`Error: <message>\` and \`#retry\` becomes visible (\`hidden = false\`)
- on success with items, \`#list\` fills and \`#status\` empties
- on success with no items, \`#status\` shows \`No items\`
- the retry button reloads

The check exercises the failure path, the retry and the success path in turn.`,
    starterCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #0d1117; color: #c9d1d9; font-family: sans-serif; padding: 20px; }
    ul { list-style: none; padding: 0; max-width: 340px; }
    li { padding: 10px 14px; background: #161b22; border-radius: 6px; margin-bottom: 6px; }
    #status { color: #8b949e; margin: 12px 0; }
    button { background: #1f6feb; color: white; border: 0; border-radius: 6px; padding: 8px 16px; cursor: pointer; }
  </style>
</head>
<body>
  <h1>Items</h1>
  <div id="status"></div>
  <button id="retry" hidden>Retry</button>
  <ul id="list"></ul>

  <script>
    // Provided fake API
    const fakeApi = {
      shouldFail: true,
      items: ["Alpha", "Beta", "Gamma"],
      load() {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (fakeApi.shouldFail) reject(new Error("Network down"));
            else resolve(fakeApi.items);
          }, 200);
        });
      },
    };

    const statusEl = document.querySelector("#status");
    const listEl = document.querySelector("#list");
    const retryEl = document.querySelector("#retry");

    let state = { status: "idle", items: [], error: null };

    function render() {
      // branch on state.status and fill in the four cases
    }

    async function load() {
      // set loading, await fakeApi.load(), handle success and failure
    }

    retryEl.addEventListener("click", load);

    load();
  </script>
</body>
</html>
`,
    webCheck:
      "(function(){var s=document.querySelector('#status');var r=document.querySelector('#retry');var l=document.querySelector('#list');if(!s||!r||!l)return false;if(typeof state==='undefined'||typeof load!=='function')return false;return new Promise(function(res){setTimeout(function(){if(s.textContent.indexOf('Error')===-1||r.hidden!==false){res(false);return;}fakeApi.shouldFail=false;r.click();if(s.textContent.indexOf('Loading')===-1){res(false);return;}setTimeout(function(){res(l.querySelectorAll('li').length===3&&s.textContent.trim()==='');},400);},400);});})()",
    hints: [
      'The check waits for the timers, so you do not need to make anything faster — just drive the states correctly.',
      '`render` should always start by clearing: `listEl.innerHTML = ""` and `retryEl.hidden = true`, then set what the current status needs.',
      'In `load`, set `{ status: "loading" }` before the await and use try/catch around it for the two outcomes.',
    ],
    solution: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #0d1117; color: #c9d1d9; font-family: sans-serif; padding: 20px; }
    ul { list-style: none; padding: 0; max-width: 340px; }
    li { padding: 10px 14px; background: #161b22; border-radius: 6px; margin-bottom: 6px; }
    #status { color: #8b949e; margin: 12px 0; }
    button { background: #1f6feb; color: white; border: 0; border-radius: 6px; padding: 8px 16px; cursor: pointer; }
  </style>
</head>
<body>
  <h1>Items</h1>
  <div id="status"></div>
  <button id="retry" hidden>Retry</button>
  <ul id="list"></ul>

  <script>
    const fakeApi = {
      shouldFail: true,
      items: ["Alpha", "Beta", "Gamma"],
      load() {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (fakeApi.shouldFail) reject(new Error("Network down"));
            else resolve(fakeApi.items);
          }, 200);
        });
      },
    };

    const statusEl = document.querySelector("#status");
    const listEl = document.querySelector("#list");
    const retryEl = document.querySelector("#retry");

    let state = { status: "idle", items: [], error: null };

    function setState(changes) {
      state = { ...state, ...changes };
      render();
    }

    function render() {
      listEl.innerHTML = "";
      retryEl.hidden = true;
      statusEl.textContent = "";

      if (state.status === "loading") {
        statusEl.textContent = "Loading…";
        return;
      }

      if (state.status === "error") {
        statusEl.textContent = "Error: " + state.error;
        retryEl.hidden = false;
        return;
      }

      if (state.status === "success" && state.items.length === 0) {
        statusEl.textContent = "No items";
        return;
      }

      for (const item of state.items) {
        const li = document.createElement("li");
        li.textContent = item;
        listEl.append(li);
      }
    }

    async function load() {
      setState({ status: "loading", error: null, items: [] });
      try {
        const items = await fakeApi.load();
        setState({ status: "success", items });
      } catch (err) {
        setState({ status: "error", error: err.message });
      }
    }

    retryEl.addEventListener("click", load);

    load();
  </script>
</body>
</html>
`,
  },
  {
    id: 'fe-05-quiz',
    title: 'Checkpoint: Browsers and Accessibility',
    language: 'javascript',
    kind: 'quiz',
    module: 'Building Interfaces',
    difficulty: 3,
    concepts: ['accessibility', 'performance', 'semantics', 'review'],
    instructions: `Accessibility questions appear in front-end interviews far more often than candidates expect, and the answers overlap heavily with just writing correct HTML.`,
    quiz: [
      {
        id: 'q1',
        prompt: 'You need a clickable control. What should you use?',
        choices: [
          'A div with an onclick handler',
          'A <button>',
          'A span with role="button"',
          'An <a href="#">',
        ],
        answerIndex: 1,
        explanation:
          'A real button. You get keyboard focus, Enter and Space activation, the correct role for screen readers and browser defaults for free. A clickable div needs tabindex, key handlers and ARIA to reach the same place — and usually only gets one of the three.',
      },
      {
        id: 'q2',
        prompt: 'Why prefer `textContent` over `innerHTML` for user-supplied text?',
        choices: [
          'It is shorter to type',
          'innerHTML parses HTML, so injected markup and scripts can run',
          'textContent supports more characters',
          'There is no difference',
        ],
        answerIndex: 1,
        explanation:
          'Cross-site scripting. `innerHTML` parses the string as markup, so a comment containing a tag becomes live HTML. `textContent` guarantees text stays text. It is also faster, since nothing has to be parsed.',
      },
      {
        id: 'q3',
        prompt: 'A list of 500 items, each with its own click listener. What is the better approach?',
        choices: [
          'It is fine as is',
          'One delegated listener on the container, using event.target.closest',
          'Remove the listeners on scroll',
          'Use inline onclick attributes',
        ],
        answerIndex: 1,
        explanation:
          'Delegation. One listener instead of 500 uses less memory, needs no cleanup, and automatically covers items added later. Events bubble to the container, and `closest` identifies which item was hit.',
      },
      {
        id: 'q4',
        prompt: 'What does an `alt` attribute on an image do?',
        choices: [
          'Shows a tooltip on hover',
          'Describes the image for screen readers and when it fails to load',
          'Improves image quality',
          'Sets the caption',
        ],
        answerIndex: 1,
        explanation:
          'It is the text alternative — read by screen readers, shown when the image fails, and indexed by search engines. Purely decorative images should have `alt=""` so assistive technology skips them rather than announcing a filename.',
      },
      {
        id: 'q5',
        prompt: 'Which state does a data-loading component most often forget?',
        choices: ['Success', 'Loading', 'Error and empty', 'None — two states is enough'],
        answerIndex: 2,
        explanation:
          'Error and empty. Success and often loading get built; a failed request leaving a blank screen forever, and "no results" looking identical to "broken", are the classic omissions. Enumerating all four states is a habit worth making automatic.',
      },
      {
        id: 'q6',
        prompt: 'Why does modelling UI as `state → render` beat patching the DOM in each handler?',
        choices: [
          'It is faster in every case',
          'The screen cannot disagree with the data, because it is derived from it',
          'It uses less memory',
          'It avoids needing CSS',
        ],
        answerIndex: 1,
        explanation:
          'One source of truth. When every handler only changes data and a single function derives the interface, whole categories of "these two parts of the page disagree" bugs stop existing. Re-rendering everything is not always faster, which is precisely the problem frameworks solve with diffing.',
      },
    ],
  },
];
