import { NextRequest, NextResponse } from "next/server";
import { run as ncuRun } from "npm-check-updates";

import {
  Dependency,
  GithubRepoRow,
  Package,
  Version,
} from "@/apis/local-storage";

export async function POST(req: NextRequest) {
  const payload = (await req.json()) as { repo: GithubRepoRow };
  const { repo } = payload;

  if (!repo) {
    return NextResponse.json(
      { message: "'repo' is required" },
      { status: 404 }
    );
  }

  try {
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

    const lastCheck = new Date().toISOString();
    repo.packages = packages;
    repo.last_check = lastCheck;

    return NextResponse.json({ data: repo, error: null });
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
