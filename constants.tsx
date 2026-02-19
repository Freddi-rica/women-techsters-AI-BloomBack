
import { JourneyStage, ForumPost, Recommendation, Badge, Resource } from './types';

export const DUMMY_POSTS: ForumPost[] = [
  {
    id: '1',
    author: 'Sarah M.',
    content: 'Feeling a bit nervous about the handover next week. Anyone have tips for a smooth transition? I want to make sure my team feels supported while I am away.',
    stage: JourneyStage.PREPARING,
    likes: 12,
    comments: 4,
    date: '2h ago'
  },
  {
    id: '2',
    author: 'Elena G.',
    content: 'Finally found a rhythm with the 3 AM feeds. It gets easier, I promise! To all the moms in the trenches right now: you are doing an amazing job.',
    stage: JourneyStage.ON_LEAVE,
    likes: 45,
    comments: 18,
    date: '5h ago'
  },
  {
    id: '3',
    author: 'Jessica L.',
    content: 'First day back in the office tomorrow. Mixed emotions but feeling ready to regain my professional self. Has anyone else felt that "identity split" on their first day?',
    stage: JourneyStage.RETURNING,
    likes: 38,
    comments: 22,
    date: '1d ago'
  },
  {
    id: '4',
    author: 'Maya R.',
    content: 'Negotiating flexible hours was the best decision I made for my return-to-work plan. It took courage to ask, but it was so worth it for my mental health.',
    stage: JourneyStage.RETURNING,
    likes: 56,
    comments: 9,
    date: '2d ago'
  }
];

export const DUMMY_CHART_DATA = [
  { name: 'Week 1', confidence: 20, wellbeing: 40, readiness: 10 },
  { name: 'Week 2', confidence: 35, wellbeing: 35, readiness: 15 },
  { name: 'Week 3', confidence: 30, wellbeing: 50, readiness: 25 },
  { name: 'Week 4', confidence: 45, wellbeing: 60, readiness: 40 },
  { name: 'Week 5', confidence: 60, wellbeing: 55, readiness: 55 },
  { name: 'Week 6', confidence: 75, wellbeing: 70, readiness: 65 },
];

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec1',
    title: '5 Grounding Affirmations for Working Moms',
    category: 'Affirmation',
    type: 'practice',
    description: 'A focused 5-minute audio session designed to center your mind before meetings or nursery drop-offs.',
    contentUrl: 'https://example.com/audio/grounding'
  },
  {
    id: 'rec2',
    title: 'The Phased Return: A Success Blueprint',
    category: 'Strategy',
    type: 'video',
    description: 'Watch HR expert Dr. Aris Thorne discuss how to structure your first 30 days back in the office.',
    contentUrl: 'https://example.com/video/phased-return'
  },
  {
    id: 'rec3',
    title: 'Navigating Guilt & Ambition',
    category: 'Health',
    type: 'article',
    description: 'A deep dive into the psychological transition of returning to a high-pressure role after maternity leave.',
    contentUrl: 'https://example.com/article/guilt-ambition'
  },
  {
    id: 'rec4',
    title: 'Effective Handover Documents',
    category: 'Strategy',
    type: 'article',
    description: 'Templates and checklists to ensure your team is set up for success while you are on leave.',
    contentUrl: 'https://example.com/article/handover-templates'
  }
];

export const DUMMY_RESOURCES: Resource[] = [
  {
    id: 'res1',
    title: 'The Art of the Gentle Handover',
    type: 'article',
    category: 'Career',
    duration: '6 min read',
    description: 'How to leave your team feeling empowered while you focus on your new arrival.',
    content: 'Full article content about handovers goes here...'
  },
  {
    id: 'res2',
    title: 'Boundaries for New Moms',
    type: 'video',
    category: 'Wellbeing',
    duration: '12 min video',
    description: 'HR Specialist Sarah Chen on how to set expectations before you even leave.',
    content: 'Video transcript or player placeholder...'
  },
  {
    id: 'res3',
    title: 'The Return Shift Podcast: Ep 4',
    type: 'podcast',
    category: 'Community',
    duration: '24 min listen',
    description: 'Real stories from 3 women who navigated executive returns successfully.',
    content: 'Audio player placeholder...'
  },
  {
    id: 'res4',
    title: 'The Working Mother Guide',
    type: 'book',
    category: 'Strategy',
    duration: 'Recommended Reading',
    description: 'A comprehensive manual for the modern professional mother.',
    content: 'Book summary and purchase links...'
  },
  {
    id: 'res5',
    title: 'Mindfulness for Nursery Drop-offs',
    type: 'article',
    category: 'Health',
    duration: '4 min read',
    description: 'Managing the separation anxiety—both yours and theirs.',
    content: 'Step-by-step mindfulness guide...'
  },
  {
    id: 'res6',
    title: 'Negotiating Flexi-Time',
    type: 'video',
    category: 'Career',
    duration: '8 min video',
    description: 'Proven scripts to use when talking to your manager about remote work.',
    content: 'Negotiation script templates...'
  },
  {
    id: 'res7',
    title: 'Identity Post-Baby',
    type: 'podcast',
    category: 'Wellbeing',
    duration: '35 min listen',
    description: 'Exploring who you are now that you are "Mom" and "Manager".',
    content: 'Podcast episode details...'
  },
  {
    id: 'res8',
    title: 'Legal Rights 101',
    type: 'book',
    category: 'Strategy',
    duration: 'Quick Reference',
    description: 'A handbook on your parental leave rights in the modern workplace.',
    content: 'Summary of legal protections...'
  }
];

export const BADGES: Badge[] = [
  {
    id: 'b1',
    name: 'First Step',
    description: 'Completed your first weekly check-in.',
    icon: 'Trophy',
    earned: true,
    color: '#22C55E'
  },
  {
    id: 'b2',
    name: 'Peer Pioneer',
    description: 'Contributed to the community forum.',
    icon: 'MessageCircle',
    earned: true,
    color: '#4e1952'
  },
  {
    id: 'b3',
    name: 'Consistency Queen',
    description: '4 consecutive weeks of check-ins.',
    icon: 'Calendar',
    earned: false,
    color: '#7A3B84'
  },
  {
    id: 'b4',
    name: 'Confidence Champion',
    description: 'Reached a high confidence score.',
    icon: 'Zap',
    earned: true,
    color: '#F472B6'
  },
  {
    id: 'b5',
    name: 'Empowerment Achieved',
    description: 'Reached top scores in wellbeing.',
    icon: 'Heart',
    earned: false,
    color: '#EF4444'
  }
];
