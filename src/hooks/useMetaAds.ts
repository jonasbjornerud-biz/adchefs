import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdMetric, getAggregateMetrics } from "@/data/mockAds";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useCallback } from "react";

interface UseMetaAdsOptions {
  since?: string;
  until?: string;
}

async function fetchMetaAds(since?: string, until?: string): Promise<AdMetric[]> {
  const body: Record<string, string> = {};
  if (since) body.since = since;
  if (until) body.until = until;

  const { data, error } = await supabase.functions.invoke("meta-ads", {
    body,
  });

  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);

  return data.ads as AdMetric[];
}

export function useMetaAds(options?: UseMetaAdsOptions) {
  const { toast } = useToast();
  const { since, until } = options || {};
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [lastFetched, setLastFetched] = useState<{ since?: string; until?: string }>({});

  const hasBothDates = !!since && !!until;
  const shouldFetch = hasBothDates && fetchTrigger > 0;

  const query = useQuery({
    queryKey: ["meta-ads", lastFetched.since, lastFetched.until, fetchTrigger],
    queryFn: () => fetchMetaAds(lastFetched.since, lastFetched.until),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: false,
    enabled: shouldFetch,
  });

  const triggerFetch = useCallback(() => {
    if (hasBothDates) {
      setLastFetched({ since, until });
      setFetchTrigger((t) => t + 1);
    }
  }, [since, until, hasBothDates]);

  useEffect(() => {
    if (query.error) {
      const msg = (query.error as Error).message;
      toast({
        title: "Failed to load data",
        description: msg.includes("request limit")
          ? "Meta API rate limit hit. Wait a minute and try again."
          : msg,
        variant: "destructive",
      });
    }
  }, [query.error]);

  const ads = query.data ?? [];
  const metrics = getAggregateMetrics(ads);

  return {
    ads,
    metrics,
    isLoading: query.isLoading && query.fetchStatus !== "idle",
    isLive: !!query.data,
    error: query.error,
    triggerFetch,
  };
}