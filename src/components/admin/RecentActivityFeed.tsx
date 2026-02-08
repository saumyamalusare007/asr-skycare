import { motion } from "framer-motion";
import { Bell, Clock } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Mission = Tables<"missions">;

interface RecentActivityFeedProps {
  missions: Mission[];
  onSelectMission: (mission: Mission) => void;
}

export function RecentActivityFeed({ missions, onSelectMission }: RecentActivityFeedProps) {
  const recentMissions = missions.slice(0, 5);

  return (
    <div className="bento-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-4 w-4 text-aviation-red" />
        <h3 className="font-semibold text-sm text-foreground">Recent Activity</h3>
        <span className="ml-auto text-[10px] text-muted-foreground flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Live
        </span>
      </div>
      
      <div className="space-y-2">
        {recentMissions.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No recent activity</p>
        ) : (
          recentMissions.map((mission, index) => {
            const missionAge = Date.now() - new Date(mission.created_at).getTime();
            const isNew = missionAge < 60000; // Less than 1 minute old
            
            return (
              <motion.button
                key={mission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectMission(mission)}
                className={`w-full text-left p-3 rounded-lg border transition-all min-h-[60px] ${
                  isNew 
                    ? "border-aviation-red/50 bg-aviation-red/5 animate-pulse-glow" 
                    : "border-border hover:border-aviation-red/30 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs text-foreground truncate">
                      {mission.patient_name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {mission.origin_code} → {mission.destination_code}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {isNew && (
                      <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-aviation-red text-white rounded-full">
                        NEW
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {formatTimeAgo(mission.created_at)}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
