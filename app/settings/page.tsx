'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserGoals, ReminderSettings } from "@/lib/types";
import { DEFAULT_GOALS, DEFAULT_REMINDER, EXERCISE_INFO } from "@/lib/constants";
import { Bell, Target } from "lucide-react";

export default function SettingsPage() {
  const [goals, setGoals] = useState<UserGoals>(DEFAULT_GOALS);
  const [reminder, setReminder] = useState<ReminderSettings>(DEFAULT_REMINDER);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // 加载保存的目标设置
    const savedGoals = localStorage.getItem('userGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }

    // 加载保存的提醒设置
    const savedReminder = localStorage.getItem('reminderSettings');
    if (savedReminder) {
      setReminder(JSON.parse(savedReminder));
    }

    // 检查通知权限
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleSaveGoals = () => {
    localStorage.setItem('userGoals', JSON.stringify(goals));
    alert('目标设置已保存！');
  };

  const handleSaveReminder = () => {
    localStorage.setItem('reminderSettings', JSON.stringify(reminder));
    alert('提醒设置已保存！');
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        alert('通知权限已授予！');
        // 测试通知
        new Notification('康复助手', {
          body: '提醒功能已设置成功！',
          icon: '/icon-192.png',
        });
      }
    } else {
      alert('您的浏览器不支持通知功能');
    }
  };

  const testReminder = () => {
    if ('Notification' in window && notificationPermission === 'granted') {
      new Notification('康复助手训练提醒', {
        body: '该进行康复训练了！',
        icon: '/icon-192.png',
        tag: 'rehabilitation-reminder',
      });
    } else {
      alert('请先授予通知权限');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">设置</h1>
        <p className="text-muted-foreground">自定义你的康复目标和提醒设置</p>
      </div>

      {/* 训练目标设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            训练目标
          </CardTitle>
          <CardDescription>设置每日康复训练的目标</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 慢走目标 */}
          <div className="space-y-2">
            <Label htmlFor="walking-target">
              {EXERCISE_INFO.walking.icon} {EXERCISE_INFO.walking.name}目标
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="walking-target"
                type="number"
                min="1"
                value={goals.walking.targetDuration}
                onChange={(e) =>
                  setGoals({
                    ...goals,
                    walking: { ...goals.walking, targetDuration: parseInt(e.target.value) || 0 },
                  })
                }
                className="max-w-xs"
              />
              <span className="text-sm text-muted-foreground">分钟/天</span>
            </div>
          </div>

          {/* 双手握拳平举目标 */}
          <div className="space-y-2">
            <Label htmlFor="fist-raise-target">
              {EXERCISE_INFO.fistRaise.icon} {EXERCISE_INFO.fistRaise.name}目标
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Input
                  id="fist-raise-sets"
                  type="number"
                  min="1"
                  value={goals.fistRaise.targetSets}
                  onChange={(e) =>
                    setGoals({
                      ...goals,
                      fistRaise: { ...goals.fistRaise, targetSets: parseInt(e.target.value) || 0 },
                    })
                  }
                />
                <span className="text-sm text-muted-foreground">组</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="fist-raise-reps"
                  type="number"
                  min="1"
                  value={goals.fistRaise.targetReps}
                  onChange={(e) =>
                    setGoals({
                      ...goals,
                      fistRaise: { ...goals.fistRaise, targetReps: parseInt(e.target.value) || 0 },
                    })
                  }
                />
                <span className="text-sm text-muted-foreground">次/组</span>
              </div>
            </div>
          </div>

          {/* 眼睛凝视训练目标 */}
          <div className="space-y-2">
            <Label htmlFor="eye-gaze-target">
              {EXERCISE_INFO.eyeGaze.icon} {EXERCISE_INFO.eyeGaze.name}目标
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="eye-gaze-target"
                type="number"
                min="1"
                value={goals.eyeGaze.targetCount}
                onChange={(e) =>
                  setGoals({
                    ...goals,
                    eyeGaze: { ...goals.eyeGaze, targetCount: parseInt(e.target.value) || 0 },
                  })
                }
                className="max-w-xs"
              />
              <span className="text-sm text-muted-foreground">次/天</span>
            </div>
          </div>

          <Button onClick={handleSaveGoals} className="w-full">
            保存目标设置
          </Button>
        </CardContent>
      </Card>

      {/* 提醒设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            训练提醒
          </CardTitle>
          <CardDescription>设置每日训练提醒时间</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="reminder-enabled">启用提醒</Label>
            <input
              id="reminder-enabled"
              type="checkbox"
              checked={reminder.enabled}
              onChange={(e) =>
                setReminder({ ...reminder, enabled: e.target.checked })
              }
              className="w-5 h-5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder-time">提醒时间</Label>
            <Input
              id="reminder-time"
              type="time"
              value={reminder.time}
              onChange={(e) =>
                setReminder({ ...reminder, time: e.target.value })
              }
              className="max-w-xs"
            />
          </div>

          {notificationPermission !== 'granted' && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                需要授予通知权限才能接收训练提醒
              </p>
              <Button
                onClick={requestNotificationPermission}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                授予通知权限
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleSaveReminder} className="flex-1">
              保存提醒设置
            </Button>
            {notificationPermission === 'granted' && (
              <Button onClick={testReminder} variant="outline">
                测试提醒
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 数据管理 */}
      <Card>
        <CardHeader>
          <CardTitle>数据管理</CardTitle>
          <CardDescription>管理你的训练记录数据</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm('确定要清空所有训练记录吗？此操作不可恢复。')) {
                  localStorage.removeItem('exerciseRecords');
                  alert('训练记录已清空');
                  window.location.reload();
                }
              }}
            >
              清空所有记录
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const records = localStorage.getItem('exerciseRecords');
                if (records) {
                  const blob = new Blob([records], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `rehabilitation-records-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }
              }}
            >
              导出数据
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
