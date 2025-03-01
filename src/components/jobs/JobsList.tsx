
import React from 'react';
import { Job } from '@/types/job';
import { motion } from 'framer-motion';
import { JobCard } from './JobCard';
import { containerVariants, itemVariants } from './utils/animationUtils';

interface JobsListProps {
  jobs: Job[];
}

export const JobsList = ({ jobs }: JobsListProps) => {
  return (
    <motion.div 
      className="space-y-6 px-4 py-6 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} itemVariants={itemVariants} />
      ))}
    </motion.div>
  );
};
