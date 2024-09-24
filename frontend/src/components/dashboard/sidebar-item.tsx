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
        className={`normalLink py-3 px-4 mt-2 flex items-center mx-6 rounded-md`}
      >
        <div>{menu.icon}</div>
        <div className="ml-3 text-lg font-semibold">{menu.title}</div>
      </div>
    </Link>
  );
};

export default SidebarItem;
