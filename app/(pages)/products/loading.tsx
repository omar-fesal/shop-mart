export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-2xl gradient-primary opacity-30 animate-ping" />
        <div className="relative w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-2xl">A</span>
        </div>
      </div>
      <p className="text-muted-foreground text-sm font-medium animate-pulse">
        Loading...
      </p>
    </div>
  );
}