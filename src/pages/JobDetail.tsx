
import React from 'react';
import { useParams } from 'react-router-dom';
import { useJobs } from '@/hooks/useJobs';
import { Navbar } from '@/components/Navbar';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import LoadingState from '@/components/jobs/detail/LoadingState';
import NotFoundState from '@/components/jobs/detail/NotFoundState';
import { JobDetailContent } from '@/components/jobs/detail/JobDetailContent';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { Footer } from '@/components/home/Footer';

const JobDetail = () => {
  const { id } = useParams();
  const { jobs, isLoading } = useJobs();
  const { settings } = useSiteSettings();

  if (isLoading) {
    return <LoadingState />;
  }

  const job = jobs.find(job => job.id === id);

  if (!job) {
    return <NotFoundState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ScrollAnimation direction="up" duration={0.7} once={true}>
        <JobDetailContent 
          job={job}
          isLoading={false}
        />
      </ScrollAnimation>
      <Footer />
    </div>
  );
};

export default JobDetail;
