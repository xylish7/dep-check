"use client";

import { useEffect, useRef, useState } from "react";
import { Upload } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@nextui-org/button";

import { useNotification } from "@/providers/notification";
import { PageLoader } from "@/components/page-loader";
import { GithubReposRow, supabaseApi } from "@/apis/supabase";
import { browserClient } from "@/supabase/clients/browser";
import { useDisclosure } from "@nextui-org/modal";
import { UploadPackageJsonModal } from "./_components/upload-package-json-modal";
import { RepoCard } from "@/components/repo-card";
import { serverApi } from "@/apis/server";

const supabaseClient = browserClient();

export default function AccountPage() {
  const [repos, setRepos] = useState<GithubReposRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();
  const isInitialized = useRef(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Handle adding a repo
  async function handleUpload(file: File) {
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

    const content = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        resolve(event.target?.result as string);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });

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

    const { data: updates, error } = await serverApi.dependencies.get(
      addedRepo.id
    );

    if (error || !updates) {
      showNotification({
        message: "Failed to check dependencies",
        color: "danger",
      });
      return;
    }

    console.log({ ...addedRepo, ...updates });
    setRepos((prevRepos) => [...prevRepos, { ...addedRepo, ...updates }]);
  }

  useEffect(() => {
    (async () => {
      if (isInitialized.current) return;

      isInitialized.current = true;
      setIsLoading(true);

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
          <Upload className="flex-shrink-0" size={22} />
          Upload package.json
        </Button>
        <UploadPackageJsonModal
          isOpen={isOpen}
          onUpload={handleUpload}
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
          onPress={onOpen}
        >
          <Upload size={20} />
          Upload package.json
        </Button>
      </div>
      <UploadPackageJsonModal
        isOpen={isOpen}
        onUpload={handleUpload}
        onOpenChange={onOpenChange}
      />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
}
