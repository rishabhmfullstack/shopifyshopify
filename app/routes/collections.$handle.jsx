import { useLoaderData, useParams, Link } from 'react-router';
import { useState } from 'react';
import { getCollectionByHandle, POLY_BARK_COLLECTIONS } from '~/lib/poly-bark-catalog';
import { ProductCard } from '~/components/ProductCard';
import { useStorefront } from '~/components/PageLayout';

export const meta = ({ data }) => {
  const collection = data?.collection || POLY_BARK_COLLECTIONS[0];
  return [
    { title: `${collection.title} | Poly & Bark Hydrogen Storefront` },
    { name: 'description', content: collection.description },
  ];
};

export async function loader({ params }) {
  const collection = getCollectionByHandle(params.handle);
  return {
    collection,
    allCollections: POLY_BARK_COLLECTIONS,
  };
}

export default function CollectionRoute() {
  const { collection, allCollections } = useLoaderData();
  const { addToCart } = useStorefront();

  const [sortOption, setSortOption] = useState('featured');
  const [filterMaterial, setFilterMaterial] = useState('all');

  let products = [...(collection.products?.nodes || [])];

  if (filterMaterial === 'leather') {
    products = products.filter((p) => p.isLeather);
  } else if (filterMaterial === 'wood') {
    products = products.filter((p) => !p.isLeather);
  }

  if (sortOption === 'price-low') {
    products.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
  } else if (sortOption === 'price-high') {
    products.sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount));
  } else if (sortOption === 'rating') {
    products.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div style={{ background: 'var(--color-sand)', minHeight: '100vh', padding: '3rem 2rem 5rem' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        {/* Collection Header Banner */}
        <div style={{ background: '#fff', border: '1px solid var(--color-sand-dark)', padding: '3rem 2rem', borderRadius: '8px', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ maxWidth: '650px' }}>
            <span style={{ color: 'var(--color-cognac)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
              Collection Category
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', margin: '0.4rem 0 0.8rem 0' }}>
              {collection.title}
            </h1>
            <p style={{ color: '#666', fontSize: '1.05rem', margin: 0 }}>
              {collection.description}
            </p>
          </div>

          {/* Collection Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {allCollections.map((col) => (
              <Link
                key={col.id}
                to={`/collections/${col.handle}`}
                style={{
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  padding: '0.5rem 1rem',
                  borderRadius: '999px',
                  border: '1px solid',
                  borderColor: col.handle === collection.handle ? 'var(--color-cognac)' : '#ddd',
                  background: col.handle === collection.handle ? 'var(--color-cognac)' : '#fff',
                  color: col.handle === collection.handle ? '#fff' : 'var(--color-dark)',
                }}
              >
                {col.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem', background: '#fff', padding: '1rem 1.5rem', borderRadius: '6px', border: '1px solid var(--color-sand-dark)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666' }}>Material:</span>
            <button
              onClick={() => setFilterMaterial('all')}
              style={{
                border: 'none',
                background: filterMaterial === 'all' ? 'var(--color-dark)' : 'transparent',
                color: filterMaterial === 'all' ? '#fff' : '#444',
                padding: '0.3rem 0.8rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              All Items ({collection.products?.nodes?.length || 0})
            </button>
            <button
              onClick={() => setFilterMaterial('leather')}
              style={{
                border: 'none',
                background: filterMaterial === 'leather' ? 'var(--color-cognac)' : 'transparent',
                color: filterMaterial === 'leather' ? '#fff' : '#444',
                padding: '0.3rem 0.8rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Italian Leather Only
            </button>
            <button
              onClick={() => setFilterMaterial('wood')}
              style={{
                border: 'none',
                background: filterMaterial === 'wood' ? 'var(--color-dark)' : 'transparent',
                color: filterMaterial === 'wood' ? '#fff' : '#444',
                padding: '0.3rem 0.8rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Walnut Wood & Velvet
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666' }}>Sort By:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem' }}
            >
              <option value="featured">Featured / Best Sellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onQuickAdd={addToCart} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '8px' }}>
            <h3>No products found matching selected filters.</h3>
            <button onClick={() => setFilterMaterial('all')} className="btn-primary" style={{ marginTop: '1rem' }}>
              Reset Material Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
id
url
altText
          }
images(first: 5) {
            nodes {
    id
    url
    altText
  }
}
          options {
  name
  values
}
variants(first: 10) {
            nodes {
    id
    title
    availableForSale
              price {
      amount
      currencyCode
    }
              compareAtPrice {
      amount
      currencyCode
    }
              selectedOptions {
      name
      value
    }
              image {
      url
    }
  }
}
        }
      }
    }
collections(first: 20) {
      nodes {
    id
    title
    handle
  }
}
products(first: $first) {
      nodes {
    id
    title
    handle
    vendor
    productType
    description
        priceRange {
          minVariantPrice {
        amount
        currencyCode
      }
          maxVariantPrice {
        amount
        currencyCode
      }
    }
        featuredImage {
      id
      url
      altText
    }
    images(first: 5) {
          nodes {
        id
        url
        altText
      }
    }
        options {
      name
      values
    }
    variants(first: 10) {
          nodes {
        id
        title
        availableForSale
            price {
          amount
          currencyCode
        }
            compareAtPrice {
          amount
          currencyCode
        }
            selectedOptions {
          name
          value
        }
            image {
          url
        }
      }
    }
  }
}
  }
`;
