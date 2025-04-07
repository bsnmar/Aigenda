import { useState, useEffect } from "react";
import { TaskAPI, TaskType } from "@/api";

interface UseTasksResult {
  tasks: TaskType[];
  loading: boolean;
  error: string | null;
  deleteTask: (taskId: number) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useTasks(fetchFn: () => Promise<TaskType[]>): UseTasksResult {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFn();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchFn]);

  const deleteTask = async (taskId: number) => {
    try {
      await TaskAPI.delete(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  return { tasks, loading, error, deleteTask, refetch: fetchTasks };
}
