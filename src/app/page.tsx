import { RecommendationForm } from '@/components/RecommendationForm';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-stone-100 flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">
          Lanna & Tribal Tea Experience
        </h1>
        <p className="text-stone-600">
          ศิลปะแห่งชาล้านนาชั้นสูง ผสานศาสตร์การจับคู่รสชาติด้วย AI
        </p>
      </div>
      <RecommendationForm />
    </main>
  );
}