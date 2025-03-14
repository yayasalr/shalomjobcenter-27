
import { supabase } from './client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Télécharger un fichier base64 vers Supabase Storage
 */
export const uploadBase64File = async (base64Data: string, folder: string = 'general'): Promise<string> => {
  try {
    // Extraire le MIME type et les données binaires
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      throw new Error('Format de données base64 invalide');
    }
    
    const mimeType = matches[1];
    const base64Content = matches[2];
    const fileExtension = mimeType.split('/')[1];
    
    // Convertir en Blob
    const byteCharacters = atob(base64Content);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    const blob = new Blob(byteArrays, { type: mimeType });
    
    // Nom de fichier unique
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `${folder}/${fileName}`;
    
    // Télécharger vers Supabase
    const { error } = await supabase.storage
      .from('site-assets')
      .upload(filePath, blob, {
        contentType: mimeType,
        cacheControl: '3600'
      });
    
    if (error) {
      throw error;
    }
    
    // Obtenir l'URL publique
    const { data } = supabase.storage
      .from('site-assets')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Erreur lors du téléchargement du fichier:', error);
    throw error;
  }
};

/**
 * Supprimer un fichier de Supabase Storage
 */
export const deleteFile = async (url: string): Promise<boolean> => {
  try {
    // Extraire le chemin du fichier à partir de l'URL
    const filePathMatch = url.match(/site-assets\/([^?]+)/);
    
    if (!filePathMatch || !filePathMatch[1]) {
      throw new Error('Format d\'URL invalide');
    }
    
    const filePath = filePathMatch[1];
    
    // Supprimer le fichier
    const { error } = await supabase.storage
      .from('site-assets')
      .remove([filePath]);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error);
    return false;
  }
};
