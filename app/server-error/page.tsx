import { DataPlaceholder } from "@/components/data-placeholder";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
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
