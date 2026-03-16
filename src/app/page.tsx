import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-gray-900">
        AetherFlow
      </h1>
      <p className="mt-6 text-lg text-gray-600 max-w-2xl">
        Real-time collaborative task manager with AI-powered suggestions.
        <br />
        Built for modern teams — Next.js 16 • Supabase • Groq • TanStack Query
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="text-base">
          Get Started
        </Button>
        <Button variant="outline" size="lg" className="text-base">
          View Demo
        </Button>
      </div>
    </main>
  );
}
