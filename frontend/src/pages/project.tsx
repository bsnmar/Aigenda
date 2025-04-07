import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useTasks } from "@/hooks/useTasks";
import { ProjectAPI, TaskAPI, ProjectType } from "@/api";
import CircularProgress from "@/components/ui/circularprogress";
import Tasks from "@/components/tasks";

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id, 10);
  const [project, setProject] = useState<ProjectType | null>(null);

  const fetchTasks = useCallback(
    () => TaskAPI.getByProjectId(projectId),
    [projectId]
  );
  const { tasks, loading, deleteTask } = useTasks(fetchTasks);

  useEffect(() => {
    async function fetchProject() {
      try {
        const fetchedProject = await ProjectAPI.getById(projectId);
        setProject(fetchedProject);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    }
    fetchProject();
  }, [projectId]);

  const handleEdit = (taskId: number) => {
    console.log("Edit Task:", taskId);
  };

  if (loading || !project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ml-20">
      <div className="flex items-center">
        <CircularProgress
          progress={project.completion}
          size={50}
          strokeWidth={4}
        />
        <h2 className="text-3xl font-semibold">{project.name}</h2>
      </div>
      <ul className="mt-12 ml-4">
        {tasks.map((task) => (
          <Tasks
            key={task.id}
            task={task}
            onEdit={handleEdit}
            onDelete={deleteTask}
          />
        ))}
      </ul>
    </div>
  );
}
