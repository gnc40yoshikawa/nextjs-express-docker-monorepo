import express from "express";

const app = express();
const port = process.env.PORT || 4000;

app.get("/message", (_req, res) => {
  const msg = `Hello from backend! time=${new Date().toISOString()}`;
  console.log(msg); // ログにも出力
  res.json({ message: msg });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
