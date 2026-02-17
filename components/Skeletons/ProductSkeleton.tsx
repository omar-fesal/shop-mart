export default function ProductSkeleton() {
  return (
    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
      {/* Image placeholder */}
      <div className="shimmer w-full aspect-square" />

      {/* Content placeholder */}
      <div className="p-4 space-y-3">
        <div className="shimmer h-3 rounded-full w-1/3" />
        <div className="shimmer h-4 rounded-full w-full" />
        <div className="shimmer h-4 rounded-full w-2/3" />
        <div className="shimmer h-3 rounded-full w-1/4 mt-2" />
        <div className="shimmer h-5 rounded-full w-1/3 mt-1" />
      </div>

      {/* Button placeholder */}
      <div className="px-4 pb-4 flex gap-2">
        <div className="shimmer h-10 rounded-xl flex-1" />
        <div className="shimmer h-10 rounded-xl w-12" />
      </div>
    </div>
  );
}
