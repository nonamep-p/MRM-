
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package, Settings, Image, MessageSquare } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

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

  return (
    <div className="flex flex-col min-h-screen">
        <Header onContactClick={() => {}} /> 
        <div className="flex flex-1">
            <aside className="w-64 bg-background border-r p-4">
                <nav className="flex flex-col space-y-2">
                    <Button variant="ghost" className="justify-start" asChild>
                        <Link href="/admin">
                            <Package className="mr-2 h-4 w-4" />
                            Packages
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
            </aside>
            <main className="flex-1 bg-background">{children}</main>
        </div>
        <Footer />
    </div>
  );
}
