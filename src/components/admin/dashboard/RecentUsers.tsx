
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserData {
  id: string;
  name: string;
  email: string;
  date: string;
  avatar: string;
}

interface RecentUsersProps {
  users: UserData[];
}

export const RecentUsers: React.FC<RecentUsersProps> = ({ users }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouveaux utilisateurs</CardTitle>
        <CardDescription>
          Derniers utilisateurs inscrits
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{user.name}</h4>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(user.date).toLocaleDateString()}
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full mt-4">
            Voir tous les utilisateurs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
