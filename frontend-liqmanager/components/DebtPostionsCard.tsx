/* eslint-disable @next/next/no-img-element */
/**
 * eslint-disable @next/next/no-img-element
 *
 * @format
 */

/** @format */

import React from "react";

export type DebtPositionsProps = {
  name: string;
  saleAmount: string;
};

export default function DebtPositionsCard(props: DebtPositionsProps) {
  return (
    <div className="  flex flex-wrap justify-between gap-3 ">
      <section className="flex justify-between gap-3 ">
        <div className=" h-12 w-12 rounded-full bg-gray-100 p-1">
          <img width={200} height={200} src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${props.name}`} alt="avatar" />
        </div>
        <div className="text-sm">
            <p>{props.name}</p>
        </div>
      </section>
        <p>{props.saleAmount}</p>
    </div>
  );
}
