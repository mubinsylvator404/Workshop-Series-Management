export interface Workshop {
  id: string;
  title: string;
  slug: string;
  description: string;
  objectives: string[];
  expectedLearning: string[];
  prerequisites: string;
  speakerId: string;
  duration: string;
  assignments: string[];
  resources: { title: string; type: 'scroll' | 'potion' | 'wand' | 'tome'; url: string }[];
}

export interface Professor {
  id: string;
  name: string;
  title: string;
  house: 'Aurelius' | 'Ignis' | 'Sylph' | 'Tenebris' | 'Astra' | 'Verdant';
  houseColor: string;
  houseBadge: string;
  achievements: string[];
  bio: string;
  favoriteMotions: string[];
  teachingStyle: string;
  avatar: string;
  socials: { twitter?: string; linkedin?: string; email?: string };
  assignedTopic?: string;
  topic?: string;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  institution: string;
  debateFormat: 'AP' | 'BP' | 'WSDC' | 'Novice';
  experienceYears: number;
  xp: number;
  coins: number;
  crystals: number;
  rank: StudentRank;
  achievements: Achievement[];
  streak: number;
  joinedAt: string;
  admissionLetterCode: string;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  chamberAccess: boolean;
  courseCompleted: boolean;
  completedSessions: number[];
  password?: string;
}

export type StudentRank =
  | 'Novice'
  | 'Scholar'
  | 'Strategist'
  | 'Master'
  | 'Archmage'
  | 'Debate Wizard'
  | 'MDS Legend';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  rewardXP: number;
  rewardCoins: number;
}

export interface LeaderboardEntry {
  fullName: string;
  institution: string;
  xp: number;
  rankName: StudentRank;
  rankIndex: number;
  avatarUrl: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Spells of Logic' | 'Strategy scrolls' | 'Academy News' | 'Pro Debater Tips';
  author: string;
  readTime: string;
  date: string;
  tags: string[];
}

export interface DebateProphecy {
  prophecy: string;
  fortune: string;
  spellTip: string;
  luckyMotionCategory: string;
}
