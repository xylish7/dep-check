"use client";

import { button as buttonStyles } from "@nextui-org/theme";
import { Link } from "@nextui-org/link";
import { UserCircle } from "@phosphor-icons/react/dist/ssr";
import { motion } from "framer-motion";
import Image from "next/image";

import { Section } from "@/components/section";
import { siteConfig } from "@/config/site";
import { title } from "@/utils/primitives";
import { Card, CardBody } from "@nextui-org/card";

export const HeroSection = () => {
  return (
    <>
      <Section className="mb-48">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col max-w-3xl text-center items-center">
            <motion.div
              className="opacity-0 translate-y-40"
              animate={{ y: [120, 0], opacity: [0, 1], scale: [0.5, 1] }}
              transition={{ ease: "easeOut", duration: 0.5 }}
            >
              <div className="relative w-20 h-20 lg:w-32 lg:h-32 mb-4">
                <Image
                  alt="Logo"
                  fill
                  priority
                  src="/images/logo.png"
                  sizes="(max-width: 1024px) 94px, 152px"
                />
              </div>
            </motion.div>

            <h1 className={title({ color: "primary", size: "xl" })}>
              {siteConfig.name}
            </h1>

            <span className="text-xl lg:text-2xl font-semibold mt-4">
              Never miss a new package update
            </span>
          </div>
          <div className="flex flex-row items-center justify-center mt-10 gap-8">
            <Link
              href="/account/dashboard"
              className={buttonStyles({
                className: "min-w-fit",
                color: "primary",
                fullWidth: true,
                radius: "full",
              })}
            >
              <UserCircle className="flex-shrink-0" size={22} />
              My account
            </Link>
          </div>
        </div>
      </Section>
      <Section>
        <Card className="w-full mx-auto">
          <CardBody className="flex flex-row items-center">
            <iframe
              className="w-full h-[600px] outline-none"
              src="https://www.youtube.com/embed/2ktKRhoRUH4"
            ></iframe>
          </CardBody>
        </Card>
      </Section>
    </>
  );
};
