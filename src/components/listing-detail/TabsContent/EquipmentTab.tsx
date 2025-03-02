
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Users, Calendar, Check } from "lucide-react";

export interface EquipmentTabProps {
  // Empty props interface for consistency
}

const EquipmentTab = ({}: EquipmentTabProps = {}) => (
  <TabsContent value="equipment" className="animate-fade-in pt-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 transition-colors">
        <Users className="h-5 w-5 text-gray-500" />
        <span>4 voyageurs maximum</span>
      </div>
      <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 transition-colors">
        <Calendar className="h-5 w-5 text-gray-500" />
        <span>Disponible toute l'année</span>
      </div>
      <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 transition-colors">
        <Check className="h-5 w-5 text-gray-500" />
        <span>Wifi gratuit</span>
      </div>
      <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 transition-colors">
        <Check className="h-5 w-5 text-gray-500" />
        <span>Climatisation</span>
      </div>
      <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 transition-colors">
        <Check className="h-5 w-5 text-gray-500" />
        <span>TV écran plat</span>
      </div>
      <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 transition-colors">
        <Check className="h-5 w-5 text-gray-500" />
        <span>Cuisine équipée</span>
      </div>
    </div>
  </TabsContent>
);

export default EquipmentTab;
