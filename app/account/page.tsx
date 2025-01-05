"use client";

import { useEffect, useState } from "react";
import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import { GithubLogo } from "@phosphor-icons/react/dist/ssr";

import { serverApi } from "@/apis/server";
import { githubAppClientId } from "@/config/env";
import { useNotification } from "@/providers/notification";
import { PageLoader } from "@/components/page-loader";

const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubAppClientId}&scope=repo,user`;

export default function AccountPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { data, error } = await serverApi.github.getIsAuthorized();

      if (error || !data) {
        showNotification({
          message: "Unable to fetch authorization status",
          color: "error",
        });
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setIsAuthorized(data?.authorized);
    })();
  }, [showNotification]);

  if (isLoading) {
    return <PageLoader label="Loading dashboard" />;
  }

  if (!isAuthorized) {
    return (
      <Link
        href={githubAuthUrl}
        className={buttonStyles({
          className:
            "min-w-fit absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          color: "primary",
          radius: "full",
          size: "lg",
        })}
      >
        <GithubLogo className="flex-shrink-0" size={22} />
        Authorize with GitHub
      </Link>
    );
  }
}
