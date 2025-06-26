import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center justify-center gap-2" aria-label="KingDragons Home">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8 text-primary"
      >
        <path d="m2 12 5 5 5-5-5-5-5 5z" />
        <path d="m12 12 5 5 5-5-5-5-5 5z" />
      </svg>
      <span className="font-headline text-2xl font-bold tracking-tighter">KingDragons</span>
    </Link>
  )
}
