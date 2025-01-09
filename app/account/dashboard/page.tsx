"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@nextui-org/button";

import { useNotification } from "@/providers/notification";
import { PageLoader } from "@/components/page-loader";
import { GithubReposRow, supabaseApi } from "@/apis/supabase";
import { browserClient } from "@/supabase/clients/browser";
import { useDisclosure } from "@nextui-org/modal";
import { AddReposModal } from "./_components/add-repos-modal";
import { RepoCard } from "@/components/repo-card";

const supabaseClient = browserClient();
// const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubAppClientId}&scope=repo,user`;

export default function AccountPage() {
  const [repos, setRepos] = useState<GithubReposRow[]>([]);
  // const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();
  const isInitialized = useRef(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Handle adding a repo
  async function handleAdd(file: File) {
    const { error: sessionError, session } = await supabaseApi.auth.getSession(
      supabaseClient
    );

    if (sessionError || !session) {
      showNotification({
        message: "Unable to fetch session",
        color: "danger",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event: ProgressEvent<FileReader>) => {
      const content = event.target?.result as string;
      const parsedContent = JSON.parse(content);

      const { data: addedRepo, error: addRepoError } =
        await supabaseApi.github.repos.add(supabaseClient, {
          uuid: session.user.id,
          name: parsedContent.name,
          package_json: content as string,
        });

      if (addRepoError || !addedRepo) {
        if (addRepoError?.code === "23505") {
          showNotification({
            message: "Repository already exists",
            color: "warning",
          });
          return;
        }
        showNotification({
          message: "Unable to add repository",
          color: "danger",
        });
        return;
      }

      setRepos((prevRepos) => [...prevRepos, addedRepo]);
    };
    reader.readAsText(file);
  }

  useEffect(() => {
    (async () => {
      if (isInitialized.current) return;

      isInitialized.current = true;
      setIsLoading(true);

      // const { data: isAuthorizedData, error: isAuthorizedError } =
      //   await serverApi.github.auth.isAuthorized();

      // if (isAuthorizedError || !isAuthorizedData) {
      //   showNotification({
      //     message: "Unable to fetch authorization status",
      //     color: "danger",
      //   });
      //   setIsLoading(false);
      //   return;
      // }
      // setIsAuthorized(isAuthorizedData?.authorized);

      const { user, error } = await supabaseApi.auth.getUser(supabaseClient);

      if (error || !user) {
        showNotification({
          message: "Unable to fetch user",
          color: "danger",
        });
        setIsLoading(false);
        return;
      }

      const { data: reposData, error: reposError } =
        await supabaseApi.github.repos.getAll(supabaseClient, user.id);

      if (reposError || !reposData) {
        showNotification({
          message: "Unable to fetch repositories",
          color: "danger",
        });
        setIsLoading(false);
        return;
      }

      setRepos(reposData);
      setIsLoading(false);
    })();
  }, [showNotification]);

  if (isLoading) {
    return <PageLoader label="Loading dashboard" />;
  }

  // if (!isAuthorized) {
  //   return (
  //     <Link
  //       href={githubAuthUrl}
  //       className={buttonStyles({
  //         className:
  //           "min-w-fit absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
  //         color: "primary",
  //         radius: "full",
  //         size: "lg",
  //       })}
  //     >
  //       <GithubLogo className="flex-shrink-0" size={22} />
  //       Authorize with GitHub
  //     </Link>
  //   );
  // }

  if (repos.length === 0) {
    return (
      <>
        <Button
          className="min-w-fit absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          color="primary"
          radius="full"
          size="lg"
          onPress={onOpen}
        >
          <Plus className="flex-shrink-0" size={22} />
          Add package.json
        </Button>
        <AddReposModal
          isOpen={isOpen}
          onAdd={handleAdd}
          onOpenChange={onOpenChange}
        />
      </>
    );
  }

  return (
    <div>
      <div className="flex justify-end">
        <Button
          className="ml-auto"
          color="primary"
          radius="full"
          size="sm"
          onPress={onOpen}
        >
          <Plus size={18} />
          Add package.json
        </Button>
      </div>
      <AddReposModal
        isOpen={isOpen}
        onAdd={handleAdd}
        onOpenChange={onOpenChange}
      />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
}
