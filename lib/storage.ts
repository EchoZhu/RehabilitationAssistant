import { ExerciseRecord, DailyProgress, UserGoals } from './types';
import { DEFAULT_GOALS } from './constants';

// Storage keys
const STORAGE_KEYS = {
  RECORDS: 'exerciseRecords',
  GOALS: 'userGoals',
  REMINDER: 'reminderSettings',
};

// 获取所有训练记录
export function getAllRecords(): ExerciseRecord[] {
  if (typeof window === 'undefined') return [];
  const records = localStorage.getItem(STORAGE_KEYS.RECORDS);
  return records ? JSON.parse(records) : [];
}

// 保存训练记录
export function saveRecord(record: ExerciseRecord): void {
  const records = getAllRecords();
  records.push(record);
  localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
}

// 获取指定日期的记录
export function getRecordsByDate(date: string): ExerciseRecord[] {
  const records = getAllRecords();
  return records.filter(r => r.date === date);
}

// 获取今日记录
export function getTodayRecords(): ExerciseRecord[] {
  const today = new Date().toISOString().split('T')[0];
  return getRecordsByDate(today);
}

// 获取用户目标
export function getUserGoals(): UserGoals {
  if (typeof window === 'undefined') return DEFAULT_GOALS;
  const goals = localStorage.getItem(STORAGE_KEYS.GOALS);
  return goals ? JSON.parse(goals) : DEFAULT_GOALS;
}

// 保存用户目标
export function saveUserGoals(goals: UserGoals): void {
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
}

// 计算今日进度
export function calculateTodayProgress(): DailyProgress {
  const today = new Date().toISOString().split('T')[0];
  const goals = getUserGoals();
  const todayRecords = getRecordsByDate(today);

  // 聚合今日的训练数据
  const walkingTotal = todayRecords.reduce((sum: number, r) => sum + (r.walking?.duration || 0), 0);
  const fistRaiseSets = todayRecords.reduce((sum: number, r) => sum + (r.fistRaise?.sets || 0), 0);
  const fistRaiseReps = todayRecords.reduce((sum: number, r) => sum + (r.fistRaise?.reps || 0), 0);
  const eyeGazeTotal = todayRecords.reduce((sum: number, r) => sum + (r.eyeGaze?.count || 0), 0);

  return {
    date: today,
    walking: {
      completed: walkingTotal,
      target: goals.walking.targetDuration,
      achieved: walkingTotal >= goals.walking.targetDuration,
    },
    fistRaise: {
      completedSets: fistRaiseSets,
      completedReps: fistRaiseReps,
      targetSets: goals.fistRaise.targetSets,
      targetReps: goals.fistRaise.targetReps,
      achieved: fistRaiseSets >= goals.fistRaise.targetSets && fistRaiseReps >= goals.fistRaise.targetReps,
    },
    eyeGaze: {
      completed: eyeGazeTotal,
      target: goals.eyeGaze.targetCount,
      achieved: eyeGazeTotal >= goals.eyeGaze.targetCount,
    },
    overallAchieved:
      walkingTotal >= goals.walking.targetDuration &&
      fistRaiseSets >= goals.fistRaise.targetSets &&
      eyeGazeTotal >= goals.eyeGaze.targetCount,
  };
}

// 获取鼓励语
export function getEncouragementMessage(progress: DailyProgress): string {
  if (progress.overallAchieved) {
    return "太棒了！今天所有训练目标都已完成，继续保持！";
  }

  const completedCount = [
    progress.walking.achieved,
    progress.fistRaise.achieved,
    progress.eyeGaze.achieved,
  ].filter(Boolean).length;

  if (completedCount === 0) {
    return "新的一天，开始今天的康复训练吧！";
  } else if (completedCount === 1) {
    return "已完成1项训练，继续加油！";
  } else if (completedCount === 2) {
    return "已完成2项训练，还差一点就能完成全部目标了！";
  } else {
    return "快完成了，坚持就是胜利！";
  }
}

// 获取最近N天的记录
export function getRecentRecords(days: number): ExerciseRecord[] {
  const records = getAllRecords();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return records.filter(r => new Date(r.date) >= cutoffDate)
    .sort((a, b) => b.timestamp - a.timestamp);
}

// 清空所有记录
export function clearAllRecords(): void {
  localStorage.removeItem(STORAGE_KEYS.RECORDS);
}
