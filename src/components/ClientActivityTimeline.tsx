"use client";
import { FileText, DollarSign, Calendar, MessageSquare } from "lucide-react";
import { format } from "date-fns";

type Activity = {
  id: string;
  type: "note" | "project" | "invoice" | "meeting";
  title: string;
  description?: string;
  date: string;
  amount?: number;
};

const activityIcons = {
  note: MessageSquare,
  project: FileText,
  invoice: DollarSign,
  meeting: Calendar,
};

const activityColors = {
  note: "text-blue-400 bg-blue-500/15",
  project: "text-purple-400 bg-purple-500/15",
  invoice: "text-emerald-400 bg-emerald-500/15",
  meeting: "text-amber-400 bg-amber-500/15",
};

export function ClientActivityTimeline({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-zinc-500">
        No activity recorded yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = activityIcons[activity.type];
        const colorClass = activityColors[activity.type];
        
        return (
          <div key={activity.id} className="flex gap-3">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>
                <Icon className="h-4 w-4" />
              </div>
              {index < activities.length - 1 && (
                <div className="w-px h-full bg-white/5 mt-2" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-medium text-zinc-200">{activity.title}</h4>
                  {activity.description && (
                    <p className="text-xs text-zinc-400 mt-1">{activity.description}</p>
                  )}
                  {activity.amount && (
                    <p className="text-sm font-medium text-emerald-400 mt-1">
                      ${activity.amount.toLocaleString()}
                    </p>
                  )}
                </div>
                <span className="text-xs text-zinc-500 flex-shrink-0">
                  {format(new Date(activity.date), "MMM dd")}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

