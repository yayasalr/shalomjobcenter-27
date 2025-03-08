
/**
 * Validation utilities for image uploads
 */

interface ValidationResult {
  valid: boolean;
  errorMessage?: string;
}

/**
 * Validate that files meet the requirements for upload
 * @param files Array of files to validate
 * @param allowedTypes Array of allowed MIME types
 * @param maxSizeMB Maximum file size in MB
 * @param maxFiles Maximum number of files allowed
 * @returns Validation result
 */
export const validateFiles = (
  files: File[],
  allowedTypes: string[],
  maxSizeMB: number,
  maxFiles: number
): ValidationResult => {
  if (files.length > maxFiles) {
    console.error(`Too many files: ${files.length} (max: ${maxFiles})`);
    return {
      valid: false,
      errorMessage: `Vous ne pouvez pas télécharger plus de ${maxFiles} fichiers à la fois.`
    };
  }
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  for (const file of files) {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      console.error(`Invalid file type: ${file.type}. Allowed: ${allowedTypes.join(', ')}`);
      return {
        valid: false,
        errorMessage: `Type de fichier non supporté: ${file.type}. Types acceptés: ${allowedTypes.join(', ')}`
      };
    }
    
    // Check file size
    if (file.size > maxSizeBytes) {
      console.error(`File too large: ${Math.round(file.size / 1024 / 1024 * 100) / 100}MB (max: ${maxSizeMB}MB)`);
      return {
        valid: false,
        errorMessage: `Fichier trop volumineux (${Math.round(file.size / 1024 / 1024 * 100) / 100}MB). La taille maximale est de ${maxSizeMB}MB.`
      };
    }
  }
  
  // All files passed validation
  return { valid: true };
};

/**
 * Validate a single file
 * @param file File to validate
 * @param allowedTypes Array of allowed MIME types
 * @param maxSizeMB Maximum file size in MB
 * @returns Validation result
 */
export const validateSingleFile = (
  file: File,
  allowedTypes: string[],
  maxSizeMB: number
): ValidationResult => {
  return validateFiles([file], allowedTypes, maxSizeMB, 1);
};
