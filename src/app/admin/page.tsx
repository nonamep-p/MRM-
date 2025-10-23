
'use client';

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import type { TravelPackage, ContactFormSubmission, PackageAvailability } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, MessageSquare, CalendarCheck, Clock, CheckCircle, XCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Progress } from "@/components/ui/progress";

export default function AdminDashboardPage() {
  const firestore = useFirestore();

  const packagesQuery = useMemoFirebase(() => firestore ? query(collection(firestore, "travelPackages")) : null, [firestore]);
  const { data: travelPackages, isLoading: isLoadingPackages } = useCollection<TravelPackage>(packagesQuery);

  const submissionsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, "contactFormSubmissions")) : null, [firestore]);
  const { data: submissions, isLoading: isLoadingSubmissions } = useCollection<ContactFormSubmission>(submissionsQuery);

  const availabilityQuery = useMemoFirebase(() => firestore ? query(collection(firestore, "packageAvailability")) : null, [firestore]);
  const { data: availabilities, isLoading: isLoadingAvailabilities } = useCollection<PackageAvailability>(availabilityQuery);
  
  const isLoading = isLoadingPackages || isLoadingSubmissions || isLoadingAvailabilities;

  const submissionStats = useMemoFirebase(() => {
    if (!submissions) return { pending: 0, confirmed: 0, canceled: 0, total: 0 };
    return submissions.reduce((acc, sub) => {
      acc[sub.status.toLowerCase()] = (acc[sub.status.toLowerCase()] || 0) + 1;
      acc.total += 1;
      return acc;
    }, { pending: 0, confirmed: 0, canceled: 0, total: 0 } as Record<string, number>);
  }, [submissions]);

  const availabilityStats = useMemoFirebase(() => {
      if(!availabilities) return { totalSlots: 0, bookedSlots: 0 };
      return availabilities.reduce((acc, item) => {
          acc.totalSlots += item.slots;
          acc.bookedSlots += item.bookedSlots;
          return acc;
      }, { totalSlots: 0, bookedSlots: 0 });
  }, [availabilities]);

  const bookingPercentage = availabilityStats.totalSlots > 0 
    ? (availabilityStats.bookedSlots / availabilityStats.totalSlots) * 100 
    : 0;

  const chartData = useMemoFirebase(() => {
    if (!travelPackages || !availabilities) return [];
    
    const packageBookings = availabilities.reduce((acc, avail) => {
        acc[avail.packageId] = (acc[avail.packageId] || 0) + avail.bookedSlots;
        return acc;
    }, {} as Record<string, number>);

    return travelPackages
        .map(pkg => ({
            name: pkg.title.length > 15 ? `${pkg.title.substring(0,15)}...` : pkg.title,
            bookings: packageBookings[pkg.id] || 0,
        }))
        .filter(item => item.bookings > 0)
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 10);

  }, [travelPackages, availabilities]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold font-headline mb-8">Dashboard</h1>
      
      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{travelPackages?.length || 0}</div>}
            <p className="text-xs text-muted-foreground">Travel packages available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{submissionStats.total}</div>}
             <div className="flex space-x-4 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-yellow-500" /> {submissionStats.pending || 0} Pending</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> {submissionStats.confirmed || 0} Confirmed</span>
                <span className="flex items-center gap-1"><XCircle className="h-3 w-3 text-red-500" /> {submissionStats.canceled || 0} Canceled</span>
            </div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Availability</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{availabilityStats.bookedSlots} / {availabilityStats.totalSlots}</div>}
             <p className="text-xs text-muted-foreground mt-1">{bookingPercentage.toFixed(1)}% of all slots booked</p>
             <Progress value={bookingPercentage} className="w-full h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Booking Chart */}
      {chartData && chartData.length > 0 && (
         <Card>
            <CardHeader>
                <CardTitle>Top 10 Booked Packages</CardTitle>
                <CardDescription>A look at the most popular travel packages based on bookings.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="h-[400px] w-full">
                    {isLoading ? <Skeleton className="h-full w-full" /> : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 50 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis 
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                            />
                            <YAxis 
                                allowDecimals={false}
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--background))",
                                    borderColor: "hsl(var(--border))"
                                }}
                            />
                            <Legend wrapperStyle={{paddingTop: '20px'}}/>
                            <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
      )}

    </div>
  );
}
