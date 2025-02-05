"use client"; // Error components must be Client Components

import { title } from "@/utils/primitives";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { usePathname } from "next/navigation";
import { Headset, Warning } from "@phosphor-icons/react/dist/ssr";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const pathName = usePathname();

  return (
    <div className="h-[50vh] w-full relative">
      <div className="flex flex-col items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
        <Warning className="text-primary mb-4" size={72} weight="duotone" />
        <h1 className={title({ color: "primary" })}>Oops..</h1>
        <span className="text-xl text-default-500 font-semibold mb-8 mt-2">
          Something went wrong
        </span>
        <Button
          color="primary"
          as={Link}
          href={`/contact/?path=${pathName}&errorMessage=${error.message}`}
          size="lg"
          startContent={<Headset size={28} />}
          variant="flat"
        >
          Contact us
        </Button>
      </div>
    </div>
  );
}
