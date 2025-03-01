
import React from "react";
import { TabsContent } from "@/components/ui/tabs";

interface DescriptionTabProps {
  description: string | undefined;
}

const DescriptionTab = ({ description }: DescriptionTabProps) => (
  <TabsContent value="description" className="animate-fade-in pt-4">
    <div className="prose max-w-none">
      <p className="text-gray-700 whitespace-pre-line">
        {description || "Aucune description disponible."}
      </p>
    </div>
  </TabsContent>
);

export default DescriptionTab;
