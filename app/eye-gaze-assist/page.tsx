'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EyeGazeAssistPage() {
  const [phase, setPhase] = useState<'idle' | 'moving'>('idle');
  const [ballPosition, setBallPosition] = useState(50); // 50 = center
  const [targetCount, setTargetCount] = useState<string>('10'); // 目标练习次数
  const [completedCount, setCompletedCount] = useState<number>(0); // 今日已完成次数
  const [sessionCount, setSessionCount] = useState<number>(0); // 当前本次训练完成次数
  const [direction, setDirection] = useState<'left' | 'right'>('left'); // 眼球移动方向，默认向左
  const [charIndex, setCharIndex] = useState<number>(0); // 当前显示的汉字索引

  const animationRef = useRef<number | null>(null);
  const currentRoundRef = useRef<number>(0); // 当前第几轮
  const directionRef = useRef<'left' | 'right'>('left'); // 存储当前训练的方向
  const charIntervalRef = useRef<NodeJS.Timeout | null>(null); // 汉字切换定时器

  // 冥想文字内容
  const meditationText = '深呼吸，告诉自己"事已至此，惟有前行"，接受无法改变的事，把注意力轻轻拉回到当下的一呼一吸间。不必执着于完美，记得"心静则明，心安则稳"，以清净心看世界，以欢喜心过生活，让思绪如落花随水流去，只留一份空明在心间。世界或许纷扰，但你可以选择聆听自然的声音，感受生活中的小确幸，或许只是窗边的阳光、一杯清茶，或是一个温柔的自我拥抱，然后发现，平静一直都在';
  const chars = meditationText.split(''); // 将文字拆分成字符数组

  // 加载今日已完成的次数
  useEffect(() => {
    loadTodayCount();
  }, []);

  // 汉字切换定时器
  useEffect(() => {
    // 每秒切换一次汉字
    charIntervalRef.current = setInterval(() => {
      setCharIndex((prev) => (prev + 1) % chars.length);
    }, 1000);

    // 清理定时器
    return () => {
      if (charIntervalRef.current) {
        clearInterval(charIntervalRef.current);
      }
    };
  }, []); // 只在组件挂载时设置一次

  // 加载今日已完成次数
  const loadTodayCount = () => {
    const today = new Date().toISOString().split('T')[0];
    const existingRecords = JSON.parse(localStorage.getItem('exerciseRecords') || '[]');

    // 筛选今天的眼睛凝视训练记录
    const todayRecords = existingRecords.filter((record: any) => {
      return record.date === today && record.eyeGaze;
    });

    // 累加今天的次数
    const totalCount = todayRecords.reduce((sum: number, record: any) => {
      return sum + (record.eyeGaze?.count || 0);
    }, 0);

    setCompletedCount(totalCount);
  };

  // 开始训练
  const handleStart = () => {
    const target = parseInt(targetCount) || 10;
    currentRoundRef.current = 0;
    setSessionCount(0); // 重置本次训练次数
    setPhase('moving');
    setBallPosition(50); // 从中央开始
    animateMove(target, direction); // 直接传递当前方向
  };

  // 移动动画
  const animateMove = (targetRounds: number, moveDirection: 'left' | 'right') => {
    // 第一阶段：从中央移动到目标方向（左或右）
    const moveDuration = 8000; // 8秒完成移动
    const startTime = performance.now();
    const startPosition = 50; // 从中央（50%）
    const targetPosition = moveDirection === 'left' ? 5 : 95; // 左侧5%或右侧95%

    const moveStep = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / moveDuration, 1);

      // 匀速移动到目标方向
      if (moveDirection === 'left') {
        setBallPosition(startPosition - progress * (startPosition - targetPosition));
      } else {
        setBallPosition(startPosition + progress * (targetPosition - startPosition));
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(moveStep);
      } else {
        // 第一阶段完成，暂停2000毫秒后开始第二阶段
        setTimeout(() => {
          animateMoveBack(targetRounds, moveDirection);
        }, 2000);
      }
    };

    // 立即开始移动
    moveStep();
  };

  // 第二阶段：从目标方向移回中央
  const animateMoveBack = (targetRounds: number, moveDirection: 'left' | 'right') => {
    const moveToCenterDuration = 8000; // 8秒完成移回中央，与移动速度一致
    const startCenterTime = performance.now();
    const startPosition = moveDirection === 'left' ? 5 : 95; // 从左侧（5%）或右侧（95%）
    const centerPosition = 50; // 回到中央（50%）

    const moveToCenterStep = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startCenterTime;
      const progress = Math.min(elapsed / moveToCenterDuration, 1);

      // 匀速移回中央
      if (moveDirection === 'left') {
        setBallPosition(startPosition + progress * (centerPosition - startPosition));
      } else {
        setBallPosition(startPosition - progress * (startPosition - centerPosition));
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(moveToCenterStep);
      } else {
        // 第二阶段完成，增加本次训练完成次数
        currentRoundRef.current += 1;
        const newSessionCount = currentRoundRef.current;
        setSessionCount(newSessionCount);

        // 更新今日总完成次数
        setCompletedCount(prev => prev + 1);

        // 检查是否需要继续下一轮
        if (newSessionCount < targetRounds) {
          // 继续下一轮
          setTimeout(() => {
            animateMove(targetRounds, moveDirection);
          }, 1000);
        } else {
          // 完成所有轮次，保存记录
          saveTrainingRecord(newSessionCount);
          setPhase('idle');
        }
      }
    };

    animationRef.current = requestAnimationFrame(moveToCenterStep);
  };

  // 保存训练记录
  const saveTrainingRecord = (count: number) => {
    const record = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      eyeGaze: { count }
    };

    const existingRecords = JSON.parse(localStorage.getItem('exerciseRecords') || '[]');
    existingRecords.push(record);
    localStorage.setItem('exerciseRecords', JSON.stringify(existingRecords));
  };


  // 复位
  const handleReset = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setPhase('idle');
    setBallPosition(50);
    setSessionCount(0); // 只重置本次训练次数
    setCharIndex(0); // 重置汉字索引到第一个字
    currentRoundRef.current = 0;
  };

  // 清理动画
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // 监听键盘事件（空格键开始训练）
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && phase === 'idle') {
        event.preventDefault(); // 防止空格键滚动页面
        handleStart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [phase, targetCount]); // 依赖 phase 和 targetCount

  return (
    <div className="h-screen bg-gray-300 flex flex-col">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button
              variant="default"
              size="sm"
              className="bg-black text-white hover:bg-black hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
          </Link>
          <h1 className="text-xl font-bold">凝视锻炼辅助</h1>
        </div>
      </div>

      {/* 主区域 */}
      <div className="flex-1 relative overflow-hidden w-full">
        {/* 提示文案 */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
          <p className="font-bold text-center px-4" style={{ color: '#8FBC8F', fontSize: '5rem' }}>
            头部摆正后不要左右摆动，目光随小球移动
          </p>
        </div>

        {/* 绿色球 */}
        <div
          className="absolute top-1/2 w-32 h-32 rounded-full flex items-center justify-center shadow-2xl"
          style={{
            left: `${ballPosition}%`,
            transform: `translate(-50%, -50%)`,
            backgroundColor: '#8FBC8F', // 豆沙绿色
          }}
        >
          {/* 小球内的汉字 */}
          <span
            className="font-bold"
            style={{
              color: '#FFFFFF',
              fontSize: '3rem',
              lineHeight: 1,
            }}
          >
            {chars[charIndex]}
          </span>
        </div>

        {/* 进度提示 - 在小球下方 */}
        {phase === 'moving' && (
          <div
            className="absolute"
            style={{
              left: `${ballPosition}%`,
              top: 'calc(50% + 80px)', // 在小球下方（小球高度128px的一半 + 间距）
              transform: `translate(-50%, 0)`,
            }}
          >
            <p className="font-bold text-center px-4" style={{ color: '#8FBC8F', fontSize: '2rem' }}>
              第 {sessionCount + 1} / {parseInt(targetCount) || 10} 次
            </p>
          </div>
        )}
      </div>

      {/* 底部控制按钮 */}
      <div className="bg-white shadow-lg p-6">
        <div className="space-y-4">
          {/* 练习次数设置 */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="target-count">练习次数</Label>
              <Input
                id="target-count"
                type="number"
                min="1"
                value={targetCount}
                onChange={(e) => setTargetCount(e.target.value)}
                disabled={phase === 'moving'}
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <Label>已完成</Label>
              <div className="mt-1 text-2xl font-bold" style={{ color: '#8FBC8F' }}>
                {completedCount} 次
              </div>
            </div>
          </div>

          {/* 方向选择 */}
          <div>
            <Label>眼球移动方向</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="direction"
                  value="left"
                  checked={direction === 'left'}
                  onChange={(e) => setDirection(e.target.value as 'left' | 'right')}
                  disabled={phase === 'moving'}
                  className="w-4 h-4"
                />
                <span>向左</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="direction"
                  value="right"
                  checked={direction === 'right'}
                  onChange={(e) => setDirection(e.target.value as 'left' | 'right')}
                  disabled={phase === 'moving'}
                  className="w-4 h-4"
                />
                <span>向右</span>
              </label>
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="flex gap-4">
            <Button
              onClick={handleStart}
              variant="destructive"
              className="flex-1"
              size="lg"
              disabled={phase === 'moving'}
            >
              开始
            </Button>
            <Button
              onClick={handleReset}
              variant="destructive"
              className="flex-1"
              size="lg"
              disabled={phase === 'moving'}
            >
              复位
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
