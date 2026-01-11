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

  const animationRef = useRef<number | null>(null);
  const currentRoundRef = useRef<number>(0); // 当前第几轮

  // 加载今日已完成的次数
  useEffect(() => {
    loadTodayCount();
  }, []);

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
    animateMove(target);
  };

  // 移动动画
  const animateMove = (targetRounds: number) => {
    // 第一阶段：从中央移动到左侧
    const moveToLeftDuration = 8000; // 8秒完成向左移动
    const startLeftTime = performance.now();
    const startPosition = 50; // 从中央（50%）
    const leftPosition = 5; // 到最左侧边缘

    const moveToLeftStep = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startLeftTime;
      const progress = Math.min(elapsed / moveToLeftDuration, 1);

      // 匀速移动到左侧
      setBallPosition(startPosition - progress * (startPosition - leftPosition));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(moveToLeftStep);
      } else {
        // 第一阶段完成，暂停2000毫秒后开始第二阶段
        setTimeout(() => {
          animateMoveBack(targetRounds);
        }, 2000);
      }
    };

    // 立即开始移动
    moveToLeftStep();
  };

  // 第二阶段：从左侧移回中央
  const animateMoveBack = (targetRounds: number) => {
    const moveToCenterDuration = 8000; // 8秒完成移回中央，与向左移动速度一致
    const startCenterTime = performance.now();
    const startPosition = 5; // 从左侧（5%）
    const centerPosition = 50; // 回到中央（50%）

    const moveToCenterStep = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startCenterTime;
      const progress = Math.min(elapsed / moveToCenterDuration, 1);

      // 匀速移回中央
      setBallPosition(startPosition + progress * (centerPosition - startPosition));

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
            animateMove(targetRounds);
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
