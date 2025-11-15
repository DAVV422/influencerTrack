import { cn } from "@/lib/utils";

export const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cn("h-4 w-4", className)}
  >
    <path d="M22.2 5.9v2.5h-2.1c-.2 3.2-1.9 6.2-4.6 8.2-2.1 1.6-4.6 2.4-7.2 2.4-2 0-3.9-.6-5.5-1.7v-2.5c1.4.9 3.1 1.4 4.8 1.4 1.3 0 2.6-.3 3.8-1 2.9-1.7 4.7-4.7 4.9-8.1H10V3.4h2.5V.9c2.3 0 4.3 1.5 5 3.6.1.4.2.8.2 1.4z" />
  </svg>
);
