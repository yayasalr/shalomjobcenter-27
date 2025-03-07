
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface SecurityScanSectionProps {
  user: any;
}

export const SecurityScanSection: React.FC<SecurityScanSectionProps> = ({ user }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanResults, setScanResults] = useState<{
    score: number;
    issues: { severity: 'critical' | 'warning' | 'info'; message: string }[];
    recommendations: string[];
  } | null>(null);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanComplete(false);
    setScanResults(null);
    
    // Simulate scanning process
    const interval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 10) + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            setScanComplete(true);
            setScanResults(generateScanResults());
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  // Generate security scan results based on actual settings and data
  const generateScanResults = () => {
    const issues: { severity: 'critical' | 'warning' | 'info'; message: string }[] = [];
    const recommendations: string[] = [];
    
    // Check if 2FA is enabled
    const twoFAData = user?.id ? JSON.parse(localStorage.getItem(`2fa_${user.id}`) || 'null') : null;
    const has2FA = twoFAData?.enabled || false;
    
    if (!has2FA) {
      issues.push({
        severity: 'critical',
        message: "L'authentification à deux facteurs n'est pas activée"
      });
      recommendations.push("Activez l'authentification à deux facteurs pour protéger votre compte");
    }
    
    // Check password age (if available)
    if (user?.passwordLastChanged) {
      const passwordAge = new Date().getTime() - new Date(user.passwordLastChanged).getTime();
      const passwordAgeDays = Math.floor(passwordAge / (1000 * 60 * 60 * 24));
      
      if (passwordAgeDays > 90) {
        issues.push({
          severity: 'warning',
          message: `Votre mot de passe n'a pas été changé depuis ${passwordAgeDays} jours`
        });
        recommendations.push("Changez régulièrement votre mot de passe (tous les 90 jours)");
      }
    }
    
    // Check for suspicious activity
    const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    const recentLogs = securityLogs.filter((log: any) => {
      const logTime = new Date(log.timestamp).getTime();
      const thirtyDaysAgo = new Date().getTime() - (30 * 24 * 60 * 60 * 1000);
      return logTime > thirtyDaysAgo && log.userId === user?.id;
    });
    
    const suspiciousLogs = recentLogs.filter((log: any) => 
      log.type.includes('suspicious') || 
      log.type.includes('failed') || 
      log.type.includes('locked')
    );
    
    if (suspiciousLogs.length > 0) {
      issues.push({
        severity: 'warning',
        message: `${suspiciousLogs.length} activités suspectes détectées ces 30 derniers jours`
      });
      recommendations.push("Vérifiez régulièrement l'historique de connexion à votre compte");
    }
    
    // Check for social accounts without 2FA
    const socialAccounts = user?.id ? 
      JSON.parse(localStorage.getItem(`social_accounts_${user.id}`) || '[]') : 
      [];
    
    const connectedAccounts = socialAccounts.filter((account: any) => account.connected);
    
    if (connectedAccounts.length > 0) {
      issues.push({
        severity: 'info',
        message: `${connectedAccounts.length} compte(s) sociaux connectés à votre profil`
      });
      recommendations.push("Activez l'authentification à deux facteurs sur tous vos comptes sociaux liés");
    }
    
    // Calculate security score
    let score = 70; // Base score
    
    // Adjust for 2FA
    score += has2FA ? 15 : 0;
    
    // Adjust for password age
    if (user?.passwordLastChanged) {
      const passwordAge = new Date().getTime() - new Date(user.passwordLastChanged).getTime();
      const passwordAgeDays = Math.floor(passwordAge / (1000 * 60 * 60 * 24));
      
      if (passwordAgeDays < 30) score += 5;
      else if (passwordAgeDays > 180) score -= 10;
      else if (passwordAgeDays > 90) score -= 5;
    }
    
    // Adjust for suspicious activity
    score -= suspiciousLogs.length * 3;
    
    // Adjust for social accounts (small risk)
    score -= connectedAccounts.length;
    
    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));
    
    return {
      score,
      issues,
      recommendations
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-gray-500" />
          Analyse de sécurité
        </CardTitle>
        <CardDescription>
          Analysez votre compte pour détecter les vulnérabilités potentielles
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isScanning && !scanComplete ? (
          <div className="flex flex-col items-center justify-center py-6">
            <Shield className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Vérifiez la sécurité de votre compte</h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              Détectez les vulnérabilités et obtenez des recommandations pour renforcer la sécurité de votre compte.
            </p>
            <Button onClick={startScan}>
              Lancer l'analyse de sécurité
            </Button>
          </div>
        ) : isScanning ? (
          <div className="py-6 space-y-4">
            <div className="flex justify-center">
              <Shield className="h-12 w-12 text-indigo-500 animate-pulse" />
            </div>
            <h3 className="text-center font-medium">Analyse en cours...</h3>
            <Progress value={scanProgress} className="w-full" />
            <div className="text-center text-sm text-gray-500">
              Recherche de vulnérabilités et de problèmes de sécurité
            </div>
          </div>
        ) : scanResults ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="relative">
                <svg viewBox="0 0 100 100" className="w-32 h-32">
                  <circle
                    className="text-gray-200 stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
                  <circle
                    className={`stroke-current ${
                      scanResults.score >= 80 
                        ? 'text-green-500' 
                        : scanResults.score >= 60 
                        ? 'text-yellow-500' 
                        : 'text-red-500'
                    }`}
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - scanResults.score / 100)}`}
                    transform="rotate(-90 50 50)"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                  {scanResults.score}
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="font-medium text-lg">
                {scanResults.score >= 80 
                  ? 'Niveau de sécurité bon'
                  : scanResults.score >= 60
                  ? 'Niveau de sécurité moyen'
                  : 'Niveau de sécurité faible'
                }
              </h3>
              <p className="text-sm text-gray-500">
                {scanResults.score >= 80 
                  ? 'Votre compte est bien protégé, mais des améliorations sont toujours possibles.'
                  : scanResults.score >= 60
                  ? 'Votre compte présente quelques vulnérabilités qui devraient être corrigées.'
                  : 'Votre compte présente des vulnérabilités importantes qui nécessitent une attention immédiate.'
                }
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">Problèmes détectés ({scanResults.issues.length})</h4>
              {scanResults.issues.length === 0 ? (
                <div className="flex items-center text-green-600 mb-2">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Aucun problème détecté</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {scanResults.issues.map((issue, index) => (
                    <div 
                      key={index} 
                      className="flex items-start p-2 rounded-md"
                      style={{ 
                        backgroundColor: issue.severity === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 
                                        issue.severity === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 
                                        'rgba(59, 130, 246, 0.1)'
                      }}
                    >
                      {issue.severity === 'critical' ? (
                        <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      ) : issue.severity === 'warning' ? (
                        <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Shield className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-sm">{issue.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Recommandations</h4>
              <ul className="space-y-1 list-disc pl-5">
                {scanResults.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm">{rec}</li>
                ))}
              </ul>
            </div>
            
            <Button onClick={startScan} variant="outline" className="w-full">
              Relancer l'analyse
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
