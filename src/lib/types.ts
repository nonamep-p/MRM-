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
  inclusions?: string[];
};
