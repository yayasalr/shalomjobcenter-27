
import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, PenSquare } from "lucide-react";

interface Review {
  id: string;
  listingId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

const AdminReviews = () => {
  const { data: reviews = [], isLoading, error } = useQuery<Review[], Error>({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      // Using mock data for now
      return [
        {
          id: "1",
          listingId: "1",
          author: "John Doe",
          rating: 4,
          comment: "Très bon séjour, appartement propre et bien situé",
          date: "2024-02-15",
          status: "pending"
        },
        {
          id: "2",
          listingId: "2",
          author: "Jane Smith",
          rating: 5,
          comment: "Excellent accueil, je recommande vivement",
          date: "2024-02-16",
          status: "approved"
        },
      ];
    },
  });

  if (error) {
    toast.error("Erreur lors du chargement des avis");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminTopbar />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <h1 className="text-2xl font-semibold mb-6">Modération des avis</h1>
            
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="animate-pulse bg-white p-4 rounded-lg shadow">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : reviews && reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium">{review.author}</h3>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, index) => (
                            <span
                              key={index}
                              className={`text-lg ${
                                index < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                          <span className="text-sm text-gray-500 ml-2">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${review.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {review.status === 'approved' ? 'Approuvé' :
                         review.status === 'pending' ? 'En attente' : 'Rejeté'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{review.comment}</p>
                    <div className="flex gap-2">
                      {review.status === 'pending' && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            className="inline-flex items-center"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approuver
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="inline-flex items-center"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Rejeter
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="inline-flex items-center"
                      >
                        <PenSquare className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Aucun avis disponible</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminReviews;
