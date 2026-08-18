import { RecommendationForm } from "@/components/RecommendationForm";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-black">
      <main className="flex flex-1 flex-col py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Lanna Tea
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Discover teas from Northern Thailand, matched to your taste.
          </p>
        </div>
        <RecommendationForm />
      </main>
    </div>
  );
}
