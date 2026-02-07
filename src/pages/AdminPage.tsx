import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import {
  Plane, Users, DollarSign, Clock, Search, MoreVertical,
  CheckCircle, AlertCircle, XCircle, MapPin, Calendar, Phone, Mail,
  Activity, Heart, AlertTriangle, Baby, Play,
  RefreshCw, Eye, CreditCard, Bell, ChevronRight, Ambulance
} from "lucide-react";
import { indianCities, formatINR } from "@/lib/data";
import { useMissions } from "@/hooks/useMissions";
import logo from "@/assets/logo-asr.png";

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  payment_confirmed: { label: "Payment Confirmed", color: "bg-info/20 text-info", icon: CheckCircle },
  aircraft_prep: { label: "Aircraft Prep", color: "bg-warning/20 text-warning", icon: Clock },
  ambulance_enroute: { label: "Ambulance En-route", color: "bg-aviation-red/20 text-aviation-red", icon: Activity },
  airborne: { label: "Airborne", color: "bg-success/20 text-success", icon: Plane },
  landed: { label: "Landed", color: "bg-success/20 text-success", icon: CheckCircle },
  completed: { label: "Completed", color: "bg-muted text-muted-foreground", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-destructive/20 text-destructive", icon: XCircle },
};

const timelineSteps = [
  { step: 1, label: "Payment", status: "payment_confirmed" },
  { step: 2, label: "Aircraft Prep", status: "aircraft_prep" },
  { step: 3, label: "Ambulance", status: "ambulance_enroute" },
  { step: 4, label: "Airborne", status: "airborne" },
];

const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "organ-transplant": Heart,
  "icu-transfer": Activity,
  "emergency-evac": AlertTriangle,
  "neonatal": Baby,
};

export default function AdminPage() {
  const { missions, loading, updateMissionStatus } = useMissions();
  const [selectedMission, setSelectedMission] = useState<typeof missions[0] | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOrigin, setFilterOrigin] = useState("all");
  const [newMissionAlert, setNewMissionAlert] = useState<string | null>(null);

  // Select first mission when loaded
  useEffect(() => {
    if (missions.length > 0 && !selectedMission) {
      setSelectedMission(missions[0]);
    }
  }, [missions, selectedMission]);

  // Show alert for new missions
  useEffect(() => {
    if (missions.length > 0) {
      const latestMission = missions[0];
      const missionAge = Date.now() - new Date(latestMission.created_at).getTime();
      if (missionAge < 10000) { // Less than 10 seconds old
        setNewMissionAlert(latestMission.patient_name);
        setTimeout(() => setNewMissionAlert(null), 5000);
      }
    }
  }, [missions]);

  const filteredMissions = missions.filter((mission) => {
    if (filterStatus !== "all" && mission.mission_status !== filterStatus) return false;
    if (filterOrigin !== "all" && mission.origin_code !== filterOrigin) return false;
    if (searchQuery && 
        !mission.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !mission.booking_id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    totalMissions: missions.length,
    activeMissions: missions.filter(m => ["aircraft_prep", "ambulance_enroute", "airborne"].includes(m.mission_status || "")).length,
    pendingPayments: missions.filter(m => m.payment_status === "pending").length,
    revenue: missions.filter(m => m.payment_status === "paid").reduce((acc, m) => acc + Number(m.quoted_price), 0),
  };

  const handleAdvanceStep = async () => {
    if (!selectedMission) return;
    const currentStep = selectedMission.status_step || 1;
    if (currentStep >= 4) return;

    const nextStep = currentStep + 1;
    const nextStatus = timelineSteps[nextStep - 1]?.status || "airborne";
    
    await updateMissionStatus(selectedMission.id, nextStatus, nextStep);
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20 lg:pb-0">
      {/* New Mission Alert */}
      <AnimatePresence>
        {newMissionAlert && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-aviation-red text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3"
          >
            <Bell className="h-5 w-5 animate-bounce" />
            <span className="font-medium">New Mission: {newMissionAlert}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="ASR Aviation" className="h-8 brightness-0 invert" />
            <div className="h-6 w-px bg-white/20 hidden sm:block" />
            <span className="font-semibold hidden sm:inline">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="hidden sm:inline">Operations Center Active</span>
            </span>
            <Button variant="aviation" size="sm" className="min-h-[40px]">
              <RefreshCw className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 lg:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bento-card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Missions</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{stats.totalMissions}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
                <Plane className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bento-card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
                <p className="text-2xl sm:text-3xl font-bold text-success">{stats.activeMissions}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-success/10">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bento-card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl sm:text-3xl font-bold text-warning">{stats.pendingPayments}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-warning/10">
                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-warning" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bento-card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Revenue</p>
                <p className="text-lg sm:text-2xl font-bold text-foreground">{formatINR(stats.revenue)}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-aviation-red/10">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-aviation-red" />
              </div>
            </div>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 border-4 border-aviation-red border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bookings List */}
            <div className="lg:col-span-1">
              <div className="bento-card h-fit">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg font-semibold">Mission Queue</h2>
                  <span className="text-sm text-muted-foreground">{filteredMissions.length} missions</span>
                </div>

                {/* Filters */}
                <div className="space-y-3 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="flex-1 min-h-[40px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="payment_confirmed">Payment Confirmed</SelectItem>
                        <SelectItem value="aircraft_prep">Aircraft Prep</SelectItem>
                        <SelectItem value="ambulance_enroute">Ambulance En-route</SelectItem>
                        <SelectItem value="airborne">Airborne</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterOrigin} onValueChange={setFilterOrigin}>
                      <SelectTrigger className="flex-1 min-h-[40px]">
                        <SelectValue placeholder="City" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {indianCities.map(city => (
                          <SelectItem key={city.code} value={city.code}>{city.code}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Mission List */}
                <div className="space-y-2 max-h-[400px] lg:max-h-[500px] overflow-y-auto">
                  {filteredMissions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Plane className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No missions found</p>
                    </div>
                  ) : (
                    filteredMissions.map((mission) => {
                      const status = statusConfig[mission.mission_status || "payment_confirmed"] || statusConfig.payment_confirmed;
                      const ServiceIcon = serviceIcons[mission.service_type] || Activity;
                      return (
                        <button
                          key={mission.id}
                          onClick={() => setSelectedMission(mission)}
                          className={`w-full text-left p-4 rounded-xl border transition-all min-h-[80px] ${
                            selectedMission?.id === mission.id
                              ? "border-aviation-red bg-aviation-red/5"
                              : "border-border hover:border-aviation-red/50 hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-primary/10">
                                <ServiceIcon className="h-4 w-4 text-primary" />
                              </div>
                              <span className="font-medium text-foreground text-sm">{mission.booking_id}</span>
                            </div>
                            <Badge className={`${status.color} text-[10px]`}>{status.label}</Badge>
                          </div>
                          <p className="font-medium text-sm text-foreground mb-1">{mission.patient_name}</p>
                          <p className="text-xs text-muted-foreground mb-2">
                            {mission.origin_code} → {mission.destination_code}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              {new Date(mission.created_at).toLocaleDateString()}
                            </span>
                            <span className={mission.payment_status === "paid" ? "text-success" : "text-warning"}>
                              {mission.payment_status === "paid" ? "✓ Paid" : "⏳ Pending"}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Selected Mission Details */}
            <div className="lg:col-span-2 space-y-6">
              {selectedMission ? (
                <>
                  {/* Mission Timeline */}
                  <motion.div
                    key={selectedMission.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bento-card"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                      <div>
                        <h2 className="font-display text-xl font-semibold">Mission Timeline</h2>
                        <p className="text-sm text-muted-foreground">{selectedMission.booking_id}</p>
                      </div>
                      <div className="flex gap-2">
                        {(selectedMission.status_step || 1) < 4 && (
                          <Button variant="aviation" size="sm" onClick={handleAdvanceStep} className="min-h-[40px]">
                            <Play className="h-4 w-4 mr-2" />
                            Advance Step
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        {timelineSteps.map((step) => {
                          const isCompleted = (selectedMission.status_step || 1) > step.step;
                          const isCurrent = (selectedMission.status_step || 1) === step.step;
                          return (
                            <div key={step.step} className="flex flex-col items-center relative z-10 flex-1">
                              <motion.div
                                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                                  isCompleted
                                    ? "bg-success border-success text-white"
                                    : isCurrent
                                    ? "bg-aviation-red border-aviation-red text-white"
                                    : "bg-background border-border text-muted-foreground"
                                }`}
                                animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ repeat: Infinity, duration: 2 }}
                              >
                                {isCompleted ? (
                                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                                ) : (
                                  <span className="font-semibold text-sm">{step.step}</span>
                                )}
                              </motion.div>
                              <span className={`mt-2 text-[10px] sm:text-xs font-medium text-center ${
                                isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                              }`}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      {/* Progress Line */}
                      <div className="absolute top-5 sm:top-6 left-[10%] right-[10%] h-0.5 bg-border -z-0">
                        <motion.div
                          className="h-full bg-gradient-to-r from-success to-aviation-red"
                          initial={{ width: "0%" }}
                          animate={{ width: `${(((selectedMission.status_step || 1) - 1) / (timelineSteps.length - 1)) * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Patient & Flight Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bento-card"
                    >
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        Patient Details
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Name</p>
                          <p className="font-medium">{selectedMission.patient_name}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Age</p>
                            <p className="font-medium">{selectedMission.patient_age || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Condition</p>
                            <p className="font-medium text-sm">{selectedMission.patient_condition || "N/A"}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Contact</p>
                          <p className="font-medium text-sm">{selectedMission.contact_phone || "N/A"}</p>
                        </div>
                        {selectedMission.medical_notes && (
                          <div>
                            <p className="text-xs text-muted-foreground">Medical Notes</p>
                            <p className="text-sm text-muted-foreground">{selectedMission.medical_notes}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bento-card"
                    >
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Plane className="h-5 w-5 text-muted-foreground" />
                        Flight Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold">{selectedMission.origin_code}</p>
                            <p className="text-xs text-muted-foreground">{selectedMission.origin_city}</p>
                          </div>
                          <div className="flex-1 flex items-center gap-2">
                            <div className="h-px flex-1 bg-border" />
                            <Plane className="h-4 w-4 text-muted-foreground -rotate-45" />
                            <div className="h-px flex-1 bg-border" />
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">{selectedMission.destination_code}</p>
                            <p className="text-xs text-muted-foreground">{selectedMission.destination_city}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Aircraft</p>
                            <p className="font-medium text-sm">{selectedMission.aircraft_model || "Pending"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Passengers</p>
                            <p className="font-medium">{selectedMission.passengers || 1}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {selectedMission.ambulance_pickup && (
                            <span className="flex items-center gap-1 text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                              <Ambulance className="h-3 w-3" />
                              Pickup
                            </span>
                          )}
                          {selectedMission.ambulance_dropoff && (
                            <span className="flex items-center gap-1 text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                              <Ambulance className="h-3 w-3" />
                              Dropoff
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Payment Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bento-card"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Status</p>
                        <p className="text-2xl font-bold text-foreground">{formatINR(Number(selectedMission.quoted_price))}</p>
                      </div>
                      <Badge className={selectedMission.payment_status === "paid" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"}>
                        {selectedMission.payment_status === "paid" ? "✓ Payment Received" : "⏳ Payment Pending"}
                      </Badge>
                    </div>
                  </motion.div>
                </>
              ) : (
                <div className="bento-card flex items-center justify-center py-20">
                  <div className="text-center text-muted-foreground">
                    <Plane className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a mission to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <MobileBottomNav />
    </div>
  );
}
