"use client";

import { useState, useEffect } from "react";
import { Upload } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useDisclosure } from "@heroui/modal";

import { useNotification } from "@/providers/notification";
import { UploadPackageJsonModal } from "./_components/upload-package-json-modal";
import { getCountPerVersion, RepoCard } from "@/components/repo-card";
import { serverApi } from "@/apis/server";
import { storage } from "@/utils/local-storage";
import { GithubRepoRow, localStorageApi } from "@/apis/local-storage";

export default function AccountPage() {
  const [sortBy, setSortBy] = useState<SortReposBy>("name");
  const [repos, setRepos] = useState<GithubRepoRow[]>([]);
  // Hydration-safe: load from localStorage on client only
  useEffect(() => {
    const storedSort = storage.getSortReposBy();
    setSortBy(storedSort);
    const storedRepos = localStorageApi.repos.getAll().data;
    setRepos(sortRepos(storedRepos, storedSort));
  }, []);
  const { showNotification } = useNotification();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Handle adding a repo
  async function handleUpload(file: File) {
    const content = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        resolve(event.target?.result as string);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });

    const parsedContent = JSON.parse(content);

    const { data: addedRepo } = localStorageApi.repos.add({
      name: parsedContent.name,
      package_json: content as string,
      last_check: null,
      packages: null,
    });

    if (!addedRepo) {
      showNotification({
        message: "Failed to add repo",
        color: "danger",
      });
      return;
    }

    const { data: updatedRepo, error } = await serverApi.dependencies.get(
      addedRepo
    );

    if (error || !updatedRepo) {
      showNotification({
        message: "Failed to check dependencies",
        color: "danger",
      });
      return;
    }

    localStorageApi.repos.update(updatedRepo.id, updatedRepo);

    setRepos((prevRepos) =>
      sortRepos([...prevRepos, { ...updatedRepo }], sortBy)
    );
  }

  function handleSortReposBy(sortBy: SortReposBy) {
    setSortBy(sortBy);
    storage.setSortReposBy(sortBy);
    setRepos(sortRepos(repos, sortBy));
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

function sortRepos(repos: GithubRepoRow[], sortBy: SortReposBy) {
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
