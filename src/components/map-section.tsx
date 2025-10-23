"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import type { TravelPackage } from "@/lib/types";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

interface MapSectionProps {
  locations: { id: string; location: { lat: number; lng: number } }[];
}

export function MapSection({ locations }: MapSectionProps) {
  const mapId = "voyage-vista-map";
  
  const mapStyles = [
    {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [
        { "color": "#8a7d6c" }
      ]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [
        { "color": "#f9f6f2" }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        { "color": "#f4ead5" }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [
        { "color": "#f4ead5" }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        { "color": "#e9e0d1" }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        { "color": "#ffffff" }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
        { "color": "#e9e0d1" }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        { "color": "#a4d3ff" } // Lighter version of ocean blue
      ]
    }
  ];

  if (!apiKey || apiKey === "YOUR_API_KEY") {
    return (
      <div className="flex h-[500px] w-full items-center justify-center rounded-lg bg-muted shadow-inner">
        <div className="text-center p-4">
          <h3 className="text-lg font-semibold text-foreground">Interactive Map is Unavailable</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            To enable this feature, please get a Google Maps API Key and add it to your project.
            <br />
            In the file explorer, open <code className="font-mono text-xs bg-muted-foreground/20 p-1 rounded">.env.local</code> and replace <code className="font-mono text-xs bg-muted-foreground/20 p-1 rounded">"YOUR_API_KEY"</code> with your actual key.
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-lg border">
        <Map
          defaultCenter={{ lat: 20, lng: 10 }}
          defaultZoom={2}
          mapId={mapId}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          styles={mapStyles}
        >
          {locations.map((loc) => (
            <Marker key={loc.id} position={loc.location} />
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}
