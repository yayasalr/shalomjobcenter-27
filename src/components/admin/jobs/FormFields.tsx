import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, Plus } from 'lucide-react';
import { Loader2, ImagePlus } from 'lucide-react';

interface FormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  domain: string;
  setDomain: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  requirements: string;
  setRequirements: (value: string) => void;
  contract: string;
  setContract: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  salary: number;
  setSalary: (value: number) => void;
  positions: number;
  setPositions: (value: number) => void;
  deadline: string;
  setDeadline: (value: string) => void;
  isHousingOffer?: boolean;
  price?: number;
  setPrice?: (value: number) => void;
  bedrooms?: number;
  setBedrooms?: (value: number) => void;
  bathrooms?: number;
  setBathrooms?: (value: number) => void;
  images?: string[];
  onAddImage?: () => void;
  onUpdateImage?: (index: number, value: string) => void;
  onRemoveImage?: (index: number) => void;
  isUploading?: boolean;
}

export const FormFields: React.FC<FormFieldsProps> = ({
  title,
  setTitle,
  domain,
  setDomain,
  description,
  setDescription,
  requirements,
  setRequirements,
  contract,
  setContract,
  location,
  setLocation,
  salary,
  setSalary,
  positions,
  setPositions,
  deadline,
  setDeadline,
  isHousingOffer = false,
  price = 0,
  setPrice,
  bedrooms = 1,
  setBedrooms,
  bathrooms = 1,
  setBathrooms,
  images = [],
  onAddImage,
  onUpdateImage,
  onRemoveImage,
  isUploading = false
}) => {
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title" className="block text-sm font-medium mb-1">
          Titre <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de l'offre"
          required
        />
      </div>

      {!isHousingOffer && (
        <div>
          <Label htmlFor="domain" className="block text-sm font-medium mb-1">
            Domaine <span className="text-red-500">*</span>
          </Label>
          <Select value={domain} onValueChange={setDomain}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un domaine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential_security">Sécurité résidentielle</SelectItem>
              <SelectItem value="bodyguard">Garde du corps</SelectItem>
              <SelectItem value="private_property">Surveillance propriétés privées</SelectItem>
              <SelectItem value="industrial_security">Sécurité industrielle</SelectItem>
              <SelectItem value="office_security">Sécurité de bureau</SelectItem>
              <SelectItem value="security_patrol">Patrouilleur</SelectItem>
              <SelectItem value="access_control">Contrôle d'accès</SelectItem>
              <SelectItem value="security_systems">Opérateur systèmes</SelectItem>
              <SelectItem value="construction_security">Sécurité chantier</SelectItem>
              <SelectItem value="site_supervisor">Surveillant travaux</SelectItem>
              <SelectItem value="security_coordinator">Coordinateur sécurité</SelectItem>
              <SelectItem value="event_security">Sécurité événementielle</SelectItem>
              <SelectItem value="k9_security">Maître-chien</SelectItem>
              <SelectItem value="security_manager">Responsable sécurité</SelectItem>
              <SelectItem value="security_consultant">Consultant sécurité</SelectItem>
              <SelectItem value="security_trainer">Formateur sécurité</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="description" className="block text-sm font-medium mb-1">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={`Description détaillée de ${isHousingOffer ? 'ce logement' : 'cette offre d\'emploi'}`}
          rows={5}
          required
        />
      </div>

      <div>
        <Label htmlFor="requirements" className="block text-sm font-medium mb-1">
          {isHousingOffer ? 'Caractéristiques' : 'Exigences'} <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="requirements"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder={isHousingOffer 
            ? "Caractéristiques du logement (une par ligne)" 
            : "Exigences du poste (une par ligne)"
          }
          rows={5}
          required
        />
        <p className="text-xs text-gray-500 mt-1">Entrez une exigence par ligne</p>
      </div>

      {!isHousingOffer && (
        <div>
          <Label htmlFor="contract" className="block text-sm font-medium mb-1">
            Type de contrat <span className="text-red-500">*</span>
          </Label>
          <Select value={contract} onValueChange={setContract}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type de contrat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full_time">CDI</SelectItem>
              <SelectItem value="part_time">Temps partiel</SelectItem>
              <SelectItem value="contract">CDD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="location" className="block text-sm font-medium mb-1">
          Localisation <span className="text-red-500">*</span>
        </Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="ex: Tokoin, Lomé, Togo"
          required
        />
      </div>

      {isHousingOffer ? (
        <div>
          <Label htmlFor="price" className="block text-sm font-medium mb-1">
            Prix (€) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice && setPrice(Number(e.target.value))}
            placeholder="Prix du logement en euros"
            min="0"
            step="0.01"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Prix en FCFA: {Math.round(price * 655.957).toLocaleString('fr-FR')} FCFA</p>
        </div>
      ) : (
        <div>
          <Label htmlFor="salary" className="block text-sm font-medium mb-1">
            Salaire (€) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="salary"
            type="number"
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            placeholder="Salaire mensuel en euros"
            min="0"
            step="0.01"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Salaire en FCFA: {Math.round(salary * 655.957).toLocaleString('fr-FR')} FCFA</p>
        </div>
      )}

      {isHousingOffer ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bedrooms" className="block text-sm font-medium mb-1">
              Nombre de chambres
            </Label>
            <Input
              id="bedrooms"
              type="number"
              value={bedrooms}
              onChange={(e) => setBedrooms && setBedrooms(Number(e.target.value))}
              min="0"
              step="1"
            />
          </div>
          <div>
            <Label htmlFor="bathrooms" className="block text-sm font-medium mb-1">
              Nombre de salles de bain
            </Label>
            <Input
              id="bathrooms"
              type="number"
              value={bathrooms}
              onChange={(e) => setBathrooms && setBathrooms(Number(e.target.value))}
              min="0"
              step="0.5"
            />
          </div>
        </div>
      ) : (
        <div>
          <Label htmlFor="positions" className="block text-sm font-medium mb-1">
            Nombre de postes <span className="text-red-500">*</span>
          </Label>
          <Input
            id="positions"
            type="number"
            value={positions}
            onChange={(e) => setPositions(Number(e.target.value))}
            placeholder="Nombre de postes disponibles"
            min="1"
            step="1"
            required
          />
        </div>
      )}

      <div>
        <Label htmlFor="deadline" className="block text-sm font-medium mb-1">
          Date limite <span className="text-red-500">*</span>
        </Label>
        <Input
          id="deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          min={today}
          required
        />
      </div>

      {isHousingOffer && (
        <div>
          <Label className="block text-sm font-medium mb-1">
            Images du logement
          </Label>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Images du logement</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative border rounded-md overflow-hidden">
                  <img
                    src={image}
                    alt={`Image ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={() => onRemoveImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="h-32 border-dashed flex flex-col items-center justify-center"
                onClick={onAddImage}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin mb-1" />
                    <span className="text-xs">Téléchargement...</span>
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-6 w-6 mb-1" />
                    <span className="text-xs">Ajouter une image</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Ajoutez des URLs d'images pour votre logement. La première sera l'image principale.
          </p>
        </div>
      )}
    </div>
  );
};
