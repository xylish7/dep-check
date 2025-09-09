import { Link } from "@heroui/link";
import Image from "next/image";

export function PersonalWebsiteLink() {
  return (
    <Link isExternal href="https://filipf.com">
      <Image
        src="https://avatars.githubusercontent.com/u/24867712?size=48"
        alt="Filip's avatar"
        width={24}
        height={24}
        className="rounded-full"
      />
    </Link>
  );
}
