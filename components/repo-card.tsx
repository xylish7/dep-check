import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { button as buttonStyles } from "@heroui/theme";
import { ArrowsClockwise, Eye } from "@phosphor-icons/react/dist/ssr";

import { GithubReposRow, Package } from "@/apis/supabase";
import { serverApi } from "@/apis/server";
import { useNotification } from "@/providers/notification";
import { Link } from "@heroui/link";
import { timeAgo } from "@/utils/time-ago";

interface RepoCardProps {
  repo: GithubReposRow;
}

export function RepoCard({ repo }: RepoCardProps) {
  const [packages, setPackages] = useState<Package[] | null>(repo.packages);
  const [lastCheck, setLastCheck] = useState(repo.last_check);
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const parsedPackageJson = JSON.parse(repo.package_json);
  const depCount = Object.keys(parsedPackageJson.dependencies).length;
  const devDepCount = Object.keys(parsedPackageJson.devDependencies).length;
  const packagesCount = getCountPerVersion(packages ?? []);

  async function handleCheck() {
    setIsLoading(true);
    const { data, error } = await serverApi.dependencies.get(repo.id);

    if (error || !data) {
      showNotification({
        message: "Failed to check dependencies",
        color: "danger",
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setPackages(data.packages);
    setLastCheck(data.last_check);
  }

  return (
    <Card className="p-2">
      <CardHeader className="flex justify-between items-start">
        <span className="text-lg font-semibold">{repo.name}</span>
        <div className="flex flex-col text-xs text-default-500 mt-1">
          <span>Last checked</span>
          <span>{lastCheck ? timeAgo(lastCheck) : "Never"}</span>
        </div>
      </CardHeader>
      <CardBody>
        {packages ? (
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
        ) : (
          <div className="flex justify-center py-4 my-auto">
            <Button isLoading={isLoading} variant="flat" onPress={handleCheck}>
              {isLoading ? null : <ArrowsClockwise size={20} />} Check Updates
            </Button>
          </div>
        )}
      </CardBody>
      {packages ? (
        <CardFooter className="gap-2 justify-end pt-6">
          <Button
            isLoading={isLoading}
            size="sm"
            variant="flat"
            onPress={handleCheck}
          >
            {isLoading ? null : <ArrowsClockwise size={18} />} Check Updates
          </Button>
          <Link
            href={`/account/dashboard/${repo.id}`}
            className={buttonStyles({ size: "sm", variant: "flat" })}
          >
            <Eye size={18} /> View
          </Link>
        </CardFooter>
      ) : null}
    </Card>
  );
}

interface DependencyInfoProps {
  title: string;
  count: {
    major: number;
    minor: number;
    patch: number;
    total: number;
  };
}

export function DependencyInfo({ title, count }: DependencyInfoProps) {
  return (
    <div className="flex flex-col text-sm gap-1">
      <span className="text-default-500 font-semibold">{title}</span>
      <div className="grid grid-cols-3 gap-4 text-default-500">
        {Boolean(count.major) && (
          <span className="text-rose-600">{count.major} major</span>
        )}
        {Boolean(count.minor) && (
          <span className="text-yellow-600">{count.minor} minor</span>
        )}
        {Boolean(count.patch) && (
          <span className="text-green-600">{count.patch} patch</span>
        )}
        {count.total === 0 && (
          <span className="text-default-500">No updates</span>
        )}
      </div>
    </div>
  );
}

export function getCountPerVersion(packages?: Package[]) {
  const count = {
    dep: {
      major: 0,
      minor: 0,
      patch: 0,
      total: 0,
    },
    devDep: {
      major: 0,
      minor: 0,
      patch: 0,
      total: 0,
    },
  };

  if (!packages) {
    return count;
  }

  for (const dep of packages) {
    if (dep.depType === "dep") {
      if (dep.version === "major") {
        count.dep.major += 1;
        count.dep.total += 1;
      } else if (dep.version === "minor") {
        count.dep.minor += 1;
        count.dep.total += 1;
      } else if (dep.version === "patch") {
        count.dep.patch += 1;
        count.dep.total += 1;
      }
    } else {
      if (dep.version === "major") {
        count.devDep.major += 1;
        count.devDep.total += 1;
      } else if (dep.version === "minor") {
        count.devDep.minor += 1;
        count.devDep.total += 1;
      } else if (dep.version === "patch") {
        count.devDep.patch += 1;
        count.devDep.total += 1;
      }
    }
  }

  return count;
}
