import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { ArrowsClockwise } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

import { GithubReposRow, Updates } from "@/apis/supabase";
import { serverApi } from "@/apis/server";
import { useNotification } from "@/providers/notification";

interface RepoCardProps {
  repo: GithubReposRow;
}

export function RepoCard({ repo }: RepoCardProps) {
  const [updates, setUpdates] = useState<Updates | null>(repo.updates);
  const { showNotification } = useNotification();
  const parsedJson = JSON.parse(repo.package_json);
  const dependenciesCount = Object.keys(parsedJson.dependencies).length;
  const devDependenciesCount = Object.keys(parsedJson.devDependencies).length;

  async function handleCheck() {
    const { data, error } = await serverApi.dependencies.get(repo.id);

    if (error) {
      showNotification({
        message: "Failed to check dependencies",
        color: "danger",
      });
      return;
    }

    setUpdates(data);
  }

  console.log(updates);
  return (
    <Card className="p-2">
      <CardHeader>{repo.name}</CardHeader>
      <CardBody>
        <div>
          <p>
            <strong>Dependencies:</strong> {dependenciesCount}
          </p>
          <p>
            <strong>Dev Dependencies:</strong> {devDependenciesCount}
          </p>
        </div>
      </CardBody>
      <CardFooter className="justify-end">
        <Button color="primary" size="sm" variant="flat" onPress={handleCheck}>
          <ArrowsClockwise size={18} /> Check
        </Button>
      </CardFooter>
    </Card>
  );
}
