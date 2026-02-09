import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Mission = Tables<"missions">;

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch initial data
    const fetchMissions = async () => {
      try {
        const { data, error } = await supabase
          .from("missions")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setMissions(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();

    // Set up real-time subscription
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
          console.log("Real-time mission update:", payload);
          
          if (payload.eventType === "INSERT") {
            setMissions((prev) => [payload.new as Mission, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setMissions((prev) =>
              prev.map((m) =>
                m.id === (payload.new as Mission).id ? (payload.new as Mission) : m
              )
            );
          } else if (payload.eventType === "DELETE") {
            setMissions((prev) =>
              prev.filter((m) => m.id !== (payload.old as Mission).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { missions, loading, error };
}

export async function createMission(missionData: Omit<Mission, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase
    .from("missions")
    .insert(missionData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMissionStatus(id: string, status: string, statusStep: number) {
  const { data, error } = await supabase
    .from("missions")
    .update({ mission_status: status, status_step: statusStep })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
