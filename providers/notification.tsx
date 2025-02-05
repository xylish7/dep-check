"use client";

import { Alert, AlertProps } from "@heroui/alert";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import {
  useState,
  createContext,
  useCallback,
  useContext,
  useRef,
} from "react";
import { Button } from "@heroui/button";
import { X } from "@phosphor-icons/react/dist/ssr";
import useMedia from "@/hooks/useMedia";

export interface Notification {
  color: AlertProps["color"];
  message: string;
}

export interface NotificationContextProps {
  isOpen: boolean;
  notification: Notification;
  showNotification: (notification: Notification) => void;
  hideNotification: () => void;
}

interface ShowNotification {
  color: AlertProps["color"];
  message: string;
}

export const NotificationContext = createContext<NotificationContextProps>({
  isOpen: false,
  notification: {
    color: "success",
    message: "",
  },
  showNotification: () => undefined,
  hideNotification: () => undefined,
});

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState<Notification>({
    color: "success",
    message: "",
  });
  const timeoutId = useRef<NodeJS.Timeout>();

  const hideNotification = useCallback(() => setIsOpen(false), []);

  const showNotification = useCallback(
    ({ message, color }: ShowNotification) => {
      clearTimeout(timeoutId.current);
      setIsOpen(false);
      setIsOpen(true);
      setNotification({ message, color });
      timeoutId.current = setTimeout(() => {
        setIsOpen(false);
      }, 6000);

      // Clean up function to clear the timeout
      return () => clearTimeout(timeoutId.current);
    },
    []
  );

  return (
    <NotificationContext.Provider
      value={{
        isOpen,
        notification,
        showNotification: ({ message, color }: Notification) =>
          showNotification({ message, color }),
        hideNotification: () => hideNotification(),
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextProps {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}

export function Notification() {
  const { isOpen, notification, hideNotification } =
    useContext(NotificationContext);
  const isMobile = useMedia("(max-width: 764px)", true);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed md:left-auto md:bottom-4 md:right-4 md:max-w-lg z-[60]"
          exit={{ y: isMobile ? -60 : 60 }}
          initial={{ y: isMobile ? -60 : 60 }}
          animate={{ y: 0 }}
          transition={{ ease: "easeOut" }}
        >
          <Alert
            classNames={{
              base: clsx(
                "rounded-none md:rounded-md",
                getColor(notification.color)
              ),
            }}
            isClosable={false}
            variant="flat"
            color={notification.color}
            title={notification.message}
            endContent={
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color={notification.color}
                onPress={hideNotification}
              >
                <X size={20} />
              </Button>
            }
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
function getColor(color: AlertProps["color"]) {
  switch (color) {
    case "danger":
      return "dark:bg-danger-50";
    case "default":
      return "dark:bg-default-50";
    case "primary":
      return "dark:bg-primary-50";
    case "secondary":
      return "dark:bg-secondary-50";
    case "success":
      return "dark:bg-success-50";
    case "warning":
      return "dark:bg-warning-50";
    default:
      return undefined;
  }
}
