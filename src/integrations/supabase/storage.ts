
import { supabase } from './client';
import { v4 as uuidv4 } from 'uuid';

// Nom du bucket Supabase
const BUCKET_NAME = 'site-assets';

/**
 * Télécharge un fichier vers Supabase Storage
 * @param file Fichier à télécharger
 * @param folder Dossier dans le bucket (optionnel)
 * @returns URL publique du fichier téléchargé
 */
export const uploadFile = async (file: File, folder = 'uploads'): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Télécharger le fichier dans le bucket
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Erreur lors du téléchargement:', error);
      throw new Error(`Erreur de téléchargement: ${error.message}`);
    }

    // Récupérer l'URL publique du fichier
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Erreur critique lors du téléchargement:', error);
    throw error;
  }
};

/**
 * Télécharge un fichier base64 vers Supabase Storage
 * @param base64String Chaîne base64 à télécharger
 * @param folder Dossier dans le bucket (optionnel)
 * @param fileType Type de fichier (ex: 'image/jpeg')
 * @returns URL publique du fichier téléchargé
 */
export const uploadBase64File = async (
  base64String: string,
  folder = 'uploads',
  fileType = 'image/jpeg'
): Promise<string> => {
  try {
    // Convertir base64 en Blob
    const base64Data = base64String.split(';base64,').pop() || '';
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);
      const byteNumbers = new Array(slice.length);
      
      for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: fileType });
    const file = new File([blob], `${uuidv4()}.${fileType.split('/')[1]}`, { type: fileType });
    
    // Utiliser la fonction uploadFile pour télécharger le fichier
    return await uploadFile(file, folder);
  } catch (error) {
    console.error('Erreur lors du téléchargement base64:', error);
    throw error;
  }
};

/**
 * Récupère l'URL publique d'un fichier dans Supabase Storage
 * @param filePath Chemin du fichier dans le bucket
 * @returns URL publique du fichier
 */
export const getPublicUrl = (filePath: string): string => {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};

/**
 * Supprime un fichier de Supabase Storage
 * @param filePath Chemin du fichier à supprimer
 * @returns Booléen indiquant si la suppression a réussi
 */
export const deleteFile = async (filePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);
    
    if (error) {
      console.error('Erreur lors de la suppression:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur critique lors de la suppression:', error);
    return false;
  }
};
