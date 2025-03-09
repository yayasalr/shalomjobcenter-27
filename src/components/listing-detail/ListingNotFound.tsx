
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/shared/BackButton";
import { useLanguage } from "@/hooks/language";

const ListingNotFound = () => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center py-16">
      <BackButton />
      <h2 className="text-2xl font-bold text-gray-900">
        {t('listing_not_found') || 'Logement non trouvé'}
      </h2>
      <p className="mt-2 text-gray-600">
        {t('listing_not_exist') || 'Le logement que vous recherchez n\'existe pas ou a été supprimé.'}
      </p>
      <Link to="/">
        <Button className="mt-6">{t('back_to_home') || 'Retour à l\'accueil'}</Button>
      </Link>
    </div>
  );
};

export default ListingNotFound;
