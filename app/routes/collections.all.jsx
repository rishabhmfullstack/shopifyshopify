import {useLoaderData, Link} from 'react-router';
import {useState} from 'react';
import {ProductCard} from '~/components/ProductCard';
import {useStorefront} from '~/components/PageLayout';

export const meta = () => {
  return [
    {title: 'All Products | Shopify Storefront'},
    {name: 'description', content: 'Explore all live products from Shopify Admin.'},
  ];
};

export async function loader({context}) {
  if (context?.storefront) {
    try {
      const {products, collections} = await context.storefront.query(ALL_PRODUCTS_QUERY, {
        variables: {first: 100},
      });

      return {
        products: products?.nodes || [],
        collections: collections?.nodes || [],
      };
    } catch (error) {
      console.error('Shopify All Products Query Error:', error);
    }
  }

  return {
    products: [],
    collections: [],
  };
}

export default function AllProductsRoute() {
  const {products: rawProducts, collections} = useLoaderData();
  const {addToCart} = useStorefront();

  const [sortOption, setSortOption] = useState('featured');

  let products = [...rawProducts];

  if (sortOption === 'price-low') {
    products.sort((a, b) => parseFloat(a.priceRange?.minVariantPrice?.amount || '0') - parseFloat(b.priceRange?.minVariantPrice?.amount || '0'));
  } else if (sortOption === 'price-high') {
    products.sort((a, b) => parseFloat(b.priceRange?.minVariantPrice?.amount || '0') - parseFloat(a.priceRange?.minVariantPrice?.amount || '0'));
  }

  return (
    <div style={{background: 'var(--color-sand)', minHeight: '100vh', padding: '3rem 2rem 5rem'}}>
      <div style={{maxWidth: '1300px', margin: '0 auto'}}>
        {/* Banner */}
        <div style={{background: '#fff', border: '1px solid var(--color-sand-dark)', padding: '3rem 2rem', borderRadius: '8px', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem'}}>
          <div style={{maxWidth: '650px'}}>
            <span style={{color: 'var(--color-cognac)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600}}>
              Full Catalog
            </span>
            <h1 style={{fontFamily: 'var(--font-serif)', fontSize: '2.8rem', margin: '0.4rem 0 0.8rem 0'}}>
              All Products
            </h1>
            <p style={{color: '#666', fontSize: '1.05rem', margin: 0}}>
              Browse our complete catalog live from Shopify Admin.
            </p>
          </div>

          {/* Collection Navigation Pills */}
          {collections.length > 0 && (
            <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
              <Link
                to="/collections/all"
                style={{
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  padding: '0.5rem 1rem',
                  borderRadius: '999px',
                  border: '1px solid var(--color-cognac)',
                  background: 'var(--color-cognac)',
                  color: '#fff',
                }}
              >
                All Products ({products.length})
              </Link>
              {collections.map((col) => (
                <Link
                  key={col.id}
                  to={`/collections/${col.handle}`}
                  style={{
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    padding: '0.5rem 1rem',
                    borderRadius: '999px',
                    border: '1px solid #ddd',
                    background: '#fff',
                    color: 'var(--color-dark)',
                  }}
                >
                  {col.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Filter & Sort Bar */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem', background: '#fff', padding: '1rem 1.5rem', borderRadius: '6px', border: '1px solid var(--color-sand-dark)'}}>
          <div style={{fontSize: '0.9rem', fontWeight: 600, color: '#444'}}>
            Showing {products.length} Products
          </div>

          <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
            <span style={{fontSize: '0.85rem', fontWeight: 600, color: '#666'}}>Sort By:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem'}}
            >
              <option value="featured">Featured / Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Premium DTC Block View Product Cards Grid */}
        {products.length > 0 ? (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem'}}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onQuickAdd={addToCart} />
            ))}
          </div>
        ) : (
          <div style={{textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '8px'}}>
            <h3>No products found in catalog.</h3>
            <Link to="/" className="btn-primary" style={{marginTop: '1rem', display: 'inline-block'}}>
              Go to Homepage
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts($first: Int = 100) {
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
    collections(first: 20) {
      nodes {
        id
        title
        handle
      }
    }
  }
`;
