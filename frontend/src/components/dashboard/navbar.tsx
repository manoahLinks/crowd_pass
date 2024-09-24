"use client"

import React from "react";
import { BiSolidMessageDetail } from "react-icons/bi";
import { FaBell } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex gap-6">
        <input
          type="text"
          placeholder="Search"
          className="p-2 h-11 w-80 text-white bg-transparent border-2 rounded-lg"
        />
        <div className="p-2.5 bg-primary rounded-full">
          <IoFilter size={25} className="text-light-black" />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="p-2.5 bg-primary rounded-full">
          <BiSolidMessageDetail size={25} className="text-light-black" />
        </div>
        <div className="p-2.5 bg-primary rounded-full">
          <FaBell size={25} className="text-light-black " />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
