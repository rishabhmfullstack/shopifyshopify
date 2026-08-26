import { Link } from 'react-router';
import { useState } from 'react';

export function ProductCard({ product, onQuickAdd }) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const currentVariant = product?.variants?.nodes?.[selectedVariantIndex] || product?.variants?.nodes?.[0];

  const price = currentVariant?.price?.amount || product?.priceRange?.minVariantPrice?.amount;
  const compareAtPrice = currentVariant?.compareAtPrice?.amount;

  return (
    <div className="pb-product-card">
      {product.badge && (
        <span className={`pb-badge ${product.isLeather ? 'leather' : ''}`}>
          {product.badge}
        </span>
      )}

      <div className="pb-product-image-wrap">
        <Link to={`/products/${product.handle}`}>
          <img
            src={currentVariant?.image?.url || product.featuredImage?.url}
            alt={product.featuredImage?.altText || product.title}
          />
        </Link>
      </div>

      <div className="pb-product-info">
        <div className="pb-rating">
          ★★★★★ <span className="pb-rating-count">({product.reviewCount || 48})</span>
        </div>

        <h3 className="pb-product-title">
          <Link to={`/products/${product.handle}`}>{product.title}</Link>
        </h3>

        <div className="pb-price">
          ${parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          {compareAtPrice && <s>${parseFloat(compareAtPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}</s>}
        </div>

        {/* Finish Swatches */}
        {product.variants?.nodes?.length > 1 && (
          <div className="pb-swatch-list">
            {product.variants.nodes.slice(0, 4).map((variant, idx) => (
              <button
                key={variant.id}
                title={variant.title}
                className={`pb-swatch-dot ${selectedVariantIndex === idx ? 'active' : ''}`}
                style={{ backgroundColor: variant.swatchHex || '#B86B35' }}
                onClick={() => setSelectedVariantIndex(idx)}
              />
            ))}
          </div>
        )}

        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <button
            onClick={() => onQuickAdd && onQuickAdd(product, currentVariant)}
            className="btn-secondary"
            style={{ width: '100%', padding: '0.65rem 1rem', fontSize: '0.8rem' }}
          >
            Add to Cart — ${parseFloat(price).toFixed(0)}
          </button>
        </div>
      </div>
    </div>
  );
}
