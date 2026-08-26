import { Link, useRouteLoaderData } from 'react-router';
import { useState } from 'react';

export function Header({ cart, onOpenCart, onOpenSwatchModal }) {
  const rootData = useRouteLoaderData('root');
  const cartLines = cart?.lines?.nodes || [];
  const totalCartCount = cart?.totalQuantity || cartLines.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <>
      <div className="announcement-bar">
        <span>✨ White-Glove White Glove Delivery on Orders Over $999 | Free 100-Day In-Home Trial</span>
      </div>
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" className="brand-logo">
            <span className="title">POLY & BARK</span>
            <span className="subtitle">DESIGN FOR LIVING</span>
          </Link>
        </div>

        <nav className="header-menu-desktop">
          <Link to="/collections/living-room" className="header-menu-item">
            Living Room
          </Link>
          <Link to="/collections/cognac-leather" className="header-menu-item" style={{ color: 'var(--color-cognac)' }}>
            Cognac Leather
          </Link>
          <Link to="/collections/dining" className="header-menu-item">
            Dining Tables
          </Link>
          <Link to="/products/napa-cognac-leather-sofa" className="header-menu-item">
            Best Sellers
          </Link>
          <button
            onClick={onOpenSwatchModal}
            className="header-menu-item"
            style={{ background: 'none', border: 'none', font: 'inherit', cursor: 'pointer' }}
          >
            Free Leather Swatches
          </button>
        </nav>

        <div className="header-ctas">
          <Link to="/search" style={{ color: 'var(--color-dark)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
            Search 🔍
          </Link>

          <button
            onClick={onOpenCart}
            className="btn-primary"
            style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
          >
            Cart 🛍️
            {totalCartCount > 0 && <span className="cart-count-badge">{totalCartCount}</span>}
          </button>
        </div>
      </header>
    </>
  );
}
