import { OrderStatus } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS: { status: OrderStatus; label: string; emoji: string }[] = [
  { status: "received", label: "Received", emoji: "📋" },
  { status: "preparing", label: "Preparing", emoji: "👨‍🍳" },
  { status: "ready", label: "Ready", emoji: "🔔" },
  { status: "served", label: "Served", emoji: "✨" },
];

const STATUS_ORDER: OrderStatus[] = ["received", "preparing", "ready", "served"];

type StatusStepperProps = {
  currentStatus: OrderStatus;
  variant?: "customer" | "admin";
};

export function StatusStepper({ currentStatus, variant = "customer" }: StatusStepperProps) {
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="flex items-start gap-0 w-full">
      {STEPS.map((step, idx) => {
        const isDone = idx < currentIdx;
        const isActive = idx === currentIdx;
        const isPending = idx > currentIdx;

        return (
          <div key={step.status} className="flex-1 flex flex-col items-center relative">
            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  "absolute top-4 left-1/2 w-full h-0.5 transition-colors duration-500",
                  isDone || isActive ? "bg-primary" : "bg-border"
                )}
                style={{ left: "50%", width: "100%" }}
              />
            )}

            {/* Circle */}
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300 text-sm border-2",
                isDone
                  ? "bg-primary border-primary text-primary-foreground"
                  : isActive
                  ? "bg-primary border-primary text-primary-foreground animate-pulse-ring"
                  : "bg-card border-border text-muted-foreground"
              )}
            >
              {isDone ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-xs">{step.emoji}</span>
              )}
            </div>

            {/* Label */}
            <span
              className={cn(
                "text-[10px] mt-1.5 font-medium text-center leading-tight",
                isActive
                  ? variant === "customer"
                    ? "text-primary font-semibold"
                    : "text-primary font-semibold"
                  : isDone
                  ? "text-muted-foreground"
                  : "text-muted-foreground/60"
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
