"use client"

import Link from "next/link";
import React from "react";

const SidebarItem = ({ menu }: any) => {
  return (
    <Link
      href={menu.url}
      className={`${({ isActive }: any) => (isActive ? "bg-primary" : "")}`}
    >
      <div
        className={`normalLink py-3 px-10 mt-2 flex items-center rounded-l-full`}
      >
        <div>{menu.icon}</div>
        <div className="ml-4 text-lg font-semibold">{menu.title}</div>
      </div>
    </Link>
  );
};

export default SidebarItem;
