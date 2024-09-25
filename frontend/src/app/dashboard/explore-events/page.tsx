import EventCard from "@/components/dashboard/event-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <div className="flex justify-between items-center my-4">
        <h1 className="text-white font-bold text-3xl">Events</h1>
        <Button className="font-semibold flex gap-3 text-light-black text-base p-4" >Create Event <Plus color="#14141A" size={20}  className="font-bold"/></Button>
      </div>
      <EventCard />
    </div>
  );
};

export default page;
