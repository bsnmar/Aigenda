const BASE_URL = "http://127.0.0.1:5000";

// Base request helper
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Error ${res.status}: ${error}`);
  }

  return res.json();
}

// --------------------
// Area API
// --------------------
export const AreaAPI = {
  getAll: () => request<AreaType[]>("/areas"),

  getById: (id: number) => request<AreaType>(`/areas/${id}`),

  create: (name: string) =>
    request(`/areas`, {
      method: "POST",
      body: JSON.stringify({ name }),
    }),

  update: (id: number, name: string) =>
    request(`/areas/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    }),

  delete: (id: number) => request(`/areas/${id}`, { method: "DELETE" }),
};

// --------------------
// Project API
// --------------------
export const ProjectAPI = {
  getAll: () => request<ProjectType[]>("/projects"),

  getById: (id: number) => request<ProjectType>(`/projects/${id}`),

  getByAreaId: (areaId: number) =>
    request<ProjectType[]>(`/areas/${areaId}/projects`),

  create: (data: { name: string; area_id?: number | null }) =>
    request(`/projects`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: { name?: string; area_id?: number | null }) =>
    request(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) => request(`/projects/${id}`, { method: "DELETE" }),
};

// --------------------
// Task API
// --------------------
export const TaskAPI = {
  getAll: () => request<TaskType[]>("/tasks"),

  getById: (id: number) => request<TaskType>(`/tasks/${id}`),

  getByProjectId: (projectId: number) =>
    request<TaskType[]>(`/projects/${projectId}/tasks`),

  create: (data: {
    title: string;
    description?: string;
    priority?: string;
    due_date?: string;
    tags?: string;
    project_id?: number | null;
  }) =>
    request(`/tasks`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (
    id: number,
    updates: Partial<Omit<TaskType, "id" | "created" | "updated">>
  ) =>
    request(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  async markTaskAsCompleted(taskId: number) {
    const res = await fetch(`${BASE_URL}/tasks/${taskId}/complete`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to mark task as completed");
    }
    return res.json();
  },

  async markTaskAsNotCompleted(taskId: number) {
    const res = await fetch(`${BASE_URL}/tasks/${taskId}/not_complete`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to mark task as not completed");
    }
    return res.json();
  },

  delete: (id: number) => request(`/tasks/${id}`, { method: "DELETE" }),
};

// --------------------
// Subtask API
// --------------------
export const SubtaskAPI = {
  getByTaskId: (taskId: number) =>
    request<SubtaskType[]>(`/tasks/${taskId}/subtasks`),

  create: (taskId: number, title: string) =>
    request(`/tasks/${taskId}/subtasks`, {
      method: "POST",
      body: JSON.stringify({ title }),
    }),

  update: (id: number, updates: Partial<SubtaskType>) =>
    request(`/subtasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  delete: (id: number) => request(`/subtasks/${id}`, { method: "DELETE" }),
};

// --------------------
// Types
// --------------------
export type AreaType = {
  id: number;
  name: string;
};

export type ProjectType = {
  id: number;
  name: string;
  area_id?: number | null;
  completion: number;
};

export type TaskType = {
  id: number;
  title: string;
  description?: string;
  priority: string;
  due_date?: string;
  tags?: string;
  completed: boolean;
  project_id?: number | null;
  created: string;
  updated: string;
  subtasks?: SubtaskType[];
};

export type SubtaskType = {
  id: number;
  title: string;
  completed: boolean;
  task_id: number;
};
