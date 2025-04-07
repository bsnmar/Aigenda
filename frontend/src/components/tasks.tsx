import { useState } from "react";
import { TaskAPI, TaskType } from "@/api";
import Checkbox from "./ui/checkbox";

interface TaskCardProps {
  task: TaskType;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const Tasks: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const [checked, setChecked] = useState(task.completed);

  const toggleCheckbox = async () => {
    const updatedChecked = !checked;
    setChecked(updatedChecked);

    try {
      if (updatedChecked) {
        await TaskAPI.markTaskAsCompleted(task.id);
      } else {
        await TaskAPI.markTaskAsNotCompleted(task.id);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      setChecked(checked);
    }
  };

  return (
    <div className="flex items-center mb-4">
      <Checkbox checked={checked} onChange={toggleCheckbox} />
      <p className="ml-3">{task.title}</p>
    </div>
  );
};

export default Tasks;
