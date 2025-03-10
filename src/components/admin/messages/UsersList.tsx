
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Search, X } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  email?: string;
}

interface UsersListProps {
  onSelectUser: (userId: string, userName: string) => void;
  onClose: () => void;
}

export const UsersList: React.FC<UsersListProps> = ({ onSelectUser, onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des utilisateurs
    setLoading(true);
    
    // Récupérer les utilisateurs dans le localStorage
    const mockUsers: User[] = [
      { id: 'user1', name: 'Jean Dupont', avatar: '/placeholder.svg', email: 'jean@example.com' },
      { id: 'user2', name: 'Marie Martin', avatar: '/placeholder.svg', email: 'marie@example.com' },
    ];
    
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 800);
  }, []);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-h-80 overflow-hidden flex flex-col">
      <div className="mb-3 relative">
        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
        {searchQuery && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 top-1 h-8 w-8"
            onClick={() => setSearchQuery('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="overflow-y-auto flex-1 border rounded-md">
        {loading ? (
          <div className="p-4 text-center text-gray-500">
            Chargement des utilisateurs...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Aucun utilisateur trouvé
          </div>
        ) : (
          filteredUsers.map(user => (
            <div 
              key={user.id}
              className="p-3 hover:bg-gray-100 cursor-pointer border-b flex items-center"
              onClick={() => onSelectUser(user.id, user.name)}
            >
              <Avatar className="h-10 w-10 mr-3">
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              </Avatar>
              <div>
                <h3 className="font-medium">{user.name}</h3>
                {user.email && <p className="text-sm text-gray-500">{user.email}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
