

import Link from 'next/link';

export default function PracticeCategories() {
  const legalCategories = [
    { name: 'Criminal Defense', count: '14+ Experts', slug: 'criminal', bg: 'from-red-500/10 dark:from-red-950/20 to-neutral-50 dark:to-neutral-900' },
    { name: 'Corporate & Tech', count: '22+ Experts', slug: 'corporate', bg: 'from-blue-500/10 dark:from-blue-950/20 to-neutral-50 dark:to-neutral-900' },
    { name: 'Family & Marriage', count: '9+ Experts', slug: 'family', bg: 'from-purple-500/10 dark:from-purple-950/20 to-neutral-50 dark:to-neutral-900' },
    { name: 'Intellectual Property', count: '11+ Experts', slug: 'ip', bg: 'from-amber-500/10 dark:from-amber-950/20 to-neutral-50 dark:to-neutral-900' },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
          Practice Classifications
        </h2>
        <p className="text-sm text-neutral-500 dark:text-zinc-500">
          Isolate legal parameters across target jurisdictional frameworks.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {legalCategories.map((cat, i) => (
          <Link 
            key={i} 
            href={`/browse?category=${cat.slug}`}
            className={`p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br ${cat.bg} hover:border-orange-500/40 dark:hover:border-orange-500/30 transition-all duration-300 group flex flex-col justify-between min-h-[140px] shadow-sm dark:shadow-none`}
          >
            <span className="text-xs font-mono text-neutral-500 dark:text-zinc-500 uppercase tracking-widest">
              {cat.count}
            </span>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors tracking-tight">
                {cat.name}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-zinc-500">Explore Directory &rarr;</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}