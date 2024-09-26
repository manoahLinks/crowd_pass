"use client"

import DashboardAnalytics from '@/components/dashboard/dashboard-analytics';
import EventTabs from '@/components/dashboard/events-tabs';
import RecentActivities from '@/components/dashboard/recent-activities';
import { useReadContract } from '@starknet-react/core';
import React, { useState } from 'react'
import { TbLoaderQuarter } from 'react-icons/tb';
import eventAbi from "../../Abis/eventAbi.json"

type Props = {}

const page = (props: Props) => {
  const contractAddr = '0x04da2dd996dc36097f2f5b663db1ffa75466d32036d7bbdbe6719f768bdc5b26';

  const { data } = useReadContract({
    functionName: "get_event_count",
    args: [],
    abi: eventAbi,
    address: contractAddr,
    watch: true,
  });


  const [allEvents, setAllEvents] = useState({loading: false, data:[]});

  return (
    <>
      {
        allEvents.loading ?  <section className='w-full h-full fixed top-0 left-0 flex justify-center items-center layoutBg overflow-hidden z-[99999]'>
        <h2 className="text-deep-blue font-barlow text-lg md:text-xl flex items-center gap-1">
            <TbLoaderQuarter className="animate-spin text-4xl mr-3" />
            fetching Events...
        </h2>
    </section>: 
    <>
      <DashboardAnalytics
        eventAttended={0}
        eventHosted={0}
        totalEvents={data === undefined? 0 : Number(data)}
      />

      <div className="flex gap-2">
        <EventTabs pageTabs={["Hosting", "Attending"]} data={allEvents.data} />
        <RecentActivities />
      </div>
      </>
    }
    </>
  );
};

export default page