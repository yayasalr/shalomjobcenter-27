
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface TextStatusFormProps {
  textStatus: string;
  setTextStatus: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const TextStatusForm: React.FC<TextStatusFormProps> = ({ 
  textStatus, 
  setTextStatus, 
  onSubmit, 
  onCancel 
}) => {
  return (
    <form onSubmit={onSubmit} className="mt-3">
      <div className="flex flex-col space-y-2">
        <Textarea
          value={textStatus}
          onChange={(e) => setTextStatus(e.target.value)}
          placeholder="Type your status here..."
          className="min-h-[100px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="flex space-x-2">
          <Button 
            type="submit" 
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
          >
            <Send className="h-4 w-4 mr-1" />
            Publish
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TextStatusForm;
