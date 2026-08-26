import { useFetcher, Link } from 'react-router';
import { useState } from 'react';

export function CartDrawer({ isOpen, onClose, cartItems = [], onUpdateQuantity, onRemoveItem }) {
  const [hasWhiteGlove, setHasWhiteGlove] = useState(true);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price || item.variant?.price?.amount || '0');
    return sum + price * (item.quantity || 1);
  }, 0);

  const whiteGloveCost = hasWhiteGlove ? 99 : 0;
  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  return (
    <div className={`overlay ${isOpen ? 'expanded' : ''}`} style={{ zIndex: 99999 }}>
      <div className="close-outside" onClick={onClose} />
      <aside style={{ display: 'flex', flexDirection: 'column' }}>
        <header>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem' }}>Your Cart ({cartItems.reduce((a, b) => a + b.quantity, 0)})</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
        </header>

        {/* Free Delivery Bar */}
        <div style={{ background: 'var(--color-sand)', padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--color-sand-dark)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-dark)', display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span>
              {remainingForFreeShipping <= 0
                ? '🎉 You unlocked FREE White-Glove Delivery!'
                : `Add $${remainingForFreeShipping.toFixed(0)} more for Free White-Glove Delivery`}
            </span>
            <span>{progressPercent.toFixed(0)}%</span>
          </div>
          <div style={{ height: '6px', width: '100%', background: '#e0dbd3', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--color-cognac)', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* Cart Items List */}
        <main className="cart-main" style={{ flexGrow: 1, padding: '1rem 1.25rem', overflowY: 'auto' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛋️</div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Your cart is currently empty.</h4>
              <p style={{ fontSize: '0.85rem', color: '#777', marginBottom: '1.5rem' }}>Explore our handcrafted Italian leather sofas and dining sets.</p>
              <Link to="/collections/living-room" onClick={onClose} className="btn-primary" style={{ padding: '0.7rem 1.5rem', fontSize: '0.8rem' }}>
                Shop Living Room Collection
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                  <img
                    src={item.image || item.variant?.image?.url}
                    alt={item.title}
                    style={{ width: '75px', height: '75px', objectFit: 'cover', borderRadius: '4px', background: '#f5f5f5' }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ fontSize: '0.9rem', margin: '0 0 0.25rem 0', fontFamily: 'var(--font-serif)' }}>
                      {item.title}
                    </h4>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.4rem' }}>
                      {item.variantTitle || 'Cognac Tan / 88" 3-Seater'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          style={{ padding: '2px 8px', background: '#f9f9f9', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          -
                        </button>
                        <span style={{ padding: '0 8px', fontSize: '0.8rem', fontWeight: 600 }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          style={{ padding: '2px 8px', background: '#f9f9f9', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          +
                        </button>
                      </div>

                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                        ${(parseFloat(item.price || item.variant?.price?.amount || '0') * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '1rem', alignSelf: 'flex-start' }}
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* White Glove Warranty Upsell */}
              <div style={{ background: 'var(--color-cognac-light)', border: '1px dashed var(--color-cognac)', padding: '0.85rem', borderRadius: '6px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <input
                  type="checkbox"
                  id="whiteglove"
                  checked={hasWhiteGlove}
                  onChange={(e) => setHasWhiteGlove(e.target.checked)}
                  style={{ marginTop: '3px', accentColor: 'var(--color-cognac)' }}
                />
                <label htmlFor="whiteglove" style={{ fontSize: '0.75rem', cursor: 'pointer', color: 'var(--color-cognac-dark)', lineHeight: 1.4 }}>
                  <strong>Add 10-Year White-Glove In-Home Placement & Packaging Removal</strong> ($99 or Free on $999+)
                </label>
              </div>
            </div>
          )}
        </main>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <footer style={{ borderTop: '1px solid #ddd', padding: '1.25rem', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>${subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.8rem', color: '#666' }}>
              <span>Shipping & White-Glove:</span>
              <span>{subtotal >= 999 || !hasWhiteGlove ? 'FREE' : `$${whiteGloveCost}`}</span>
            </div>

            <button
              onClick={() => alert('Hydrogen Shopify Checkout Initiated! Redirecting to Storefront API secure checkout endpoint...')}
              className="btn-primary"
              style={{ width: '100%', padding: '1rem', fontSize: '0.95rem' }}
            >
              Proceed to Checkout — ${(subtotal + (subtotal < 999 && hasWhiteGlove ? 99 : 0)).toLocaleString()}
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
