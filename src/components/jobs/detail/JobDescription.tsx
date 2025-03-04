
import React from 'react';
import DOMPurify from 'dompurify';

interface JobDescriptionProps {
  description: string;
}

const JobDescription = ({ description }: JobDescriptionProps) => {
  // Function to safely render HTML content
  const createMarkup = (html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  // Check if description contains HTML tags
  const containsHtml = /<[a-z][\s\S]*>/i.test(description);

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4 text-sholom-dark">Description</h3>
      <div className="text-gray-700 space-y-4 prose max-w-none">
        {containsHtml ? (
          <div dangerouslySetInnerHTML={createMarkup(description)} />
        ) : (
          description.split('\n').map((paragraph, index) => (
            paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
          ))
        )}
      </div>
    </div>
  );
};

export default JobDescription;
