import Banner from "@/Components/Banner";
import FeaturedLawyersGrid from "@/Components/FeaturedLawyersGrid";
import PracticeCategories from "@/Components/PracticeCategories";
import TopExperts from "@/Components/TopExperts";





// Server-side database fetching
async function getHomepageData() {
  const baseUrl = process.env.NEXT_PUBLIC_URL;
  try {
    const res = await fetch(`${baseUrl}/lawyers`, { cache: 'no-store' });
    const response = await res.json(); // This is the object: { success: true, data: [...] }
    
    // Extract the array safely
    const lawyers = Array.isArray(response?.data) ? response.data : [];
    
    return {
      featured: lawyers, 
      topExperts: lawyers 
    };
  } catch (err) {
    console.error("Failed to parse upstream cluster data vectors:", err);
    return { featured: [], topExperts: [] };
  }
}

export default async function Home() {
  const { featured, topExperts } = await getHomepageData();
  return (
    <div className="space-y-20 pb-24 bg-white dark:bg-black text-neutral-800 dark:text-neutral-200 transition-colors duration-200">
      {/* HERO BANNER SECTION */}
      <Banner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* DYNAMIC SECTION: FEATURED LAWYERS GRID */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">Featured Counsel Profiles</h2>
            <p className="text-sm text-neutral-500 dark:text-zinc-500">Verified platform legal providers currently open to active retainer placements.</p>
          </div>
          <FeaturedLawyersGrid lawyers={featured} />
        </section>

        {/* EXTRA SECTION 1: TOP LEGAL EXPERTS (Prop Passed Down) */}
        <TopExperts experts={topExperts} />

        {/* EXTRA SECTION 2: LEGAL PRACTICE CATEGORIES */}
        <PracticeCategories />

      </div>
    </div>
  );
}