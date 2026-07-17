import React, { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { Task, User } from '../types';
import { initTelegram } from '../lib/telegram';
import { t } from '../lib/i18n';

// Khai báo cấu trúc Props đồng bộ nhận vào object user từ App.tsx
interface TasksTabProps {
  user: User;
}

// Giữ cấu trúc Props nhưng không bóc tách biến 'user' để tránh lỗi TS6133 (unused variable)
export const TasksTab: React.FC<TasksTabProps> = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);

  const { haptic } = initTelegram() || {};

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksRes, completedRes] = await Promise.all([
        apiClient.getTasks(),
        apiClient.getCompletedTasks(),
      ]);
      setTasks(tasksRes.data.tasks);
      setCompletedTaskIds(completedRes.data.completedTaskIds);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (task: Task) => {
    if (completing) return;

    setCompleting(task._id);
    haptic?.impact('medium');

    try {
      if (task.targetUrl) {
        window.open(task.targetUrl, '_blank');
      }

      await apiClient.checkTask(task._id);
      haptic?.notification('success');
      setCompletedTaskIds([...completedTaskIds, task._id]);
      alert(t('taskCompleted'));
    } catch (error: any) {
      console.error('Task completion error:', error);
      haptic?.notification('error');
      alert(error.response?.data?.error || t('error'));
    } finally {
      setCompleting(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 pb-20">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-charcoal-800 rounded-xl p-4 h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <h2 className="text-xl font-bold text-white mb-4">{t('tasks')}</h2>
      
      {tasks.length === 0 ? (
        <div className="bg-charcoal-800 rounded-xl p-6 text-center text-gray-400">
          No tasks available at the moment
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => {
            const isCompleted = completedTaskIds.includes(task._id);
            return (
              <div
                key={task._id}
                className={`bg-charcoal-800 rounded-xl p-4 ${
                  isCompleted ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold flex-1">{task.title}</h3>
                  <span className="text-gold-400 font-bold ml-2">+{task.reward}</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{task.description}</p>
                <button
                  onClick={() => handleCompleteTask(task)}
                  disabled={isCompleted || completing === task._id}
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                    isCompleted
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : 'bg-gold-500 hover:bg-gold-600 text-white disabled:bg-gray-600'
                  }`}
                >
                  {isCompleted ? '✓ Completed' : completing === task._id ? t('loading') : 'Complete'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
