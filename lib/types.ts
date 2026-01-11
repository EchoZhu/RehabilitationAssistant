// 训练类型
export type ExerciseType = 'walking' | 'fistRaise' | 'eyeGaze';

// 慢走训练记录
export interface WalkingRecord {
  duration: number; // 分钟
}

// 双手握拳平举记录
export interface FistRaiseRecord {
  sets: number; // 组数
  reps: number; // 每组次数
}

// 眼睛凝视训练记录
export interface EyeGazeRecord {
  count: number; // 从左到右的次数
}

// 单次训练记录
export interface ExerciseRecord {
  id: string;
  date: string; // YYYY-MM-DD 格式
  timestamp: number; // Unix timestamp
  walking?: WalkingRecord;
  fistRaise?: FistRaiseRecord;
  eyeGaze?: EyeGazeRecord;
}

// 用户目标设置
export interface UserGoals {
  walking: {
    targetDuration: number; // 目标分钟数
  };
  fistRaise: {
    targetSets: number; // 目标组数
    targetReps: number; // 目标每组次数
  };
  eyeGaze: {
    targetCount: number; // 目标从左到右次数
  };
}

// 提醒设置
export interface ReminderSettings {
  enabled: boolean;
  time: string; // HH:MM 格式
}

// 每日进度
export interface DailyProgress {
  date: string;
  walking: {
    completed: number;
    target: number;
    achieved: boolean;
  };
  fistRaise: {
    completedSets: number;
    completedReps: number;
    targetSets: number;
    targetReps: number;
    achieved: boolean;
  };
  eyeGaze: {
    completed: number;
    target: number;
    achieved: boolean;
  };
  overallAchieved: boolean;
}
