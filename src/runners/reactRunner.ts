import { transform } from 'sucrase';

/**
 * React lessons run the real library.
 *
 * JSX is compiled with Sucrase (already used for TypeScript) in classic mode,
 * so it emits `React.createElement` calls that resolve against the UMD global.
 * React and ReactDOM are inlined into the generated document rather than
 * fetched from a CDN, which keeps lessons working offline and keeps the
 * iframe's `sandbox="allow-scripts"` restriction intact.
 *
 * The development builds are used on purpose: React's warnings — missing
 * `key`, invalid hook calls, updates on unmounted components — are a large
 * part of what makes React learnable, and one lesson grades against them.
 */

export interface BuiltDocument {
  html: string | null;
  error: string | null;
}

/** Compiles JSX to JavaScript. Syntax errors come back as a message. */
export function transformJsx(code: string): { js: string | null; error: string | null } {
  try {
    return {
      js: transform(code, { transforms: ['jsx'], jsxRuntime: 'classic' }).code,
      error: null,
    };
  } catch (err: any) {
    return { js: null, error: 'JSX syntax error: ' + (err?.message ?? String(err)) };
  }
}

const BASE_STYLES = `
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 20px;
    background: #0d1117;
    color: #c9d1d9;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 15px;
    line-height: 1.5;
  }
  button {
    font: inherit;
    padding: 8px 14px;
    border-radius: 6px;
    border: 1px solid #30363d;
    background: #21262d;
    color: #c9d1d9;
    cursor: pointer;
  }
  button:hover { background: #30363d; }
  input, select, textarea {
    font: inherit;
    padding: 7px 10px;
    border-radius: 6px;
    border: 1px solid #30363d;
    background: #0d1117;
    color: #c9d1d9;
  }
  ul { padding-left: 20px; }
  h1 { font-size: 22px; }
  h2 { font-size: 18px; }
  .codelab-error {
    white-space: pre-wrap;
    background: #f8514922;
    border: 1px solid #f85149;
    border-radius: 6px;
    padding: 12px;
    color: #ffa198;
    font-family: ui-monospace, Menlo, monospace;
    font-size: 13px;
  }
`;

/**
 * Assembles the page. Kept pure and separate from the dynamic imports below
 * so the Playwright suite can build the same document in Node.
 */
export function reactDocument(parts: {
  react: string;
  reactDom: string;
  js: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>${BASE_STYLES}</style>
</head>
<body>
  <div id="root"></div>

  <script>
    // The preview iframe is sandboxed without allow-same-origin, so touching
    // localStorage throws a SecurityError. React's development build and any
    // lesson that stores state would both trip over it, so swap in an
    // in-memory stand-in with the same API before anything else runs.
    (function () {
      // Detect the sandbox without touching localStorage: merely reading the
      // property throws, and Chromium reports that as an uncaught error even
      // when it is caught here.
      var sandboxed = true;
      try { sandboxed = window.origin === 'null' || document.origin === 'null'; }
      catch (e) { sandboxed = true; }
      if (!sandboxed) return;

      var data = {};
      var memory = {
        getItem: function (k) { return Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null; },
        setItem: function (k, v) { data[k] = String(v); },
        removeItem: function (k) { delete data[k]; },
        clear: function () { data = {}; },
        key: function (i) { return Object.keys(data)[i] ?? null; },
        get length() { return Object.keys(data).length; },
      };
      try {
        Object.defineProperty(window, 'localStorage', { value: memory, configurable: true });
        Object.defineProperty(window, 'sessionStorage', { value: memory, configurable: true });
      } catch (e) { /* nothing more we can do */ }
    })();

    // React's warnings are the lesson in several cases, so keep them readable.
    window.__reactWarnings = [];
    (function () {
      var realError = console.error;
      console.error = function () {
        try {
          window.__reactWarnings.push(
            Array.prototype.map.call(arguments, String).join(' ')
          );
        } catch (e) { /* ignore */ }
        realError.apply(console, arguments);
      };
    })();

    // Interval bookkeeping, so a lesson can grade whether an effect actually
    // cleaned up after itself — the most-skipped half of useEffect, and not
    // otherwise observable from the DOM.
    window.__timers = { active: 0 };
    (function () {
      var realSet = window.setInterval;
      var realClear = window.clearInterval;
      window.setInterval = function () {
        window.__timers.active++;
        return realSet.apply(window, arguments);
      };
      window.clearInterval = function (id) {
        if (id !== undefined && id !== null) window.__timers.active--;
        return realClear.call(window, id);
      };
    })();

  <\/script>

  <script>${parts.react}<\/script>
  <script>${parts.reactDom}<\/script>

  <script>
    // Pre-imported so lesson code reads the way real code does. In a project
    // these come from: import { useState } from "react";
    const { useState, useEffect, useRef, useMemo, useCallback, useReducer,
            useContext, createContext, memo, Fragment } = React;
  <\/script>

  <script>${parts.js}<\/script>

  <script>
    (function () {
      var container = document.getElementById('root');

      function showError(message) {
        var pre = document.createElement('pre');
        pre.className = 'codelab-error';
        pre.textContent = String(message);
        container.innerHTML = '';
        container.appendChild(pre);
      }

      // Without a boundary, a render error leaves a blank white box and the
      // learner has nothing to go on.
      class __Boundary extends React.Component {
        constructor(props) {
          super(props);
          this.state = { error: null };
        }
        static getDerivedStateFromError(error) {
          return { error: error };
        }
        render() {
          if (this.state.error) {
            return React.createElement(
              'pre',
              { className: 'codelab-error' },
              String(this.state.error.message || this.state.error)
            );
          }
          return this.props.children;
        }
      }

      try {
        if (typeof App === 'undefined') {
          throw new Error(
            'No component called App was found. Lessons render <App />, so name your top-level component App.'
          );
        }
        window.__root = ReactDOM.createRoot(container);
        window.__root.render(
          React.createElement(__Boundary, null, React.createElement(App))
        );
      } catch (err) {
        showError((err && err.message) || err);
      }

      // Only surface an uncaught error when nothing rendered — otherwise a
      // stray error from a library would blank a working page.
      window.addEventListener('error', function (event) {
        if (container.childElementCount === 0) showError(event.message);
      });
    })();
  <\/script>
</body>
</html>`;
}

let cached: { react: string; reactDom: string } | null = null;

/**
 * React is ~1.2MB of development build, so it is a dynamic import: Vite emits
 * it as its own chunk that downloads the first time a React lesson is opened
 * and never touches the main bundle.
 *
 * The paths are relative on purpose. React's package.json `exports` map does
 * not expose `./umd/*`, so the package specifier is unresolvable, and routing
 * around it with a `resolve.alias` that carries `?raw` made Vite execute the
 * UMD build as a module instead of handing back its text.
 */
async function loadReactSources(): Promise<{ react: string; reactDom: string }> {
  if (cached) return cached;
  const [react, reactDom] = await Promise.all([
    import('../../node_modules/react/umd/react.development.js?raw'),
    import('../../node_modules/react-dom/umd/react-dom.development.js?raw'),
  ]);
  cached = { react: react.default, reactDom: reactDom.default };
  return cached;
}

export async function buildReactDocument(code: string): Promise<BuiltDocument> {
  const { js, error } = transformJsx(code);
  if (error || js === null) return { html: null, error };

  try {
    const sources = await loadReactSources();
    return { html: reactDocument({ ...sources, js }), error: null };
  } catch (err: any) {
    return {
      html: null,
      error: 'Could not load React: ' + (err?.message ?? String(err)),
    };
  }
}
