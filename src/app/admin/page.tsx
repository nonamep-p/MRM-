
'use client';

import { useState } from "react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, doc, deleteDoc } from "firebase/firestore";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { PackageForm } from "@/components/package-form";
import { useToast } from "@/hooks/use-toast";

export default function AdminPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const firestore = useFirestore();
  const { toast } = useToast();

  const packagesCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "travelPackages"));
  }, [firestore]);
  const { data: travelPackages, isLoading } = useCollection<TravelPackage>(packagesCollection);

  const handleAddNew = () => {
    setSelectedPackage(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (pkg: TravelPackage) => {
    setSelectedPackage(pkg);
    setIsDialogOpen(true);
  };

  const handleDelete = async (packageId: string) => {
    if (!firestore) return;
    if (confirm("Are you sure you want to delete this package?")) {
      try {
        await deleteDoc(doc(firestore, "travelPackages", packageId));
        toast({
          title: "Package Deleted",
          description: "The travel package has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting package:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete the package. Please try again.",
        });
      }
    }
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    setSelectedPackage(null);
  };

  return (
    <>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-headline">Manage Travel Packages</h1>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Package
          </Button>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    Loading packages...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && travelPackages?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No packages found. Add your first package!
                  </TableCell>
                </TableRow>
              )}
              {travelPackages?.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">{pkg.title}</TableCell>
                  <TableCell>{pkg.location ? `${pkg.location.lat.toFixed(2)}, ${pkg.location.lng.toFixed(2)}` : 'N/A'}</TableCell>
                  <TableCell>{pkg.duration}</TableCell>
                  <TableCell>${pkg.price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(pkg)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(pkg.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPackage ? 'Edit Package' : 'Add New Package'}</DialogTitle>
            <DialogDescription>
              {selectedPackage ? 'Update the details for this travel package.' : 'Fill in the details for the new travel package.'}
            </DialogDescription>
          </DialogHeader>
          <PackageForm 
            travelPackage={selectedPackage}
            onSuccess={handleFormSuccess} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
