import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { T } from '../lib/theme';

export interface WebPreviewHandle {
  /** Render the HTML document and optionally evaluate a check expression.
      Resolves true if the check passes (or when there is no check). */
  run: (html: string, check?: string) => Promise<boolean>;
}

/** Some checks drive timers before answering, so they are allowed to be async. */
const CHECK_TIMEOUT_MS = 6000;

const WebPreview = forwardRef<WebPreviewHandle>(function WebPreview(_props, ref) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<'idle' | 'pass' | 'fail'>('idle');

  useImperativeHandle(ref, () => ({
    run(html: string, check?: string) {
      return new Promise<boolean>((resolve) => {
        const iframe = iframeRef.current;
        if (!iframe) return resolve(false);

        const checkId = 'chk_' + Date.now() + '_' + Math.random().toString(36).slice(2);

        // The check may return a boolean or a promise of one. Promise.resolve
        // normalises both, so a lesson can wait for its own timers before
        // reporting.
        const harness = check
          ? `<script>
              window.addEventListener('load', function () {
                setTimeout(function () {
                  var report = function (ok) {
                    parent.postMessage({ codeLabCheck: '${checkId}', ok: !!ok }, '*');
                  };
                  try {
                    Promise.resolve((function () { return (${check}); })())
                      .then(report, function () { report(false); });
                  } catch (e) {
                    report(false);
                  }
                }, 300);
              });
            <\/script>`
          : '';

        let timer: number | undefined;

        const onMessage = (e: MessageEvent) => {
          if (e.data?.codeLabCheck !== checkId) return;
          window.removeEventListener('message', onMessage);
          clearTimeout(timer);
          setStatus(e.data.ok ? 'pass' : 'fail');
          resolve(e.data.ok);
        };

        if (check) {
          window.addEventListener('message', onMessage);
          timer = window.setTimeout(() => {
            window.removeEventListener('message', onMessage);
            setStatus('fail');
            resolve(false);
          }, CHECK_TIMEOUT_MS);
        } else {
          setStatus('idle');
        }

        iframe.srcdoc = html + harness;
        if (!check) resolve(true);
      });
    },
  }));

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 8,
        overflow: 'hidden',
        border:
          status === 'pass'
            ? `2px solid ${T.green}`
            : status === 'fail'
              ? `2px solid ${T.red}`
              : `1px solid ${T.border}`,
        background: '#fff',
      }}
    >
      <iframe
        ref={iframeRef}
        title="preview"
        sandbox="allow-scripts"
        style={{ flex: 1, border: 'none', width: '100%' }}
        srcDoc="<body style='margin:0;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#8b949e;background:#0d1117'>Hit Run to render your page</body>"
      />
    </div>
  );
});

export default WebPreview;
