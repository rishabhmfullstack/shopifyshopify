import { useState } from 'react';

export function RoomVisualizerModal({ product, isOpen, onClose }) {
  const [activeBg, setActiveBg] = useState('modern-living');
  const [selectedFinish, setSelectedFinish] = useState('Cognac Tan');

  if (!isOpen || !product) return null;

  const bgImages = {
    'modern-living': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    'minimalist-loft': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    'warm-boho': 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
  };

  return (
    <div className="pb-modal-overlay">
      <div className="pb-modal-content" style={{ maxWidth: '850px' }}>
        <button onClick={onClose} className="pb-modal-close">✕</button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', margin: 0, fontSize: '1.6rem' }}>
              3D Room Visualizer Preview
            </h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
              See how the {product.title} fits into modern interior spaces.
            </p>
          </div>
          <span style={{ background: 'var(--color-cognac-light)', color: 'var(--color-cognac-dark)', fontSize: '0.75rem', padding: '0.3rem 0.8rem', borderRadius: '4px', fontWeight: 600 }}>
            Spatial Scale 1:1
          </span>
        </div>

        {/* Room Canvas Simulator */}
        <div style={{ position: 'relative', height: '380px', borderRadius: '8px', overflow: 'hidden', background: '#222' }}>
          <img
            src={bgImages[activeBg]}
            alt="Room Background"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
          />

          {/* Furniture Overlay */}
          <div style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', width: '60%', textAlign: 'center' }}>
            <img
              src={product.featuredImage?.url}
              alt={product.title}
              style={{ maxHeight: '220px', width: 'auto', filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.5))' }}
            />
          </div>

          <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem' }}>
            Finish: {selectedFinish}
          </div>
        </div>

        {/* Room & Finish Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
              Select Room Environment:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setActiveBg('modern-living')}
                className={`btn-secondary ${activeBg === 'modern-living' ? 'active' : ''}`}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: activeBg === 'modern-living' ? 'var(--color-dark)' : 'transparent', color: activeBg === 'modern-living' ? '#fff' : '#000' }}
              >
                Modern Living
              </button>
              <button
                onClick={() => setActiveBg('minimalist-loft')}
                className={`btn-secondary ${activeBg === 'minimalist-loft' ? 'active' : ''}`}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: activeBg === 'minimalist-loft' ? 'var(--color-dark)' : 'transparent', color: activeBg === 'minimalist-loft' ? '#fff' : '#000' }}
              >
                Urban Loft
              </button>
              <button
                onClick={() => setActiveBg('warm-boho')}
                className={`btn-secondary ${activeBg === 'warm-boho' ? 'active' : ''}`}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: activeBg === 'warm-boho' ? 'var(--color-dark)' : 'transparent', color: activeBg === 'warm-boho' ? '#fff' : '#000' }}
              >
                Warm Studio
              </button>
            </div>
          </div>

          <button onClick={onClose} className="btn-primary" style={{ padding: '0.7rem 1.5rem', fontSize: '0.85rem' }}>
            Done Visualizing
          </button>
        </div>
      </div>
    </div>
  );
}
