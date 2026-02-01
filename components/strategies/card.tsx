"use client";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { RefreshCw, Quote, Heart } from "lucide-react";
import { useRandomObliqueStrategy, useRefreshStrategy, useLikeStrategy } from "./oblique-queries";

export default function StrategyCard() {
  const { data: strategy, isLoading, error } = useRandomObliqueStrategy();
  const refreshMutation = useRefreshStrategy();
  const likeMutation = useLikeStrategy();

  const likeCount = strategy?.like_count ?? 0;

  const handleRefresh = async () => {
    try {
      await refreshMutation.mutateAsync();
    } catch (err) {
      console.error('Failed to refresh strategy:', err);
    }
  };

  const handleLike = async () => {
    if (!strategy) return;

    try {
      await likeMutation.mutateAsync({
        strategyId: strategy.strategy_id,
      });
    } catch (err) {
      console.error('Failed to like strategy:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-emerald-600 p-12 shadow-2xl">
          <div className="relative z-10 flex items-center justify-center min-h-75">
            <div className="text-orange-100 text-xl">Loading your strategy...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-red-600 p-12 shadow-2xl">
          <div className="relative z-10 flex flex-col items-center justify-center min-h-75 space-y-4">
            <div className="text-orange-100 text-xl text-center">
              Failed to load strategy
            </div>
            <Button 
              onClick={handleRefresh}
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-emerald-600 p-12 shadow-2xl">
        {/* Background decoration */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

        {likeCount > 0 && (
          <Badge className="absolute top-6 left-6 bg-orange-200 text-emerald-900">
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </Badge>
        )}
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-75 space-y-8">
          {/* Quote icon */}
          <Quote className="w-12 h-12 text-orange-300/60" />
          
          {/* Strategy text */}
          <blockquote className="text-orange-100 text-2xl md:text-3xl font-light leading-relaxed text-center max-w-md">
            {strategy?.content}
          </blockquote> 
        </div>
        
        {/* Refresh button */}
        <div className="absolute bottom-6 right-6">
          <Button
            onClick={handleRefresh}
            disabled={isLoading || refreshMutation.isPending}
            size="lg"
            className="bg-white/20 hover:bg-white/30 text-white border-none shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
          >
            <RefreshCw className={`w-5 h-5 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
            {refreshMutation.isPending ? 'Getting...' : 'New Strategy'}
          </Button>
        </div>

        {/* Like button */}
        <div className="absolute bottom-6 left-6">
          <Button
            onClick={handleLike}
            disabled={!strategy || isLoading || likeMutation.isPending || refreshMutation.isPending}
            size="lg"
            className="bg-orange-300/90 hover:bg-orange-300 text-emerald-900 border-none shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Heart className={`w-5 h-5 ${likeMutation.isPending ? 'animate-pulse' : ''}`} />
            {likeMutation.isPending ? 'Liking...' : 'Like'}
          </Button>
        </div>
      </div>
    </div>
  );
}
