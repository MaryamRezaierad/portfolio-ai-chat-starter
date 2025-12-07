import { AIChat } from '@/components/AIChat';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <AIChat endpoint={process.env.NEXT_PUBLIC_CHAT_API_URL ?? '/api/chat'} />
    </main>
  );
}
