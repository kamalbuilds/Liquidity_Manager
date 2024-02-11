"use client"
import Link from "next/link"
import { useEffect } from "react";
import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

import { ConnectButton } from "@particle-network/connect-react-ui"
import '@particle-network/connect-react-ui/dist/index.css';
import { HeroSection } from "@/components/Hero/page";
import { FeaturesSection } from "@/components/Features";
// import { DeployMonitorAaveV3 } from "@/components/deploy/deploymonitoraavev3";
import { DeployLPSC } from "@/components/deploy/deploylpsc";
import { useConnectKit } from '@particle-network/connect-react-ui';

export default function IndexPage() {



  const connectKit = useConnectKit();
  const userInfo = connectKit.particle.auth.getUserInfo();
  console.log("User info: " + userInfo, connectKit);

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <HeroSection />
      <FeaturesSection />
    </section>
  )
}
