import { UserGoals, ReminderSettings } from './types';

// 默认目标设置
export const DEFAULT_GOALS: UserGoals = {
  walking: {
    targetDuration: 30, // 30分钟
  },
  fistRaise: {
    targetSets: 3, // 3组
    targetReps: 10, // 每组10次
  },
  eyeGaze: {
    targetCount: 20, // 20次
  },
};

// 默认提醒设置
export const DEFAULT_REMINDER: ReminderSettings = {
  enabled: true,
  time: '09:00', // 早上9点
};

// 训练项目信息
export const EXERCISE_INFO = {
  walking: {
    name: '慢走',
    description: '缓慢步行，保持平稳的节奏',
    unit: '分钟',
    icon: '🚶',
  },
  fistRaise: {
    name: '双手握拳平举',
    description: '双手交叉握拳，从腹部慢慢移动到眼前，使双臂与地面平行',
    unit: '组',
    icon: '💪',
  },
  eyeGaze: {
    name: '眼睛凝视训练',
    description: '眼睛从左侧慢慢移动到右侧，头部保持不动',
    unit: '次',
    icon: '👀',
  },
};
