import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

export interface WebPreviewHandle {
  /** Render the given HTML document and optionally run a check expression.
      Resolves true if the check passes (or no check given). */
  run: (html: string, check?: string) => Promise<boolean>;
}

const CHECK_TIMEOUT_MS = 1500;

const WebPreview = forwardRef<WebPreviewHandle>(function WebPreview(
  _props,
  ref
) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<'idle' | 'pass' | 'fail'>('idle');

  useImperativeHandle(ref, () => ({
    run(html: string, check?: string) {
      return new Promise<boolean>((resolve) => {
        const iframe = iframeRef.current;
        if (!iframe) return resolve(false);

        const checkId = 'chk_' + Date.now();

        const harness = check
          ? `<script>
              window.addEventListener('load', function () {
                setTimeout(function () {
                  var ok = false;
                  try { ok = !!(function(){ return (${check}); })(); }
                  catch (e) { ok = false; }
                  parent.postMessage({ codeLabCheck: '${checkId}', ok: ok }, '*');
                }, 300);
              });
            <\/script>`
          : '';

        const onMessage = (e: MessageEvent) => {
          if (e.data?.codeLabCheck !== checkId) return;
          window.removeEventListener('message', onMessage);
          clearTimeout(timer);
          setStatus(e.data.ok ? 'pass' : 'fail');
          resolve(e.data.ok);
        };

        let timer: number | undefined;
        if (check) {
          window.addEventListener('message', onMessage);
          timer = window.setTimeout(() => {
            window.removeEventListener('message', onMessage);
            setStatus('fail');
            resolve(false);
          }, CHECK_TIMEOUT_MS + 2000);
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
            ? '2px solid #3fb950'
            : status === 'fail'
              ? '2px solid #f85149'
              : '1px solid #30363d',
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
