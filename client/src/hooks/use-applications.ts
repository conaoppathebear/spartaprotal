import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertApplication } from "@shared/schema";

export function useMyApplications() {
  return useQuery({
    queryKey: [api.applications.listMine.path],
    queryFn: async () => {
      const res = await fetch(api.applications.listMine.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch applications");
      return api.applications.listMine.responses[200].parse(await res.json());
    },
  });
}

export function useJobApplications(jobId: number) {
  return useQuery({
    queryKey: [api.applications.listByJob.path, jobId],
    queryFn: async () => {
      const url = buildUrl(api.applications.listByJob.path, { jobId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch applications");
      return api.applications.listByJob.responses[200].parse(await res.json());
    },
    enabled: !!jobId,
  });
}

export function useApply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertApplication) => {
      const validated = api.applications.create.input.parse(data);
      const res = await fetch(api.applications.create.path, {
        method: api.applications.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit application");
      }
      return api.applications.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.applications.listMine.path] });
    },
  });
}
