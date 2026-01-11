'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EXERCISE_INFO } from "@/lib/constants";
import { ExerciseRecord } from "@/lib/types";
import { useRouter } from 'next/navigation';

export default function RecordPage() {
  const router = useRouter();
  const [walkingDuration, setWalkingDuration] = useState('');
  const [fistRaiseSets, setFistRaiseSets] = useState('');
  const [fistRaiseReps, setFistRaiseReps] = useState('');
  const [eyeGazeCount, setEyeGazeCount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 创建训练记录
    const record: ExerciseRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
    };

    // 只添加有值的训练项目
    if (walkingDuration) {
      record.walking = { duration: parseInt(walkingDuration) };
    }
    if (fistRaiseSets && fistRaiseReps) {
      record.fistRaise = {
        sets: parseInt(fistRaiseSets),
        reps: parseInt(fistRaiseReps),
      };
    }
    if (eyeGazeCount) {
      record.eyeGaze = { count: parseInt(eyeGazeCount) };
    }

    // 保存到 localStorage
    const existingRecords = JSON.parse(localStorage.getItem('exerciseRecords') || '[]');
    existingRecords.push(record);
    localStorage.setItem('exerciseRecords', JSON.stringify(existingRecords));

    // 显示成功消息并重定向
    alert('训练记录已保存！');
    router.push('/');
  };

  const handleReset = () => {
    setWalkingDuration('');
    setFistRaiseSets('');
    setFistRaiseReps('');
    setEyeGazeCount('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">记录训练</h1>
        <p className="text-muted-foreground">记录你今天的康复训练成果</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 慢走 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{EXERCISE_INFO.walking.icon}</span>
                {EXERCISE_INFO.walking.name}
              </CardTitle>
            </div>
            <CardDescription>{EXERCISE_INFO.walking.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="walking-duration">训练时长（分钟）</Label>
              <Input
                id="walking-duration"
                type="number"
                min="0"
                placeholder="例如：30"
                value={walkingDuration}
                onChange={(e) => setWalkingDuration(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 双手握拳平举 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{EXERCISE_INFO.fistRaise.icon}</span>
                {EXERCISE_INFO.fistRaise.name}
              </CardTitle>
            </div>
            <CardDescription>{EXERCISE_INFO.fistRaise.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fist-raise-sets">组数</Label>
                <Input
                  id="fist-raise-sets"
                  type="number"
                  min="0"
                  placeholder="例如：3"
                  value={fistRaiseSets}
                  onChange={(e) => setFistRaiseSets(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fist-raise-reps">每组次数</Label>
                <Input
                  id="fist-raise-reps"
                  type="number"
                  min="0"
                  placeholder="例如：10"
                  value={fistRaiseReps}
                  onChange={(e) => setFistRaiseReps(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 眼睛凝视训练 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{EXERCISE_INFO.eyeGaze.icon}</span>
                {EXERCISE_INFO.eyeGaze.name}
              </CardTitle>
            </div>
            <CardDescription>{EXERCISE_INFO.eyeGaze.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eye-gaze-count">从左到右次数</Label>
              <Input
                id="eye-gaze-count"
                type="number"
                min="0"
                placeholder="例如：20"
                value={eyeGazeCount}
                onChange={(e) => setEyeGazeCount(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 提交按钮 */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="default"
            className="flex-1"
            size="lg"
            onClick={() => router.push('/')}
          >
            取消
          </Button>
          <Button type="submit" className="flex-1" size="lg">
            保存记录
          </Button>
        </div>
      </form>
    </div>
  );
}
