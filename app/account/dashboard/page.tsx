"use client";

import { useEffect, useRef, useState } from "react";
import { Upload } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";

import { useNotification } from "@/providers/notification";
import { PageLoader } from "@/components/page-loader";
import { GithubReposRow, supabaseApi } from "@/apis/supabase";
import { browserClient } from "@/supabase/clients/browser";
import { useDisclosure } from "@heroui/modal";
import { UploadPackageJsonModal } from "./_components/upload-package-json-modal";
import { getCountPerVersion, RepoCard } from "@/components/repo-card";
import { serverApi } from "@/apis/server";
import { storage } from "@/utils/local-storage";

const supabaseClient = browserClient();

export default function AccountPage() {
  const [sortBy, setSortBy] = useState<SortReposBy>(storage.getSortReposBy());
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

    setRepos((prevRepos) =>
      sortRepos([...prevRepos, { ...addedRepo, ...updates }], sortBy)
    );
  }

  function handleSortReposBy(sortBy: SortReposBy) {
    setSortBy(sortBy);
    storage.setSortReposBy(sortBy);
    setRepos(sortRepos(repos, sortBy));
  }

  /**
   * Handle fetching user and repositories
   */
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

      setRepos(sortRepos(reposData, sortBy));
      setIsLoading(false);
    })();
  }, [showNotification, sortBy]);

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
        <Dropdown>
          <DropdownTrigger color="primary" variant="flat">
            <Button>Sort by: {sortBy}</Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Single selection example"
            selectedKeys={sortBy}
            selectionMode="single"
            variant="flat"
            onSelectionChange={(selection) =>
              handleSortReposBy(selection.currentKey as SortReposBy)
            }
          >
            <DropdownItem key="name">name</DropdownItem>
            <DropdownItem key="major dep updates">
              major deps updates
            </DropdownItem>
            <DropdownItem key="major dev dep updates">
              major dev deps updates
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
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

function sortRepos(repos: GithubReposRow[], sortBy: SortReposBy) {
  if (sortBy === "name") {
    return repos.toSorted((a, b) => a.name.localeCompare(b.name));
  }

  if (sortBy === "major dep updates") {
    return repos.toSorted((a, b) => {
      let aUpdates = 0;
      let bUpdates = 0;

      if (a.packages) {
        const aCountPerVersion = getCountPerVersion(a.packages);
        aUpdates = aCountPerVersion.dep.major;
      }
      if (b.packages) {
        const bCountPerVersion = getCountPerVersion(b.packages);
        bUpdates = bCountPerVersion.dep.major;
      }

      return bUpdates - aUpdates;
    });
  }

  if (sortBy === "major dev dep updates") {
    return repos.toSorted((a, b) => {
      let aUpdates = 0;
      let bUpdates = 0;

      if (a.packages) {
        const aCountPerVersion = getCountPerVersion(a.packages);
        aUpdates = aCountPerVersion.devDep.major;
      }
      if (b.packages) {
        const bCountPerVersion = getCountPerVersion(b.packages);
        bUpdates = bCountPerVersion.devDep.major;
      }

      return bUpdates - aUpdates;
    });
  }

  return repos;
}

export type SortReposBy =
  | "name"
  | "major dep updates"
  | "major dev dep updates";
