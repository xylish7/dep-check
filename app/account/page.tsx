import { githubAppClientId } from "@/config/env";
import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import { GithubLogo } from "@phosphor-icons/react/dist/ssr";

export default function AccountPage() {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubAppClientId}&scope=repo,user`;

  return (
    <Link
      href={githubAuthUrl}
      className={buttonStyles({
        className: "min-w-fit",
        color: "primary",
        radius: "full",
        size: "lg",
      })}
    >
      <GithubLogo className="flex-shrink-0" size={22} />
      Authorize with GitHub
    </Link>
  );
}
