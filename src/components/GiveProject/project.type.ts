export enum RecordType {
  PROJECT = "Project",
  GRANT = "Grant",
}

export type Project = {
  title: string;
  owner: string;
  slug: string;
  shortDescription: string;
  details: string;
  finishDate?: string;
  photos: string[];
  category: string;
  wallet: string;
  depositGoal: number;
  website: string;
};

export type GrantMilestone = {
  amount: number;
  description: string;
};

export type Grant = {
  title: string;
  owner: string;
  slug: string;
  shortDescription: string;
  details: string;
  finishDate?: string;
  photos: string[];
  category: string;
  wallet: string;
  depositGoal: number; // TODO remove this
  website: string;
  milestones?: GrantMilestone[];
  latestMilestoneCompleted?: number;
  disabled?: boolean;
};
