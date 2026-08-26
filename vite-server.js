import express from 'express';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  app.use(vite.middlewares);

  app.use(async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const { default: fetchHandler } = await vite.ssrLoadModule('/server.js');

      const fullUrl = `http://${req.get('host') || 'localhost:3000'}${url}`;
      const webRequest = new Request(fullUrl, {
        method: req.method,
        headers: req.headers,
      });

      const mockEnv = {
        SESSION_SECRET: 'foobar_poly_bark_key',
        PUBLIC_STORE_DOMAIN: 'mock.shop',
        PUBLIC_STOREFRONT_API_TOKEN: 'mock_token',
        PUBLIC_STOREFRONT_ID: 'poly_bark_sfid',
      };

      const mockExecContext = {
        waitUntil: () => { },
        passThroughOnException: () => { },
      };

      const response = await fetchHandler.fetch(webRequest, mockEnv, mockExecContext);

      res.status(response.status);
      response.headers.forEach((val, key) => {
        res.setHeader(key, val);
      });

      const bodyText = await response.text();
      res.send(bodyText);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Poly & Bark Hydrogen Storefront SSR active on http://localhost:${PORT}`);
  });
}

startServer();
