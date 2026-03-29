const SkeletonCard = () => (
  <div className="bg-card rounded-xl border border-border overflow-hidden">
    <div className="h-44 shimmer" />
    <div className="p-5 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full shimmer" />
        <div className="h-3 w-24 rounded shimmer" />
      </div>
      <div className="h-4 w-3/4 rounded shimmer" />
      <div className="h-3 w-1/2 rounded shimmer" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 w-16 rounded shimmer" />
        <div className="h-7 w-20 rounded-full shimmer" />
      </div>
    </div>
  </div>
);

export default SkeletonCard;
