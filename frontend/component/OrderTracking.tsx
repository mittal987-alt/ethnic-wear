"use client";


export default function OrderTracking({ timeline }: { timeline: any[] }) {
  const steps = [
    "Placed",
    "Confirmed",
    "Packed",
    "Shipped",
    "Out for delivery",
    "Delivered",
  ];

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center text-xs">
        {steps.map((step, i) => {
          const completed = timeline.find(t => t.status === step);

          return (
            <div key={step} className="flex-1 text-center">
              <div
                className={`w-3 h-3 mx-auto rounded-full ${
                  completed ? "bg-green-600" : "bg-gray-300"
                }`}
              />
              <p className={completed ? "text-green-600" : "text-gray-400"}>
                {step}
              </p>
              {completed && (
                <p className="text-[10px] text-gray-400">
                  {new Date(completed.date).toLocaleString()}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
