import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';

export const taskKeys = {
  all: ['tasks'],
  list: status => ['tasks', 'list', status ?? 'ALL'],
  stats: ['tasks', 'stats'],
};

export function useTasks(status) {
  return useQuery({
    queryKey: taskKeys.list(status),
    queryFn: () => tasksApi.list(status),
  });
}

export function useTaskStats() {
  return useQuery({
    queryKey: taskKeys.stats,
    queryFn: tasksApi.stats,
  });
}

function useTaskMutation(mutationFn) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    // lists and counters both depend on tasks, so refresh everything under ['tasks']
    onSettled: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}

export const useCreateTask = () => useTaskMutation(tasksApi.create);
export const useUpdateTask = () => useTaskMutation(tasksApi.update);
export const useDeleteTask = () => useTaskMutation(tasksApi.remove);
