"use client";

import React from "react";
import { Card, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { epochToDatetime } from "datetime-epoch-conversion";
import Link from "next/link";

const EventCard = () => {
  // const {
  //   organizer,
  //   eventName,
  //   eventId,
  //   eventAddress,
  //   isCancelled,
  //   startTime,
  //   endTime,
  //   description,
  // } = event;
  // const { day, month, time, year } = epochToDatetime(startTime);

  return (
    <Card className="w-full max-w-96 border-0 py-4  border-muted rounded-2xl shadow-2xl bg-deep-blue">
      <Button className="bg-light-black text-white italic p-4 mb-2">Paid</Button>
      <img
        src="/assets/about-image-podcast.jpg"
        alt="Event Image"
        className="object-cover w-full h-44"
      />
      <Link href={"/dashboard/explore-events/1"}>
        <h2 className="text-white font-semibold px-6 py-2">DEVCON 2024</h2>
      </Link>
      <p className="text-white text-xs px-6">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam minima
        expedita, voluptatum natus dignissimos cum?{" "}
      </p>
    </Card>
  );
};

export default EventCard;
