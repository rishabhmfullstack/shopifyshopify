import { useState } from 'react';

export function SwatchRequestModal({ isOpen, onClose }) {
  const [selectedSwatches, setSelectedSwatches] = useState(['Cognac Tan Italian Leather', 'Midnight Black Leather']);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const availableSwatches = [
    { name: 'Cognac Tan Italian Leather', color: '#B86B35' },
    { name: 'Midnight Black Italian Leather', color: '#1A1A1A' },
    { name: 'Espresso Brown Aniline Leather', color: '#4A2E1B' },
    { name: 'Saddle Tan Heritage Leather', color: '#C88242' },
    { name: 'Forest Emerald Performance Velvet', color: '#1B4D3E' },
    { name: 'American Walnut Solid Wood', color: '#5C3A21' },
  ];

  const toggleSwatch = (name) => {
    if (selectedSwatches.includes(name)) {
      setSelectedSwatches(selectedSwatches.filter((s) => s !== name));
    } else {
      if (selectedSwatches.length < 5) {
        setSelectedSwatches([...selectedSwatches, name]);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pb-modal-overlay">
      <div className="pb-modal-content">
        <button onClick={onClose} className="pb-modal-close">✕</button>

        {!submitted ? (
          <>
            <h2 style={{ fontFamily: 'var(--font-serif)', marginTop: 0, fontSize: '1.8rem' }}>
              Complimentary Leather Swatch Kit
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1.5rem' }}>
              Select up to 5 physical leather and wood finish swatches. Shipped free to your door within 2 business days.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {availableSwatches.map((item) => {
                const isSelected = selectedSwatches.includes(item.name);
                return (
                  <div
                    key={item.name}
                    onClick={() => toggleSwatch(item.name)}
                    style={{
                      border: `2px solid ${isSelected ? 'var(--color-cognac)' : '#e5e5e5'}`,
                      background: isSelected ? 'var(--color-cognac-light)' : '#fff',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: item.color,
                        border: '1px solid #ccc',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{item.name}</span>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  required
                  type="text"
                  placeholder="Full Name"
                  style={{ flex: 1, padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.9rem' }}
                />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  style={{ flex: 1, padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.9rem' }}
                />
              </div>
              <input
                required
                type="text"
                placeholder="Shipping Street Address"
                style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.9rem' }}
              />

              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                Send Free Swatch Kit ({selectedSwatches.length}/5 Selected)
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📫</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-cognac)' }}>
              Your Free Swatches are on the Way!
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
              We have dispatched your requested leather & wood swatches. Expect tracking details in your inbox shortly.
            </p>
            <button onClick={onClose} className="btn-primary">
              Continue Browsing Storefront
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
