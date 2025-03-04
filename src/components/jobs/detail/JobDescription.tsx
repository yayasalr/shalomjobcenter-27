
import React from 'react';

interface JobDescriptionProps {
  description: string;
}

const JobDescription = ({ description }: JobDescriptionProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4 text-sholom-dark">Description</h3>
      <div className="text-gray-700 space-y-4 prose max-w-none">
        {description.split('\n').map((paragraph, index) => (
          paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
        ))}
      </div>
    </div>
  );
};

export default JobDescription;
