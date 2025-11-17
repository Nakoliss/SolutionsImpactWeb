export default function TestMiddlewarePage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Middleware Test Page</h1>
      <p>If you can see this page, middleware is NOT redirecting.</p>
      <p>Current URL: <span id="url"></span></p>
      <script dangerouslySetInnerHTML={{__html: `
        if (typeof window !== 'undefined') {
          document.getElementById('url').textContent = window.location.href;
        }
      `}} />
    </div>
  );
}

