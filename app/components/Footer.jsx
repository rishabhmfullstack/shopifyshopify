import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="footer" style={{ background: 'var(--color-dark)', color: '#fff', padding: '4rem 2rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-cognac)', marginBottom: '1rem' }}>POLY & BARK</h3>
          <p style={{ fontSize: '0.85rem', color: '#aaa', lineHeight: 1.6 }}>
            Headless Shopify storefront built with Hydrogen & Remix Oxygen edge runtime. Delivering Italian full-grain leather furniture straight to modern homes.
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Shop Collections</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li><Link to="/collections/living-room" style={{ color: '#ccc', textDecoration: 'none' }}>Living Room Sofas</Link></li>
            <li><Link to="/collections/cognac-leather" style={{ color: '#ccc', textDecoration: 'none' }}>Italian Cognac Leather</Link></li>
            <li><Link to="/collections/dining" style={{ color: '#ccc', textDecoration: 'none' }}>Solid Walnut Dining</Link></li>
            <li><Link to="/products/napa-cognac-leather-sofa" style={{ color: '#ccc', textDecoration: 'none' }}>Napa Leather Sofa</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>The Poly Guarantee</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: '#ccc', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li>✓ 100-Day In-Home Trial</li>
            <li>✓ 10-Year Structural Frame Warranty</li>
            <li>✓ Free White-Glove Shipping over $999</li>
            <li>✓ Direct Italian Leather Tannery Sourcing</li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Hydrogen Architecture</h4>
          <p style={{ fontSize: '0.8rem', color: '#888' }}>
            Powered by Shopify Storefront API GraphQL & Oxygen Workers Edge Runtime.
          </p>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'monospace', color: '#10B981', marginTop: '0.5rem' }}>
            ● Edge Node: IAD-OXYGEN-V2
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '3rem auto 0', borderTop: '1px solid #333', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: '#777' }}>
        <span>© {new Date().getFullYear()} Poly & Bark. Headless Hydrogen Storefront.</span>
        <span>Storefront API 2026-04 • Hydrogen Remix Edge</span>
      </div>
    </footer>
  );
}
