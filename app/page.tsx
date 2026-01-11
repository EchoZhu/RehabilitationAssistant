'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EXERCISE_INFO } from "@/lib/constants";
import { ClipboardList, TrendingUp, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { calculateTodayProgress, getEncouragementMessage, getUserGoals } from "@/lib/storage";
import { DailyProgress } from "@/lib/types";

export default function Home() {
  const [progress, setProgress] = useState<DailyProgress | null>(null);
  const [encouragement, setEncouragement] = useState<string>('');
  const [goals, setGoals] = useState(getUserGoals());

  useEffect(() => {
    // 计算今日进度
    const todayProgress = calculateTodayProgress();
    setProgress(todayProgress);
    setEncouragement(getEncouragementMessage(todayProgress));
    setGoals(getUserGoals());
  }, []);

  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  if (!progress) {
    return <div>加载中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 欢迎信息 */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">欢迎回来</h1>
        <p className="text-muted-foreground">{today}</p>
      </div>

      {/* 快速操作 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              记录训练
            </CardTitle>
            <CardDescription>记录今天的康复训练</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/record">
              <Button className="w-full">开始记录</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              查看统计
            </CardTitle>
            <CardDescription>查看训练进度和趋势</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/statistics">
              <Button variant="outline" className="w-full">查看详情</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* 训练项目 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">今日训练</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {/* 慢走 */}
          <Card className={progress.walking.achieved ? "border-green-500 bg-green-50 dark:bg-green-950" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {EXERCISE_INFO.walking.name}
                  {progress.walking.achieved && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                </CardTitle>
                <span className="text-2xl">{EXERCISE_INFO.walking.icon}</span>
              </div>
              <CardDescription className="text-sm">
                {EXERCISE_INFO.walking.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">已完成</span>
                  <span className="font-medium">{progress.walking.completed} / {progress.walking.target} 分钟</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((progress.walking.completed / progress.walking.target) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 双手握拳平举 */}
          <Card className={progress.fistRaise.achieved ? "border-green-500 bg-green-50 dark:bg-green-950" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {EXERCISE_INFO.fistRaise.name}
                  {progress.fistRaise.achieved && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                </CardTitle>
                <span className="text-2xl">{EXERCISE_INFO.fistRaise.icon}</span>
              </div>
              <CardDescription className="text-sm">
                {EXERCISE_INFO.fistRaise.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">已完成</span>
                  <span className="font-medium">
                    {progress.fistRaise.completedSets}组×{progress.fistRaise.completedReps}次 / {progress.fistRaise.targetSets}组×{progress.fistRaise.targetReps}次
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        ((progress.fistRaise.completedSets / progress.fistRaise.targetSets) +
                         (progress.fistRaise.completedReps / progress.fistRaise.targetReps)) / 2 * 100,
                        100
                      )}%`
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 眼睛凝视训练 */}
          <Card className={progress.eyeGaze.achieved ? "border-green-500 bg-green-50 dark:bg-green-950" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {EXERCISE_INFO.eyeGaze.name}
                  {progress.eyeGaze.achieved && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                </CardTitle>
                <span className="text-2xl">{EXERCISE_INFO.eyeGaze.icon}</span>
              </div>
              <CardDescription className="text-sm">
                {EXERCISE_INFO.eyeGaze.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">已完成</span>
                  <span className="font-medium">{progress.eyeGaze.completed} / {progress.eyeGaze.target} 次</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((progress.eyeGaze.completed / progress.eyeGaze.target) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 鼓励语 */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">💪 今日寄语</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{encouragement}</p>
        </CardContent>
      </Card>

      {/* 辅助锻炼功能专区 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">辅助锻炼功能</h2>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">👁️</span>
              凝视锻炼辅助
            </CardTitle>
            <CardDescription>辅助进行眼睛凝视训练，帮助眼球左右移动</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/eye-gaze-assist">
              <Button className="w-full">开始辅助训练</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
