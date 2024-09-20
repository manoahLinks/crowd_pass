"use client"

import React, { useState, useEffect } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import EventDetailsCard from "./event-details-cards";
import { Button } from "../ui/button";
import Link from "next/link";

const EventTabs = ({ pageTabs, data }:any) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [filteredEvents, setFilteredEvents] = useState([]);

  // useEffect(() => {
  //   if (pageTabs[tabIndex] === "Hosting") {
  //     setFilteredEvents(data.filter((event) => event.organizer === address));
  //   } else if (pageTabs[tabIndex] === "Attending") {
  //     setFilteredEvents(attendingEvent.data);
  //   } else {
  //     setFilteredEvents([]);
  //   }
  // }, [pageTabs, tabIndex, data, address]);

  return (
    <Tabs
      selectedIndex={tabIndex}
      onSelect={(index) => setTabIndex(index)}
      className="ml-3 md:w-3/5 whitespace-no-wrap"
    >
      <TabList className="flex gap-3 mb-2 overflow-x-auto md:w-full text-deep-blue mt-3">
        {pageTabs.map((pageTab: any, index:number) => (
          <Tab key={index} className={"text-deep-blue"}>
            <Button variant="outline" className="w-[140px] text-deep-blue border-deep-blue">{pageTab}</Button>
          </Tab>
        ))}
      </TabList>
      {pageTabs.map((pageTab: any, index:number) => (
        <TabPanel key={index}>
          <div className="h-[510px] overflow-y-scroll">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <EventDetailsCard key={index} event={event} />
              ))
            ) : (
              <>
                {tabIndex === 0 ? (
                  <div className="w-full h-full flex flex-col gap-8 justify-center items-center">
                    <h1 className="text-2xl text-deep-blue">
                      You have not created any event
                    </h1>
                    <Link href="/create-event">
                      <Button className="text-primary hover:text-deep-blue bg-deep-blue ">
                        Create Event
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col gap-8 justify-center items-center">
                    <h1 className="text-2xl text-deep-blue">
                      Explore events to attend
                    </h1>
                    <Link href="/events">
                      <Button className="text-primary hover:text-deep-blue bg-deep-blue">
                        Explore Events
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </TabPanel>
      ))}
    </Tabs>
  );
};

export default EventTabs;