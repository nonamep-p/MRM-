import { type DocumentReference } from 'firebase/firestore';

export type ItineraryItem = {
  day: number;
  title: string;
  description: string;
};

export type TravelPackage = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  duration: string;
  location: {
    lat: number;
    lng: number;
  };
  grade: 'Luxury' | 'Comfort' | 'Adventure';
  inclusions?: string[];
  exclusions?: string[];
  itinerary?: ItineraryItem[];
};
