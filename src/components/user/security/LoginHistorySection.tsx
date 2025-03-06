
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { History, KeyRound, ShieldCheck } from 'lucide-react';
import { User } from '@/hooks/auth/types';

interface LoginHistorySectionProps {
  user: User | null;
}

export const LoginHistorySection: React.FC<LoginHistorySectionProps> = ({ user }) => {
  const loginLogs = JSON.parse(localStorage.getItem('login_logs') || '[]')
    .filter((log: any) => log.email === user?.email)
    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="h-5 w-5 mr-2 text-gray-500" />
          Historique de connexion
        </CardTitle>
        <CardDescription>Vérifiez les dernières connexions à votre compte</CardDescription>
      </CardHeader>
      <CardContent>
        {loginLogs.length > 0 ? (
          <div className="space-y-4">
            {loginLogs.map((log: any, index: number) => (
              <div key={index} className="flex items-start space-x-4">
                {log.action === 'logout' ? (
                  <div className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                    <KeyRound className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-medium">
                    {log.action === 'logout' ? 'Déconnexion' : 'Connexion réussie'}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(log.timestamp).toLocaleString('fr-FR')} • 
                    {log.device?.indexOf('iPhone') > -1 ? ' iPhone' : 
                     log.device?.indexOf('Android') > -1 ? ' Android' : 
                     ' Ordinateur'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aucun historique de connexion disponible
          </p>
        )}
      </CardContent>
    </Card>
  );
};
