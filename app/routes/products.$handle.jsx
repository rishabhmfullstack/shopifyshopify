import { useLoaderData } from 'react';
import { useState } from 'react';
import { getProductByHandle, POLY_BARK_PRODUCTS } from '~/lib/poly-bark-catalog';
import { useStorefront } from '~/components/PageLayout';
import { RoomVisualizerModal } from '~/components/RoomVisualizerModal';
import { ProductCard } from '~/components/ProductCard';

export const meta = ({ data }) => {
  const product = data?.product || POLY_BARK_PRODUCTS[0];
  return [
    { title: `${product.title} | Poly & Bark Hydrogen Storefront` },
    { name: 'description', content: product.description },
  ];
};

export async function loader({ params }) {
  const product = getProductByHandle(params.handle);
  const relatedProducts = POLY_BARK_PRODUCTS.filter((p) => p.handle !== product.handle).slice(0, 3);

  return {
    product,
    relatedProducts,
    cachePolicy: 'CacheShort(s-maxage=1, stale-while-revalidate=60)',
  };
}

export default function ProductRoute() {
  const { product, relatedProducts } = useLoaderData();
  const { addToCart, openSwatchModal } = useStorefront();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('specs');
  const [showVisualizer, setShowVisualizer] = useState(false);

  const currentVariant = product.variants?.nodes?.[selectedVariantIndex] || product.variants?.nodes?.[0];
  const images = product.images?.nodes || [product.featuredImage];

  const price = currentVariant?.price?.amount || product.priceRange?.minVariantPrice?.amount;
  const compareAtPrice = currentVariant?.compareAtPrice?.amount;

  return (
    <div style={{ background: 'var(--color-sand)', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="pdp-grid">
        {/* Gallery Column */}
        <div className="pdp-gallery">
          <div className="pdp-main-image">
            <img
              src={images[selectedImageIndex]?.url || product.featuredImage?.url}
              alt={images[selectedImageIndex]?.altText || product.title}
            />
          </div>

          {images.length > 1 && (
            <div className="pdp-thumbnails">
              {images.map((img, idx) => (
                <div
                  key={img.id || idx}
                  className={`pdp-thumb ${selectedImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(idx)}
                >
                  <img src={img.url} alt={img.altText || ''} />
                </div>
              ))}
            </div>
          )}

          {/* Visualizer Banner CTA */}
          <div
            style={{
              background: '#fff',
              border: '1px solid var(--color-sand-dark)',
              padding: '1.25rem',
              borderRadius: '6px',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              marginTop: '1rem',
            }}
          >
            <div>
              <h4 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>
                Visualize in 3D Living Room
              </h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>
                Test spatial scale and leather finish in realistic room backgrounds.
              </p>
            </div>
            <button
              onClick={() => setShowVisualizer(true)}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.6rem 1.2rem', minWidth: 'fit-content' }}
            >
              Launch 👁️
            </button>
          </div>
        </div>

        {/* Product Details & Selection Column */}
        <div>
          {product.badge && (
            <span
              style={{
                display: 'inline-block',
                background: 'var(--color-cognac)',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '0.3rem 0.8rem',
                borderRadius: '2px',
                marginBottom: '0.75rem',
              }}
            >
              {product.badge}
            </span>
          )}

          <h1 className="pdp-title">{product.title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#d4a359' }}>
            ★★★★★ <span style={{ fontSize: '0.85rem', color: '#666' }}>({product.reviewCount} customer reviews)</span>
          </div>

          {/* Price */}
          <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-dark)' }}>
            ${parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            {compareAtPrice && (
              <s style={{ color: '#888', fontWeight: 400, fontSize: '1.2rem', marginLeft: '0.75rem' }}>
                ${parseFloat(compareAtPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </s>
            )}
          </div>

          <p style={{ color: '#444', lineHeight: 1.7, fontSize: '1rem', marginBottom: '2rem' }}>
            {product.description}
          </p>

          {/* Leather / Finish Swatches Selector */}
          {product.variants?.nodes?.length > 1 && (
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '0.75rem' }}>
                Leather / Finish Color: <span style={{ color: 'var(--color-cognac)' }}>{currentVariant?.selectedOptions?.[0]?.value || currentVariant?.title}</span>
              </label>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {product.variants.nodes.map((variant, idx) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantIndex(idx)}
                    style={{
                      border: `2px solid ${selectedVariantIndex === idx ? 'var(--color-cognac)' : '#ddd'}`,
                      background: selectedVariantIndex === idx ? 'var(--color-cognac-light)' : '#fff',
                      padding: '0.6rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                    }}
                  >
                    <span
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: variant.swatchHex || '#B86B35',
                      }}
                    />
                    {variant.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Key Specs Bar */}
          <div className="pdp-metafield-bar">
            {product.metafields?.map((m) => (
              <div key={m.key} className="pdp-metafield-item">
                <span className="label">{m.key.replace('_', ' ')}</span>
                <span className="value">{m.value}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <button
              onClick={() => addToCart(product, currentVariant)}
              className="btn-primary"
              style={{ flex: 2, minWidth: '220px', padding: '1.1rem 2rem', fontSize: '1rem' }}
            >
              Add to Cart — ${parseFloat(price).toFixed(0)}
            </button>

            <button
              onClick={openSwatchModal}
              className="btn-secondary"
              style={{ flex: 1, minWidth: '180px', padding: '1.1rem 1rem', fontSize: '0.85rem' }}
            >
              Free Swatch Kit 📦
            </button>
          </div>

          {/* Delivery & Guarantee Accordion */}
          <div style={{ border: '1px solid var(--color-sand-dark)', borderRadius: '6px', overflow: 'hidden', background: '#fff' }}>
            <div
              onClick={() => setActiveTab(activeTab === 'specs' ? '' : 'specs')}
              style={{ padding: '1rem 1.25rem', cursor: 'pointer', borderBottom: '1px solid #eee', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}
            >
              <span>Dimensions & Structural Specs</span>
              <span>{activeTab === 'specs' ? '−' : '+'}</span>
            </div>
            {activeTab === 'specs' && (
              <div style={{ padding: '1.25rem', fontSize: '0.9rem', color: '#555', lineHeight: 1.6 }}>
                • Overall Dimensions: 88.5" W x 38" D x 32" H<br />
                • Seat Height: 19" | Seat Depth: 24"<br />
                • Frame: Corner-blocked kiln-dried Eucalyptus hardwood<br />
                • Suspension: Pirelli webbing & pocket spring core
              </div>
            )}

            <div
              onClick={() => setActiveTab(activeTab === 'care' ? '' : 'care')}
              style={{ padding: '1rem 1.25rem', cursor: 'pointer', borderBottom: '1px solid #eee', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}
            >
              <span>Italian Leather Care Guide</span>
              <span>{activeTab === 'care' ? '−' : '+'}</span>
            </div>
            {activeTab === 'care' && (
              <div style={{ padding: '1.25rem', fontSize: '0.9rem', color: '#555', lineHeight: 1.6 }}>
                Apply leather conditioner every 6 months to maintain supple oil balance. Wipe spills immediately with a clean, dry microfiber cloth. Avoid direct long-term sunlight.
              </div>
            )}

            <div
              onClick={() => setActiveTab(activeTab === 'shipping' ? '' : 'shipping')}
              style={{ padding: '1rem 1.25rem', cursor: 'pointer', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}
            >
              <span>White-Glove Shipping & 100-Day Trial</span>
              <span>{activeTab === 'shipping' ? '−' : '+'}</span>
            </div>
            {activeTab === 'shipping' && (
              <div style={{ padding: '1.25rem', fontSize: '0.9rem', color: '#555', lineHeight: 1.6 }}>
                Orders over $999 include complimentary White-Glove in-home placement, assembly, and packaging removal. Try it in your home for 100 days.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* You May Also Like */}
      {relatedProducts.length > 0 && (
        <section style={{ maxWidth: '1300px', margin: '4rem auto 0', padding: '0 2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '2rem' }}>
            Complete Your Room
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} onQuickAdd={addToCart} />
            ))}
          </div>
        </section>
      )}

      <RoomVisualizerModal
        product={product}
        isOpen={showVisualizer}
        onClose={() => setShowVisualizer(false)}
      />
    </div>
  );
}
