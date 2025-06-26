export function Logo() {
  return (
    <div className="flex items-center justify-center gap-2" aria-label="King Dragons">
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
      <span className="font-headline text-2xl font-bold tracking-tighter">KD</span>
    </div>
  )
}
