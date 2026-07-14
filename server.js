import { createServer } from 'http';
import next from 'next';
import { attachBattleRoyale } from './src/server/br/battleRoyaleServer.js';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT, 10) || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  // Attach the Battle Royale Socket.io server
  attachBattleRoyale(httpServer);

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Pixelmon Next.js Server ready on http://localhost:${port} (Web app + REST + Battle Royale Socket.io)`);
  });
});
