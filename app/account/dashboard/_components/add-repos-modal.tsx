import { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { PackageJsonDropzone } from "@/components/package-json-dropzone";
import { useNotification } from "@/providers/notification";

interface AddReposModalProps {
  isOpen: boolean;
  onAdd: (file: File) => void;
  onOpenChange: (isOpen: boolean) => void;
}

export function AddReposModal({
  isOpen,
  onAdd,
  onOpenChange,
}: AddReposModalProps) {
  const [file, setFile] = useState<File | null>(null);
  // const [repos, setRepos] = useState<GetGithubReposResponse["data"]>(null);
  // const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();

  // Handle adding a repo
  function handleAdd(onClose: () => void) {
    if (!file) {
      showNotification({
        message: "Please select a package.json file",
        color: "warning",
      });
      return;
    }

    onAdd(file);
    onClose();
  }

  // useEffect(() => {
  //   if (!isOpen) return;
  //   (async () => {
  //     setIsLoading(true);

  //     const { data: reposData, error: reposError } =
  //       await serverApi.github.repos.get();

  //     if (reposError) {
  //       showNotification({
  //         message: "Unable to fetch repos",
  //         color: "danger",
  //       });
  //       setIsLoading(false);
  //       return;
  //     }

  //     setRepos(reposData);

  //     setIsLoading(false);
  //   })();
  // }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      placement="top-center"
      size="sm"
      onOpenChange={onOpenChange}
      isDismissable={false}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Select package.json
            </ModalHeader>
            <ModalBody>
              <PackageJsonDropzone onFile={setFile} />
              {/* <Autocomplete
                isLoading={isLoading}
                label="Repositories"
                onSelectionChange={(e) => console.log(e)}
              >
                {(repos ?? []).map((repo) => (
                  <AutocompleteItem key={repo.name}>
                    {repo.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete> */}
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" size="sm" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                size="sm"
                onPress={() => handleAdd(onClose)}
              >
                Add
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
