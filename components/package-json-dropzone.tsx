import { useNotification } from "@/providers/notification";
import { useCallback, useState } from "react";

interface PackageJsonDropzoneProps {
  onFile: (file: File) => void;
}

export function PackageJsonDropzone({ onFile }: PackageJsonDropzoneProps) {
  const [fileName, setFileName] = useState("");

  const { showNotification } = useNotification();

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const content = JSON.parse(event.target?.result as string);
          if (content.dependencies || content.devDependencies) {
            setFileName(content.name || file.name);
            onFile(file);
          } else {
            showNotification({
              message: "The provided file seems to be an invalid package.json",
              color: "danger",
            });
          }
        } catch (error) {
          console.error("Failed to parse package.json", error);
          showNotification({
            message: "Failed to parse package.json",
            color: "danger",
          });
        }
      };
      reader.readAsText(file);
    },
    [showNotification, onFile]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length > 1) {
        alert("Please upload only one file.");
        return;
      }
      if (files.length > 0 && files[0].type === "application/json") {
        handleFile(files[0]);
      } else {
        alert("Please drop a valid JSON file.");
      }
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;

      if (!files) return;

      if (files.length > 1) {
        showNotification({
          message: "Please upload only one file.",
          color: "danger",
        });
        return;
      }
      if (files.length > 0 && files[0].type === "application/json") {
        handleFile(files[0]);
      } else {
        showNotification({
          message: "Please select a valid JSON file.",
          color: "danger",
        });
      }
    },
    [handleFile, showNotification]
  );

  return (
    <div
      className="flex items-center justify-center w-full"
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
    >
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-content2 hover:bg-content3"
      >
        <div className="flex flex-col items-center justify-center py-6">
          <p className="text-sm text-center text-default-700">
            {fileName
              ? fileName
              : "Click to upload or drag and drop your package.json file"}
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          accept="application/json"
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
