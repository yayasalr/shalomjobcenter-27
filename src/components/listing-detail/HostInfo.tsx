
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HostProps {
  name?: string;
  image?: string;
}

interface HostInfoProps {
  host?: HostProps;
}

const HostInfo = ({ host }: HostInfoProps) => (
  <div className="flex justify-between items-start mb-6">
    <div>
      <h2 className="text-xl font-semibold text-gray-900">
        Hébergé par {host?.name || "l'hôte"}
      </h2>
      <p className="text-gray-600 text-sm">Membre depuis 2022</p>
    </div>
    <Avatar className="h-12 w-12 border-2 border-primary shadow-sm hover:scale-105 transition-transform">
      <AvatarImage src={host?.image || "/placeholder.svg"} />
      <AvatarFallback>{(host?.name || "Hôte")[0]}</AvatarFallback>
    </Avatar>
  </div>
);

export default HostInfo;
