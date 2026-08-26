import { useLoaderData, Link } from 'react-router';
import { useState } from 'react';
import { POLY_BARK_PRODUCTS } from '~/lib/poly-bark-catalog';
import { ProductCard } from '~/components/ProductCard';
import { useStorefront } from '~/components/PageLayout';

export const meta = () => {
  return [
    { title: 'Search Furniture | Poly & Bark Hydrogen Storefront' },
  ];
};

export async function loader({ request }) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';

  const results = POLY_BARK_PRODUCTS.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.productType.toLowerCase().includes(q) ||
      p.options.some((o) => o.values.some((v) => v.toLowerCase().includes(q)))
    );
  });

  return {
    query,
    results: query ? results : POLY_BARK_PRODUCTS,
  };
}

export default function SearchRoute() {
  const { query, results } = useLoaderData();
  const { addToCart } = useStorefront();
  const [searchTerm, setSearchTerm] = useState(query);

  return (
    <div style={{ background: 'var(--color-sand)', minHeight: '100vh', padding: '3rem 2rem 5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '8px', border: '1px solid var(--color-sand-dark)', marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', marginTop: 0 }}>
            Search Poly & Bark Catalog
          </h1>

          <form style={{ display: 'flex', gap: '0.75rem', maxWidth: '700px' }}>
            <input
              type="text"
              name="q"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by leather finish (Cognac, Black), product type (Sofa, Chair, Table)..."
              style={{ flexGrow: 1, padding: '0.85rem 1.25rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.85rem 1.8rem' }}>
              Search 🔍
            </button>
          </form>
        </div>

        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
          {query ? `Search Results for "${query}" (${results.length})` : 'All Products Catalog'}
        </h3>

        {results.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {results.map((product) => (
              <ProductCard key={product.id} product={product} onQuickAdd={addToCart} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#fff', borderRadius: '8px' }}>
            <h4>No furniture matching "{query}" was found.</h4>
            <p style={{ color: '#666' }}>Try searching for "Leather", "Sofa", "Walnut", or "Sectional".</p>
          </div>
        )}
      </div>
    </div>
  );
}
