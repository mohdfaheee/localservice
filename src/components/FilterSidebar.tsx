import { motion } from "framer-motion";
import { categories } from "@/data/mockData";

interface FilterSidebarProps {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
  locationInput: string;
  onLocationChange: (loc: string) => void;
}

const FilterSidebar = ({
  selectedCategory,
  onCategoryChange,
  minRating,
  onRatingChange,
  locationInput,
  onLocationChange,
}: FilterSidebarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-card border border-border rounded-xl p-5 space-y-6"
    >
      <div>
        <h3 className="font-semibold text-foreground mb-3 text-sm">Category</h3>
        <div className="space-y-1">
          <button
            onClick={() => onCategoryChange("")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedCategory ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            All Services
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                selectedCategory === cat.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <span>{cat.icon} {cat.name}</span>
              <span className="text-xs opacity-60">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3 text-sm">Location (City)</h3>
        <input
          value={locationInput}
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder="Enter city..."
          className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3 text-sm">Minimum Rating</h3>
        <div className="flex flex-wrap gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => onRatingChange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                minRating === r
                  ? "gradient-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/10"
              }`}
            >
              {r === 0 ? "Any" : `${r}+ ★`}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FilterSidebar;
