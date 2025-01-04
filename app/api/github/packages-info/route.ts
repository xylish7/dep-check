import { Octokit } from "@octokit/rest";
import { NextRequest, NextResponse } from "next/server";

const octokit = new Octokit({
  auth: "",
});

export async function POST(req: NextRequest) {
  const payload = (await req.json()) as { repo: string; owner: string };
  const { owner, repo } = payload;

  if (!owner || !repo) {
    return NextResponse.json(
      { message: "Owner and repo are required" },
      { status: 404 }
    );
  }

  try {
    const { data } = await octokit.repos.getContent({
      owner: owner as string,
      repo: repo as string,
      path: "package.json",
    });

    const content = Buffer.from(data.content, "base64").toString("utf-8");
    const packageJson = JSON.parse(content);

    return NextResponse.json(packageJson);
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
