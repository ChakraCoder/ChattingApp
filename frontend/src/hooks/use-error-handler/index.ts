import { useToast } from "@/hooks/use-toast";

export const useErrorHandler = () => {
  const { toast } = useToast();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (error: any) => {
    const message =
      error.response?.data?.error || "An unexpected error occurred.";
    toast({ title: message, variant: "destructive" });
  };
};
