"use client";
import { useAccountInfo, useConnectKit } from '@particle-network/connect-react-ui';
import working from "@/components/assets/howitworks.png";
import Image from "next/image";

export default function Working() {


  const connectKit = useConnectKit();
  const getUserInfo = useAccountInfo();

  console.log(getUserInfo,"user")
    // const userInfo = connectKit.particle.auth.getUserInfo();
  // console.log("User info: " + userInfo, connectKit);

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <Image src={working} alt="working" />
    </section>
  )
}
