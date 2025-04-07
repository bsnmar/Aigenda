import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTasks } from "@/hooks/useTasks";
import { TaskAPI, TaskType } from "@/api";
import Tasks from "@/components/tasks";

const TaskCategories: React.FC = () => {
  const { category = "inbox" } = useParams<{ category: string }>();
  const { tasks, loading, error, deleteTask } = useTasks(TaskAPI.getAll);

  const filteredTasks = useMemo(() => {
    switch (category) {
      case "inbox":
        return tasks.filter((task) => !task.project_id);
      case "today":
        return tasks.filter(
          (task) =>
            task.due_date &&
            new Date(task.due_date).toDateString() === new Date().toDateString()
        );
      case "upcoming":
        return tasks.filter(
          (task) =>
            task.due_date &&
            new Date(task.due_date) > new Date() &&
            new Date(task.due_date) <
              new Date(new Date().setDate(new Date().getDate() + 14))
        );
      case "anytime":
        return tasks.filter((task) => task.priority === "Anytime"); // Adjusted to use priority instead of category
      case "someday":
        return tasks.filter((task) => task.priority === "Someday"); // Adjusted to use priority instead of category
      default:
        return tasks;
    }
  }, [tasks, category]);

  const getTitle = (category: string) => {
    switch (category) {
      case "inbox":
        return "Inbox";
      case "today":
        return "Today";
      case "upcoming":
        return "Upcoming";
      case "anytime":
        return "Anytime";
      case "someday":
        return "Someday";
      default:
        return "All Tasks";
    }
  };

  const handleEdit = (taskId: number) => {
    console.log("Edit Task:", taskId);
    // Implement edit logic
  };

  return (
    <div className="tasks-container ml-20">
      <h2 className="text-4xl font-semibold">{getTitle(category)}</h2>
      <div className="tasks-list mt-12">
        {loading && <p>Loading tasks...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && filteredTasks.length === 0 && (
          <p>No tasks found for {category}.</p>
        )}
        {!loading && !error && filteredTasks.length > 0 && (
          <div className="tasks">
            {filteredTasks.map((task) => (
              <Tasks
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCategories;
