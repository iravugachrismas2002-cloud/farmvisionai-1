import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AskFarmVisionAI() {
  const [questions, setQuestions] = useState<
    { id: string; question: string; answer: string }[]
>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const sendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setQuestions((prev) => [
      ...prev,
      { id: Date.now().toString(), question: input, answer: "" },
    ]);

    try {
      const response = await fetch(`${pathname}api/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();

      setQuestions((prev) => {
        const updated = prev.map((q) =>
          q.id === prev[prev.length - 1].id ? { ...q, answer: data.answer } : q
        );
        return updated;
      });
    } catch (error) {
      console.error("Error sending question:", error);
      setQuestions((prev) => {
        const last = prev[prev.length - 1];
        if (last) {
          return prev.map((q) => (q.id === last.id ? { ...q, answer: "Error: Failed to get AI response" } : q));
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendQuestion();
    }
  };

  return (
    <Card className="min-h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ask FarmVision AI</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard")}
        >
          {ChevronLeft}
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 space-y-4 p-4">
        {questions.length === 0 && (
          <p className="text-muted-foreground text-sm">
            Ask me anything about your farm's feed, water, temperature, or sensor data.
          </p>
        )}

        {questions.map((q) => (
          <div key={q.id} className="space-y-3">
            <div className="flex items-start gap-3">
              <div
                className="flex-shrink-0 rounded-lg bg-primary/15 p-2.5"
                aria-hidden="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLineCap="round"
                    strokeLineJoin="round"
                    strokeWidth={2}
                    d="M15.75 19.25a3 3 0 01-1.72-1.45h-5.25a2.75 2.75 0 01-2.46-2.07l2.14-3.07a.75.75 0 01.66 0l2.14 3.07a2.75 2.75 0 01-1.05 2.38h4.58l-1.25 2.35a.75.75 0 01-1.1 0l-1.25-2.35h4.72a2.75 2.75 0 011.05 2.38l2.14-3.07a2.75 2.75 0 012.46-2.07h-5.25a3 3 0 01-1.72-1.45z"
                  />
                  <path
                    strokeLineCap="round"
                    strokeLineJoin="round"
                    strokeWidth={2}
                    d="M8.25 9h.008c.61 0 1.13.33 1.41.857l3.89 3.05a.75.75 0 01-.11 1.33l-3.89 3.05a.75.75 0 01-.9-.6l3.89-3.05a.75.75 0 01.1-.86z"
                  />
                  <path
                    strokeLineCap="round"
                    strokeLineJoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-line-clamp line-clamp-2">{q.question}</p>
              </div>
            </div>

            {q.answer && (
              <p className="text-sm text-muted-foreground line-clamp-3">{q.answer}</p>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div
              className="flex-shrink-0 rounded-lg bg-primary/15 p-2.5"
              aria-hidden="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 text-primary animate-spink"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLineCap="round"
                  strokeLineJoin="round"
                  strokeWidth={2}
                  d="M12 15l2.293-2.293m0 0l-1.293 1.293m1.707-1.707l3.293-3.293m0 0l-3.293-3.293m3.293 3.293l1.293 1.293m-1.707 1.707L12 5l-6.707 6.707"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Getting AI response...</p>
            </div>
          </div>
        )}

        {!isLoading && input && (
          <form onSubmit={sendQuestion} className="mt-3">
            <Input
              placeholder="Ask about feed levels, water temperature, or sensor data..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading} className="mt-2">
              {isLoading ? "Thinking..." : "Send"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}