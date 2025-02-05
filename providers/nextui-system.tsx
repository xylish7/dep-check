import { HeroUIProvider as HeroUIProviderSystem } from "@heroui/system";
import { useRouter } from "next/navigation";

interface HeroUIProviderProps {
  children: React.ReactNode;
}

export function NextUISystemProvider({ children }: HeroUIProviderProps) {
  const router = useRouter();

  return (
    <HeroUIProviderSystem navigate={router.push}>
      {children}
    </HeroUIProviderSystem>
  );
}
