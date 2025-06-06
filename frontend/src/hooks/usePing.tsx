// hooks/usePing.ts
import { useQuery } from "@tanstack/react-query";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const usePing = () => {
  return useQuery({
    queryKey: ["ping"],
    queryFn: async () => {
      const response = await fetch(`${backendUrl}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("Ping successful");
      return true;
    },
    retry: 10,
    retryDelay: attemptIndex => 1000 * (attemptIndex + 1),
  });
};
// This hook can be used to check the server's availability by pinging it.
// It retries up to 5 times with an increasing delay between attempts.