
/**
 * Calculate average rating from reviews
 */
export const calculateAverageRating = (reviews: any[]): number => {
  if (!reviews || reviews.length === 0) return 0;
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
};

/**
 * Generate demo reviews when none are available
 */
export const generateDemoReviews = (listingId: string): any[] => {
  return [
    {
      id: `demo1-${listingId}`,
      author: "Michel Dupont",
      avatar: "/placeholder.svg",
      rating: 5,
      date: "Mars 2024",
      comment:
        "Superbe logement, très bien situé. Le propriétaire est très accueillant. Je recommande vivement !",
    },
    {
      id: `demo2-${listingId}`,
      author: "Sophie Martin",
      avatar: "/placeholder.svg",
      rating: 4,
      date: "Février 2024",
      comment:
        "Appartement conforme aux photos, propre et fonctionnel. Un peu bruyant le soir mais globalement un bon séjour.",
    },
  ];
};

/**
 * Filter and process listing reviews
 */
export const processListingReviews = (
  listingId: string | undefined,
  allReviews: any[] | undefined
): any[] => {
  if (!listingId || !allReviews) return [];

  const filteredReviews = allReviews.filter(
    (review) => review.listingId === listingId && review.status === "approved"
  );

  if (filteredReviews.length === 0 && listingId) {
    return generateDemoReviews(listingId);
  }

  return filteredReviews;
};
