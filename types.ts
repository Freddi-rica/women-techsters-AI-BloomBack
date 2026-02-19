
export enum JourneyStage {
  PREPARING = 'Preparing',
  ON_LEAVE = 'On Leave',
  RETURNING = 'Returning'
}

export interface NotificationSettings {
  enabled: boolean;
  day: string;
  time: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  stage: JourneyStage;
  notificationSettings?: NotificationSettings;
}

export interface CheckInResponse {
  confidence: number;
  wellbeing: number;
  readiness: number;
  support: number;
  energy: number;
  date: string;
}

export interface ForumPost {
  id: string;
  author: string;
  content: string;
  stage: JourneyStage;
  likes: number;
  comments: number;
  date: string;
}

export type RecommendationType = 'article' | 'video' | 'practice';

export interface Recommendation {
  id: string;
  title: string;
  category: 'Affirmation' | 'Strategy' | 'Community' | 'Health';
  description: string;
  type: RecommendationType;
  contentUrl: string;
}

export type ResourceType = 'article' | 'video' | 'podcast' | 'book';

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  category: string;
  description: string;
  duration: string;
  content: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  color: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  time: string;
  type: string;
}
