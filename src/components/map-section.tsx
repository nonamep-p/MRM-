
"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { TravelPackage } from "@/lib/types";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function MapSection() {
  const mapId = "voyage-vista-map";
  const firestore = useFirestore();

  const packagesCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "travelPackages"));
  }, [firestore]);
  const { data: travelPackages, isLoading } = useCollection<TravelPackage>(packagesCollection);
  
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

  if (isLoading) {
    return (
       <div className="flex h-[500px] w-full items-center justify-center rounded-lg bg-muted shadow-inner">
        <p>Loading map...</p>
       </div>
    )
  }
  
  return (
    <div className="flex h-[500px] w-full items-center justify-center rounded-lg bg-muted shadow-inner">
      <div className="text-center p-4">
        <h3 className="text-lg font-semibold text-foreground">Interactive Map is Unavailable</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          The map requires latitude and longitude coordinates to display markers.
          <br/>
          To re-enable the map, the package data structure would need to be updated to include coordinates.
        </p>
      </div>
    </div>
  );
}
