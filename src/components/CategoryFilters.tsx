
import { 
  Home, 
  Building, 
  Pool, 
  Wind, 
  Utensils, 
  Mountain, 
  Snowflake,
  Umbrella,
  Golf,
  Trees,
  Building2,
  Ship
} from "lucide-react";
import { useState } from "react";

const categories = [
  { id: 1, name: "Chambres", icon: Home },
  { id: 2, name: "Iconiques", icon: Building2 },
  { id: 3, name: "Maisons troglodytes", icon: Mountain },
  { id: 4, name: "Piscines", icon: Pool },
  { id: 5, name: "Chambres d'hôtes", icon: Building },
  { id: 6, name: "Moulins à vent", icon: Wind },
  { id: 7, name: "Cuisines équipées", icon: Utensils },
  { id: 8, name: "Arctique", icon: Snowflake },
  { id: 9, name: "Plages", icon: Umbrella },
  { id: 10, name: "Golf", icon: Golf },
  { id: 11, name: "Fermes", icon: Trees },
  { id: 12, name: "Bord de mer", icon: Ship },
];

export const CategoryFilters = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  return (
    <div className="fixed top-20 left-0 right-0 bg-white z-40 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-8 py-4 overflow-x-auto no-scrollbar">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex flex-col items-center min-w-fit text-sm pb-2 border-b-2 transition-colors duration-200 ${
                  activeCategory === category.id
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="whitespace-nowrap">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
