
import React, { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";

interface ImportExportTabProps {
  onImport: (file: File) => Promise<boolean>;
  onExport: () => boolean;
}

export const ImportExportTab: React.FC<ImportExportTabProps> = ({
  onImport,
  onExport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const success = await onImport(file);

    if (success) {
      toast.success("Paramètres importés avec succès");
    } else {
      toast.error("Échec de l'importation des paramètres");
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExportClick = () => {
    const success = onExport();
    if (success) {
      toast.success("Paramètres exportés avec succès");
    } else {
      toast.error("Échec de l'exportation des paramètres");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Importation et exportation des paramètres</CardTitle>
        <CardDescription>
          Sauvegardez ou restaurez les paramètres du site
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Exporter les paramètres</h3>
          <p className="text-sm text-gray-500">
            Téléchargez les paramètres actuels du site en tant que fichier JSON. Vous pourrez les réimporter ultérieurement.
          </p>
          <Button onClick={handleExportClick} className="mt-2">
            <Download className="mr-2 h-4 w-4" />
            Exporter les paramètres
          </Button>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Importer les paramètres</h3>
          <p className="text-sm text-gray-500">
            Importez des paramètres à partir d'un fichier JSON précédemment exporté. Cela remplacera tous les paramètres actuels.
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".json"
          />
          <Button onClick={handleImportClick} variant="outline" className="mt-2">
            <Upload className="mr-2 h-4 w-4" />
            Importer des paramètres
          </Button>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex flex-col items-start">
        <p className="text-sm text-orange-500 font-medium">
          Attention: L'importation de paramètres remplacera tous les paramètres actuels. Assurez-vous d'avoir une sauvegarde.
        </p>
      </CardFooter>
    </Card>
  );
};
