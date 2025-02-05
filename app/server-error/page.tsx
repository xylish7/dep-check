import { DataPlaceholder } from "@/components/data-placeholder";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Headset, Warning } from "@phosphor-icons/react/dist/ssr";

export default function LoginErrorPage() {
  return (
    <DataPlaceholder
      actions={[
        <Button
          color="primary"
          as={Link}
          href="/contact"
          key="contact-me"
          size="lg"
          startContent={<Headset size={28} />}
          variant="flat"
        >
          Contact me
        </Button>,
      ]}
      icon={<Warning />}
      position="top"
      title="Oops.."
      subtitle="Something went wrong"
    />
  );
}
