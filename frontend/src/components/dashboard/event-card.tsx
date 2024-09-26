"use client";

import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { epochToDatetime } from "datetime-epoch-conversion";
import Link from "next/link";
import {feltToString}from '@/helpers/helper';

const EventCard = (event: any) => {
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

  console.log(event)
  // const { day, month, time, year } = epochToDatetime(startTime);


  return (
    <Card className="w-full max-w-96 border-0 py-4  border-muted rounded-2xl shadow-2xl bg-deep-blue">
      <Button className="bg-light-black text-white italic p-4 mb-2">{feltToString(event?.event.category)}</Button>
      <img
        src="/assets/about-image-podcast.jpg"
        alt="Event Image"
        className="object-cover w-full h-44"
      />
      <Link href={`/dashboard/explore-events/${event?.event.id}`}>
        <h2 className="text-white font-semibold px-6 py-2">{feltToString(event?.event.name)}</h2>
      </Link>
      <p className="text-white text-xs px-6">
      {feltToString(event?.event.description)}
      </p>
    </Card>
  );
};

export default EventCard;
