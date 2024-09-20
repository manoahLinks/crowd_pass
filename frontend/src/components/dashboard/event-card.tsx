"use client"

import React from "react";
import { Card, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import {CalendarIcon, MapPinIcon} from "lucide-react"
import { epochToDatetime } from 'datetime-epoch-conversion';
import Link from "next/link";



const EventCard = ({ event}: any) => {
  const { organizer, eventName, eventId, eventAddress, isCancelled, startTime, endTime, description } = event;
  const {day, month, time, year} = epochToDatetime(startTime)

  return (
    <Card className="w-full max-w-md p-4 border border-muted rounded-lg shadow-2xl">
      <img
        src="/assets/about-image-podcast.jpg"
        alt="Event Image"
        className="rounded-t-lg object-cover w-full h-48"
      />
      <div className="mt-4 space-y-2">
        <h3 className="text-2xl font-semibold text-deep-blue">{eventName}</h3>
        <p className="text-sm text-muted-foreground text-deep-blue">
          {description}
        </p>
        <div className="gap-2 flex flex-col">
        <div className="flex items-center space-x-2 text-muted-foreground text-deep-blue">
          <CalendarIcon className="w-5 h-5" />
          <span>{`${day} ${month}, ${year} ${time}`}</span>
        </div>
        <div className="flex items-center space-x-2 text-muted-foreground text-deep-blue">
          <MapPinIcon className="w-5 h-5" />
          <span>{eventAddress}</span>
        </div>
        </div>
        
       
      </div>
        <CardFooter className="w-full bg-base-white p-4 flex items-center justify-center">
          <Link href={`/events/${eventId}`} className="w-full">
            <Button
              variant="outline"
              className="text-deep-blue border-deep-blue w-full"
            >
              View Details
            </Button>
          </Link>
        </CardFooter>
    </Card>
  );
};

export default EventCard;


