import { useState } from "react";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { button as buttonStyles } from "@nextui-org/theme";
import { ArrowsClockwise, Eye } from "@phosphor-icons/react/dist/ssr";

import { Dependencies, GithubReposRow, Updates } from "@/apis/supabase";
import { serverApi } from "@/apis/server";
import { useNotification } from "@/providers/notification";
import { Link } from "@nextui-org/link";

interface RepoCardProps {
  repo: GithubReposRow;
}

export function RepoCard({ repo }: RepoCardProps) {
  const [updates, setUpdates] = useState<Updates | null>(repo.updates);
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const parsedPackageJson = JSON.parse(repo.package_json);
  const depCount = Object.keys(parsedPackageJson.dependencies).length;
  const devDepCount = Object.keys(parsedPackageJson.devDependencies).length;
  const depUpdatesCount = getCountPerVersionType(updates?.dependencies);
  const devDepUpdatesCount = getCountPerVersionType(updates?.devDependencies);

  async function handleCheck() {
    setIsLoading(true);
    const { data, error } = await serverApi.dependencies.get(repo.id);

    if (error) {
      showNotification({
        message: "Failed to check dependencies",
        color: "danger",
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setUpdates(data);
  }

  return (
    <Card className="p-2">
      <CardHeader className="text-lg font-semibold">{repo.name}</CardHeader>
      <CardBody>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col text-sm gap-1">
            <span className="text-default-500 font-semibold">Packages</span>
            <div className="flex gap-4 text-sm">
              <span>{depCount} deps</span>
              <span>{devDepCount} dev deps</span>
            </div>
          </div>
          <DependencyInfo title="Deps" count={depUpdatesCount} />
          <DependencyInfo title="Dev Deps" count={devDepUpdatesCount} />
        </div>
      </CardBody>
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
          href="/account"
          className={buttonStyles({ size: "sm", variant: "flat" })}
        >
          <Eye size={18} /> View
        </Link>
      </CardFooter>
    </Card>
  );
}

interface DependencyInfoProps {
  title: string;
  count: {
    major: number;
    minor: number;
    patch: number;
    majorZero: number;
  };
}

function DependencyInfo({ title, count }: DependencyInfoProps) {
  return (
    <div className="flex flex-col text-sm gap-1">
      <span className="text-default-500 font-semibold">{title}</span>
      <div className="flex gap-4 text-default-500">
        <span className="text-rose-600">{count.major} major</span>
        <span className="text-yellow-600">{count.minor} minor</span>
        <span className="text-green-600">{count.patch} patch</span>
        <span className="text-indigo-600">{count.majorZero} major-zero</span>
      </div>
    </div>
  );
}

function getCountPerVersionType(dependencies?: Dependencies) {
  const count = {
    major: 0,
    minor: 0,
    patch: 0,
    majorZero: 0,
  };

  if (!dependencies) {
    return count;
  }

  Object.values(dependencies).forEach((dependency) => {
    if (dependency.type === "major") {
      count.major++;
    } else if (dependency.type === "minor") {
      count.minor++;
    } else if (dependency.type === "patch") {
      count.patch++;
    } else if (dependency.type === "major-zero") {
      count.majorZero++;
    }
  });

  return count;
}
