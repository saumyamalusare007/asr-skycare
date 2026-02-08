import { motion } from "framer-motion";
import { Plane, Activity, CreditCard, DollarSign } from "lucide-react";
import { formatINR } from "@/lib/data";

interface AdminStatsProps {
  totalMissions: number;
  activeMissions: number;
  pendingPayments: number;
  revenue: number;
}

const statsConfig = [
  { key: "totalMissions", label: "Total Missions", icon: Plane, colorClass: "bg-primary/10 text-primary" },
  { key: "activeMissions", label: "Active", icon: Activity, colorClass: "bg-success/10 text-success" },
  { key: "pendingPayments", label: "Pending", icon: CreditCard, colorClass: "bg-warning/10 text-warning" },
  { key: "revenue", label: "Revenue", icon: DollarSign, colorClass: "bg-aviation-red/10 text-aviation-red", isRevenue: true },
];

export function AdminStats({ totalMissions, activeMissions, pendingPayments, revenue }: AdminStatsProps) {
  const stats = { totalMissions, activeMissions, pendingPayments, revenue };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
      {statsConfig.map((stat, index) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bento-card p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              <p className={`${stat.isRevenue ? "text-lg sm:text-2xl" : "text-2xl sm:text-3xl"} font-bold text-foreground`}>
                {stat.isRevenue ? formatINR(stats[stat.key as keyof typeof stats]) : stats[stat.key as keyof typeof stats]}
              </p>
            </div>
            <div className={`p-2 sm:p-3 rounded-xl ${stat.colorClass.split(" ")[0]}`}>
              <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.colorClass.split(" ")[1]}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
