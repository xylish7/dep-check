import { title } from "@/utils/primitives";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { House, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <div className="h-[50vh] w-full relative">
      <div className="flex flex-col items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
        <MagnifyingGlass
          className="text-primary mb-4"
          size={72}
          weight="duotone"
        />
        <h1 className={title({ color: "primary" })}>404 - Not Found</h1>
        <p className="text-xl text-default-500 font-semibold mb-8">
          Could not find requested resource
        </p>
        <Button
          color="primary"
          as={Link}
          href="/"
          size="lg"
          startContent={<House size={28} />}
          variant="flat"
        >
          Return Home
        </Button>
      </div>
    </div>
  );
}
