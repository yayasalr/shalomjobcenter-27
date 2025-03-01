
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ImportExportTabProps {
  handleImportClick: () => void;
  handleSettingsExport: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImportExportTab: React.FC<ImportExportTabProps> = ({
  handleImportClick,
  handleSettingsExport,
  fileInputRef,
  handleFileChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Importer / Exporter les paramètres</CardTitle>
        <CardDescription>Importer ou exporter les paramètres de votre site.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        <Button onClick={handleImportClick}>Importer les paramètres</Button>
        <Button onClick={handleSettingsExport}>Exporter les paramètres</Button>
      </CardContent>
    </Card>
  );
};
