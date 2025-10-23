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
  currency: string;
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

export type SiteSettings = {
    address: string;
    phone: string;
    email: string;
    twitterUrl: string;
    instagramUrl: string;
    facebookUrl: string;
};
