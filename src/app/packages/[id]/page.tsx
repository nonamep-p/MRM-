
import { doc, getDoc } from 'firebase/firestore';
import { getSdks } from '@/firebase/firebase-server';
import { notFound } from 'next/navigation';
import type { TravelPackage, SiteSettings } from '@/lib/types';
import { PackageDetailsClient } from './package-details-client';

type PackageDetailsProps = {
  travelPackage: TravelPackage,
  siteSettings: SiteSettings | null
}

async function getPageData(id: string): Promise<PackageDetailsProps> {
    const { firestore } = getSdks();
    
    const packageDocRef = doc(firestore, 'travelPackages', id);
    const settingsDocRef = doc(firestore, "siteSettings", "main");

    const [packageSnap, settingsSnap] = await Promise.all([
        getDoc(packageDocRef),
        getDoc(settingsDocRef)
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

    return { travelPackage, siteSettings };
}


export default async function PackageDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { travelPackage, siteSettings } = await getPageData(params.id);

  if (!travelPackage) {
    notFound();
  }

  return <PackageDetailsClient travelPackage={travelPackage} siteSettings={siteSettings} />;
}
