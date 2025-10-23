
import { type DocumentReference, type Timestamp, type FieldValue } from 'firebase/firestore';

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
  location: string;
  category: 'Luxury' | 'Comfort' | 'Adventure' | 'Family' | 'Honeymoon' | 'Cultural' | 'Budget' | 'Romantic';
  inclusions?: string[];
  exclusions?: string[];
  itinerary?: ItineraryItem[];
};

export type PackageAvailability = {
  id: string;
  packageId: string;
  startDate: Timestamp;
  endDate: Timestamp;
  slots: number;
  bookedSlots: number;
}

export type SiteSettings = {
    address: string;
    phone: string;
    email: string;
    defaultCurrency: 'AED' | 'USD' | 'EUR' | 'GBP';
    twitterUrl?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    linkedinUrl?: string;
    youtubeUrl?: string;
    pinterestUrl?: string;
    logoUrl?: string;
    logoText?: string;
    logoTextColor?: string;
    logoFontFamily?: string;
    logoTextSize?: string;
    logoAlignment?: 'items-start' | 'items-center' | 'items-end';
    logoSpacing?: string;
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
    submittedAt: Timestamp | FieldValue;
    travelers?: number;
    travelDates?: string;
    budget?: string;
    interests?: string;
    sourcePackage?: string; // e.g., The title of the package they were viewing
    status: 'Pending' | 'Confirmed' | 'Canceled';
};

    