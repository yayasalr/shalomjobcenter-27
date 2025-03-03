
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  Home,
  Briefcase,
  Calendar,
  Star,
} from "lucide-react";

type StatCardProps = {
  title: string;
  count: number;
  change: {
    value: number;
    direction: 'up' | 'down';
  };
  icon: 'listings' | 'jobs' | 'reservations' | 'reviews';
};

const StatCard = ({ title, count, change, icon }: StatCardProps) => {
  const IconComponent = {
    listings: Home,
    jobs: Briefcase,
    reservations: Calendar,
    reviews: Star,
  }[icon];

  const iconColors = {
    listings: { bg: 'bg-blue-50', text: 'text-blue-500' },
    jobs: { bg: 'bg-purple-50', text: 'text-purple-500' },
    reservations: { bg: 'bg-green-50', text: 'text-green-500' },
    reviews: { bg: 'bg-yellow-50', text: 'text-yellow-500' },
  }[icon];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <h3 className="text-2xl font-semibold mt-1">{count}</h3>
            <div className={`flex items-center mt-1 ${change.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {change.direction === 'up' ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm">{change.value}% ce mois</span>
            </div>
          </div>
          <div className={`rounded-full ${iconColors.bg} p-3`}>
            <IconComponent className={`h-5 w-5 ${iconColors.text}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface StatCardsProps {
  listingsCount: number;
  jobsCount: number;
  reservationsCount: number;
  reviewsCount: number;
}

export const StatCards: React.FC<StatCardsProps> = ({
  listingsCount,
  jobsCount,
  reservationsCount,
  reviewsCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Logements"
        count={listingsCount}
        change={{ value: 4, direction: 'up' }}
        icon="listings"
      />
      <StatCard
        title="Offres d'emploi"
        count={jobsCount}
        change={{ value: 7, direction: 'up' }}
        icon="jobs"
      />
      <StatCard
        title="Réservations"
        count={reservationsCount}
        change={{ value: 2, direction: 'down' }}
        icon="reservations"
      />
      <StatCard
        title="Avis clients"
        count={reviewsCount}
        change={{ value: 12, direction: 'up' }}
        icon="reviews"
      />
    </div>
  );
};
