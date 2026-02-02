import { useState, useCallback, useMemo } from 'react';
import type { Task, TaskStats, Priority } from '@/types';
import { useLocalStorage } from './useLocalStorage';

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('neon-tasks', []);
  const [isLoaded] = useState(true);

  // Calculate stats
  const stats: TaskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;
    const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length;
    
    return { total, active, completed, highPriority };
  }, [tasks]);

  // Add a new task
  const addTask = useCallback((title: string, description: string = '', priority: Priority = 'medium') => {
    const newTask: Task = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      priority,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }, [setTasks]);

  // Toggle task completion
  const toggleTask = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: Date.now() }
          : task
      )
    );
  }, [setTasks]);

  // Delete a task
  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, [setTasks]);

  // Edit a task
  const editTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: Date.now() }
          : task
      )
    );
  }, [setTasks]);

  // Clear all completed tasks
  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(task => !task.completed));
  }, [setTasks]);

  // Reorder tasks (move task to new index)
  const reorderTasks = useCallback((oldIndex: number, newIndex: number) => {
    setTasks(prev => {
      const result = [...prev];
      const [removed] = result.splice(oldIndex, 1);
      result.splice(newIndex, 0, removed);
      return result;
    });
  }, [setTasks]);

  // Get sorted tasks (active first, then by priority)
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      // Completed tasks go to bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Sort by priority (high > medium > low)
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      
      // Sort by creation date (newest first)
      return b.createdAt - a.createdAt;
    });
  }, [tasks]);

  return {
    tasks: sortedTasks,
    stats,
    isLoaded,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    clearCompleted,
    reorderTasks,
  };
}
