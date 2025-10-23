
'use client';

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import type { TravelPackage } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Edit, PlusCircle, Trash2 } from "lucide-react";

export default function AdminPage() {
  const firestore = useFirestore();
  const packagesCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "travelPackages"));
  }, [firestore]);
  const { data: travelPackages, isLoading } = useCollection<TravelPackage>(packagesCollection);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Admin Panel</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Package
        </Button>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading packages...
                </TableCell>
              </TableRow>
            )}
            {travelPackages?.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-medium">{pkg.title}</TableCell>
                <TableCell>{Object.keys(pkg.location).length > 0 ? `${pkg.location.lat.toFixed(2)}, ${pkg.location.lng.toFixed(2)}` : 'N/A'}</TableCell>
                <TableCell>{pkg.duration}</TableCell>
                <TableCell>${pkg.price.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
