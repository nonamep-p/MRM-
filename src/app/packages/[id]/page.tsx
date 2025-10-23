
import { doc, getDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { getSdks } from '@/firebase/firebase-server';
import { notFound } from 'next/navigation';
import type { TravelPackage, SiteSettings, PackageAvailability } from '@/lib/types';
import { PackageDetailsClient } from './package-details-client';

export type PackageAvailabilitySerializable = Omit<PackageAvailability, 'startDate' | 'endDate' | 'id'> & {
  id: string;
  startDate: string;
  endDate: string;
};


type PackageDetailsProps = {
  travelPackage: TravelPackage,
  siteSettings: SiteSettings | null,
  availability: PackageAvailabilitySerializable[]
}

async function getPageData(id: string): Promise<PackageDetailsProps> {
    const { firestore } = getSdks();
    
    const packageDocRef = doc(firestore, 'travelPackages', id);
    const settingsDocRef = doc(firestore, "siteSettings", "main");
    
    const availabilityQuery = query(collection(firestore, "packageAvailability"), where("packageId", "==", id));

    const [packageSnap, settingsSnap, availabilitySnap] = await Promise.all([
        getDoc(packageDocRef),
        getDoc(settingsSnap),
        getDocs(availabilityQuery)
    ]);

    let travelPackage: TravelPackage | null = null;
    if (packageSnap.exists()) {
        const data = packageSnap.data();
        travelPackage = {
            id: packageSnap.id,
            title: data.title,
            description: data.description,
            price: data.price,
            image: data.image,
            duration: data.duration,
            location: data.location,
            category: data.category,
            inclusions: data.inclusions,
            exclusions: data.exclusions,
            itinerary: data.itinerary,
        };
    } else {
        notFound();
    }
    
    const siteSettings = settingsSnap.exists() ? settingsSnap.data() as SiteSettings : null;

    const availability = availabilitySnap.docs.map(doc => {
        const data = doc.data() as Omit<PackageAvailability, 'id'>;
        // When serializing, we convert Timestamps to ISO strings
        return {
            id: doc.id,
            packageId: data.packageId,
            startDate: (data.startDate as Timestamp).toDate().toISOString(),
            endDate: (data.endDate as Timestamp).toDate().toISOString(),
            slots: data.slots,
            bookedSlots: data.bookedSlots,
        } as PackageAvailabilitySerializable
    });


    return { travelPackage, siteSettings, availability };
}


export default async function PackageDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { travelPackage, siteSettings, availability } = await getPageData(params.id);

  if (!travelPackage) {
    notFound();
  }

  return <PackageDetailsClient travelPackage={travelPackage} siteSettings={siteSettings} availability={availability} />;
}
