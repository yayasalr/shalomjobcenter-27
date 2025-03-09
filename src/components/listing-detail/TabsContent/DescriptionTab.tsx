
import React from "react";
import { TabsContent } from "@/components/ui/tabs";

export interface DescriptionTabProps {
  description: string | undefined;
}

const DescriptionTab = ({ description }: DescriptionTabProps) => (
  <TabsContent value="description" className="animate-fade-in pt-6">
    <div className="prose prose-lg max-w-none">
      <div className="text-gray-700 whitespace-pre-line text-base md:text-lg leading-relaxed">
        {description ? (
          <>
            {description.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </>
        ) : (
          <p>Aucune description disponible pour ce logement.</p>
        )}
      </div>
    </div>
  </TabsContent>
);

export default DescriptionTab;
