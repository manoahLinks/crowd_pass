"use client"

import DashboardAnalytics from '@/components/dashboard/dashboard-analytics';
import EventTabs from '@/components/dashboard/events-tabs';
import RecentActivities from '@/components/dashboard/recent-activities';
import React, { useState } from 'react'
import { TbLoaderQuarter } from 'react-icons/tb';

type Props = {}

const page = (props: Props) => {
  const [allEvents, setAllEvents] = useState({loading: true, data:[]});

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
        totalEvents={0}
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