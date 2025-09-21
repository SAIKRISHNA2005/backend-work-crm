import { BaseModel, BaseInsert, BaseUpdate } from './base';
import { StudentProfile } from './student';
import { Class } from './school';
import { School } from './school';

// Leaderboard Model
export interface Leaderboard extends BaseModel {
  student_id: number;
  class_id: number;
  school_id: number;
  xp: number;
  percentage: number;
  classwise_rank: number;
  overall_rank: number;
}

export interface LeaderboardInsert extends BaseInsert {
  student_id: number;
  class_id: number;
  school_id: number;
  xp: number;
  percentage: number;
  classwise_rank: number;
  overall_rank: number;
}

export interface LeaderboardUpdate extends BaseUpdate {
  student_id?: number;
  class_id?: number;
  school_id?: number;
  xp?: number;
  percentage?: number;
  classwise_rank?: number;
  overall_rank?: number;
}

// Leaderboard with related data
export interface LeaderboardWithDetails extends Leaderboard {
  student: StudentProfile;
  class: Class;
  school: School;
}

// Leaderboard search and filter
export interface LeaderboardSearchParams {
  student_id?: number;
  class_id?: number;
  school_id?: number;
  min_xp?: number;
  max_xp?: number;
  min_percentage?: number;
  max_percentage?: number;
  rank_range?: {
    min: number;
    max: number;
  };
}

// Leaderboard statistics
export interface LeaderboardStats {
  total_students: number;
  average_xp: number;
  average_percentage: number;
  top_performers: LeaderboardWithDetails[];
  class_wise_stats: ClassLeaderboardStats[];
}

export interface ClassLeaderboardStats {
  class_id: number;
  class_name: string;
  total_students: number;
  average_xp: number;
  average_percentage: number;
  top_students: LeaderboardWithDetails[];
}

// Leaderboard rankings
export interface LeaderboardRankings {
  classwise: LeaderboardWithDetails[];
  overall: LeaderboardWithDetails[];
  top_performers: LeaderboardWithDetails[];
  most_improved: LeaderboardWithDetails[];
}

// XP and achievement tracking
export interface XPAchievement {
  student_id: number;
  achievement_type: string;
  points_earned: number;
  description: string;
  date_earned: string;
}

export interface XPAchievementInsert {
  student_id: number;
  achievement_type: string;
  points_earned: number;
  description: string;
  date_earned?: string;
}

// Student progress tracking
export interface StudentProgress {
  student_id: number;
  student_name: string;
  class_name: string;
  current_xp: number;
  current_rank: number;
  previous_rank: number;
  rank_change: number;
  xp_gained_this_month: number;
  achievements_this_month: number;
  goals_completed: number;
  goals_pending: number;
}

// Leaderboard dashboard
export interface LeaderboardDashboard {
  class_rankings: ClassLeaderboardStats[];
  overall_rankings: LeaderboardWithDetails[];
  top_achievers: StudentProgress[];
  recent_achievements: XPAchievement[];
  stats: LeaderboardStats;
}

// Re-export for convenience
export type { Leaderboard };
