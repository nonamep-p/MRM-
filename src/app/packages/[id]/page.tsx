
import { doc, getDoc } from 'firebase/firestore';
import { getSdks } from '@/firebase';
import { notFound } from 'next/navigation';
import type { TravelPackage } from '@/lib/types';
import { PackageDetailsClient } from './package-details-client';

async function getPackage(id: string): Promise<TravelPackage | null> {
    // We cannot use the useFirestore hook here as this is a Server Component.
    // Instead, we get a new firestore instance.
    const { firestore } = getSdks();
    const docRef = doc(firestore, 'travelPackages', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            title: data.title,
            description: data.description,
            price: data.price,
            image: data.image,
            duration: data.duration,
            location: data.location,
            grade: data.grade,
            inclusions: data.inclusions,
            exclusions: data.exclusions,
            itinerary: data.itinerary,
        };
    } else {
        return null;
    }
}


export default async function PackageDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const travelPackage = await getPackage(params.id);

  if (!travelPackage) {
    notFound();
  }

  return <PackageDetailsClient travelPackage={travelPackage} />;
}
