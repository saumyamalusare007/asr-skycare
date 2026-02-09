import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Plane, Users, DollarSign, Clock, Search, MoreVertical,
  CheckCircle, AlertCircle, XCircle, MapPin, Calendar, Phone, Mail,
  Activity, Heart, AlertTriangle, Baby, ChevronRight, Play,
  RefreshCw, Eye, CreditCard, Bell, Ambulance
} from "lucide-react";
import { MissionTimeline } from "@/components/booking/MissionTimeline";
import { indianCities, formatINR } from "@/lib/data";
import { useMissions, updateMissionStatus, type Mission } from "@/hooks/useMissions";
import logo from "@/assets/logo-asr.png";

const statusConfig = {
  pending: { label: "Pending", color: "bg-warning/20 text-warning", icon: Clock },
  payment_confirmed: { label: "Confirmed", color: "bg-info/20 text-info", icon: CheckCircle },
  aircraft_prep: { label: "Aircraft Prep", color: "bg-info/20 text-info", icon: Plane },
  in_progress: { label: "In Progress", color: "bg-success/20 text-success", icon: Activity },
  airborne: { label: "Airborne", color: "bg-success/20 text-success", icon: Plane },
  completed: { label: "Completed", color: "bg-muted text-muted-foreground", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-destructive/20 text-destructive", icon: XCircle },
};

const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Organ Transplant Transfer": Heart,
  "ICU-to-ICU Transfer": Activity,
  "Emergency Medical Evacuation": AlertTriangle,
  "Neonatal Care Transport": Baby,
};

// Check if a mission was created in the last 10 minutes
const isNewMission = (createdAt: string) => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffMins = diffMs / (1000 * 60);
  return diffMins <= 10;
};

export default function AdminPage() {
  const { missions, loading } = useMissions();
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOrigin, setFilterOrigin] = useState("all");
  const [newMissionAlert, setNewMissionAlert] = useState<string | null>(null);

  // Auto-select first mission
  useEffect(() => {
    if (missions.length > 0 && !selectedMission) {
      setSelectedMission(missions[0]);
    }
  }, [missions, selectedMission]);

  // Show alert for new missions
  useEffect(() => {
    const latestMission = missions[0];
    if (latestMission && isNewMission(latestMission.created_at)) {
      setNewMissionAlert(latestMission.booking_id);
      const timer = setTimeout(() => setNewMissionAlert(null), 5000);
      return () => clearTimeout(timer);
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
    activeMissions: missions.filter(m => m.mission_status === "in_progress" || m.mission_status === "airborne").length,
    pendingPayments: missions.filter(m => m.payment_status === "pending").length,
    revenue: missions.filter(m => m.payment_status === "paid").reduce((acc, m) => acc + Number(m.quoted_price), 0),
  };

  const handleAdvanceStep = async () => {
    if (!selectedMission) return;
    const newStep = (selectedMission.status_step || 1) + 1;
    const statusMap: Record<number, string> = {
      1: "payment_confirmed",
      2: "aircraft_prep",
      3: "in_progress",
      4: "airborne",
    };
    try {
      await updateMissionStatus(selectedMission.id, statusMap[newStep] || "completed", newStep);
    } catch (error) {
      console.error("Error updating mission status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* New Mission Alert */}
      <AnimatePresence>
        {newMissionAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl bg-success text-white shadow-lg flex items-center gap-3"
          >
            <Bell className="h-5 w-5 animate-pulse" />
            <span className="font-medium">New booking received: {newMissionAlert}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="ASR Aviation" className="h-8 brightness-0 invert" />
            <div className="h-6 w-px bg-white/20 hidden md:block" />
            <span className="font-semibold hidden md:block">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="hidden md:inline">Operations Center Active</span>
            </span>
            <Button variant="aviation" size="sm">
              <RefreshCw className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Refresh</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bento-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Total Missions</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{stats.totalMissions}</p>
              </div>
              <div className="p-2 md:p-3 rounded-xl bg-primary/10 hidden sm:block">
                <Plane className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bento-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Active Missions</p>
                <p className="text-2xl md:text-3xl font-bold text-success">{stats.activeMissions}</p>
              </div>
              <div className="p-2 md:p-3 rounded-xl bg-success/10 hidden sm:block">
                <Activity className="h-5 w-5 md:h-6 md:w-6 text-success" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bento-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Pending Pay</p>
                <p className="text-2xl md:text-3xl font-bold text-warning">{stats.pendingPayments}</p>
              </div>
              <div className="p-2 md:p-3 rounded-xl bg-warning/10 hidden sm:block">
                <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-warning" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bento-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Revenue</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">{formatINR(stats.revenue)}</p>
              </div>
              <div className="p-2 md:p-3 rounded-xl bg-aviation-red/10 hidden sm:block">
                <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-aviation-red" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
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
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="payment_confirmed">Confirmed</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterOrigin} onValueChange={setFilterOrigin}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {indianCities.map(city => (
                        <SelectItem key={city.code} value={city.code}>{city.code}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Mission List */}
              <div className="space-y-2 max-h-[400px] md:max-h-[500px] overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading missions...</div>
                ) : filteredMissions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No missions found</div>
                ) : (
                  filteredMissions.map((mission) => {
                    const status = statusConfig[mission.mission_status as keyof typeof statusConfig] || statusConfig.pending;
                    const ServiceIcon = serviceIcons[mission.service_type] || Plane;
                    const isNew = isNewMission(mission.created_at);
                    
                    return (
                      <button
                        key={mission.id}
                        onClick={() => setSelectedMission(mission)}
                        className={`w-full text-left p-3 md:p-4 rounded-xl border transition-all ${
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
                            {isNew && (
                              <Badge className="bg-success/20 text-success text-[10px] px-1.5 py-0">NEW</Badge>
                            )}
                          </div>
                          <Badge className={`${status.color} text-[10px] md:text-xs`}>{status.label}</Badge>
                        </div>
                        <p className="font-medium text-sm text-foreground mb-1">{mission.patient_name}</p>
                        <p className="text-xs text-muted-foreground mb-2">
                          {mission.origin_code} → {mission.destination_code}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{mission.flight_date}</span>
                          <div className="flex items-center gap-2">
                            {(mission.ambulance_pickup || mission.ambulance_dropoff) && (
                              <span className="text-warning flex items-center gap-1">
                                <Ambulance className="h-3 w-3" />
                              </span>
                            )}
                            <span className={mission.payment_status === "paid" ? "text-success" : "text-warning"}>
                              {mission.payment_status === "paid" ? "✓ Paid" : "⏳ Pending"}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Selected Mission Details */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {selectedMission && (
              <>
                {/* Mission Timeline */}
                <motion.div
                  key={selectedMission.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bento-card"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div>
                      <h2 className="font-display text-lg md:text-xl font-semibold">Mission Timeline</h2>
                      <p className="text-sm text-muted-foreground">{selectedMission.booking_id}</p>
                    </div>
                    <div className="flex gap-2">
                      {(selectedMission.status_step || 1) < 4 && (
                        <Button variant="aviation" size="sm" onClick={handleAdvanceStep}>
                          <Play className="h-4 w-4 mr-2" />
                          Advance Step
                        </Button>
                      )}
                    </div>
                  </div>

                  <MissionTimeline 
                    currentStep={selectedMission.status_step || 1} 
                    showAmbulance={selectedMission.ambulance_pickup || selectedMission.ambulance_dropoff}
                  />
                </motion.div>

                {/* Patient & Flight Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                        <p className="font-medium text-foreground">{selectedMission.patient_name}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Age</p>
                          <p className="font-medium text-foreground">{selectedMission.patient_age || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Passengers</p>
                          <p className="font-medium text-foreground">{selectedMission.passengers}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Condition</p>
                        <p className="font-medium text-foreground">{selectedMission.patient_condition || "Not specified"}</p>
                      </div>
                      {selectedMission.aadhar_id && (
                        <div>
                          <p className="text-xs text-muted-foreground">Aadhar ID</p>
                          <p className="font-medium text-foreground">{selectedMission.aadhar_id}</p>
                        </div>
                      )}
                      {selectedMission.medical_notes && (
                        <div>
                          <p className="text-xs text-muted-foreground">Medical Notes</p>
                          <p className="text-sm text-foreground">{selectedMission.medical_notes}</p>
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
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Origin</p>
                          <p className="font-medium text-foreground">{selectedMission.origin_city}</p>
                          <p className="text-xs text-muted-foreground">{selectedMission.origin_code}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Destination</p>
                          <p className="font-medium text-foreground">{selectedMission.destination_city}</p>
                          <p className="text-xs text-muted-foreground">{selectedMission.destination_code}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Flight Date</p>
                        <p className="font-medium text-foreground">{selectedMission.flight_date || "TBD"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Service Type</p>
                        <p className="font-medium text-foreground">{selectedMission.service_type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Quoted Price</p>
                        <p className="text-xl font-bold text-aviation-red">{formatINR(Number(selectedMission.quoted_price))}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Ground Support Card */}
                {(selectedMission.ambulance_pickup || selectedMission.ambulance_dropoff) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bento-card border-warning/50 bg-warning/5"
                  >
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Ambulance className="h-5 w-5 text-warning" />
                      Ground Support Required
                      <Badge className="bg-warning/20 text-warning">High Priority</Badge>
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`h-4 w-4 ${selectedMission.ambulance_pickup ? "text-success" : "text-muted-foreground"}`} />
                        <span className={selectedMission.ambulance_pickup ? "text-foreground" : "text-muted-foreground"}>
                          Pickup Ambulance
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`h-4 w-4 ${selectedMission.ambulance_dropoff ? "text-success" : "text-muted-foreground"}`} />
                        <span className={selectedMission.ambulance_dropoff ? "text-foreground" : "text-muted-foreground"}>
                          Dropoff Ambulance
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bento-card"
                >
                  <h3 className="font-semibold text-foreground mb-4">Contact Information</h3>
                  <div className="flex flex-wrap gap-4">
                    {selectedMission.contact_phone && (
                      <a href={`tel:${selectedMission.contact_phone}`} className="flex items-center gap-2 text-sm hover:text-aviation-red transition-colors">
                        <Phone className="h-4 w-4" />
                        {selectedMission.contact_phone}
                      </a>
                    )}
                    {selectedMission.contact_email && (
                      <a href={`mailto:${selectedMission.contact_email}`} className="flex items-center gap-2 text-sm hover:text-aviation-red transition-colors">
                        <Mail className="h-4 w-4" />
                        {selectedMission.contact_email}
                      </a>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
