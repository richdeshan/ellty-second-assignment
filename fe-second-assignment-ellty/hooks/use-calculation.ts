import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Calculation, CreateCalculationPayload } from "@/types";

export function useCalculations() {
  const queryClient = useQueryClient();

  const { data: calculations, isLoading } = useQuery<Calculation[]>({
    queryKey: ["calculations"],
    queryFn: async () => {
      const { data } = await api.get("/calculations");
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newCalc: CreateCalculationPayload) => {
      const { data } = await api.post("/calculations", newCalc);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calculations"] });
    },
  });

  return {
    calculations,
    isLoading,
    addCalculation: mutation.mutate,
  };
}
