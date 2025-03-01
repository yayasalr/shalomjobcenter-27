
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { JobsHero } from './JobsHero';
import { JobsContent } from './JobsContent';
import { JobsFeatures } from './JobsFeatures';
import { JobsFooter } from './JobsFooter';

const JobsPage = () => {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Navbar />
      <JobsHero />
      <JobsContent />
      <JobsFeatures />
      <JobsFooter />
    </div>
  );
};

export default JobsPage;
