import { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { PackageJsonDropzone } from "@/components/package-json-dropzone";
import { useNotification } from "@/providers/notification";

interface UploadPackageJsonModal {
  isOpen: boolean;
  onUpload: (file: File) => Promise<void>;
  onOpenChange: (isOpen: boolean) => void;
}

export function UploadPackageJsonModal({
  isOpen,
  onUpload,
  onOpenChange,
}: UploadPackageJsonModal) {
  const [file, setFile] = useState<File | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { showNotification } = useNotification();

  // Handle adding a repo
  async function handleUpload(onClose: () => void) {
    if (!file) {
      showNotification({
        message: "Please select a package.json file",
        color: "warning",
      });
      return;
    }

    setIsAdding(true);
    await onUpload(file);
    setIsAdding(false);
    setFile(null);
    onClose();
  }

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
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                isLoading={isAdding}
                onPress={() => handleUpload(onClose)}
              >
                Upload
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
