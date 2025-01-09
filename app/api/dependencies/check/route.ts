import { NextRequest, NextResponse } from "next/server";
import { run as ncuRun } from "npm-check-updates";

import { Dependency, Package, supabaseApi, Version } from "@/apis/supabase";
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

    const packages: Package[] = [
      ...createDependencyObject(
        parsedPackageJson.dependencies,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ncu types are not exported
        latestVersions as any,
        "dep"
      ),
      ...createDependencyObject(
        parsedPackageJson.devDependencies,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ncu types are not exported
        latestVersions as any,
        "devDep"
      ),
    ];

    supabaseApi.github.repos.update(supabaseClient, repoId, {
      packages,
    });

    return NextResponse.json({ data: packages });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
function getVersionType(current: string, last: string): Version | undefined {
  if (current === last) return undefined;
  const [curMajor, curMinor, curPatch] = current.split(".");
  const [lastMajor, lastMinor, lastPatch] = last.split(".");

  if (!last) return undefined;
  if (curMajor !== lastMajor) return "major";
  if (curMinor !== lastMinor) return "minor";
  if (curPatch !== lastPatch) return "patch";

  return undefined;
}

function createDependencyObject(
  dependencies: Record<string, string>,
  latestVersions: Record<string, string>,
  depType: Dependency
): Package[] {
  if (dependencies) {
    const packages: Package[] = Object.keys(dependencies).map((key) => ({
      name: key,
      current: dependencies[key],
      last: latestVersions[key] ?? dependencies[key],
      depType,
      version: getVersionType(dependencies[key], latestVersions[key] ?? ""),
    }));

    return packages;
  }
  return [];
}
