import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Mission = Tables<"missions">;

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial missions
    const fetchMissions = async () => {
      try {
        const { data, error } = await supabase
          .from("missions")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setMissions(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch missions");
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("missions-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "missions",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMissions((prev) => [payload.new as Mission, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setMissions((prev) =>
              prev.map((m) => (m.id === (payload.new as Mission).id ? (payload.new as Mission) : m))
            );
          } else if (payload.eventType === "DELETE") {
            setMissions((prev) => prev.filter((m) => m.id !== (payload.old as Mission).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateMissionStatus = async (missionId: string, newStatus: string, newStep: number) => {
    const { error } = await supabase
      .from("missions")
      .update({ mission_status: newStatus, status_step: newStep })
      .eq("id", missionId);

    if (error) throw error;
  };

  return { missions, loading, error, updateMissionStatus };
}
