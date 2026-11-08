// **CRITICAL: This file must be a Client Component because it uses usePathname, useRouter, and useState hooks**

"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MAX_QUESTIONS = 50;

export default function AskFarmVisionAI() {
  const [questions, setQuestions] = useState<
    { id: string; question: string; answer: string; status: "pending" | "complete" | "error" }[]
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = usePathname();

  // Auto-focus on mount
  useEffect(() => {
    const defer = setTimeout(() => {
      const inputEl = document.querySelector('input[placeholder*="Ask"]');
      if (inputEl) inputEl.focus();
    }, 300);
    return () => clearTimeout(defer);
  }, []);

  // Input enter key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendQuestion();
      }
    },
    []
  );

  const sendQuestion = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const newQuestion = {
      id: Date.now().toString(),
      question: input,
      answer: "",
      status: "pending",
    };

    setIsLoading(true);
    setQuestions((prev) => {
      const updated = [...prev, newQuestion];
      return updated.length > MAX_QUESTIONS ? updated.slice(-MAX_QUESTIONS) : updated;
    });
    setInput("");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();
      const answer = data.answer || "No response from AI";

      setQuestions((prev) => {
        return prev.map((q) =>
          q.id === newQuestion.id ? { ...q, answer, status: "complete" } : q
        );
      });
    } catch (error) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === newQuestion.id ? { ...q, answer: "Error: Failed to get AI response", status: "error" } : q
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, router, input]);

  const suggestedQuestions = [
    "What is the current feed level?",
    "Check water temperature status",
    "Any alerts on sensor data?",
    "How are the animals behaving?",
    "Review yesterday's temperature trends",
    "Optimize feeding schedule",
    "Check energy consumption",
  ];

  return (
    <Card className="min-h-[500px] max-w-2xl mx-auto bg-card border border-border">
      <CardHeader className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ChevronLeft
            className="size-4 text-primary flex-shrink-0"
            aria-hidden="true"
          />
          <span>Ask FarmVision AI</span>
          <ChevronRight
            className="size-4 text-primary flex-shrink-0 hidden"
            aria-hidden="true"
          />
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard")}
          aria-label="Go back to dashboard"
          className="hidden sm:block"
          asChild
        >
          <ChevronRight className="size-4 p-2" />
        </Button>
      </CardHeader>

      <CardContent className="p-4 flex-1 space-y-3">
        {/* Suggestions chip row */}
        <div className="grid grid-cols-2 gap-2 mb-3" role="list">
          {suggestedQuestions.map((q, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              onClick={() => {
                setInput(q);
                setTimeout(() => input.length && sendQuestion(), 100);
              }}
              className="px-3 py-1.5 text-xs font-medium"
            >
              {q}
            </Button>
          ))}
        </div>

        {/* Questions list */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {questions.map((q) => {
            const isLast = q === questions[questions.length - 1];
            const isLoading = q.status === "pending";
            const hasAnswer = q.status === "complete" && !!q.answer;
            const hasError = q.status === "error";

            return (
              <div
                key={q.id}
                className={`p-3 rounded-lg ${
                  isLoading
                    ? "bg-primary/5 animate-bounce"
                    : hasError
                      ? "bg-destructive/10 text-destructive"
                      : hasAnswer
                        ? "bg-background/50"
                        : "bg-transparent"
                }`}
                style={{
                  transition: "all 0.2s ease",
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar/Icon */}
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center flex-none"
                    style={{
                      background:
                        isLoading || !hasAnswer
                          ? "var(--primary)"
                          : "var(--muted)",
                      color:
                        isLoading || !hasAnswer
                          ? "var(--primary-foreground)"
                          : "var(--muted-foreground)",
                    }}
                  >
                    {isLoading
                      ? (
                        <svg
                          className="size-3 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                          strokeCurrentColor
                        >
                          <path
                            strokeLineCap="round"
                            strokeLineJoin="round"
                            strokeWidth={2}
                            d="M12 15l2.293-2.293m0 0l-1.293 1.293m1.707-1.707l3.293-3.293m0 0l-3.293-3.293m3.293 3.293l1.293 1.293m-1.707 1.707L12 5l-6.707 6.707"
                          />
                        </svg>
                      )
                      : q.question[0]
                      ? q.question[0].toUpperCase()
                      : "F"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate line-clamp-2">
                      {q.question}
                    </p>
                    {hasError && (
                      <p className="text-xs text-destructive/80 mt-1">
                        ❌ {q.answer}
                      </p>
                    )}
                    {hasAnswer && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {q.answer}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty state when no questions yet or only input is typing */}
          {!questions.length && (
            <p className="p-3 text-center text-muted-foreground/60">
              Ask me anything about your farm's feed, water, temperature, or sensor data
            </p>
          )}
        </div>

        {/* Input area at bottom */}
        <div className="p-3 border-t border-border/60 flex gap-2">
          <Input
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1 border rounded-lg focus-visible:ring-primary"
          />
          <Button
            disabled={isLoading || !input.trim()}
            onClick={sendQuestion}
            className="flex-shrink-0"
          >
            {isLoading ? (
              <svg
                className="size-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                strokeCurrentColor
              >
                <path
                  strokeLineCap="round"
                  strokeLineJoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.562a1 1 0 01.954.692l5.358 3.635a1 1 0 01.64 1.04l-.156 1.318L12 19.25l-7.845-5.338a1 1 0 01.142-1.633L9.333 5.535a1 1 0 01.641-.3l5.358-3.636A1 1 0 0120 4H4z"
                />
              </svg>
            ) : "Send"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}