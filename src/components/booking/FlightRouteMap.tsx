 import { useEffect, useRef, useState } from "react";
 import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
 import L from "leaflet";
 import "leaflet/dist/leaflet.css";
 import type { IndianCity } from "@/lib/data";
 
 // Fix for default markers
 delete (L.Icon.Default.prototype as any)._getIconUrl;
 L.Icon.Default.mergeOptions({
   iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
 });
 
 // Custom markers
 const createCustomIcon = (color: string) => {
   return L.divIcon({
     className: "custom-marker",
     html: `
       <div style="
         width: 24px;
         height: 24px;
         border-radius: 50%;
         background: ${color};
         border: 3px solid white;
         box-shadow: 0 2px 8px rgba(0,0,0,0.3);
         display: flex;
         align-items: center;
         justify-content: center;
       ">
         <div style="
           width: 8px;
           height: 8px;
           border-radius: 50%;
           background: white;
         "></div>
       </div>
     `,
     iconSize: [24, 24],
     iconAnchor: [12, 12],
   });
 };
 
 const originIcon = createCustomIcon("#ef4444");
 const destinationIcon = createCustomIcon("#22c55e");
 
 // Generate curved path
 function getCurvedPath(origin: [number, number], destination: [number, number]): [number, number][] {
   const points: [number, number][] = [];
   const midLat = (origin[0] + destination[0]) / 2;
   const midLng = (origin[1] + destination[1]) / 2;
   
   // Calculate curve height based on distance
   const distance = Math.sqrt(
     Math.pow(destination[0] - origin[0], 2) + Math.pow(destination[1] - origin[1], 2)
   );
   const curveHeight = distance * 0.15;
   
   // Control point for curve
   const controlLat = midLat + curveHeight;
   const controlLng = midLng;
 
   // Generate bezier curve points
   for (let t = 0; t <= 1; t += 0.05) {
     const lat = Math.pow(1 - t, 2) * origin[0] + 2 * (1 - t) * t * controlLat + Math.pow(t, 2) * destination[0];
     const lng = Math.pow(1 - t, 2) * origin[1] + 2 * (1 - t) * t * controlLng + Math.pow(t, 2) * destination[1];
     points.push([lat, lng]);
   }
   points.push(destination);
   
   return points;
 }
 
 function MapController({ origin, destination }: { origin: [number, number]; destination: [number, number] }) {
   const map = useMap();
   
   useEffect(() => {
     const bounds = L.latLngBounds([origin, destination]);
     map.fitBounds(bounds, { padding: [50, 50] });
   }, [map, origin, destination]);
   
   return null;
 }
 
 interface FlightRouteMapProps {
   origin: IndianCity;
   destination: IndianCity;
 }
 
 export function FlightRouteMap({ origin, destination }: FlightRouteMapProps) {
   const [animationProgress, setAnimationProgress] = useState(0);
   const curvedPath = getCurvedPath(origin.coordinates, destination.coordinates);
   
   useEffect(() => {
     const interval = setInterval(() => {
       setAnimationProgress((prev) => {
         if (prev >= 1) return 0;
         return prev + 0.02;
       });
     }, 50);
     
     return () => clearInterval(interval);
   }, []);
 
   const animatedPathLength = Math.floor(curvedPath.length * animationProgress);
   const animatedPath = curvedPath.slice(0, animatedPathLength + 1);
 
   return (
     <div className="relative rounded-xl overflow-hidden border border-border">
       <div className="absolute top-4 left-4 z-[1000] flex gap-2">
         <button className="px-3 py-1.5 bg-white rounded-lg text-sm font-medium shadow-md">
           Map
         </button>
         <button className="px-3 py-1.5 bg-white/80 rounded-lg text-sm text-muted-foreground shadow-md hover:bg-white transition-colors">
           Satellite
         </button>
       </div>
       
       <MapContainer
         center={[22.5, 78.5]}
         zoom={5}
         scrollWheelZoom={false}
         className="h-[300px] md:h-[350px] w-full"
         style={{ background: "#e8f4f8" }}
       >
         <TileLayer
           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
         />
         
         <MapController origin={origin.coordinates} destination={destination.coordinates} />
         
         {/* Full path (faded) */}
         <Polyline
           positions={curvedPath}
           pathOptions={{ color: "#e5e7eb", weight: 3, dashArray: "5, 10" }}
         />
         
         {/* Animated path */}
         <Polyline
           positions={animatedPath}
           pathOptions={{
             color: "#22c55e",
             weight: 4,
           }}
         />
         
         <Marker position={origin.coordinates} icon={originIcon} />
         <Marker position={destination.coordinates} icon={destinationIcon} />
       </MapContainer>
       
       {/* City Labels */}
       <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
         <p className="text-xs text-muted-foreground">From</p>
         <p className="font-semibold text-sm">{origin.code}</p>
       </div>
       <div className="absolute bottom-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
         <p className="text-xs text-muted-foreground">To</p>
         <p className="font-semibold text-sm text-success">{destination.code}</p>
       </div>
     </div>
   );
 }