 // Fleet data for Indian market
export interface FleetAircraft {
  id: string;
  operator: string;
  model: string;
  baseHub: string;
  baseHubCode: string;
  hourlyRate: number;
  icuCapable: boolean;
  maxPassengers: number;
  range: string;
  image: string;
  medicalStaff: string;
}
 
export const fleetData: FleetAircraft[] = [
  {
    id: "1",
    operator: "ACS (Air Charter Service)",
    model: "Falcon 2000",
    baseHub: "Delhi",
    baseHubCode: "DEL",
    hourlyRate: 350000,
    icuCapable: true,
    maxPassengers: 8,
    range: "5,550 km",
    image: "https://www.jetcraft.com/wp-content/uploads/2018/12/Falcon-2000-Ext-Header-JS.jpg",
    medicalStaff: "2 Pilots, 1 ICU Doctor, 1 Paramedic",
  },
  {
    id: "2",
    operator: "JetSetGo",
    model: "Hawker 800XP",
    baseHub: "Mumbai",
    baseHubCode: "BOM",
    hourlyRate: 280000,
    icuCapable: true,
    maxPassengers: 6,
    range: "4,630 km",
    image: "https://www.jetcraft.com/wp-content/uploads/2016/03/hawker-800xp-Exterior-NEW-jS.jpg",
    medicalStaff: "2 Pilots, 1 ICU Doctor, 1 Paramedic",
  },
  {
    id: "3",
    operator: "Xeontech Aviation",
    model: "Learjet 45",
    baseHub: "Bangalore",
    baseHubCode: "BLR",
    hourlyRate: 220000,
    icuCapable: true,
    maxPassengers: 6,
    range: "3,700 km",
    image: "https://www.jetcraft.com/wp-content/uploads/2015/02/Lear45XR-ext-JS.jpg",
    medicalStaff: "2 Pilots, 1 Doctor, 1 Paramedic",
  },
  {
    id: "4",
    operator: "VSR Ventures",
    model: "King Air B200",
    baseHub: "Delhi",
    baseHubCode: "DEL",
    hourlyRate: 180000,
    icuCapable: true,
    maxPassengers: 4,
    range: "2,200 km",
    image: "https://www.corporatejetinvestor.com/wp-content/uploads/2025/07/Screenshot-2025-07-14-at-13.04.57-800x520.jpg",
    medicalStaff: "2 Pilots, 1 Doctor, 1 Nurse",
  },
  {
    id: "5",
    operator: "Jipson Aviation",
    model: "Beechcraft C90",
    baseHub: "Chennai",
    baseHubCode: "MAA",
    hourlyRate: 150000,
    icuCapable: false,
    maxPassengers: 4,
    range: "1,850 km",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Tc-90_04l.jpg",
    medicalStaff: "2 Pilots, 1 Paramedic",
  },
  {
    id: "6",
    operator: "Club One Air",
    model: "Gulfstream G550",
    baseHub: "Mumbai",
    baseHubCode: "BOM",
    hourlyRate: 650000,
    icuCapable: true,
    maxPassengers: 12,
    range: "11,000 km",
    image: "https://cdn.privatejetcardcomparisons.com/uploads/Gulfstream-G550-pric1e.jpg",
    medicalStaff: "2 Pilots, 1 ICU Doctor, 2 Paramedics",
  },
  {
    id: "7",
    operator: "Pawan Hans",
    model: "Bell 407 (Helicopter)",
    baseHub: "Delhi",
    baseHubCode: "DEL",
    hourlyRate: 200000,
    icuCapable: false,
    maxPassengers: 4,
    range: "600 km",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Nassau_County_Police_Bell_407.jpg/500px-Nassau_County_Police_Bell_407.jpg",
    medicalStaff: "1 Pilot, 1 Paramedic",
  },
  {
    id: "8",
    operator: "Global Vectra Helicorp",
    model: "Agusta 109 (Helicopter)",
    baseHub: "Mumbai",
    baseHubCode: "BOM",
    hourlyRate: 320000,
    icuCapable: true,
    maxPassengers: 5,
    range: "900 km",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/RAF_A109.jpg/500px-RAF_A109.jpg",
    medicalStaff: "1 Pilot, 1 ICU Doctor, 1 Paramedic",
  },
  {
    id: "9",
    operator: "VSR Ventures",
    model: "King Air B200 (Long-Range)",
    baseHub: "Bangalore",
    baseHubCode: "BLR",
    hourlyRate: 195000,
    icuCapable: true,
    maxPassengers: 6,
    range: "2,800 km",
    image: "https://www.corporatejetinvestor.com/wp-content/uploads/2025/07/Screenshot-2025-07-14-at-13.04.57-800x520.jpg",
    medicalStaff: "2 Pilots, 1 Doctor, 1 Nurse",
  },
];
 
 export interface ServiceType {
   id: string;
   title: string;
   description: string;
   features: string[];
   aircraft: string;
   priceRange: { min: number; max: number };
   icon: string;
   image: string;
 }
 
 export const serviceTypes: ServiceType[] = [
   {
     id: "organ-transplant",
     title: "Organ Transplant Transfer",
     description: "Green Corridor logistics with specialized cold-chain equipment",
     features: ["Cold-Chain Certified", "Priority Clearance", "Real-Time Tracking"],
     aircraft: "Learjet 45XR",
     priceRange: { min: 1500000, max: 2500000 },
     icon: "Heart",
     image: "organ-transport",
   },
   {
     id: "icu-transfer",
     title: "ICU-to-ICU Transfer",
     description: "Full-crew advanced life support with continuous monitoring",
     features: ["ICU Medical Team", "Ventilator Support", "Hospital-to-Hospital"],
     aircraft: "Gulfstream G550",
     priceRange: { min: 2500000, max: 5000000 },
     icon: "Activity",
     image: "icu-interior",
   },
   {
     id: "emergency-evac",
     title: "Emergency Medical Evacuation",
     description: "Rapid response evacuation for critical medical emergencies",
     features: ["15-Min Response", "Trauma Team", "Critical Care"],
     aircraft: "King Air 350",
     priceRange: { min: 1000000, max: 3000000 },
     icon: "AlertTriangle",
     image: "emergency-evac",
   },
   {
     id: "neonatal",
     title: "Neonatal Care Transport",
     description: "Specialized transport for newborns requiring intensive care",
     features: ["Neonatal Incubator", "Pediatric Team", "Climate Controlled"],
     aircraft: "Falcon 2000",
     priceRange: { min: 2000000, max: 4000000 },
     icon: "Baby",
     image: "neonatal-care",
   },
 ];
 
 export interface IndianCity {
   code: string;
   name: string;
   coordinates: [number, number];
 }
 
 export const indianCities: IndianCity[] = [
   { code: "DEL", name: "New Delhi", coordinates: [28.6139, 77.209] },
   { code: "BOM", name: "Mumbai", coordinates: [19.076, 72.8777] },
   { code: "BLR", name: "Bangalore", coordinates: [12.9716, 77.5946] },
   { code: "MAA", name: "Chennai", coordinates: [13.0827, 80.2707] },
   { code: "CCU", name: "Kolkata", coordinates: [22.5726, 88.3639] },
   { code: "HYD", name: "Hyderabad", coordinates: [17.385, 78.4867] },
   { code: "PNQ", name: "Pune", coordinates: [18.5204, 73.8567] },
   { code: "AMD", name: "Ahmedabad", coordinates: [23.0225, 72.5714] },
   { code: "GOI", name: "Goa", coordinates: [15.2993, 74.124] },
   { code: "JAI", name: "Jaipur", coordinates: [26.9124, 75.7873] },
   { code: "COK", name: "Kochi", coordinates: [9.9312, 76.2673] },
   { code: "LKO", name: "Lucknow", coordinates: [26.8467, 80.9462] },
 ];
 
 export interface Booking {
   id: string;
   patientName: string;
   age: number;
   condition: string;
   serviceType: string;
   origin: IndianCity;
   destination: IndianCity;
   ambulancePickup: boolean;
   ambulanceDropoff: boolean;
   quotedPrice: number;
   status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
   statusStep: number;
   createdAt: Date;
   flightDate: Date;
   passengers: number;
   contactPhone: string;
   contactEmail: string;
   medicalNotes: string;
 }
 
export const operatorContacts: Record<string, { phone: string; whatsapp: string }> = {
  "ACS (Air Charter Service)": { phone: "+91 11 4160 0000", whatsapp: "+911141600000" },
  "JetSetGo": { phone: "+91 80 4857 4857", whatsapp: "+918048574857" },
  "Xeontech Aviation": { phone: "+91 80 2520 1234", whatsapp: "+918025201234" },
  "VSR Ventures": { phone: "+91 11 4055 5555", whatsapp: "+911140555555" },
  "Jipson Aviation": { phone: "+91 44 2815 0000", whatsapp: "+914428150000" },
  "Club One Air": { phone: "+91 22 4343 4343", whatsapp: "+912243434343" },
  "Pawan Hans": { phone: "+91 11 2465 2465", whatsapp: "+911124652465" },
  "Global Vectra Helicorp": { phone: "+91 22 6677 8899", whatsapp: "+912266778899" },
};

export const certifications = [
   { name: "EASA Certified", description: "European Aviation Safety Agency" },
   { name: "FAA Approved", description: "US Federal Aviation Administration" },
   { name: "ISO 9001:2015", description: "Quality Management System" },
   { name: "EURAMI Accredited", description: "European Aeromedical Institute" },
 ];
 
 export const formatINR = (amount: number): string => {
   return new Intl.NumberFormat("en-IN", {
     style: "currency",
     currency: "INR",
     maximumFractionDigits: 0,
   }).format(amount);
 };