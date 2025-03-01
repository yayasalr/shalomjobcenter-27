
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoSectionProps {
  title: string;
  description: string;
  price: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setPrice: (price: string) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  title,
  description,
  price,
  setTitle,
  setDescription,
  setPrice
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-gray-700 font-medium">Titre</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du logement"
            className="bg-white border-gray-300 shadow-sm"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price" className="text-gray-700 font-medium">Prix (en FCFA)</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Prix par nuit en FCFA"
            min="0"
            step="0.01"
            className="bg-white border-gray-300 shadow-sm"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description du logement"
          rows={4}
          className="bg-white border-gray-300 shadow-sm"
        />
      </div>
    </>
  );
};
