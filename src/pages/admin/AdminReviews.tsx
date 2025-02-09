
import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { ReviewEditDialog } from '@/components/admin/reviews/ReviewEditDialog';
import { useReviews } from '@/hooks/useReviews';

const AdminReviews = () => {
  const {
    reviews,
    isLoading,
    error,
    updateReviewStatus,
    updateReviewContent
  } = useReviews();

  const handleApprove = async (reviewId: string) => {
    await updateReviewStatus.mutateAsync({ reviewId, status: 'approved' });
  };

  const handleReject = async (reviewId: string) => {
    await updateReviewStatus.mutateAsync({ reviewId, status: 'rejected' });
  };

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
                            onClick={() => handleApprove(review.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approuver
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="inline-flex items-center"
                            onClick={() => handleReject(review.id)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Rejeter
                          </Button>
                        </>
                      )}
                      <ReviewEditDialog
                        review={review}
                        onSave={updateReviewContent.mutateAsync}
                      />
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
