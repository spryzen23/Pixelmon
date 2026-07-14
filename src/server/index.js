import http from "http";
import express from "express";
import cors from "cors";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";
import { apiRouter } from "./routes/api.js";
import { battleRouter } from "./routes/battle.js";
import { battleEngineRouter } from "./routes/battleEngine.js";
import { attachBattleRoyale } from "./br/battleRoyaleServer.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const PUBLIC = path.join(ROOT, "public");
const CLIENT_DIST = path.join(ROOT, "client", "dist");

const PORT = Number(process.env.PORT) || 4000;

const app = express();
app.use(cors());
app.use(compression());
app.use(express.json({ limit: "1mb" }));

app.use("/api", apiRouter);
app.use("/api/battle", battleRouter);
app.use("/api/battle-engine", battleEngineRouter);

app.use(
  "/assets",
  express.static(path.join(PUBLIC, "assets"), {
    maxAge: "7d",
    etag: true,
  })
);

app.use(express.static(PUBLIC, { maxAge: "1h" }));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(CLIENT_DIST));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(CLIENT_DIST, "index.html"));
  });
}

const httpServer = http.createServer(app);
attachBattleRoyale(httpServer);

httpServer.listen(PORT, () => {
  console.log(
    `Pixelmon server http://localhost:${PORT} (REST + Battle Royale Socket.io)`
  );
});
