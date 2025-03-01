
import React from "react";
import { TabsContent } from "@/components/ui/tabs";

interface DescriptionTabProps {
  description: string | undefined;
}

const DescriptionTab = ({ description }: DescriptionTabProps) => (
  <TabsContent value="description" className="animate-fade-in pt-6">
    <div className="prose prose-lg max-w-none">
      <p className="text-gray-700 whitespace-pre-line text-base md:text-lg leading-relaxed">
        {description || "Aucune description disponible pour ce logement."}
      </p>
    </div>
  </TabsContent>
);

export default DescriptionTab;
