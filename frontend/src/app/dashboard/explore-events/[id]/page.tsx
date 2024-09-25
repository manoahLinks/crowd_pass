import { Button } from "@/components/ui/button";
import React from "react";
import { BsCash } from "react-icons/bs";
import { MdCancel } from "react-icons/md";

type Props = {};

const page = (props: Props) => {
  const attendee = true;
  return (
    <div>
      <div className="flex justify-between items-center my-4">
        <h1 className="text-white font-bold text-3xl">Event details</h1>
        {attendee === true ? (
          <Button className="font-semibold flex gap-3 text-light-black text-base p-4">
            Buy Ticket{" "}
            <BsCash color="#14141A" size={20} className="font-bold" />{" "}
          </Button>
        ) : (
          <Button className="font-semibold flex gap-3 text-light-black text-base p-4">
            Cancel Event{" "}
            <MdCancel color="#14141A" size={20} className="font-bold" />
          </Button>
        )}
      </div>
      <div className="flex gap-10 items-start">
        <img
          src="/assets/about-image-podcast.jpg"
          alt="Event Image"
          className="object-cover w-[45%] rounded-2xl"
        />
        <div className="flex flex-col gap-10">
          <h1 className="text-white font-bold text-3xl">
            DEVCON - Developer’s Conference 24
          </h1>
          <p className="text-white text-base ">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus,
            inventore consequuntur ipsam eaque quo iure a voluptatum, est
            dolores sit tenetur molestiae expedita suscipit atque minus quia,
            fugit temporibus excepturi animi magni. Excepturi aperiam soluta,
            fuga natus quas officia vero.
          </p>
          <hr className="h2 text-white w-full " />
          <div className="flex gap-6 items-center">
            <h1 className="text-white font-bold text-4xl">$2000</h1>
            <p className="text-white font-extralight text-5xl">|</p>
            <h1 className="text-white font-bold text-4xl">500</h1>
            <p className="text-white font-extralight text-5xl">|</p>
            <h1 className="text-white font-bold text-4xl">200</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
