import { useEffect, useState } from "react";
import CircularProgress from "./ui/circularprogress";
import {
  Calendar,
  Inbox,
  Star,
  Box,
  Plus,
  Package,
  Settings2,
  Layers,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { AreaAPI, ProjectAPI, AreaType, ProjectType } from "@/api";

const topItems = [
  { title: "Inbox", url: "/category/inbox", icon: Inbox },
  { title: "Today", url: "/category/today", icon: Star },
  { title: "Upcoming", url: "/category/upcoming", icon: Calendar },
  { title: "Anytime", url: "/category/anytime", icon: Layers },
  { title: "Someday", url: "/category/someday", icon: Box },
];

export function AppSidebar() {
  const [areas, setAreas] = useState<AreaType[]>([]);
  const [standaloneProjects, setStandaloneProjects] = useState<ProjectType[]>(
    []
  );
  const [areaProjects, setAreaProjects] = useState<{
    [key: number]: ProjectType[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const fetchedAreas = await AreaAPI.getAll();
        setAreas(fetchedAreas);

        const allProjects = await ProjectAPI.getAll();

        const standalone = allProjects.filter((project) => !project.area_id);
        setStandaloneProjects(standalone);

        const projectsByArea: { [key: number]: ProjectType[] } = {};
        for (const area of fetchedAreas) {
          const areaProjectsList = allProjects.filter(
            (project) => project.area_id === area.id
          );
          projectsByArea[area.id] = areaProjectsList;
        }
        setAreaProjects(projectsByArea);

        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load sidebar data"
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton>
                        <span>Loading...</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  if (error) {
    return (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <span>Error: {error}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {topItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon
                        className={`
                          h-5 w-5 
                          ${item.title === "Inbox" ? "text-blue-500" : ""}
                          ${item.title === "Today" ? "text-yellow-400" : ""}
                          ${item.title === "Upcoming" ? "text-red-500" : ""}
                          ${item.title === "Someday" ? "text-yellow-900" : ""}
                          ${item.title === "Anytime" ? "text-emerald-600" : ""}
                        `}
                      />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {standaloneProjects.length > 0 && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {standaloneProjects.map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton asChild>
                      <a href={`${project.id}`}>
                        <CircularProgress
                          progress={project.completion}
                          size={85}
                          strokeWidth={4}
                        />
                        <span>{project.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {areas.map((area) => (
          <SidebarGroup key={area.id}>
            <SidebarGroupLabel className="text-md font-semibold">
              <Package className="mr-2" /> {area.name}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {areaProjects[area.id]?.map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton asChild>
                      <a href={`/projects/${project.id}`}>
                        <CircularProgress
                          progress={project.completion}
                          size={85}
                          strokeWidth={4}
                        />
                        <span>{project.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between p-2">
          <SidebarMenuButton asChild>
            <a href="#new-list" className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              <span>New List</span>
            </a>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <a href="#settings">
              <Settings2 className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </a>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
