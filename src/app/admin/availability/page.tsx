
'use client';

import { useState } from "react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, doc } from "firebase/firestore";
import type { TravelPackage, PackageAvailability } from "@/lib/types";
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
import { useToast } from "@/hooks/use-toast";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { AvailabilityForm } from "@/components/availability-form";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";

export default function AdminAvailabilityPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState<PackageAvailability | null>(null);
  const firestore = useFirestore();
  const { toast } = useToast();

  const packagesCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "travelPackages"));
  }, [firestore]);
  const { data: travelPackages, isLoading: isLoadingPackages } = useCollection<TravelPackage>(packagesCollection);

  const availabilityCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "packageAvailability"));
  }, [firestore]);
  const { data: availabilities, isLoading: isLoadingAvailabilities } = useCollection<PackageAvailability>(availabilityCollection);
  
  const packageMap = useMemoFirebase(() => {
      if(!travelPackages) return {};
      return travelPackages.reduce((acc, pkg) => {
          acc[pkg.id] = pkg.title;
          return acc;
      }, {} as Record<string, string>);
  }, [travelPackages]);

  const isLoading = isLoadingPackages || isLoadingAvailabilities;

  const handleAddNew = () => {
    setSelectedAvailability(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (availability: PackageAvailability) => {
    setSelectedAvailability(availability);
    setIsDialogOpen(true);
  };

  const handleDelete = (availabilityId: string) => {
    if (!firestore) return;
    if (confirm("Are you sure you want to delete this availability record?")) {
      deleteDocumentNonBlocking(doc(firestore, "packageAvailability", availabilityId));
      toast({
        title: "Availability Deletion Initiated",
        description: "The availability record will be deleted shortly.",
      });
    }
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    setSelectedAvailability(null);
  };
  
  const getBookingPercentage = (item: PackageAvailability) => {
      if (item.slots === 0) return 0;
      return (item.bookedSlots / item.slots) * 100;
  }

  return (
    <>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-headline">Manage Package Availability</h1>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Availability
          </Button>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Slots</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    Loading availability...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && availabilities?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No availability records found. Add your first one!
                  </TableCell>
                </TableRow>
              )}
              {availabilities?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{packageMap[item.packageId] || 'Unknown Package'}</TableCell>
                  <TableCell>{format(item.startDate.toDate(), 'PPP')}</TableCell>
                  <TableCell>{format(item.endDate.toDate(), 'PPP')}</TableCell>
                  <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={getBookingPercentage(item)} className="w-24"/>
                        <span>{item.bookedSlots} / {item.slots}</span>
                      </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedAvailability ? 'Edit Availability' : 'Add New Availability'}</DialogTitle>
            <DialogDescription>
              {selectedAvailability ? 'Update the details for this availability record.' : 'Fill in the details for the new availability record.'}
            </DialogDescription>
          </DialogHeader>
          <AvailabilityForm
            availability={selectedAvailability}
            packages={travelPackages || []}
            onSuccess={handleFormSuccess} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
