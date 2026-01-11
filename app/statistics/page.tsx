'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExerciseRecord, DailyProgress } from "@/lib/types";
import { EXERCISE_INFO } from "@/lib/constants";

export default function StatisticsPage() {
  const [records, setRecords] = useState<ExerciseRecord[]>([]);
  const [todayProgress, setTodayProgress] = useState<DailyProgress | null>(null);

  useEffect(() => {
    // 从 localStorage 加载记录
    const savedRecords = JSON.parse(localStorage.getItem('exerciseRecords') || '[]');
    setRecords(savedRecords);

    // 计算今日进度
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = savedRecords.filter((r: ExerciseRecord) => r.date === today);

    if (todayRecords.length > 0) {
      // TODO: 根据目标计算进度
      const goals = JSON.parse(localStorage.getItem('userGoals') || '{}');
      setTodayProgress({
        date: today,
        walking: {
          completed: todayRecords.reduce((sum: number, r) => sum + (r.walking?.duration || 0), 0),
          target: goals.walking?.targetDuration || 30,
          achieved: false,
        },
        fistRaise: {
          completedSets: todayRecords.reduce((sum: number, r) => sum + (r.fistRaise?.sets || 0), 0),
          completedReps: todayRecords.reduce((sum: number, r) => sum + (r.fistRaise?.reps || 0), 0),
          targetSets: goals.fistRaise?.targetSets || 3,
          targetReps: goals.fistRaise?.targetReps || 10,
          achieved: false,
        },
        eyeGaze: {
          completed: todayRecords.reduce((sum: number, r) => sum + (r.eyeGaze?.count || 0), 0),
          target: goals.eyeGaze?.targetCount || 20,
          achieved: false,
        },
        overallAchieved: false,
      });
    }
  }, []);

  const getTotalDays = () => {
    const uniqueDates = new Set(records.map(r => r.date));
    return uniqueDates.size;
  };

  const getRecentRecords = () => {
    return records
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 7);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">训练统计</h1>
        <p className="text-muted-foreground">查看你的康复训练进度和趋势</p>
      </div>

      {/* 总览统计 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">训练天数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{getTotalDays()}</div>
            <p className="text-xs text-muted-foreground mt-1">累计训练天数</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">总记录数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{records.length}</div>
            <p className="text-xs text-muted-foreground mt-1">所有训练记录</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">本周记录</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {records.filter(r => {
                const recordDate = new Date(r.date);
                const today = new Date();
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                return recordDate >= weekAgo;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">最近7天</p>
          </CardContent>
        </Card>
      </div>

      {/* 最近记录 */}
      <Card>
        <CardHeader>
          <CardTitle>最近记录</CardTitle>
          <CardDescription>最近7次的训练记录</CardDescription>
        </CardHeader>
        <CardContent>
          {getRecentRecords().length === 0 ? (
            <p className="text-center text-muted-foreground py-8">暂无训练记录</p>
          ) : (
            <div className="space-y-4">
              {getRecentRecords().map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium">
                      {new Date(record.timestamp).toLocaleDateString('zh-CN', {
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short',
                      })}
                    </p>
                    <div className="flex gap-2 mt-1">
                      {record.walking && (
                        <span className="text-sm text-muted-foreground">
                          {EXERCISE_INFO.walking.icon} 慢走 {record.walking.duration}分钟
                        </span>
                      )}
                      {record.fistRaise && (
                        <span className="text-sm text-muted-foreground">
                          {EXERCISE_INFO.fistRaise.icon} 握拳 {record.fistRaise.sets}组×{record.fistRaise.reps}次
                        </span>
                      )}
                      {record.eyeGaze && (
                        <span className="text-sm text-muted-foreground">
                          {EXERCISE_INFO.eyeGaze.icon} 凝视 {record.eyeGaze.count}次
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 训练趋势提示 */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">📊 统计提示</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            持续记录训练数据可以帮助你更好地了解康复进度。建议每天固定时间进行训练，并保持记录的连续性。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
