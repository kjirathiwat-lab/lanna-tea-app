"use client";

import { useCallback, useMemo, useState } from "react";
import {
  TEA_MATRIX_KEYS,
  type RecommendResponse,
  type TeaMatrix,
  type TeaMatrixKey,
  type UserAssessmentPayload,
} from "@/types/tea.types";

const LABELS: Record<TeaMatrixKey, string> = {
  floral: "Floral",
  fruity: "Fruity",
  earthy: "Earthy",
  sweet: "Sweet",
  bitter: "Bitter",
  warming: "Warming",
  caffeine: "Caffeine",
};

const DEFAULT_PREFERENCES: TeaMatrix = {
  floral: 0.5,
  fruity: 0.5,
  earthy: 0.5,
  sweet: 0.5,
  bitter: 0.3,
  warming: 0.4,
  caffeine: 0.4,
};

type FormState = "idle" | "loading" | "success" | "error";

export function RecommendationForm() {
  const [preferences, setPreferences] =
    useState<TeaMatrix>(DEFAULT_PREFERENCES);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<RecommendResponse | null>(null);

  const sessionId = useMemo(() => crypto.randomUUID(), []);

  const updatePreference = useCallback(
    (key: TeaMatrixKey, value: number) => {
      setPreferences((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState("loading");
    setErrorMessage(null);

    const payload: UserAssessmentPayload = {
      preferences,
      sessionId,
      constraints: { inStockOnly },
    };

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to fetch recommendations");
      }

      const data = (await response.json()) as RecommendResponse;
      setResults(data);
      setFormState("success");
    } catch (error) {
      setFormState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Unexpected error",
      );
    }
  };

  return (
    <section className="mx-auto w-full max-w-2xl space-y-8 p-6">
      <header>
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Find Your Tea
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Adjust the sliders to match your taste profile.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {TEA_MATRIX_KEYS.map((key) => (
          <label key={key} className="block space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {LABELS[key]}
              </span>
              <span className="tabular-nums text-zinc-500">
                {preferences[key].toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={preferences[key]}
              onChange={(e) =>
                updatePreference(key, Number(e.target.value))
              }
              className="w-full"
            />
          </label>
        ))}

        <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          In stock only
        </label>

        <button
          type="submit"
          disabled={formState === "loading"}
          className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {formState === "loading" ? "Finding teas…" : "Get Recommendations"}
        </button>
      </form>

      {formState === "error" && errorMessage && (
        <p role="alert" className="text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      {results && (
        <ol className="space-y-4">
          {results.recommendations.map(({ product, score }, index) => (
            <li
              key={product.id}
              className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    #{index + 1} · {product.origin}
                  </p>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {product.description}
                  </p>
                </div>
                <span className="shrink-0 text-sm tabular-nums text-zinc-500">
                  {score.toFixed(3)}
                </span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
