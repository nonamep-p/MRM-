
import { type DocumentReference, type Timestamp } from 'firebase/firestore';

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
  category: 'Luxury' | 'Comfort' | 'Adventure' | 'Family' | 'Honeymoon' | 'Cultural' | 'Budget' | 'Romantic';
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
    linkedinUrl?: string;
    youtubeUrl?: string;
    pinterestUrl?: string;
};

export type HeroSlide = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

export type ContactFormSubmission = {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    message: string;
    submittedAt: Timestamp;
    travelers?: number;
    travelDates?: string;
    budget?: string;
    interests?: string;
    sourcePackage?: string; // e.g., The title of the package they were viewing
};
