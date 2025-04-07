import React from "react";
import { useTasks } from "@/hooks/useTasks";
import { TaskAPI, TaskType } from "@/api";
import Tasks from "./tasks";

const TaskList: React.FC = () => {
  const { tasks, loading, error, deleteTask } = useTasks(TaskAPI.getAll);

  const handleEdit = (taskId: number) => {
    console.log("Edit Task:", taskId);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <Tasks
          key={task.id}
          task={task}
          onEdit={handleEdit}
          onDelete={deleteTask}
        />
      ))}
    </div>
  );
};

export default TaskList;
