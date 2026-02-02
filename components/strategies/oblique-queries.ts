import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

interface ObliqueStrategy {
  strategy_id: number;
  content: string;
  like_count: number;
  created_at: string;
  updated_at: string;
}

// Query keys for cache management
export const obliqueQueryKeys = {
  all: ['oblique-strategies'] as const,
  random: () => [...obliqueQueryKeys.all, 'random'] as const,
};

// Get random oblique strategy from Supabase
export function useRandomObliqueStrategy() {
  return useQuery({
    queryKey: obliqueQueryKeys.random(),
    queryFn: async (): Promise<ObliqueStrategy> => {
      const supabase = createClient();
      
      // First get the count of total strategies
      const { count } = await supabase
        .from("oblique_strategies")
        .select('*', { count: 'exact', head: true });
      
      if (!count || count === 0) {
        throw new Error('No strategies found');
      }
      
      // Generate random offset
      const randomOffset = Math.floor(Math.random() * count);
      
      // Get strategy at random offset
      const { data, error } = await supabase
        .from("oblique_strategies")
        .select()
        .range(randomOffset, randomOffset)
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data) {
        throw new Error('No strategies found');
      }
      
      return data;
    },
    staleTime: 0, // Always fetch fresh for randomness
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on focus to avoid constant changes
  });
}

// Manually refetch a new random strategy
export function useRefreshStrategy() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (): Promise<void> => {
      // Invalidate the current random strategy to force a refetch
      await queryClient.invalidateQueries({ queryKey: obliqueQueryKeys.random() });
    },
  });
}

interface LikeStrategyParams {
  strategyId: number;
}

// Increment like count for a strategy
export function useLikeStrategy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ strategyId }: LikeStrategyParams): Promise<ObliqueStrategy> => {
      const supabase = createClient();

      const { data, error } = await supabase
        .rpc("increment_like_count", { p_strategy_id: strategyId })
        .single();

      if (error) {
        throw new Error(error.message);
      }

      const typedData = data as ObliqueStrategy | null;

      if (!typedData) {
        throw new Error("Failed to update like count");
      }

      return typedData;
    },
    onMutate: async ({ strategyId }) => {
      await queryClient.cancelQueries({ queryKey: obliqueQueryKeys.random() });

      const previousStrategy = queryClient.getQueryData<ObliqueStrategy>(
        obliqueQueryKeys.random()
      );

      if (previousStrategy?.strategy_id === strategyId) {
        queryClient.setQueryData<ObliqueStrategy>(obliqueQueryKeys.random(), {
          ...previousStrategy,
          like_count: (previousStrategy.like_count ?? 0) + 1,
          updated_at: new Date().toISOString(),
        });
      }

      return { previousStrategy };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousStrategy) {
        queryClient.setQueryData(obliqueQueryKeys.random(), context.previousStrategy);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(obliqueQueryKeys.random(), data);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: obliqueQueryKeys.random() });
    },
  });
}
