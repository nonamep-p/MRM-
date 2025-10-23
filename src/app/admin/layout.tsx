
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package, Settings, Image, MessageSquare, CalendarCheck, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  
  const NavLinks = () => (
     <nav className="flex flex-col space-y-2">
        <Button variant="ghost" className="justify-start" asChild>
            <Link href="/admin">
                <Package className="mr-2 h-4 w-4" />
                Packages
            </Link>
        </Button>
        <Button variant="ghost" className="justify-start" asChild>
            <Link href="/admin/availability">
                <CalendarCheck className="mr-2 h-4 w-4" />
                Availability
            </Link>
        </Button>
        <Button variant="ghost" className="justify-start" asChild>
            <Link href="/admin/hero">
                 <Image className="mr-2 h-4 w-4" />
                 Hero Slides
            </Link>
        </Button>
        <Button variant="ghost" className="justify-start" asChild>
            <Link href="/admin/submissions">
                <MessageSquare className="mr-2 h-4 w-4" />
                Submissions
            </Link>
        </Button>
        <Button variant="ghost" className="justify-start" asChild>
            <Link href="/admin/settings">
                 <Settings className="mr-2 h-4 w-4" />
                 Site Settings
            </Link>
        </Button>
    </nav>
  );

  return (
    <div className="flex flex-col min-h-screen">
        <Header /> 
        <div className="flex flex-1">
            {/* Desktop Sidebar */}
            <aside className={cn("w-64 bg-background border-r p-4 transition-all duration-300 hidden md:block", isSidebarOpen ? "translate-x-0" : "-translate-x-full w-0 p-0")}>
                <NavLinks />
            </aside>

            {/* Mobile Sidebar */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="fixed top-20 left-2 z-40 bg-background/50 backdrop-blur-sm">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-4">
                  <SheetHeader>
                    <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
                  </SheetHeader>
                  <NavLinks />
                </SheetContent>
              </Sheet>
            </div>
            
            <main className="flex-1 bg-background overflow-y-auto">
              <Button variant="ghost" size="icon" className="hidden md:inline-flex fixed top-20 left-2 z-40 bg-background/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              {children}
            </main>
        </div>
        <Footer />
    </div>
  );
}
