"use client";

import { useEffect } from "react";
import { CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { User } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import { PageLoader } from "@/components/page-loader";
import { BlurredCard } from "@/components/blurred-card";
import { signIn } from "../actions";

interface LoginCardProps {
  user: User | null;
}

export default function LoginCard({ user }: LoginCardProps) {
  // const [hasAccepted, setHasAccepted] = useState(false);
  // const [isSelected, setIsSelected] = useState(false);
  // const [checkboxError, setError] = useState(false);
  // const { showNotification } = useNotification();
  const searchParams = useSearchParams();
  const router = useRouter();
  const route = searchParams.get("route");

  // useEffect(() => {
  //   const accepted = storage.getSignUpTermsAccepted();
  //   if (accepted) {
  //     setHasAccepted(true);
  //   }
  // }, []);

  // function handleCheckboxChange(isSelected: boolean) {
  //   setError(false);
  //   setIsSelected(isSelected);
  // }

  function handleSignIn() {
    // if (!hasAccepted && !isSelected) {
    //   setError(true);
    //   showNotification({
    //     message:
    //       "You must agree to the Terms and Conditions and Privacy Policy to continue.",
    //     color: "warning",
    //   });
    //   return;
    // }

    // if (isSelected) {
    //   storage.setSignUpTermsAccepted();
    // }

    signIn();
  }

  useEffect(() => {
    if (!user) {
      return;
    }

    router.replace("/account/dashboard");
  }, [route, user, router]);

  if (user) {
    return <PageLoader label="Redirecționează..." type="relative" />;
  }

  return (
    <BlurredCard className="p-4 max-w-md mx-auto mt-20 lg:mt-40">
      <CardHeader className="flex-col text-2xl font-semibold justify-center gap-3">
        <Image alt="" src="/images/logo.png" width={64} height={64} />
        Sign In
      </CardHeader>
      <CardBody className="mt-4">
        <p>
          Quick and secure authentication with your Google account, ensuring the
          protection of your information.
        </p>
      </CardBody>
      <CardFooter className="flex-col mt-8">
        {/* {!hasAccepted && (
          <LegalCheckbox
            isSelected={isSelected}
            isInvalid={checkboxError}
            onValueChange={handleCheckboxChange}
          />
        )} */}
        <Button
          className="mt-4"
          size="lg"
          fullWidth
          variant="flat"
          onPress={handleSignIn}
        >
          <Image
            alt="google logo"
            src="/assets/images/google-logo.svg"
            width={28}
            height={28}
          />
          Sign in with Google
        </Button>
      </CardFooter>
    </BlurredCard>
  );
}
