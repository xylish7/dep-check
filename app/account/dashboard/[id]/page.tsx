"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { useDisclosure } from "@heroui/modal";
import {
  ArrowLeft,
  ArrowsClockwise,
  Trash,
  Upload,
} from "@phosphor-icons/react/dist/ssr";

import { useNotification } from "@/providers/notification";
import { DependencyInfo, getCountPerVersion } from "@/components/repo-card";
import { serverApi } from "@/apis/server";
import { UploadPackageJsonModal } from "../_components/upload-package-json-modal";
import { PackagesTable } from "./_components/packages-table";
import { timeAgo } from "@/utils/time-ago";
import { GithubRepoRow, localStorageApi } from "@/apis/local-storage";

export default function RepositoryPage() {
  const [isChecking, setIsChecking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { id } = useParams() as { id: string };
  const [repo, setRepo] = useState<GithubRepoRow | null>();
  const { packages, last_check: lastCheck } = repo ?? {};
  const { showNotification } = useNotification();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    const repo = localStorageApi.repos.get(Number(id)).data;
    setRepo(repo);
  }, [id]);

  async function handleCheck() {
    if (!repo) {
      return;
    }

    setIsChecking(true);
    const { data: updatedRepo, error } = await serverApi.dependencies.get(repo);

    if (error || !updatedRepo) {
      showNotification({
        message: "Failed to check dependencies",
        color: "danger",
      });
      setIsChecking(false);
      return;
    }

    setIsChecking(false);
    localStorageApi.repos.update(repo.id, updatedRepo);
    setRepo(updatedRepo);
  }

  async function handleDelete() {
    if (!repo) {
      return;
    }

    setIsDeleting(true);
    const { error } = localStorageApi.repos.delete(repo.id);

    if (error) {
      showNotification({
        message: "Failed to delete repository",
        color: "danger",
      });
      setIsDeleting(false);
      return;
    }

    showNotification({
      message: "Repository successfully deleted",
      color: "success",
    });
    setIsDeleting(false);
    router.push("/account/dashboard");
  }

  async function handleUpload(file: File) {
    if (!repo) {
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

    const { data: updatedRepo, error: getDepsError } =
      await serverApi.dependencies.get({
        ...repo,
        name: parsedContent.name,
        package_json: content,
      });

    if (getDepsError || !updatedRepo) {
      showNotification({
        message: "Failed to check dependencies",
        color: "danger",
      });
      return;
    }

    const { error } = localStorageApi.repos.update(updatedRepo.id, updatedRepo);

    if (error) {
      showNotification({
        message: "Unable to update repository",
        color: "danger",
      });
      return;
    }

    setRepo(updatedRepo);
  }

  if (!repo) {
    return <div>Repository not found</div>;
  }

  const parsedPackageJson = JSON.parse(repo.package_json);
  const depCount = Object.keys(parsedPackageJson.dependencies).length;
  const devDepCount = Object.keys(parsedPackageJson.devDependencies).length;
  const packagesCount = getCountPerVersion(packages ?? []);

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <Button
            isIconOnly
            radius="full"
            variant="light"
            onPress={() => router.push("/account/dashboard")}
          >
            <ArrowLeft size={22} />
          </Button>
          <h1 className="text-2xl font-semibold">{repo.name}</h1>
        </div>

        <div className="flex gap-2">
          <Button isLoading={isChecking} variant="flat" onPress={handleCheck}>
            {isChecking ? null : <ArrowsClockwise size={20} />} Check Updates
          </Button>
          <Button variant="flat" onPress={onOpen}>
            <Upload size={20} />
            Upload package.json
          </Button>
          <Button
            color="danger"
            isLoading={isDeleting}
            variant="flat"
            onPress={handleDelete}
          >
            {isDeleting ? null : <Trash size={20} />} Delete
          </Button>
        </div>
      </div>
      <div className="flex gap-8 mt-8">
        <Card className="p-2 shrink-0 h-min">
          <CardBody>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col text-sm">
                <span className="text-default-500 font-semibold">
                  Last checked
                </span>

                <span>{lastCheck ? timeAgo(lastCheck) : "Never"}</span>
              </div>
              <div className="flex flex-col text-sm gap-1">
                <span className="text-default-500 font-semibold">Packages</span>
                <div className="flex gap-4 text-sm">
                  <span>{depCount} deps</span>
                  <span>{devDepCount} dev deps</span>
                </div>
              </div>
              <DependencyInfo title="Deps" count={packagesCount.dep} />
              <DependencyInfo title="Dev Deps" count={packagesCount.devDep} />
            </div>
          </CardBody>
        </Card>
        <div className="flex flex-col items-center w-full gap-2">
          <PackagesTable packages={packages ?? []} />
        </div>
      </div>
      <UploadPackageJsonModal
        isOpen={isOpen}
        onUpload={handleUpload}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}
