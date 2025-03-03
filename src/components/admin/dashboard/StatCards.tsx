
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  Home,
  Briefcase,
  Calendar,
  StarIcon,
  DollarSign,
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
    reviews: StarIcon,
  }[icon];

  const iconColors = {
    listings: { bg: 'bg-blue-100', text: 'text-blue-600' },
    jobs: { bg: 'bg-purple-100', text: 'text-purple-600' },
    reservations: { bg: 'bg-green-100', text: 'text-green-600' },
    reviews: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  }[icon];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{count}</h3>
            <div className={`flex items-center text-${change.direction === 'up' ? 'green' : 'red'}-600 text-sm mt-1`}>
              {change.direction === 'up' ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              <span>{change.value}% ce mois</span>
            </div>
          </div>
          <div className={`p-3 ${iconColors.bg} rounded-full`}>
            <IconComponent className={`h-6 w-6 ${iconColors.text}`} />
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
