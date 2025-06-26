import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from './ui/button';

function LegalHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Become a Knight</Link>
            </Button>
          </div>
      </div>
    </header>
  );
}

function LegalFooter() {
    return (
        <footer className="border-t py-6 mt-auto">
            <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground text-center sm:text-left">&copy; {new Date().getFullYear()} KingDragons. All rights reserved.</p>
                <div className="flex gap-4">
                    <Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link>
                    <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
                    <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
                </div>
            </div>
      </footer>
    )
}

export function LegalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-dvh flex-col bg-background">
            <LegalHeader />
            <main className="flex-1 py-12 sm:py-16 md:py-20">
                <div className="container max-w-4xl">
                    {children}
                </div>
            </main>
            <LegalFooter />
        </div>
    )
}
