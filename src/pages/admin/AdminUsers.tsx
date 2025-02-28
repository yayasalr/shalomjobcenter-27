
import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Ban, 
  CheckCircle, 
  UserCog, 
  UserPlus, 
  Building, 
  Home, 
  Lock, 
  Mail, 
  Search,
  MoreHorizontal,
  AlertTriangle,
  UserX,
  RefreshCw,
  Shield,
  BriefcaseBusiness
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'host' | 'guest';
  status: 'active' | 'suspended';
  joinedDate: string;
  lastLogin?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  verifiedEmail?: boolean;
  verifiedPhone?: boolean;
  verifiedId?: boolean;
  listings?: number;
  bookings?: number;
}

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isUserVerificationDialogOpen, setIsUserVerificationDialogOpen] = useState(false);
  
  // Formulaire d'utilisateur
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'guest' as 'admin' | 'host' | 'guest',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Récupération des utilisateurs
  const { data: users = [], isLoading, error } = useQuery<User[], Error>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Utilisation de données fictives pour la démonstration
      return [
        {
          id: "1",
          name: "Jean Dupont",
          email: "jean.dupont@example.com",
          role: "host",
          status: "active",
          joinedDate: "2023-05-15",
          lastLogin: "2024-04-01",
          avatar: "/placeholder.svg",
          phone: "+33 6 12 34 56 78",
          address: "123 Rue de Paris, 75001 Paris",
          verifiedEmail: true,
          verifiedPhone: true,
          verifiedId: true,
          listings: 3,
          bookings: 5
        },
        {
          id: "2",
          name: "Marie Martin",
          email: "marie.martin@example.com",
          role: "guest",
          status: "active",
          joinedDate: "2023-08-22",
          lastLogin: "2024-04-02",
          phone: "+33 6 98 76 54 32",
          verifiedEmail: true,
          verifiedPhone: false,
          verifiedId: false,
          bookings: 2
        },
        {
          id: "3",
          name: "Pierre Lefebvre",
          email: "pierre.lefebvre@example.com",
          role: "admin",
          status: "active",
          joinedDate: "2023-02-10",
          lastLogin: "2024-04-03",
          avatar: "/placeholder.svg",
          phone: "+33 6 55 44 33 22",
          address: "456 Avenue des Champs-Élysées, 75008 Paris",
          verifiedEmail: true,
          verifiedPhone: true,
          verifiedId: true
        },
        {
          id: "4",
          name: "Sophie Bernard",
          email: "sophie.bernard@example.com",
          role: "host",
          status: "suspended",
          joinedDate: "2023-11-05",
          lastLogin: "2024-03-15",
          phone: "+33 6 11 22 33 44",
          address: "789 Boulevard Haussmann, 75009 Paris",
          verifiedEmail: true,
          verifiedPhone: true,
          verifiedId: false,
          listings: 1,
          bookings: 0
        },
        {
          id: "5",
          name: "Thomas Petit",
          email: "thomas.petit@example.com",
          role: "guest",
          status: "active",
          joinedDate: "2024-01-18",
          lastLogin: "2024-04-01",
          verifiedEmail: true,
          verifiedPhone: false,
          verifiedId: false,
          bookings: 3
        }
      ];
    },
  });

  // Mutation pour mettre à jour un utilisateur
  const updateUser = useMutation({
    mutationFn: async (updatedUser: User) => {
      // Simulation d'un appel API
      return new Promise<User>((resolve) => {
        setTimeout(() => {
          resolve(updatedUser);
        }, 500);
      });
    },
    onSuccess: (updatedUser) => {
      // Mise à jour du cache
      queryClient.setQueryData(['admin-users'], (oldData: User[] | undefined) => {
        if (!oldData) return [updatedUser];
        return oldData.map(user => user.id === updatedUser.id ? updatedUser : user);
      });
      
      toast.success(`Utilisateur ${updatedUser.name} mis à jour avec succès`);
      setIsUserDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Erreur lors de la mise à jour: ${error.message}`);
    }
  });

  // Mutation pour suspendre/réactiver un utilisateur
  const toggleUserStatus = useMutation({
    mutationFn: async ({ userId, newStatus }: { userId: string, newStatus: 'active' | 'suspended' }) => {
      // Simulation d'un appel API
      return new Promise<{ userId: string, newStatus: 'active' | 'suspended' }>((resolve) => {
        setTimeout(() => {
          resolve({ userId, newStatus });
        }, 500);
      });
    },
    onSuccess: ({ userId, newStatus }) => {
      // Mise à jour du cache
      queryClient.setQueryData(['admin-users'], (oldData: User[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(user => {
          if (user.id === userId) {
            return { ...user, status: newStatus };
          }
          return user;
        });
      });
      
      toast.success(`Utilisateur ${newStatus === 'active' ? 'réactivé' : 'suspendu'} avec succès`);
    },
    onError: (error) => {
      toast.error(`Erreur lors de la modification du statut: ${error.message}`);
    }
  });

  // Mutation pour supprimer un utilisateur
  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      // Simulation d'un appel API
      return new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve(userId);
        }, 500);
      });
    },
    onSuccess: (userId) => {
      // Mise à jour du cache
      queryClient.setQueryData(['admin-users'], (oldData: User[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(user => user.id !== userId);
      });
      
      toast.success("Utilisateur supprimé avec succès");
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression: ${error.message}`);
    }
  });

  // Mutation pour ajouter un utilisateur
  const addUser = useMutation({
    mutationFn: async (userData: typeof newUser) => {
      // Simulation d'un appel API
      return new Promise<User>((resolve) => {
        setTimeout(() => {
          const newUser: User = {
            id: `${Math.floor(Math.random() * 1000)}`,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            status: 'active',
            joinedDate: new Date().toISOString().split('T')[0],
            phone: userData.phone,
            verifiedEmail: false,
            verifiedPhone: false,
            verifiedId: false,
            bookings: 0
          };
          
          if (userData.role === 'host') {
            newUser.listings = 0;
          }
          
          resolve(newUser);
        }, 500);
      });
    },
    onSuccess: (user) => {
      // Mise à jour du cache
      queryClient.setQueryData(['admin-users'], (oldData: User[] | undefined) => {
        if (!oldData) return [user];
        return [...oldData, user];
      });
      
      toast.success(`Utilisateur ${user.name} créé avec succès`);
      setIsAddUserDialogOpen(false);
      resetNewUserForm();
    },
    onError: (error) => {
      toast.error(`Erreur lors de la création: ${error.message}`);
    }
  });

  // Gestion des filtres
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phone && user.phone.includes(searchQuery));
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Formater la date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Gérer l'action de suspendre/réactiver
  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    toggleUserStatus.mutate({ userId: user.id, newStatus });
  };

  // Gérer l'ouverture du modal d'édition
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserDialogOpen(true);
  };

  // Gérer l'ouverture du modal de suppression
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Gérer l'ouverture du modal de vérification
  const handleVerificationDialog = (user: User) => {
    setSelectedUser(user);
    setIsUserVerificationDialogOpen(true);
  };

  // Gérer la mise à jour d'un utilisateur
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedUser) {
      updateUser.mutate(selectedUser);
    }
  };

  // Gérer la création d'un utilisateur
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newUser.password !== newUser.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.password) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    addUser.mutate(newUser);
  };

  // Réinitialiser le formulaire de création
  const resetNewUserForm = () => {
    setNewUser({
      name: '',
      email: '',
      role: 'guest',
      phone: '',
      password: '',
      confirmPassword: '',
    });
  };

  if (error) {
    toast.error("Erreur lors du chargement des utilisateurs");
  }

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-semibold">Gestion des utilisateurs</h1>
                <p className="text-gray-500 mt-1">
                  {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} trouvé{filteredUsers.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <Button onClick={() => {
                resetNewUserForm();
                setIsAddUserDialogOpen(true);
              }} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Ajouter un utilisateur
              </Button>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par nom, email..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div>
                  <Select
                    value={roleFilter}
                    onValueChange={setRoleFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les rôles</SelectItem>
                      <SelectItem value="admin">Administrateurs</SelectItem>
                      <SelectItem value="host">Hôtes</SelectItem>
                      <SelectItem value="guest">Voyageurs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="active">Actifs</SelectItem>
                      <SelectItem value="suspended">Suspendus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="animate-pulse bg-white p-4 rounded-lg shadow">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Utilisateur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rôle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Inscrit le
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                {user.avatar ? (
                                  <AvatarImage src={user.avatar} alt={user.name} />
                                ) : null}
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">ID: {user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center">
                              <Mail className="h-4 w-4 mr-1 text-gray-400" />
                              {user.email}
                              {user.verifiedEmail && (
                                <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                                  Vérifié
                                </Badge>
                              )}
                            </div>
                            {user.phone && (
                              <div className="text-sm text-gray-500 mt-1">{user.phone}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              className={`${
                                user.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800 border-purple-200' 
                                  : user.role === 'host' 
                                    ? 'bg-blue-100 text-blue-800 border-blue-200' 
                                    : 'bg-green-100 text-green-800 border-green-200'
                              }`}
                            >
                              {user.role === 'admin' && 'Administrateur'}
                              {user.role === 'host' && 'Hôte'}
                              {user.role === 'guest' && 'Voyageur'}
                            </Badge>
                            {user.role === 'host' && user.listings !== undefined && (
                              <div className="text-xs text-gray-500 mt-1">
                                {user.listings} logement{user.listings !== 1 ? 's' : ''}
                              </div>
                            )}
                            {user.bookings !== undefined && (
                              <div className="text-xs text-gray-500 mt-1">
                                {user.bookings} réservation{user.bookings !== 1 ? 's' : ''}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              variant="outline" 
                              className={`${
                                user.status === 'active' 
                                  ? 'bg-green-100 text-green-800 border-green-200' 
                                  : 'bg-red-100 text-red-800 border-red-200'
                              }`}
                            >
                              {user.status === 'active' ? 'Actif' : 'Suspendu'}
                            </Badge>
                            {user.lastLogin && (
                              <div className="text-xs text-gray-500 mt-1">
                                Dernière connexion: {formatDate(user.lastLogin)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(user.joinedDate)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                  <UserCog className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleVerificationDialog(user)}>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Vérifications
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                                  {user.status === 'active' ? (
                                    <>
                                      <Ban className="mr-2 h-4 w-4" />
                                      Suspendre
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Réactiver
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteUser(user)}
                                  className="text-red-600"
                                >
                                  <UserX className="mr-2 h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-lg shadow">
                <div className="mb-4 text-gray-400">
                  <UserX className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun utilisateur trouvé</h3>
                <p className="text-gray-500">
                  Aucun utilisateur ne correspond à vos critères de recherche ou de filtrage.
                </p>
                {(searchQuery || roleFilter !== 'all' || statusFilter !== 'all') && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('');
                      setRoleFilter('all');
                      setStatusFilter('all');
                    }}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Réinitialiser les filtres
                  </Button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal d'édition d'utilisateur */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier un utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'utilisateur ci-dessous
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <form onSubmit={handleUpdateUser}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nom
                  </Label>
                  <Input
                    id="name"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Téléphone
                  </Label>
                  <Input
                    id="phone"
                    value={selectedUser.phone || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Rôle
                  </Label>
                  <Select
                    value={selectedUser.role}
                    onValueChange={(value) => setSelectedUser({
                      ...selectedUser,
                      role: value as 'admin' | 'host' | 'guest'
                    })}
                  >
                    <SelectTrigger id="role" className="col-span-3">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="host">Hôte</SelectItem>
                      <SelectItem value="guest">Voyageur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Adresse
                  </Label>
                  <Input
                    id="address"
                    value={selectedUser.address || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, address: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Statut
                  </Label>
                  <Select
                    value={selectedUser.status}
                    onValueChange={(value) => setSelectedUser({
                      ...selectedUser,
                      status: value as 'active' | 'suspended'
                    })}
                  >
                    <SelectTrigger id="status" className="col-span-3">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="suspended">Suspendu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  Enregistrer les modifications
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-4">
                <Avatar className="h-12 w-12 mr-4">
                  {selectedUser.avatar ? (
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  ) : null}
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  <p className="text-sm text-gray-500">
                    {selectedUser.role === 'admin' ? 'Administrateur' : 
                     selectedUser.role === 'host' ? 'Hôte' : 'Voyageur'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-red-50 text-red-800 rounded-lg">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-sm">
                  <strong>Attention:</strong> Supprimer cet utilisateur entraînera la perte de toutes ses données associées.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedUser && deleteUser.mutate(selectedUser.id)}
              disabled={deleteUser.isPending}
            >
              {deleteUser.isPending ? "Suppression..." : "Confirmer la suppression"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal d'ajout d'utilisateur */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouvel utilisateur
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-name" className="text-right">
                  Nom *
                </Label>
                <Input
                  id="new-name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-email" className="text-right">
                  Email *
                </Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-phone" className="text-right">
                  Téléphone
                </Label>
                <Input
                  id="new-phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-role" className="text-right">
                  Rôle *
                </Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({
                    ...newUser,
                    role: value as 'admin' | 'host' | 'guest'
                  })}
                  required
                >
                  <SelectTrigger id="new-role" className="col-span-3">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="host">Hôte</SelectItem>
                    <SelectItem value="guest">Voyageur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-password" className="text-right">
                  Mot de passe *
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-confirm-password" className="text-right">
                  Confirmer *
                </Label>
                <Input
                  id="new-confirm-password"
                  type="password"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={addUser.isPending}>
                {addUser.isPending ? "Création..." : "Créer l'utilisateur"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de vérification d'utilisateur */}
      <Dialog open={isUserVerificationDialogOpen} onOpenChange={setIsUserVerificationDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Vérifications utilisateur</DialogTitle>
            <DialogDescription>
              Gérer les vérifications et documents pour cet utilisateur
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-6">
                <Avatar className="h-12 w-12 mr-4">
                  {selectedUser.avatar ? (
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  ) : null}
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              
              <Tabs defaultValue="status">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="status">Statut de vérification</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
                
                <TabsContent value="status" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-700 mr-3">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">Email</h4>
                          <p className="text-sm text-gray-500">{selectedUser.email}</p>
                        </div>
                      </div>
                      <Badge 
                        className={selectedUser.verifiedEmail 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : "bg-yellow-100 text-yellow-800 border-yellow-200"}
                      >
                        {selectedUser.verifiedEmail ? "Vérifié" : "Non vérifié"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-700 mr-3">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">Téléphone</h4>
                          <p className="text-sm text-gray-500">{selectedUser.phone || "Non renseigné"}</p>
                        </div>
                      </div>
                      <Badge 
                        className={selectedUser.verifiedPhone 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : "bg-yellow-100 text-yellow-800 border-yellow-200"}
                      >
                        {selectedUser.verifiedPhone ? "Vérifié" : "Non vérifié"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-700 mr-3">
                          <Lock className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">Identité</h4>
                          <p className="text-sm text-gray-500">Carte d'identité / Passeport</p>
                        </div>
                      </div>
                      <Badge 
                        className={selectedUser.verifiedId 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : "bg-yellow-100 text-yellow-800 border-yellow-200"}
                      >
                        {selectedUser.verifiedId ? "Vérifié" : "Non vérifié"}
                      </Badge>
                    </div>
                    
                    {selectedUser.role === 'host' && (
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-blue-100 text-blue-700 mr-3">
                            <Building className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">Adresse</h4>
                            <p className="text-sm text-gray-500">{selectedUser.address || "Non renseignée"}</p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          Non vérifiée
                        </Badge>
                      </div>
                    )}
                    
                    {selectedUser.role === 'host' && (
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-blue-100 text-blue-700 mr-3">
                            <BriefcaseBusiness className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">Entreprise</h4>
                            <p className="text-sm text-gray-500">Enregistrement commercial</p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          Non vérifié
                        </Badge>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="documents" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Documents téléchargés</h3>
                    
                    <div className="p-8 border border-dashed rounded-lg text-center text-gray-500">
                      <p>Aucun document disponible</p>
                      <p className="text-sm mt-1">L'utilisateur n'a pas encore téléchargé de documents de vérification.</p>
                    </div>
                    
                    <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                      <div className="flex">
                        <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                        <div>
                          <p><strong>Information:</strong> Les documents de vérification seraient normalement accessibles ici.</p>
                          <p className="mt-1">Dans une version complète, vous pourriez :</p>
                          <ul className="list-disc list-inside mt-1">
                            <li>Consulter les pièces d'identité téléchargées</li>
                            <li>Vérifier les justificatifs de domicile</li>
                            <li>Valider ou rejeter les documents</li>
                            <li>Demander des documents supplémentaires</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          <DialogFooter>
            {selectedUser && (
              <div className="flex justify-between w-full">
                <Button variant="outline" onClick={() => setIsUserVerificationDialogOpen(false)}>
                  Fermer
                </Button>
                
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedUser({
                        ...selectedUser,
                        verifiedEmail: true,
                        verifiedPhone: selectedUser.phone ? true : false,
                        verifiedId: true
                      });
                      
                      toast.success("Vérifications mises à jour");
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Valider toutes les vérifications
                  </Button>
                </div>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
