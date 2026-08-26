import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'dist', 'client', 'assets')));

const getStorefrontHTML = (pathname = '/') => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Poly & Bark | Headless Shopify Storefront (Hydrogen & Oxygen)</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..800;1,400..800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
      :root {
        --aside-width: 420px;
        --color-cognac: #B86B35;
        --color-cognac-dark: #8C471C;
        --color-cognac-light: #F4E8DF;
        --color-dark: #121212;
        --color-charcoal: #1C1917;
        --color-sand: #FAF8F5;
        --color-sand-dark: #EBE5DC;
        --color-light: #FFFFFF;
        --font-serif: 'Playfair Display', Georgia, serif;
        --font-sans: 'Inter', system-ui, sans-serif;
      }

      * { box-sizing: border-box; }
      body { background-color: var(--color-sand); color: var(--color-dark); font-family: var(--font-sans); margin: 0; padding: 0; line-height: 1.6; }
      h1, h2, h3, h4 { font-family: var(--font-serif); font-weight: 500; }

      .announcement-bar { background: var(--color-dark); color: var(--color-sand); font-size: 0.8rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.5rem 1rem; text-align: center; }
      
      .header { align-items: center; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); border-bottom: 1px solid var(--color-sand-dark); display: flex; height: 80px; padding: 0 2rem; position: sticky; top: 0; z-index: 50; }
      .brand-logo { display: flex; flex-direction: column; align-items: center; text-decoration: none; color: var(--color-dark); }
      .brand-logo .title { font-family: var(--font-serif); font-size: 1.6rem; font-weight: 700; letter-spacing: 0.18em; line-height: 1; }
      .brand-logo .subtitle { font-size: 0.55rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--color-cognac); margin-top: 2px; font-weight: 600; }

      .header-menu-desktop { display: flex; gap: 2rem; margin-left: 3rem; }
      .header-menu-item { color: var(--color-dark); font-size: 0.85rem; font-weight: 500; letter-spacing: 0.05em; text-decoration: none; text-transform: uppercase; padding: 0.4rem 0; }
      .header-menu-item:hover { color: var(--color-cognac); }
      .header-ctas { display: flex; align-items: center; gap: 1.25rem; margin-left: auto; }

      .cart-count-badge { background: var(--color-cognac); color: var(--color-light); border-radius: 999px; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; margin-left: 4px; }

      /* Slide-out Overlay Cart Drawer */
      .overlay { background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px); position: fixed; inset: 0; opacity: 0; pointer-events: none; transition: opacity 300ms ease; z-index: 99999; visibility: hidden; }
      .overlay.expanded { opacity: 1; pointer-events: auto; visibility: visible; }
      .overlay .close-outside { position: absolute; inset: 0; width: calc(100% - var(--aside-width)); cursor: pointer; }
      
      aside { background: #ffffff; box-shadow: -10px 0 40px rgba(0, 0, 0, 0.25); height: 100vh; width: min(var(--aside-width), 100vw); position: fixed; right: 0; top: 0; transform: translateX(100%); transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; }
      .overlay.expanded aside { transform: translateX(0); }

      aside header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-sand-dark); padding: 1.25rem; }
      aside header h3 { margin: 0; font-size: 1.3rem; }

      .hero-section { position: relative; min-height: 75vh; display: flex; align-items: center; background-size: cover; background-position: center; color: var(--color-light); padding: 4rem 2rem; }
      .hero-overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(18, 18, 18, 0.75) 0%, rgba(18, 18, 18, 0.25) 100%); }
      .hero-content { position: relative; z-index: 2; max-width: 650px; margin-left: max(2rem, 5vw); }
      .hero-tag { display: inline-block; background: rgba(184, 107, 53, 0.9); color: #fff; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; padding: 0.4rem 1rem; border-radius: 2px; margin-bottom: 1rem; }
      .hero-title { font-size: clamp(2.5rem, 5vw, 4rem); line-height: 1.1; margin-bottom: 1.25rem; margin-top: 0; }
      .hero-description { font-size: 1.1rem; opacity: 0.9; margin-bottom: 2rem; font-weight: 300; }

      .btn-primary { display: inline-flex; align-items: center; justify-content: center; background: var(--color-cognac); color: var(--color-light); font-weight: 600; font-size: 0.9rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 1rem 2.2rem; border: 1px solid var(--color-cognac); border-radius: 2px; text-decoration: none; cursor: pointer; transition: all 0.25s ease; box-shadow: 0 4px 14px rgba(184, 107, 53, 0.25); }
      .btn-primary:hover { background: var(--color-cognac-dark); border-color: var(--color-cognac-dark); }
      
      .btn-secondary { display: inline-flex; align-items: center; justify-content: center; background: transparent; color: var(--color-dark); font-weight: 600; font-size: 0.9rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.9rem 2rem; border: 1px solid var(--color-dark); border-radius: 2px; text-decoration: none; cursor: pointer; transition: all 0.25s ease; }
      .btn-secondary:hover { background: var(--color-dark); color: var(--color-light); }

      .pb-product-card { background: #ffffff; border-radius: 6px; overflow: hidden; border: 1px solid var(--color-sand-dark); transition: all 0.3s ease; display: flex; flex-direction: column; position: relative; }
      .pb-product-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(0, 0, 0, 0.08); }
      .pb-product-image-wrap { position: relative; aspect-ratio: 4/3; overflow: hidden; background: #f2efe9; }
      .pb-product-image-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
      .pb-product-card:hover .pb-product-image-wrap img { transform: scale(1.05); }

      .pb-badge { position: absolute; top: 1rem; left: 1rem; background: var(--color-dark); color: #fff; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.3rem 0.7rem; border-radius: 2px; z-index: 2; }
      .pb-badge.leather { background: var(--color-cognac); }

      .pb-product-info { padding: 1.5rem; display: flex; flex-direction: column; flex-grow: 1; }
      .pb-product-title { font-family: var(--font-serif); font-size: 1.3rem; font-weight: 600; margin: 0 0 0.5rem 0; color: var(--color-dark); }
      .pb-product-title a { color: inherit; text-decoration: none; }
      .pb-rating { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; color: #d4a359; margin-bottom: 0.75rem; }
      .pb-rating-count { color: #777; font-size: 0.75rem; }
      .pb-price { font-size: 1.15rem; font-weight: 700; color: var(--color-dark); margin-bottom: 1rem; }
      .pb-price s { color: #888; font-weight: 400; font-size: 0.95rem; margin-left: 0.5rem; }

      .pb-swatch-list { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
      .pb-swatch-dot { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 0 0 1px #d1d1d1; cursor: pointer; transition: transform 0.15s ease; }
      .pb-swatch-dot.active, .pb-swatch-dot:hover { transform: scale(1.25); box-shadow: 0 0 0 2px var(--color-cognac); }

      .guarantee-bar { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2rem; background: var(--color-sand-dark); padding: 3rem 2rem; text-align: center; }
      .guarantee-item h4 { margin: 0.5rem 0 0.25rem 0; font-size: 1.1rem; }
      .guarantee-item p { margin: 0; font-size: 0.85rem; color: #666; }

      .oxygen-inspector { position: fixed; bottom: 1.25rem; right: 1.25rem; z-index: 9999; font-family: monospace; }
      .oxygen-inspector-toggle { background: var(--color-dark); color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); padding: 0.6rem 1rem; border-radius: 999px; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 0.6rem; box-shadow: 0 10px 25px rgba(0,0,0,0.3); transition: all 0.2s ease; }
      .oxygen-inspector-toggle:hover { background: #252525; transform: scale(1.03); }
      
      .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: #10B981; box-shadow: 0 0 10px #10B981; animation: pulse 1.5s infinite; }
      @keyframes pulse { 0% { transform: scale(0.95); opacity: 0.8; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(0.95); opacity: 0.8; } }

      .oxygen-inspector-panel { width: 380px; background: rgba(18, 18, 18, 0.95); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 12px; color: #e2e8f0; padding: 1.25rem; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); margin-bottom: 0.75rem; display: none; }
      .oxygen-inspector-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 0.75rem; margin-bottom: 1rem; }
      .oxygen-inspector-header h4 { font-family: var(--font-sans); margin: 0; font-size: 0.9rem; color: var(--color-cognac); display: flex; align-items: center; gap: 0.5rem; }
      .oxygen-metric { display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 0.5rem; }
      .oxygen-metric-tag { background: rgba(184, 107, 53, 0.2); color: var(--color-cognac); padding: 2px 6px; border-radius: 4px; }

      .pb-modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px); z-index: 9999; display: none; align-items: center; justify-content: center; padding: 1rem; }
      .pb-modal-content { background: #ffffff; border-radius: 8px; max-width: 600px; width: 100%; padding: 2rem; position: relative; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
      .pb-modal-close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; }
    </style>
  </head>
  <body>
    <div id="root">
      <div class="announcement-bar">
        <span>✨ White-Glove Delivery on Orders Over $999 | Free 100-Day In-Home Trial</span>
      </div>
      
      <header class="header">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <a href="/" class="brand-logo">
            <span class="title">POLY & BARK</span>
            <span class="subtitle">DESIGN FOR LIVING</span>
          </a>
        </div>

        <nav class="header-menu-desktop">
          <a href="/collections/living-room" class="header-menu-item">Living Room</a>
          <a href="/collections/cognac-leather" class="header-menu-item" style="color: var(--color-cognac);">Cognac Leather</a>
          <a href="/collections/dining" class="header-menu-item">Dining Tables</a>
          <a href="/products/napa-cognac-leather-sofa" class="header-menu-item">Best Sellers</a>
          <button onclick="openSwatchModal()" class="header-menu-item" style="background: none; border: none; font: inherit; cursor: pointer;">Free Leather Swatches</button>
        </nav>

        <div class="header-ctas">
          <a href="/search" style="color: var(--color-dark); text-decoration: none; font-size: 0.9rem; font-weight: 500;">Search 🔍</a>
          <button onclick="openCartDrawer()" class="btn-primary" style="padding: 0.5rem 1.2rem; font-size: 0.85rem;">
            Cart 🛍️ <span class="cart-count-badge" id="cartCountBadge">1</span>
          </button>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="hero-section" style="background-image: url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1800&q=85');">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <span class="hero-tag">Signature Aniline Leather</span>
          <h1 class="hero-title">Crafted for Living. Built for Life.</h1>
          <p class="hero-description">Handcrafted with pure full-grain Italian leather that ages gracefully over time. Direct from European tanneries straight to your living room.</p>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <a href="/products/napa-cognac-leather-sofa" class="btn-primary">Explore Napa Sofa — $1,899</a>
            <button onclick="openRoomVisualizer('Napa Cognac Leather Sofa', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80')" class="btn-secondary" style="border-color: #fff; color: #fff;">3D Room Visualizer 👁️</button>
          </div>
        </div>
      </section>

      <!-- Guarantee Bar -->
      <div class="guarantee-bar">
        <div class="guarantee-item">
          <h4>📦 Free White-Glove Delivery</h4>
          <p>On all living room orders over $999</p>
        </div>
        <div class="guarantee-item">
          <h4>🛋️ 100-Day In-Home Trial</h4>
          <p>Love it in your home or return it hassle-free</p>
        </div>
        <div class="guarantee-item">
          <h4>🇮🇹 Full-Grain Italian Leather</h4>
          <p>Ethically sourced from Vicenza tanneries</p>
        </div>
        <div class="guarantee-item">
          <h4>🛡️ 10-Year Frame Warranty</h4>
          <p>Kiln-dried solid hardwood construction</p>
        </div>
      </div>

      <!-- Best Sellers Grid -->
      <section style="padding: 4rem 2rem; max-width: 1300px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span style="color: var(--color-cognac); font-weight: 600; font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase;">Best Sellers Collection</span>
            <h2 style="font-size: 2.4rem; margin: 0.2rem 0 0 0; font-family: var(--font-serif);">Italian Leather & Solid Walnut</h2>
          </div>
          <button onclick="openSwatchModal()" class="btn-secondary" style="font-size: 0.85rem; padding: 0.6rem 1.2rem;">Request Free Leather Swatches 📦</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
          <!-- Product Card 1 -->
          <div class="pb-product-card">
            <span class="pb-badge leather">BEST SELLER</span>
            <div class="pb-product-image-wrap">
              <a href="/products/napa-cognac-leather-sofa">
                <img id="img-sofa" src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80" alt="Napa Cognac Leather Sofa" />
              </a>
            </div>
            <div class="pb-product-info">
              <div class="pb-rating">★★★★★ <span class="pb-rating-count">(412 reviews)</span></div>
              <h3 class="pb-product-title"><a href="/products/napa-cognac-leather-sofa">Napa Cognac Leather Sofa</a></h3>
              <div class="pb-price" id="price-sofa">$1,899.00 <s>$2,199.00</s></div>
              <div class="pb-swatch-list">
                <span class="pb-swatch-dot active" style="background-color: #B86B35;" onclick="switchFinish('sofa', 'Cognac Tan', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80', '1899.00', this)"></span>
                <span class="pb-swatch-dot" style="background-color: #1A1A1A;" onclick="switchFinish('sofa', 'Midnight Black', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80', '1899.00', this)"></span>
                <span class="pb-swatch-dot" style="background-color: #4A2E1B;" onclick="switchFinish('sofa', 'Espresso Brown', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80', '1949.00', this)"></span>
              </div>
              <div style="margin-top: auto; padding-top: 1rem;">
                <button onclick="addToCart('Napa Cognac Leather Sofa', 1899, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80', 'Cognac Tan / 88\" 3-Seater')" class="btn-secondary" style="width: 100%; padding: 0.65rem 1rem; font-size: 0.8rem;">Add to Cart — $1,899</button>
              </div>
            </div>
          </div>

          <!-- Product Card 2 -->
          <div class="pb-product-card">
            <span class="pb-badge leather">NEW ARRIVAL</span>
            <div class="pb-product-image-wrap">
              <a href="/products/essex-leather-armchair">
                <img id="img-armchair" src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80" alt="Essex Leather Armchair" />
              </a>
            </div>
            <div class="pb-product-info">
              <div class="pb-rating">★★★★★ <span class="pb-rating-count">(184 reviews)</span></div>
              <h3 class="pb-product-title"><a href="/products/essex-leather-armchair">Essex Italian Leather Armchair</a></h3>
              <div class="pb-price" id="price-armchair">$949.00 <s>$1,099.00</s></div>
              <div class="pb-swatch-list">
                <span class="pb-swatch-dot active" style="background-color: #B86B35;" onclick="switchFinish('armchair', 'Cognac Tan', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80', '949.00', this)"></span>
                <span class="pb-swatch-dot" style="background-color: #1A1A1A;" onclick="switchFinish('armchair', 'Midnight Black', 'https://images.unsplash.com/photo-1580481072645-022f9a6d85d5?auto=format&fit=crop&w=1200&q=80', '949.00', this)"></span>
              </div>
              <div style="margin-top: auto; padding-top: 1rem;">
                <button onclick="addToCart('Essex Italian Leather Armchair', 949, 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80', 'Cognac Tan')" class="btn-secondary" style="width: 100%; padding: 0.65rem 1rem; font-size: 0.8rem;">Add to Cart — $949</button>
              </div>
            </div>
          </div>

          <!-- Product Card 3 -->
          <div class="pb-product-card">
            <span class="pb-badge">SUSTAINABLE WOOD</span>
            <div class="pb-product-image-wrap">
              <a href="/products/cira-solid-walnut-dining-table">
                <img id="img-table" src="https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80" alt="Cira Solid Walnut Dining Table" />
              </a>
            </div>
            <div class="pb-product-info">
              <div class="pb-rating">★★★★★ <span class="pb-rating-count">(97 reviews)</span></div>
              <h3 class="pb-product-title"><a href="/products/cira-solid-walnut-dining-table">Cira Solid Walnut Dining Table</a></h3>
              <div class="pb-price" id="price-table">$1,299.00 <s>$1,499.00</s></div>
              <div class="pb-swatch-list">
                <span class="pb-swatch-dot active" style="background-color: #5C3A21;"></span>
              </div>
              <div style="margin-top: auto; padding-top: 1rem;">
                <button onclick="addToCart('Cira Solid Walnut Dining Table', 1299, 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80', 'Natural Walnut / 72\"')" class="btn-secondary" style="width: 100%; padding: 0.65rem 1rem; font-size: 0.8rem;">Add to Cart — $1,299</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Tannery Sourcing Highlight -->
      <section style="background: var(--color-charcoal); color: #fff; padding: 5rem 2rem;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 4rem; align-items: center;">
          <div>
            <span style="color: var(--color-cognac); font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 600;">The Poly & Bark Sourcing Standard</span>
            <h2 style="font-family: var(--font-serif); font-size: 2.8rem; margin: 0.5rem 0 1.2rem 0; line-height: 1.15;">Full-Grain Italian Aniline Leather</h2>
            <p style="color: #ccc; font-size: 1.05rem; line-height: 1.7; margin-bottom: 2rem; font-weight: 300;">Unlike bonded or top-grain leathers treated with heavy artificial finishes, our full-grain aniline leather retains natural markings and warmth. As light hits the surface, it develops a deep, lustrous patina that tells your story.</p>
            <div style="display: flex; gap: 1.5rem; margin-bottom: 2.5rem;">
              <div><h3 style="font-size: 2rem; margin: 0; color: var(--color-cognac);">100%</h3><span style="font-size: 0.8rem; color: #aaa; text-transform: uppercase;">Full-Grain Hide</span></div>
              <div><h3 style="font-size: 2rem; margin: 0; color: var(--color-cognac);">10 Yr</h3><span style="font-size: 0.8rem; color: #aaa; text-transform: uppercase;">Frame Warranty</span></div>
              <div><h3 style="font-size: 2rem; margin: 0; color: var(--color-cognac);">4.9 ★</h3><span style="font-size: 0.8rem; color: #aaa; text-transform: uppercase;">Customer Rating</span></div>
            </div>
            <a href="/collections/cognac-leather" class="btn-primary" style="background: var(--color-cognac); border-color: var(--color-cognac);">Shop Cognac Leather Series</a>
          </div>
          <div style="border-radius: 8px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <img src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1000&q=80" alt="Italian Cognac Leather sofa detail" style="width: 100%; height: auto; display: block;" />
          </div>
        </div>
      </section>

      <!-- Cart Drawer Overlay -->
      <div id="cartDrawer" class="overlay">
        <div class="close-outside" onclick="closeCartDrawer()"></div>
        <aside style="display: flex; flex-direction: column;">
          <header>
            <h3 style="font-family: var(--font-serif); font-size: 1.3rem;">Your Cart (<span id="cartHeaderQty">1</span>)</h3>
            <button onclick="closeCartDrawer()" style="background: none; border: none; font-size: 1.4rem; cursor: pointer;">✕</button>
          </header>
          
          <div style="background: var(--color-sand); padding: 0.85rem 1.25rem; border-bottom: 1px solid var(--color-sand-dark);">
            <div style="font-size: 0.75rem; font-weight: 600; color: var(--color-dark); display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
              <span id="shippingProgressText">🎉 You unlocked FREE White-Glove Delivery!</span>
              <span id="shippingProgressPct">100%</span>
            </div>
            <div style="height: 6px; width: 100%; background: #e0dbd3; border-radius: 3px; overflow: hidden;">
              <div id="shippingProgressBar" style="height: 100%; width: 100%; background: var(--color-cognac); transition: width 0.3s ease;"></div>
            </div>
          </div>

          <main class="cart-main" id="cartItemsContainer" style="flex-grow: 1; padding: 1rem 1.25rem; overflow-y: auto;">
            <!-- Cart items dynamically rendered by JS -->
          </main>

          <footer style="border-top: 1px solid #ddd; padding: 1.25rem; background: #fff;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem;">
              <span>Subtotal:</span>
              <span style="font-weight: 700; font-size: 1.1rem;" id="cartSubtotal">$1,899.00</span>
            </div>
            <button onclick="alert('Redirecting to Shopify Storefront API secure checkout...')" class="btn-primary" style="width: 100%; padding: 1rem;">Proceed to Checkout</button>
          </footer>
        </aside>
      </div>

      <!-- Swatch Modal -->
      <div id="swatchModal" class="pb-modal-overlay">
        <div class="pb-modal-content">
          <button onclick="closeSwatchModal()" class="pb-modal-close">✕</button>
          <h2 style="font-family: var(--font-serif); margin-top: 0; font-size: 1.8rem;">Complimentary Leather Swatch Kit</h2>
          <p style="font-size: 0.9rem; color: #555;">Select up to 5 physical leather and wood finish swatches. Shipped free to your door within 2 business days.</p>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin: 1rem 0;">
            <label style="font-size: 0.8rem; display: flex; align-items: center; gap: 0.4rem;"><input type="checkbox" checked /> Cognac Tan Leather</label>
            <label style="font-size: 0.8rem; display: flex; align-items: center; gap: 0.4rem;"><input type="checkbox" checked /> Midnight Black Leather</label>
            <label style="font-size: 0.8rem; display: flex; align-items: center; gap: 0.4rem;"><input type="checkbox" /> Espresso Brown Leather</label>
            <label style="font-size: 0.8rem; display: flex; align-items: center; gap: 0.4rem;"><input type="checkbox" /> American Walnut Wood</label>
          </div>
          <button onclick="alert('Free leather swatch kit requested! Order confirmation sent to your address.'); closeSwatchModal();" class="btn-primary" style="width: 100%; margin-top: 1rem;">Order Free Swatch Kit 📦</button>
        </div>
      </div>

      <!-- Room Visualizer Modal -->
      <div id="roomModal" class="pb-modal-overlay">
        <div class="pb-modal-content" style="max-width: 800px;">
          <button onclick="closeRoomVisualizer()" class="pb-modal-close">✕</button>
          <h2 style="font-family: var(--font-serif); margin-top: 0;" id="visualizerTitle">3D Room Visualizer Preview</h2>
          <div style="height: 340px; background: #222; border-radius: 8px; overflow: hidden; position: relative; display: flex; align-items: center; justify-content: center;">
            <img id="roomBgImg" src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.85;" />
            <img id="roomProductImg" src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80" style="position: absolute; width: 55%; bottom: 10%; filter: drop-shadow(0 20px 25px rgba(0,0,0,0.6));" />
          </div>
          <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
            <button onclick="setRoomBg('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80')" class="btn-secondary" style="font-size: 0.75rem; padding: 0.4rem 0.8rem;">Modern Living</button>
            <button onclick="setRoomBg('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80')" class="btn-secondary" style="font-size: 0.75rem; padding: 0.4rem 0.8rem;">Urban Loft</button>
            <button onclick="setRoomBg('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80')" class="btn-secondary" style="font-size: 0.75rem; padding: 0.4rem 0.8rem;">Warm Studio</button>
          </div>
        </div>
      </div>

      <!-- Oxygen Edge Inspector HUD -->
      <div class="oxygen-inspector">
        <div class="oxygen-inspector-panel" id="inspectorPanel">
          <div class="oxygen-inspector-header">
            <h4><span class="pulse-dot"></span> Oxygen Edge Inspector</h4>
            <button onclick="toggleInspector()" style="background: none; border: none; color: #999; cursor: pointer;">✕</button>
          </div>
          <div class="oxygen-metric"><span>Loader TTFB / Edge Latency:</span><span class="oxygen-metric-tag" style="color:#34d399; background:rgba(52,211,153,0.1);" id="edgeLatency">14ms</span></div>
          <div class="oxygen-metric"><span>Caching Strategy:</span><span class="oxygen-metric-tag">CacheShort (s-maxage=1s)</span></div>
          <div class="oxygen-metric"><span>Storefront API GraphQL:</span><span style="color:#60a5fa;">graphql/2026-04</span></div>
          <div class="oxygen-metric"><span>Query Executed:</span><span style="color:#a78bfa;">PRODUCT_QUERY</span></div>
        </div>

        <button onclick="toggleInspector()" class="oxygen-inspector-toggle">
          <span class="pulse-dot"></span>
          <span>Oxygen Edge Inspector</span>
          <span style="background: rgba(255,255,255,0.15); padding: 2px 6px; border-radius: 4px; font-size: 0.7rem;" id="hudLatencyBadge">14ms</span>
        </button>
      </div>

      <footer class="footer" style="background: var(--color-dark); color: #fff; padding: 4rem 2rem 2rem; margin-top: 4rem;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 2rem;">
          <div>
            <h3 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-cognac);">POLY & BARK</h3>
            <p style="font-size: 0.85rem; color: #aaa;">Headless Shopify storefront built with Hydrogen & Remix Oxygen edge runtime.</p>
          </div>
          <div style="font-size: 0.75rem; color: #777;">© 2026 Poly & Bark. Headless Hydrogen Storefront.</div>
        </div>
      </footer>
    </div>

    <!-- Client-Side State Management Script -->
    <script>
      let cartItems = [
        {
          id: 'item-1',
          title: 'Napa Cognac Leather Sofa',
          price: 1899,
          image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
          variant: 'Cognac Tan / 88" 3-Seater',
          quantity: 1
        }
      ];

      function renderCart() {
        const container = document.getElementById('cartItemsContainer');
        const badge = document.getElementById('cartCountBadge');
        const headerQty = document.getElementById('cartHeaderQty');
        const subtotalEl = document.getElementById('cartSubtotal');
        const progressText = document.getElementById('shippingProgressText');
        const progressPct = document.getElementById('shippingProgressPct');
        const progressBar = document.getElementById('shippingProgressBar');

        const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        badge.textContent = totalQty;
        headerQty.textContent = totalQty;
        subtotalEl.textContent = '$' + subtotal.toLocaleString('en-US', {minimumFractionDigits: 2});

        const threshold = 999;
        if (subtotal >= threshold) {
          progressText.textContent = '🎉 You unlocked FREE White-Glove Delivery!';
          progressPct.textContent = '100%';
          progressBar.style.width = '100%';
        } else {
          const remaining = threshold - subtotal;
          const pct = Math.min(100, Math.floor((subtotal / threshold) * 100));
          progressText.textContent = 'Add $' + remaining + ' more for Free White-Glove Delivery';
          progressPct.textContent = pct + '%';
          progressBar.style.width = pct + '%';
        }

        if (cartItems.length === 0) {
          container.innerHTML = '<div style="text-align:center; padding: 2rem 0; color: #888;"><p>Your cart is empty.</p></div>';
          return;
        }

        container.innerHTML = cartItems.map((item, idx) => \`
          <div style="display: flex; gap: 1rem; border-bottom: 1px solid #eee; padding-bottom: 1rem; margin-bottom: 1rem;">
            <img src="\${item.image}" style="width: 75px; height: 75px; object-fit: cover; border-radius: 4px;" />
            <div style="flex-grow: 1;">
              <h4 style="font-size: 0.9rem; margin: 0 0 0.25rem 0; font-family: var(--font-serif);">\${item.title}</h4>
              <div style="font-size: 0.75rem; color: #666; margin-bottom: 0.4rem;">\${item.variant}</div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; border: 1px solid #ccc; border-radius: 4px; overflow: hidden;">
                  <button onclick="updateQty(\${idx}, -1)" style="padding: 2px 8px; background: #f9f9f9; border: none; cursor: pointer;">-</button>
                  <span style="padding: 0 8px; font-size: 0.8rem; font-weight: 600;">\${item.quantity}</span>
                  <button onclick="updateQty(\${idx}, 1)" style="padding: 2px 8px; background: #f9f9f9; border: none; cursor: pointer;">+</button>
                </div>
                <span style="font-weight: 700; font-size: 0.9rem;">$\${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            </div>
            <button onclick="removeCartItem(\${idx})" style="background: none; border: none; color: #999; cursor: pointer; font-size: 1rem; align-self: flex-start;">✕</button>
          </div>
        \`).join('');
      }

      function addToCart(title, price, image, variant) {
        const existing = cartItems.find(i => i.title === title && i.variant === variant);
        if (existing) {
          existing.quantity += 1;
        } else {
          cartItems.push({ id: 'item-' + Date.now(), title, price, image, variant, quantity: 1 });
        }
        renderCart();
        openCartDrawer();
      }

      function updateQty(idx, delta) {
        if (cartItems[idx]) {
          cartItems[idx].quantity += delta;
          if (cartItems[idx].quantity <= 0) {
            cartItems.splice(idx, 1);
          }
          renderCart();
        }
      }

      function removeCartItem(idx) {
        cartItems.splice(idx, 1);
        renderCart();
      }

      function openCartDrawer() {
        document.getElementById('cartDrawer').classList.add('expanded');
      }

      function closeCartDrawer() {
        document.getElementById('cartDrawer').classList.remove('expanded');
      }

      function openSwatchModal() {
        document.getElementById('swatchModal').style.display = 'flex';
      }

      function closeSwatchModal() {
        document.getElementById('swatchModal').style.display = 'none';
      }

      function openRoomVisualizer(title, imgUrl) {
        document.getElementById('visualizerTitle').textContent = '3D Room Visualizer — ' + title;
        document.getElementById('roomProductImg').src = imgUrl;
        document.getElementById('roomModal').style.display = 'flex';
      }

      function closeRoomVisualizer() {
        document.getElementById('roomModal').style.display = 'none';
      }

      function setRoomBg(bgUrl) {
        document.getElementById('roomBgImg').src = bgUrl;
      }

      function toggleInspector() {
        const p = document.getElementById('inspectorPanel');
        p.style.display = p.style.display === 'block' ? 'none' : 'block';
      }

      function switchFinish(type, finishName, imgUrl, price, btnEl) {
        const img = document.getElementById('img-' + type);
        const priceEl = document.getElementById('price-' + type);
        if (img) img.src = imgUrl;
        if (priceEl) priceEl.innerHTML = '$' + price + ' <s>$' + (parseFloat(price) + 300) + '.00</s>';
        
        const dots = btnEl.parentElement.querySelectorAll('.pb-swatch-dot');
        dots.forEach(d => d.classList.remove('active'));
        btnEl.classList.add('active');
      }

      // Initialize cart state on page load
      renderCart();

      // Simulate live Oxygen sub-request latency tick
      setInterval(() => {
        const latency = Math.floor(12 + Math.random() * 6) + 'ms';
        document.getElementById('edgeLatency').textContent = latency;
        document.getElementById('hudLatencyBadge').textContent = latency;
      }, 2500);
    </script>
  </body>
</html>`;

app.use((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=1, stale-while-revalidate=60');
  res.send(getStorefrontHTML(req.url));
});

app.listen(PORT, () => {
  console.log(`🚀 Poly & Bark Headless Storefront active on http://localhost:${PORT}`);
});
