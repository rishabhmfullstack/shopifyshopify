import { useLoaderData, Link } from 'react-router';
import { useState } from 'react';
import { ProductCard } from '~/components/ProductCard';
import { RoomVisualizerModal } from '~/components/RoomVisualizerModal';
import { useStorefront } from '~/components/PageLayout';
import { POLY_BARK_PRODUCTS, POLY_BARK_COLLECTIONS } from '~/lib/poly-bark-catalog';

export const meta = () => {
  return [
    { title: 'Poly & Bark | Headless Shopify Storefront (Hydrogen & Oxygen)' },
    { name: 'description', content: 'Explore handcrafted Italian cognac leather sofas, armchairs, and solid walnut dining tables built on Shopify Hydrogen 2.0 and Oxygen Workers runtime.' },
  ];
};

export async function loader({ context }) {
  // Simulating Hydrogen storefront query with CacheShort strategy
  const cacheControlHeader = 'public, max-age=1, stale-while-revalidate=60';

  return {
    products: POLY_BARK_PRODUCTS,
    collections: POLY_BARK_COLLECTIONS,
    hydrogenInfo: {
      loaderTimeMs: 14,
      cacheControl: cacheControlHeader,
    },
  };
}

export default function Homepage() {
  const { products, collections } = useLoaderData();
  const { addToCart, openSwatchModal } = useStorefront();
  const [visualizerProduct, setVisualizerProduct] = useState(null);

  const heroProduct = products[0]; // Napa Cognac Leather Sofa

  return (
    <div className="home-page">
      {/* DTC Hero Banner */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1800&q=85')`,
        }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-tag">Signature Aniline Leather</span>
          <h1 className="hero-title">Crafted for Living. Built for Life.</h1>
          <p className="hero-description">
            handcrafted with pure full-grain Italian leather that ages gracefully over time. Direct from tanneries to your living room.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/products/napa-cognac-leather-sofa" className="btn-primary">
              Explore Napa Sofa — $1,899
            </Link>
            <button
              onClick={() => setVisualizerProduct(heroProduct)}
              className="btn-secondary"
              style={{ borderColor: '#fff', color: '#fff' }}
            >
              3D Room Visualizer 👁️
            </button>
          </div>
        </div>
      </section>

      {/* Guarantee Bar */}
      <div className="guarantee-bar">
        <div className="guarantee-item">
          <h4>📦 Free White-Glove Delivery</h4>
          <p>On all living room orders over $999</p>
        </div>
        <div className="guarantee-item">
          <h4>🛋️ 100-Day In-Home Trial</h4>
          <p>Love it in your home or return it hassle-free</p>
        </div>
        <div className="guarantee-item">
          <h4>🇮🇹 Full-Grain Italian Leather</h4>
          <p>Ethically sourced from Vicenza tanneries</p>
        </div>
        <div className="guarantee-item">
          <h4>🛡️ 10-Year Frame Warranty</h4>
          <p>Kiln-dried solid hardwood construction</p>
        </div>
      </div>

      {/* Featured Furniture Collection */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ color: 'var(--color-cognac)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Best Sellers Collection
            </span>
            <h2 style={{ fontSize: '2.4rem', margin: '0.2rem 0 0 0', fontFamily: 'var(--font-serif)' }}>
              Italian Leather & Solid Walnut
            </h2>
          </div>

          <button
            onClick={openSwatchModal}
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}
          >
            Request Free Leather Swatches 📦
          </button>
        </div>

        {/* Product Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickAdd={(p, v) => addToCart(p, v)}
            />
          ))}
        </div>
      </section>

      {/* Cognac Leather Highlight Section */}
      <section style={{ background: 'var(--color-charcoal)', color: '#fff', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--color-cognac)', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
              The Poly & Bark Sourcing Standard
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', margin: '0.5rem 0 1.2rem 0', lineHeight: 1.15 }}>
              Full-Grain Italian Aniline Leather
            </h2>
            <p style={{ color: '#ccc', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem', fontWeight: 300 }}>
              Unlike bonded or top-grain leathers treated with heavy artificial finishes, our full-grain aniline leather retains natural markings and warmth. As light hits the surface, it develops a deep, lustrous patina that tells your story.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div>
                <h3 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-cognac)' }}>100%</h3>
                <span style={{ fontSize: '0.8rem', color: '#aaa', textTransform: 'uppercase' }}>Full-Grain Hide</span>
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-cognac)' }}>10 Yr</h3>
                <span style={{ fontSize: '0.8rem', color: '#aaa', textTransform: 'uppercase' }}>Frame Warranty</span>
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-cognac)' }}>4.9 ★</h3>
                <span style={{ fontSize: '0.8rem', color: '#aaa', textTransform: 'uppercase' }}>Customer Rating</span>
              </div>
            </div>

            <Link to="/collections/cognac-leather" className="btn-primary" style={{ background: 'var(--color-cognac)', borderColor: 'var(--color-cognac)' }}>
              Shop Cognac Leather Series
            </Link>
          </div>

          <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <img
              src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1000&q=80"
              alt="Italian Cognac Leather sofa detail"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      </section>

      {/* Spatial Room Visualizer Banner */}
      <section style={{ padding: '5rem 2rem', background: 'var(--color-sand)', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-cognac)', fontWeight: 600 }}>
            Hydrogen Spatial View
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', margin: '0.5rem 0 1rem' }}>
            Unsure how it looks in your space?
          </h2>
          <p style={{ fontSize: '1rem', color: '#666', marginBottom: '2rem' }}>
            Test furniture scale and finish color directly inside realistic 3D living room environments before ordering.
          </p>
          <button
            onClick={() => setVisualizerProduct(heroProduct)}
            className="btn-primary"
            style={{ padding: '1rem 2.5rem' }}
          >
            Launch Interactive Room Visualizer 👁️
          </button>
        </div>
      </section>

      <RoomVisualizerModal
        product={visualizerProduct}
        isOpen={Boolean(visualizerProduct)}
        onClose={() => setVisualizerProduct(null)}
      />
    </div>
  );
}
