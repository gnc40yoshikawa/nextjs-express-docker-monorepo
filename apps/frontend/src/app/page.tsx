// apps/frontend/app/page.tsx
type MessageResponse = {
  message: string;
};

// サーバー側で backend へ HTTP リクエスト
async function getMessage(): Promise<MessageResponse> {
  const backendUrl = process.env.BACKEND_URL ?? "http://backend:4000";
  const res = await fetch(`${backendUrl}/message`, {
    cache: "no-store", // 毎回最新を取りに行く
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch from backend: ${res.status}`);
  }

  return res.json();
}

// ページコンポーネント
export default async function Page() {
  const data = await getMessage();

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Backendの出力</h1>
      <p>{data.message}</p>
    </main>
  );
}
