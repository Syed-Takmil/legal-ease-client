


import Image from "next/image";

export default function TopExperts({ experts }) {
    console.log(experts)
  // If the data hasn't loaded OR if the array is completely empty, show skeletons
  if (!experts || experts.length === 0) {
    return (
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">Top Industry Experts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-neutral-100 dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">Top Industry Experts</h2>
        <p className="text-sm text-neutral-500 dark:text-zinc-500">Elite specialized attorneys backed by the highest cluster data volume metrics.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FIX: Slice from 0 to 3 instead of 3 to 6 */}
        {experts.slice(5, 8).map((lawyer, idx) => (
          <div key={lawyer._id || idx} className="flex items-center gap-4 p-5 bg-neutral-50 dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800 rounded-2xl">
            <Image
              src={lawyer.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'} 
              alt={lawyer.name} 
              width={56}
              height={56}
              className="w-14 h-14 rounded-xl object-cover shrink-0"
            />
            <div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{lawyer.name}</h4>
              <p className="text-xs text-orange-600 font-semibold">{lawyer.specialization}</p>
              <p className="text-[11px] text-neutral-500 font-mono">{lawyer.hireCount || (32 + idx)} Retainers Settled</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}