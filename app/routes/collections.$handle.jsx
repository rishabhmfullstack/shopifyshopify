import {useLoaderData, Link} from 'react-router';
import {useState} from 'react';
import {ProductCard} from '~/components/ProductCard';
import {useStorefront} from '~/components/PageLayout';

export const meta = ({data}) => {
  return [
    {title: `${data?.collection?.title || 'Collection'} | Shopify Storefront`},
    {name: 'description', content: data?.collection?.description || 'Browse collection items.'},
  ];
};

export async function loader({params, context}) {
  const handle = params.handle || 'all';

  if (context?.storefront) {
    try {
      const {collection, products, collections} = await context.storefront.query(COLLECTION_QUERY, {
        variables: {handle, first: 100},
      });

      const activeCollection = collection || {
        title: handle === 'all' ? 'All Products' : handle.replace(/-/g, ' '),
        description: 'Explore live products synced from Shopify Storefront API.',
        products: products || {nodes: []},
      };

      return {
        collection: activeCollection,
        products: activeCollection.products?.nodes || products?.nodes || [],
        collections: collections?.nodes || [],
      };
    } catch (error) {
      console.error('Shopify Collection Query Error:', error);
    }
  }

  return {
    collection: {title: 'All Products', description: 'Browse items live from Shopify'},
    products: [],
    collections: [],
  };
}

export default function CollectionRoute() {
  const {collection, products: rawProducts, collections} = useLoaderData();
  const {addToCart} = useStorefront();

  const [sortOption, setSortOption] = useState('featured');
  const [filterMaterial, setFilterMaterial] = useState('all');

  let products = [...rawProducts];

  if (filterMaterial !== 'all') {
    products = products.filter((p) =>
      p.title?.toLowerCase().includes(filterMaterial.toLowerCase()) ||
      p.description?.toLowerCase().includes(filterMaterial.toLowerCase())
    );
  }

  if (sortOption === 'price-low') {
    products.sort((a, b) => parseFloat(a.priceRange?.minVariantPrice?.amount || '0') - parseFloat(b.priceRange?.minVariantPrice?.amount || '0'));
  } else if (sortOption === 'price-high') {
    products.sort((a, b) => parseFloat(b.priceRange?.minVariantPrice?.amount || '0') - parseFloat(a.priceRange?.minVariantPrice?.amount || '0'));
  }

  return (
    <div style={{background: 'var(--color-sand)', minHeight: '100vh', padding: '3rem 2rem 5rem'}}>
      <div style={{maxWidth: '1300px', margin: '0 auto'}}>
        {/* Collection Banner */}
        <div style={{background: '#fff', border: '1px solid var(--color-sand-dark)', padding: '3rem 2rem', borderRadius: '8px', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem'}}>
          <div style={{maxWidth: '650px'}}>
            <span style={{color: 'var(--color-cognac)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600}}>
              Collection
            </span>
            <h1 style={{fontFamily: 'var(--font-serif)', fontSize: '2.8rem', margin: '0.4rem 0 0.8rem 0'}}>
              {collection.title}
            </h1>
            <p style={{color: '#666', fontSize: '1.05rem', margin: 0}}>
              {collection.description}
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
                All Products
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

        {/* Product Grid */}
        {products.length > 0 ? (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem'}}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onQuickAdd={addToCart} />
            ))}
          </div>
        ) : (
          <div style={{textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '8px'}}>
            <h3>No products found in this collection.</h3>
            <Link to="/" className="btn-primary" style={{marginTop: '1rem', display: 'inline-block'}}>
              View All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const COLLECTION_QUERY = `#graphql
  query CollectionByHandle($handle: String!, $first: Int = 100) {
    collection(handle: $handle) {
      id
      title
      handle
      description
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
