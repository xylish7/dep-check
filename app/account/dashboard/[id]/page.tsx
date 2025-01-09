"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { Card, CardBody } from "@nextui-org/card";
import {
  ArrowLeft,
  ArrowsClockwise,
  Trash,
} from "@phosphor-icons/react/dist/ssr";

import { browserClient } from "@/supabase/clients/browser";
import { GithubReposRow, supabaseApi } from "@/apis/supabase";
import { useNotification } from "@/providers/notification";
import { PageLoader } from "@/components/page-loader";
import { DependencyInfo, getCountPerVersion } from "@/components/repo-card";
import { serverApi } from "@/apis/server";

const supabaseClient = browserClient();

export default function RepositoryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [packages, setPackages] = useState<GithubReposRow["packages"] | null>(
    null
  );
  const { id } = useParams() as { id: string };
  const [repo, setRepo] = useState<GithubReposRow | null>(null);
  const { showNotification } = useNotification();
  const router = useRouter();

  async function handleCheck() {
    if (!repo) {
      return;
    }

    setIsChecking(true);
    const { data, error } = await serverApi.dependencies.get(repo.id);

    if (error) {
      showNotification({
        message: "Failed to check dependencies",
        color: "danger",
      });
      setIsChecking(false);
      return;
    }

    setIsChecking(false);
    setPackages(data);
  }

  async function handleDelete() {
    if (!repo) {
      return;
    }

    setIsDeleting(true);
    const { error } = await supabaseApi.github.repos.delete(
      supabaseClient,
      repo.id
    );

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

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { data, error } = await supabaseApi.github.repos.get(
        supabaseClient,
        Number(id)
      );

      if (error) {
        showNotification({
          message: "Failed to load repository",
          color: "danger",
        });
        return;
      }

      setRepo(data);
      setPackages(data?.packages ?? []);
      setIsLoading(false);
    })();
  }, [id]);

  if (isLoading) {
    return <PageLoader label="Loading..." />;
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
          <Button
            isLoading={isChecking}
            size="sm"
            variant="flat"
            onPress={handleCheck}
          >
            {isChecking ? null : <ArrowsClockwise size={18} />} Check Updates
          </Button>
          <Button
            color="danger"
            isLoading={isDeleting}
            size="sm"
            variant="flat"
            onPress={handleDelete}
          >
            {isDeleting ? null : <Trash size={18} />} Delete
          </Button>
        </div>
      </div>
      <div className="flex gap-8 mt-8">
        <Card className="p-2 flex-shrink-0 h-min">
          <CardBody>
            <div className="flex flex-col gap-4">
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
        <Table aria-label="Example table with dynamic content">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={repo.packages ?? []}>
            {(item) => (
              <TableRow key={item.name}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const columns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "current",
    label: "CURRENT",
  },
  {
    key: "last",
    label: "LATEST",
  },
  {
    key: "version",
    label: "VERSION",
  },
];
