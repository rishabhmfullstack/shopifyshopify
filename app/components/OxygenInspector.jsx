import {useState, useEffect} from 'react';

export function OxygenInspector({loaderLatency = 16, cachePolicy = 'CacheShort (max-age=1s, stale-while-revalidate=60s)', queryName = 'PRODUCT_QUERY'}) {
  const [isOpen, setIsOpen] = useState(false);
  const [latency, setLatency] = useState(loaderLatency);

  useEffect(() => {
    // Simulate real edge latency fluctuations
    const interval = setInterval(() => {
      setLatency(Math.floor(12 + Math.random() * 8));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="oxygen-inspector">
      {isOpen && (
        <div className="oxygen-inspector-panel">
          <div className="oxygen-inspector-header">
            <h4>
              <span className="pulse-dot"></span> Oxygen Edge Inspector
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              style={{background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '1rem'}}
            >
              ✕
            </button>
          </div>

          <div style={{fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem'}}>
            Live developer HUD demonstrating Hydrogen loader sub-requests and Oxygen runtime edge caching.
          </div>

          <div className="oxygen-metric">
            <span>Loader TTFB / Edge Latency:</span>
            <span className="oxygen-metric-tag" style={{color: '#34d399', background: 'rgba(52,211,153,0.1)'}}>
              {latency}ms
            </span>
          </div>

          <div className="oxygen-metric">
            <span>Caching Primitives:</span>
            <span className="oxygen-metric-tag">{cachePolicy}</span>
          </div>

          <div className="oxygen-metric">
            <span>Response Header:</span>
            <span style={{fontSize: '0.7rem', color: '#f59e0b', fontFamily: 'monospace'}}>
              Cache-Control: public, s-maxage=3600
            </span>
          </div>

          <div className="oxygen-metric">
            <span>Storefront API Endpoint:</span>
            <span style={{fontSize: '0.7rem', color: '#60a5fa'}}>
              graphql/2026-04
            </span>
          </div>

          <div className="oxygen-metric">
            <span>GraphQL Query Executed:</span>
            <span style={{color: '#a78bfa'}}>{queryName}</span>
          </div>

          <div style={{marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.7rem', color: '#64748b'}}>
            ✔ Hydrogen 2.0 • Remix React-Router 7 • Edge Sub-request Cache Hit
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="oxygen-inspector-toggle"
      >
        <span className="pulse-dot"></span>
        <span>Oxygen Edge Inspector</span>
        <span style={{background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem'}}>
          {latency}ms
        </span>
      </button>
    </div>
  );
}
