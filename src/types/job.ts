
export type JobDomain = 
  | "residential_security"
  | "industrial_security" 
  | "construction_security"
  | "event_security"
  | "k9_security"
  | "security_consulting";

export type JobContract = "full_time" | "part_time" | "contract";

export interface Job {
  id: string;
  title: string;
  domain: JobDomain;
  description: string;
  requirements: string;
  contract: JobContract;
  location: string;
  salary: {
    amount: number;
    currency: string;
  };
  positions: number;
  publishDate: string;
  deadline: string;
  status: "active" | "closed";
  images?: string[];
}
