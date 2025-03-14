
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Listing } from '@/types/listing';
import { uploadBase64File } from '@/integrations/supabase/storage';
import { toast } from 'sonner';

// Type pour les lignes de la base de données
type ListingRow = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  location: string;
  neighborhood: string | null;
  map_location: string | null;
  rating: number;
  dates: string | null;
  main_image_url: string | null;
  images: string[];
  host: { name: string; image: string };
  created_at: string;
  updated_at: string;
};

// Convertir une ligne de la base de données en objet Listing
const convertRowToListing = (row: ListingRow): Listing => {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    price: Number(row.price),
    location: row.location,
    neighborhood: row.neighborhood || '',
    mapLocation: row.map_location || '',
    rating: Number(row.rating),
    dates: row.dates || new Date().toLocaleDateString(),
    image: row.main_image_url || '/placeholder.svg',
    images: Array.isArray(row.images) ? row.images : [],
    host: row.host || { name: 'Hôte', image: '/placeholder.svg' }
  };
};

export const useListingsCloud = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger tous les logements
  const getListings = useCallback(async (): Promise<Listing[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Convertir les lignes en objets Listing
      return (data || []).map(row => convertRowToListing(row as ListingRow));
    } catch (err: any) {
      console.error('Erreur lors du chargement des logements:', err);
      setError(err.message || 'Erreur lors du chargement des logements');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Ajouter un nouveau logement
  const addListing = useCallback(async (listing: Omit<Listing, 'id'>): Promise<Listing | null> => {
    try {
      setLoading(true);
      setError(null);

      // Traiter les images
      let mainImageUrl = listing.image;
      let imagesArray: string[] = [];

      // Télécharger l'image principale si c'est une chaîne base64
      if (listing.image && (listing.image.startsWith('data:image/') || listing.image.startsWith('blob:'))) {
        try {
          mainImageUrl = await uploadBase64File(listing.image, 'listings');
        } catch (err) {
          console.error('Erreur lors du téléchargement de l\'image principale:', err);
          toast.error('Erreur lors du téléchargement de l\'image principale');
        }
      }

      // Télécharger les images additionnelles si elles existent
      if (listing.images && listing.images.length > 0) {
        const uploadPromises = listing.images.map(async (img) => {
          if (img && (img.startsWith('data:image/') || img.startsWith('blob:'))) {
            try {
              return await uploadBase64File(img, 'listings');
            } catch (err) {
              console.error('Erreur lors du téléchargement d\'une image:', err);
              return null;
            }
          }
          return img;
        });

        const uploadedImages = await Promise.all(uploadPromises);
        imagesArray = uploadedImages.filter(Boolean) as string[];
      }

      // Préparer les données pour Supabase
      const newListing = {
        title: listing.title,
        description: listing.description || '',
        price: listing.price,
        location: listing.location,
        neighborhood: listing.neighborhood || '',
        map_location: listing.mapLocation || '',
        rating: listing.rating || 0,
        dates: listing.dates || new Date().toLocaleDateString(),
        main_image_url: mainImageUrl,
        images: imagesArray,
        host: listing.host || { name: 'Hôte', image: '/placeholder.svg' }
      };

      // Insérer dans Supabase
      const { data, error } = await supabase
        .from('listings')
        .insert(newListing)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success('Logement ajouté avec succès');
      return convertRowToListing(data as ListingRow);
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout du logement:', err);
      setError(err.message || 'Erreur lors de l\'ajout du logement');
      toast.error('Erreur lors de l\'ajout du logement');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour un logement existant
  const updateListing = useCallback(async (listing: Listing): Promise<Listing | null> => {
    try {
      setLoading(true);
      setError(null);

      // Traiter les images
      let mainImageUrl = listing.image;
      let imagesArray: string[] = [];

      // Télécharger l'image principale si c'est une chaîne base64
      if (listing.image && (listing.image.startsWith('data:image/') || listing.image.startsWith('blob:'))) {
        try {
          mainImageUrl = await uploadBase64File(listing.image, 'listings');
        } catch (err) {
          console.error('Erreur lors du téléchargement de l\'image principale:', err);
          toast.error('Erreur lors du téléchargement de l\'image principale');
        }
      }

      // Télécharger les images additionnelles si elles existent
      if (listing.images && listing.images.length > 0) {
        const uploadPromises = listing.images.map(async (img) => {
          if (img && (img.startsWith('data:image/') || img.startsWith('blob:'))) {
            try {
              return await uploadBase64File(img, 'listings');
            } catch (err) {
              console.error('Erreur lors du téléchargement d\'une image:', err);
              return null;
            }
          }
          return img;
        });

        const uploadedImages = await Promise.all(uploadPromises);
        imagesArray = uploadedImages.filter(Boolean) as string[];
      }

      // Préparer les données pour Supabase
      const updatedListing = {
        title: listing.title,
        description: listing.description || '',
        price: listing.price,
        location: listing.location,
        neighborhood: listing.neighborhood || '',
        map_location: listing.mapLocation || '',
        rating: listing.rating || 0,
        dates: listing.dates || new Date().toLocaleDateString(),
        main_image_url: mainImageUrl,
        images: imagesArray,
        host: listing.host || { name: 'Hôte', image: '/placeholder.svg' },
        updated_at: new Date().toISOString()
      };

      // Mettre à jour dans Supabase
      const { data, error } = await supabase
        .from('listings')
        .update(updatedListing)
        .eq('id', listing.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success('Logement mis à jour avec succès');
      return convertRowToListing(data as ListingRow);
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du logement:', err);
      setError(err.message || 'Erreur lors de la mise à jour du logement');
      toast.error('Erreur lors de la mise à jour du logement');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Supprimer un logement
  const deleteListing = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success('Logement supprimé avec succès');
      return true;
    } catch (err: any) {
      console.error('Erreur lors de la suppression du logement:', err);
      setError(err.message || 'Erreur lors de la suppression du logement');
      toast.error('Erreur lors de la suppression du logement');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtenir un logement par son ID
  const getListingById = useCallback(async (id: string): Promise<Listing | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data ? convertRowToListing(data as ListingRow) : null;
    } catch (err: any) {
      console.error(`Erreur lors de la récupération du logement ${id}:`, err);
      setError(err.message || `Erreur lors de la récupération du logement ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getListings,
    addListing,
    updateListing,
    deleteListing,
    getListingById
  };
};
