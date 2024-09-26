"use client";
import EventCard from "@/components/dashboard/event-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import { useReadContract } from '@starknet-react/core';
import eventAbi from '@/Abis/eventAbi.json'

type Props = {};

const page = (props: Props) => {

  const contractAddr = '0x05db5c273a4d43fb94758c49428c9c70fbb8185fe77cf91ccaacee8215cf1367';

  const { data, isError, isLoading, error } = useReadContract({
    functionName: "get_all_events",
    args: [],
    abi: eventAbi,
    address: contractAddr,
    watch: true,
  });

  console.log(data)

  return (
    <div>
      <div className="flex justify-between items-center my-4">
        <h1 className="text-white font-bold text-3xl">Events</h1>
        <Button className="font-semibold flex gap-3 text-light-black text-base p-4" >Create Event <Plus color="#14141A" size={20}  className="font-bold"/></Button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {data && data.length > 0 ? data.map((item : any) => (
          <EventCard event={item}/>
        )) : <h4>No events yets</h4> }
      </div>
      
      
    </div>
  );
};

export default page;
