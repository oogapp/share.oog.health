
export default function Home() {
  // redirect to oog.health
  if (typeof window !== 'undefined') {
    window.location.href = 'https://oog.health';
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

    </main>
  );
}
