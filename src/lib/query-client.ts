import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,              // always refetch when component mounts
      gcTime: 1000 * 60,         // keep unused data in memory for 1 min
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});
