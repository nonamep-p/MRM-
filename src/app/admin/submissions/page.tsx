
'use client';

import { useState } from "react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, doc, updateDoc } from "firebase/firestore";
import type { ContactFormSubmission } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";


const statusStyles: Record<ContactFormSubmission['status'], string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Confirmed: "bg-green-100 text-green-800 border-green-200",
  Canceled: "bg-red-100 text-red-800 border-red-200",
};

const statusIcons: Record<ContactFormSubmission['status'], React.ElementType> = {
    Pending: Clock,
    Confirmed: CheckCircle,
    Canceled: XCircle
}

export default function AdminSubmissionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactFormSubmission | null>(null);
  const firestore = useFirestore();
  const { toast } = useToast();

  const submissionsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "contactFormSubmissions"), orderBy("submittedAt", "desc"));
  }, [firestore]);
  const { data: submissions, isLoading } = useCollection<ContactFormSubmission>(submissionsCollection);
  
  const handleView = (submission: ContactFormSubmission) => {
    setSelectedSubmission(submission);
    setIsDialogOpen(true);
  };
  
  const handleStatusChange = (submissionId: string, status: ContactFormSubmission['status']) => {
    if (!firestore) return;
    const submissionRef = doc(firestore, "contactFormSubmissions", submissionId);
    updateDocumentNonBlocking(submissionRef, { status });
    toast({
      title: "Status Updated",
      description: `Submission status changed to ${status}.`,
    });
  }

  return (
    <>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-headline">Contact Form Submissions</h1>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Package</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    Loading submissions...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && submissions?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No submissions yet.
                  </TableCell>
                </TableRow>
              )}
              {submissions?.map((sub) => {
                  const StatusIcon = statusIcons[sub.status || 'Pending'];
                  return (
                    <TableRow key={sub.id}>
                      <TableCell>
                        {sub.submittedAt ? format(sub.submittedAt.toDate(), 'PPP p') : 'N/A'}
                      </TableCell>
                      <TableCell className="font-medium">{sub.name}</TableCell>
                      <TableCell>{sub.email}</TableCell>
                       <TableCell>
                          <Badge variant="outline" className={cn("gap-1.5", statusStyles[sub.status || 'Pending'])}>
                              <StatusIcon className="h-3.5 w-3.5" />
                              {sub.status || 'Pending'}
                          </Badge>
                      </TableCell>
                      <TableCell>
                        {sub.sourcePackage ? (
                          <Badge variant="secondary">{sub.sourcePackage}</Badge>
                        ) : (
                          <span className="text-muted-foreground">General Inquiry</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                         <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => handleView(sub)}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleStatusChange(sub.id, 'Pending')}>
                                <Clock className="mr-2 h-4 w-4" /> Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleStatusChange(sub.id, 'Confirmed')}>
                                <CheckCircle className="mr-2 h-4 w-4" /> Mark as Confirmed
                            </DropdownMenuItem>
                             <DropdownMenuItem onSelect={() => handleStatusChange(sub.id, 'Canceled')} className="text-destructive">
                                <XCircle className="mr-2 h-4 w-4" /> Mark as Canceled
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>View Submission</DialogTitle>
            <DialogDescription>
              From: {selectedSubmission?.name} ({selectedSubmission?.email})
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="py-4 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">Phone Number</h4>
                    <p className="text-muted-foreground">{selectedSubmission.phoneNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Source</h4>
                    <p className="text-muted-foreground">{selectedSubmission.sourcePackage || 'General Inquiry'}</p>
                  </div>
                   <div>
                    <h4 className="font-semibold">Travelers</h4>
                    <p className="text-muted-foreground">{selectedSubmission.travelers || 'Not provided'}</p>
                  </div>
                   <div>
                    <h4 className="font-semibold">Preferred Dates</h4>
                    <p className="text-muted-foreground">{selectedSubmission.travelDates || 'Not provided'}</p>
                  </div>
                  <div className="col-span-2">
                    <h4 className="font-semibold">Budget Per Person</h4>
                    <p className="text-muted-foreground">{selectedSubmission.budget ? selectedSubmission.budget.replace('-', ' - ').replace('<', '< ').replace('+', ' +') : 'Not provided'}</p>
                  </div>
                </div>
                 <div>
                    <h4 className="font-semibold">Interests</h4>
                    <p className="mt-1 p-3 bg-muted rounded-md">{selectedSubmission.interests || 'Not provided'}</p>
                </div>
                <div>
                    <h4 className="font-semibold">Message</h4>
                    <p className="mt-1 p-3 bg-muted rounded-md">{selectedSubmission.message}</p>
                </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

    