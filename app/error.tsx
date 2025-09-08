"use client"; // Error components must be Client Components

import { title } from "@/utils/primitives";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { usePathname } from "next/navigation";
import { TrashSimple, Warning } from "@phosphor-icons/react/dist/ssr";
import { GithubLogo } from "@phosphor-icons/react";
import { REPOS_STORAGE_KEY } from "@/apis/local-storage/github-repos";

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
        <div className="flex gap-4 mt-6">
          <Button
            onPress={() => {
              localStorage.removeItem(REPOS_STORAGE_KEY);
              window.location.reload();
            }}
            size="lg"
            variant="ghost"
          >
            <TrashSimple size={28} /> Clear Storage and Refresh
          </Button>
          <Button
            as={Link}
            href={`https://github.com/xylish7/dep-check/issues/new?body=${encodeURIComponent(
              `📍 Location: \`${pathName}\`\n⚠️ Reported error: \`${error.message}\``
            )}`}
            isExternal
            size="lg"
            startContent={<GithubLogo size={28} />}
            variant="ghost"
          >
            Report on github
          </Button>
        </div>
      </div>
    </div>
  );
}
