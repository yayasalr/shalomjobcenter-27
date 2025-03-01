
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ValidationErrors {
  title?: string;
  description?: string;
  price?: string;
  [key: string]: string | undefined;
}

interface BasicInfoSectionProps {
  title: string;
  description: string;
  price: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setPrice: (price: string) => void;
  errors: ValidationErrors;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  title,
  description,
  price,
  setTitle,
  setDescription,
  setPrice,
  errors
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title" className={`text-gray-700 font-medium ${errors.title ? 'text-red-500' : ''}`}>
            Titre *
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du logement"
            className={`bg-white border-gray-300 shadow-sm ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
            required
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title && (
            <p id="title-error" className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="price" className={`text-gray-700 font-medium ${errors.price ? 'text-red-500' : ''}`}>
            Prix (en FCFA) *
          </Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Prix par nuit en FCFA"
            min="0"
            step="0.01"
            className={`bg-white border-gray-300 shadow-sm ${errors.price ? 'border-red-500 focus:ring-red-500' : ''}`}
            required
            aria-invalid={!!errors.price}
            aria-describedby={errors.price ? "price-error" : undefined}
          />
          {errors.price && (
            <p id="price-error" className="text-red-500 text-xs mt-1">{errors.price}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className={`text-gray-700 font-medium ${errors.description ? 'text-red-500' : ''}`}>
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description du logement"
          rows={4}
          className={`bg-white border-gray-300 shadow-sm ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "description-error" : undefined}
        />
        {errors.description && (
          <p id="description-error" className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>
    </>
  );
};
