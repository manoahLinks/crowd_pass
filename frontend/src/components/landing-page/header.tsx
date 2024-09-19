import React, { useContext } from "react";
import { Button } from "../ui/button";

const Header = () => {

  return (
    <div className="rounded-full bg-white/70 flex justify-between items-center py-5 px-10 w-full">
      <img src="/assets/hostit-logo.png" height={30} width={150} />
      <div className="flex">
        <Button className="bg-deep-blue text-primary hover:bg-primary hover:text-deep-blue">
          Popular Events
        </Button>
      </div>
      <div className="flex gap-4">
      </div>
    </div>
  );
};

export default Header;