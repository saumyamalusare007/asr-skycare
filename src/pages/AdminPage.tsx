import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Plane, Users, Clock, Search,
  CheckCircle, AlertCircle, XCircle, MapPin, Calendar, Phone, Mail,
  Activity, Heart, AlertTriangle, Baby,  Play,
  RefreshCw, Eye, CreditCard, FileText, LogOut
} from "lucide-react";
import { indianCities } from "@/lib/data";
import logo from "@/assets/logo-asr.png";

const mockBookings = [
  {
    id: "ASR-001",
    patientName: "Rajesh Kumar",
    age: 45,
    condition: "Cardiac Emergency",
    serviceType: "emergency-evac",
    origin: "DEL",
    destination: "BOM",
    status: "in_progress",
    statusStep: 3,
    paymentStatus: "paid",
    flightDate: "2026-02-05",
    createdAt: "2026-02-05T08:30:00",
    contactPhone: "+91 98765 43210",
    passengers: 2,
    ambulancePickup: true,
    ambulanceDropoff: true,
    assignedAircraft: "Learjet 45",
  },
  {
    id: "ASR-002",
    patientName: "Priya Sharma",
    age: 28,
    condition: "Organ Transplant",
    serviceType: "organ-transplant",
    origin: "BLR",
    destination: "DEL",
    status: "confirmed",
    statusStep: 2,
    paymentStatus: "paid",
    flightDate: "2026-02-06",
    createdAt: "2026-02-04T14:20:00",
    contactPhone: "+91 87654 32109",
    passengers: 3,
    ambulancePickup: true,
    ambulanceDropoff: false,
    assignedAircraft: "King Air B200",
  },
  {
    id: "ASR-003",
    patientName: "Baby Arjun",
    age: 0,
    condition: "Neonatal ICU Transfer",
    serviceType: "neonatal",
    origin: "MAA",
    destination: "HYD",
    status: "pending",
    statusStep: 1,
    paymentStatus: "pending",
    flightDate: "2026-02-07",
    createdAt: "2026-02-05T10:00:00",
    contactPhone: "+91 76543 21098",
    passengers: 4,
    ambulancePickup: true,
    ambulanceDropoff: true,
    assignedAircraft: null,
  },
  {
    id: "ASR-004",
    patientName: "Mohammed Ali",
    age: 62,
    condition: "ICU Transfer",
    serviceType: "icu-transfer",
    origin: "CCU",
    destination: "DEL",
    status: "completed",
    statusStep: 4,
    paymentStatus: "paid",
    flightDate: "2026-02-03",
    createdAt: "2026-02-02T09:15:00",
    contactPhone: "+91 65432 10987",
    passengers: 2,
    ambulancePickup: true,
    ambulanceDropoff: true,
    assignedAircraft: "Gulfstream G550",
  },
];

const statusConfig = {
  pending: { label: "Pending", color: "bg-warning/20 text-warning", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-info/20 text-info", icon: CheckCircle },
  in_progress: { label: "In Progress", color: "bg-success/20 text-success", icon: Activity },
  completed: { label: "Completed", color: "bg-muted text-muted-foreground", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-destructive/20 text-destructive", icon: XCircle },
};

const timelineSteps = [
  { step: 1, label: "Request Received" },
  { step: 2, label: "Aircraft Prep" },
  { step: 3, label: "Ground Ambulance" },
  { step: 4, label: "Airborne" },
];

const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "organ-transplant": Heart,
  "icu-transfer": Activity,
  "emergency-evac": AlertTriangle,
  "neonatal": Baby,
};

export default function AdminPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [allBookings, setAllBookings] = useState(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState(allBookings[0]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOrigin, setFilterOrigin] = useState("all");

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin-login");
        return;
      }
      // Check admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        await supabase.auth.signOut();
        navigate("/admin-login");
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  // Merge localStorage user bookings with mock data
  useEffect(() => {
    const userBookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
    if (userBookings.length > 0) {
      const merged = [...userBookings, ...mockBookings];
      setAllBookings(merged);
      setSelectedBooking(merged[0]);
    }
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  const isNewBooking = (createdAt: string) => {
    const diff = Date.now() - new Date(createdAt).getTime();
    return diff < 10 * 60 * 1000;
  };

  const filteredBookings = allBookings.filter((booking) => {
    if (filterStatus !== "all" && booking.status !== filterStatus) return false;
    if (filterOrigin !== "all" && booking.origin !== filterOrigin) return false;
    if (searchQuery && !booking.patientName.toLowerCase().includes(searchQuery.toLowerCase()) && !booking.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    totalMissions: allBookings.length,
    activeMissions: allBookings.filter(b => b.status === "in_progress").length,
    pendingPayments: allBookings.filter(b => b.paymentStatus === "pending").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-aviation-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="ASR Aviation" className="h-8 brightness-0 invert" />
            <div className="h-6 w-px bg-white/20" />
            <span className="font-semibold">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Operations Center Active
            </span>
            <Button variant="aviation" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bento-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Missions</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalMissions}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <Plane className="h-6 w-6 text-primary" />
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bento-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Missions</p>
                <p className="text-3xl font-bold text-success">{stats.activeMissions}</p>
              </div>
              <div className="p-3 rounded-xl bg-success/10">
                <Activity className="h-6 w-6 text-success" />
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bento-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-3xl font-bold text-warning">{stats.pendingPayments}</p>
              </div>
              <div className="p-3 rounded-xl bg-warning/10">
                <CreditCard className="h-6 w-6 text-warning" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bookings List */}
          <div className="lg:col-span-1">
            <div className="bento-card h-fit">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold">Mission Queue</h2>
                <span className="text-sm text-muted-foreground">{filteredBookings.length} missions</span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by name or ID..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterOrigin} onValueChange={setFilterOrigin}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Origin" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {indianCities.map(city => (
                        <SelectItem key={city.code} value={city.code}>{city.code}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredBookings.map((booking) => {
                  const status = statusConfig[booking.status as keyof typeof statusConfig];
                  const ServiceIcon = serviceIcons[booking.serviceType] || Plane;
                  return (
                    <button
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedBooking?.id === booking.id
                          ? "border-aviation-red bg-aviation-red/5"
                          : "border-border hover:border-aviation-red/50 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-primary/10">
                            <ServiceIcon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium text-foreground">{booking.id}</span>
                        </div>
                        <Badge className={status.color}>{status.label}</Badge>
                        {isNewBooking(booking.createdAt) && (
                          <Badge className="bg-aviation-red text-white animate-pulse ml-1">New</Badge>
                        )}
                      </div>
                      <p className="font-medium text-sm text-foreground mb-1">{booking.patientName}</p>
                      <p className="text-xs text-muted-foreground mb-2">{booking.origin} → {booking.destination}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{booking.flightDate}</span>
                        <span className={booking.paymentStatus === "paid" ? "text-success" : "text-warning"}>
                          {booking.paymentStatus === "paid" ? "✓ Paid" : "⏳ Pending"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selected Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedBooking && (
              <>
                {/* Mission Timeline */}
                <motion.div key={selectedBooking.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bento-card">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-display text-xl font-semibold">Mission Timeline</h2>
                      <p className="text-sm text-muted-foreground">{selectedBooking.id}</p>
                    </div>
                    <div className="flex gap-2">
                      {selectedBooking.status === "in_progress" && (
                        <Button variant="aviation" size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Advance Step
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      {timelineSteps.map((step) => {
                        const isCompleted = selectedBooking.statusStep > step.step;
                        const isCurrent = selectedBooking.statusStep === step.step;
                        return (
                          <div key={step.step} className="flex flex-col items-center relative z-10">
                            <motion.div
                              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                                isCompleted
                                  ? "bg-success border-success text-white"
                                  : isCurrent
                                  ? "bg-aviation-red border-aviation-red text-white animate-pulse-glow"
                                  : "bg-background border-border text-muted-foreground"
                              }`}
                              animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                              transition={{ repeat: Infinity, duration: 2 }}
                            >
                              {isCompleted ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                <span className="font-semibold">{step.step}</span>
                              )}
                            </motion.div>
                            <span className={`mt-2 text-xs font-medium text-center ${
                              isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="absolute top-6 left-6 right-6 h-0.5 bg-border -z-0">
                      <motion.div
                        className="h-full bg-gradient-to-r from-success to-aviation-red"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((selectedBooking.statusStep - 1) / (timelineSteps.length - 1)) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Patient & Flight Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bento-card">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      Patient Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Name</span>
                        <span className="font-medium">{selectedBooking.patientName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Age</span>
                        <span className="font-medium">{selectedBooking.age === 0 ? "Infant" : `${selectedBooking.age} years`}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Condition</span>
                        <span className="font-medium">{selectedBooking.condition}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Contact</span>
                        <span className="font-medium">{selectedBooking.contactPhone}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Passengers</span>
                        <span className="font-medium">{selectedBooking.passengers}</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bento-card">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Plane className="h-5 w-5 text-muted-foreground" />
                      Flight Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Route</span>
                        <span className="font-medium">{selectedBooking.origin} → {selectedBooking.destination}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">{selectedBooking.flightDate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Aircraft</span>
                        <span className="font-medium">{selectedBooking.assignedAircraft || "Not Assigned"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ground Support</span>
                        <span className="font-medium">
                          {selectedBooking.ambulancePickup && selectedBooking.ambulanceDropoff
                            ? "Pickup & Drop"
                            : selectedBooking.ambulancePickup
                            ? "Pickup Only"
                            : selectedBooking.ambulanceDropoff
                            ? "Drop Only"
                            : "None"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Payment & Actions */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bento-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      Payment Status
                    </h3>
                    <Badge className={selectedBooking.paymentStatus === "paid" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"}>
                      {selectedBooking.paymentStatus === "paid" ? "Paid" : "Pending Payment"}
                    </Badge>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Invoice
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Patient
                    </Button>
                    <Button variant="destructive" size="icon">
                      <XCircle className="h-4 w-4" />
                    </Button>
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
