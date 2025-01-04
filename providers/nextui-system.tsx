import { NextUIProvider as NextUIProviderSystem } from "@nextui-org/system";
import { useRouter } from "next/navigation";

interface NextUIProviderProps {
  children: React.ReactNode;
}

export function NextUISystemProvider({ children }: NextUIProviderProps) {
  const router = useRouter();

  return (
    <NextUIProviderSystem navigate={router.push}>
      {children}
    </NextUIProviderSystem>
  );
}
