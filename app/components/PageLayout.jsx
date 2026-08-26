import { useState, createContext, useContext } from 'react';
import { Header } from '~/components/Header';
import { Footer } from '~/components/Footer';
import { CartDrawer } from '~/components/CartDrawer';
import { SwatchRequestModal } from '~/components/SwatchRequestModal';
import { OxygenInspector } from '~/components/OxygenInspector';
import { POLY_BARK_PRODUCTS } from '~/lib/poly-bark-catalog';

export const StorefrontContext = createContext();

export function useStorefront() {
  return useContext(StorefrontContext);
}

export function PageLayout({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSwatchModalOpen, setIsSwatchModalOpen] = useState(false);

  // Default initial cart items with Napa Cognac Leather Sofa
  const [cartItems, setCartItems] = useState([
    {
      id: 'cart-line-1',
      title: POLY_BARK_PRODUCTS[0].title,
      variantTitle: 'Cognac Tan / 88" 3-Seater',
      price: POLY_BARK_PRODUCTS[0].priceRange.minVariantPrice.amount,
      image: POLY_BARK_PRODUCTS[0].featuredImage.url,
      quantity: 1,
    },
  ]);

  const addToCart = (product, variant) => {
    const variantId = variant?.id || product.variants?.nodes?.[0]?.id || product.id;
    const existingIndex = cartItems.findIndex((item) => item.id === variantId);

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          id: variantId,
          title: product.title,
          variantTitle: variant?.title || 'Cognac Tan',
          price: variant?.price?.amount || product.priceRange?.minVariantPrice?.amount,
          image: variant?.image?.url || product.featuredImage?.url,
          quantity: 1,
        },
      ]);
    }
    setIsCartOpen(true);
  };

  const updateQuantity = (id, newQty) => {
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQty } : item)));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <StorefrontContext.Provider
      value={{
        addToCart,
        openCart: () => setIsCartOpen(true),
        openSwatchModal: () => setIsSwatchModalOpen(true),
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header
          cart={{ lines: { nodes: cartItems }, totalQuantity: cartItems.reduce((a, b) => a + b.quantity, 0) }}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSwatchModal={() => setIsSwatchModalOpen(true)}
        />

        <main style={{ flexGrow: 1 }}>{children}</main>

        <Footer />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
        />

        <SwatchRequestModal
          isOpen={isSwatchModalOpen}
          onClose={() => setIsSwatchModalOpen(false)}
        />

        <OxygenInspector />
      </div>
    </StorefrontContext.Provider>
  );
}
