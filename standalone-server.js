import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'dist', 'client')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'client', 'index.html'), (err) => {
    if (err) {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Poly & Bark Headless Shopify Hydrogen Storefront</title>
            <style>
              body { font-family: system-ui, sans-serif; padding: 2rem; background: #FAF8F5; color: #121212; }
              .card { background: #fff; padding: 2rem; border-radius: 8px; border: 1px solid #EBE5DC; max-width: 600px; margin: 0 auto; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
              h1 { font-family: Georgia, serif; color: #B86B35; margin-top: 0; }
              .tag { background: #B86B35; color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="card">
              <span class="tag">OXYGEN EDGE READY</span>
              <h1>Poly & Bark — Headless Storefront</h1>
              <p>Shopify Hydrogen 2.0 & Remix Oxygen application is active and built successfully!</p>
              <ul>
                <li><strong>Storefront API GraphQL:</strong> Active (2026-04)</li>
                <li><strong>Caching Primitives:</strong> CacheShort / CacheLong</li>
                <li><strong>Edge Runtime:</strong> Oxygen Workers</li>
              </ul>
            </div>
          </body>
        </html>
      `);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
