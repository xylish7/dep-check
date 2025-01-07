import { NextRequest, NextResponse } from "next/server";
import { run as ncuRun } from "npm-check-updates";

import { supabaseApi } from "@/apis/supabase";
import { serverClient } from "@/supabase/clients/server";

export async function POST(req: NextRequest) {
  const payload = (await req.json()) as { repoId: number };
  const { repoId } = payload;

  if (!repoId) {
    return NextResponse.json(
      { message: "repoId is required" },
      { status: 404 }
    );
  }

  try {
    const supabaseClient = await serverClient();

    const { user } = await supabaseApi.auth.getUser(supabaseClient);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { data: repo, error } = await supabaseApi.github.repos.get(
      supabaseClient,
      repoId
    );

    if (error || !repo) {
      return NextResponse.json({ message: "Repo not found" }, { status: 404 });
    }

    const parsedPackageJson = JSON.parse(repo.package_json);
    // Run ncu on the fetched package.json
    const latestVersions = await ncuRun({
      packageData: JSON.stringify(parsedPackageJson),
    });

    const updates = {
      dependencies: createDependencyObject(
        parsedPackageJson.dependencies,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ncu types are not exported
        latestVersions as any
      ),
      devDependencies: createDependencyObject(
        parsedPackageJson.devDependencies,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ncu types are not exported
        latestVersions as any
      ),
    };

    supabaseApi.github.repos.update(supabaseClient, repoId, {
      updates,
    });

    return NextResponse.json({ data: updates });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

type DependencyType = "major" | "minor" | "patch" | "major-zero" | undefined;

interface Dependency {
  current: string;
  last: string;
  type: DependencyType;
}

function getVersionType(current: string, last: string): DependencyType {
  if (current === last) return undefined;
  const [curMajor, curMinor, curPatch] = current.split(".").map(Number);
  const [lastMajor, lastMinor, lastPatch] = last.split(".").map(Number);

  if (curMajor === 0 || lastMajor === 0) return "major-zero";
  if (curMajor !== lastMajor) return "major";
  if (curMinor !== lastMinor) return "minor";
  if (curPatch !== lastPatch) return "patch";

  return undefined;
}

function createDependencyObject(
  dependencies: Record<string, string>,
  latestVersions: Record<string, string>
) {
  const result: Record<string, Dependency> = {};

  if (dependencies) {
    Object.keys(dependencies).forEach((key) => {
      const current = dependencies[key];
      const last = latestVersions[key] || current;
      result[key] = {
        current,
        last,
        type: getVersionType(current, last),
      };
    });
  }
  return result;
}
