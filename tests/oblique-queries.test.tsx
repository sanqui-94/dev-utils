import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import {
  useRandomObliqueStrategy,
  useLikeStrategy,
  obliqueQueryKeys,
} from "@/components/strategies/oblique-queries";

type Strategy = {
  strategy_id: number;
  content: string;
  like_count: number;
  created_at: string;
  updated_at: string;
};

const rangeSingle = vi.fn();
const range = vi.fn(() => ({ single: rangeSingle }));
const select = vi.fn((_: string, options?: { count?: string; head?: boolean }) => {
  if (options?.count === "exact" && options?.head) {
    return { count: 1 };
  }
  return { range };
});
const from = vi.fn(() => ({ select }));
const rpcSingle = vi.fn();
const rpc = vi.fn(() => ({ single: rpcSingle }));

const supabase = { from, rpc };

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => supabase,
}));

const createWrapper = (queryClient: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

describe("oblique-queries hooks", () => {
  beforeEach(() => {
    rangeSingle.mockReset();
    range.mockClear();
    select.mockClear();
    from.mockClear();
    rpc.mockClear();
    rpcSingle.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches a random strategy", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    const strategy: Strategy = {
      strategy_id: 1,
      content: "Test strategy",
      like_count: 0,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    };

    rangeSingle.mockResolvedValue({ data: strategy, error: null });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const { result } = renderHook(() => useRandomObliqueStrategy(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(strategy);
    expect(from).toHaveBeenCalledWith("oblique_strategies");
    expect(select).toHaveBeenCalledWith("*", { count: "exact", head: true });
    expect(range).toHaveBeenCalledWith(0, 0);
  });

  it("updates cache on like mutation", async () => {
    const initial: Strategy = {
      strategy_id: 2,
      content: "Initial",
      like_count: 1,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    };

    const updated: Strategy = {
      ...initial,
      like_count: 2,
      updated_at: "2026-01-01T01:00:00Z",
    };

    rpcSingle.mockResolvedValue({ data: updated, error: null });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    queryClient.setQueryData(obliqueQueryKeys.random(), initial);

    const { result } = renderHook(() => useLikeStrategy(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.mutateAsync({ strategyId: initial.strategy_id });

    expect(rpc).toHaveBeenCalledWith("increment_like_count", {
      p_strategy_id: initial.strategy_id,
    });

    const cached = queryClient.getQueryData<Strategy>(obliqueQueryKeys.random());
    expect(cached).toEqual(updated);
  });
});
