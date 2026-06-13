import { Check } from "lucide-react";
import type { OrderStage } from "../../types";

const STAGES: OrderStage[] = [
  "Order Registered",
  "Payment Verified in Escrow",
  "Batch Dispatched",
  "Completed & Delivered",
];

export default function OrderStepper({ currentStage }: { currentStage: OrderStage }) {
  const currentIndex = STAGES.indexOf(currentStage);

  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:items-start sm:gap-0">
      {STAGES.map((stage, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const isLast = i === STAGES.length - 1;
        return (
          <li key={stage} className="flex flex-1 items-start gap-3 sm:flex-col sm:items-start sm:gap-2">
            <div className="flex items-center sm:w-full">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold ${
                  done
                    ? "border-brand-600 bg-brand-600 text-white"
                    : active
                    ? "border-brand-600 bg-white text-brand-600"
                    : "border-border bg-white text-text"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              {!isLast && (
                <div
                  className={`hidden h-0.5 flex-1 sm:block ${
                    done ? "bg-brand-600" : "bg-border"
                  }`}
                />
              )}
            </div>
            <div className="pb-4 sm:pb-0">
              <p
                className={`text-xs font-medium ${
                  done || active ? "text-text-h" : "text-text"
                }`}
              >
                {stage}
              </p>
            </div>
            {!isLast && (
              <div
                className={`ml-3.5 h-6 w-0.5 sm:hidden ${
                  done ? "bg-brand-600" : "bg-border"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
