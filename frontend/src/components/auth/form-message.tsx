import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function FormMessage({
  isError,
  title,
  message,
}: {
  isError: boolean;
  title?: string;
  message: string;
}) {
  return (
    <Alert variant={isError ? "destructive" : "success"} aria-live="polite">
      {isError ? <AlertCircle aria-hidden="true" /> : <CheckCircle2 aria-hidden="true" />}
      <AlertTitle>{title ?? (isError ? "Something went wrong" : "Success")}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
