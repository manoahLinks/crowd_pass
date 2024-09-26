"use client"

import React, { useState } from 'react'
import {   Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle, } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import axios from "axios";
// import { cairo } from 'starknet'
// import { Contract, RpcProvider } from 'starknet'
// import eventAbi from '@/Abis/eventAbi.json'
// import { useAccount } from "@starknet-react/core";

type Props = {}

const page = (props: Props) => {
  const [selectedFile, setSelectedFile] = useState("");
  const [isSubmitting, setIsSubmmiting] = useState(false);
  const [eventName, setEventName] = useState("")
  const [description, setDescription] = useState("")
  const [cid, setCid] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")
  const [eventType, setEventType] = useState("")
  const [startDate, setStartDate] = useState(Date.now().toString())
  const [endDate, setEndDate] = useState(Date.now().toString())
  const [ticketPrice, setTicketPrice] = useState(0)
  const [totalTickets, setTotalTickets] = useState(0)

  const handleSelectImage = ({ target }: any) => {
    setSelectedFile(target.files[0]);
  };

  const uploadImageToIPFS = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
            pinata_secret_api_key:
            process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
          },
        }
      );

      const cid = response.data.IpfsHash;
      setCid(cid);
      return cid;
    } catch (error) {
    }
  };

  const handleSubmit= async () => {
    setIsSubmmiting(true)
    const toast1 = toast.loading("Creating Events");
    const eventImage = await uploadImageToIPFS()
    const _start_date = new Date(startDate).getTime() / 1000;
    const _end_date = new Date(endDate).getTime() / 1000;

    try {

      toast.remove(toast1);
      toast.success("Event Created");
      setIsSubmmiting(false)
    } catch (error) {
      toast.remove(toast1);
      toast.error("error creating event");
      setIsSubmmiting(false)
      console.log(error);
    }
  }

  return (
    <div className="w-full mt-10 flex justify-center items-center">
        <Card className="w-full bg-light-black border-0 border-none max-w-2xl shadow-2xl mb-4">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Create New Event</CardTitle>
            <CardDescription className="text-white text-xs">
              Fill out the details for your upcoming event.
            </CardDescription>
          </CardHeader>
         
              <form onSubmit={handleSubmit}>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 flex flex-col">
                      <label htmlFor="name" className="text-white">
                        Event Name
                      </label>
                      <input
                      className="rounded-md"
                        type="text"
                        name="name"
                        placeholder={"input your name"}
                        onChange={(e) => setEventName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <label htmlFor="email" className="text-white">
                        Ticket Price <span className='italic text-xs'>(in strk)</span>
                      </label>
                      <input
                      className="rounded-md"
                        type="number"
                        name="ticket_price"
                        placeholder={"enter ticket price in strk"}
                        onChange={(e) => setTicketPrice(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 flex flex-col">
                      <label htmlFor="ticket-price" className="text-white">
                        Total Tickets
                      </label>
                      <input
                      className="rounded-md"
                        type="number"
                        name="total_ticket"
                        placeholder={"input event city"}
                        onChange={(e) => setTotalTickets(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <label htmlFor="ticket-price" className="text-white">
                        Location
                      </label>
                      <input
                      className="rounded-md"
                        type="text"
                        name="Location"
                        placeholder={"input event country"}
                        onChange={(e) => setLocation(e.target.value)}

                      />
                      
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 flex flex-col">
                      <label
                        htmlFor="event-category"
                        className="text-white"
                      >
                        Event Category
                      </label>
                      <select
                      className="rounded-md"
                        name="eventCategory"
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value={"free"}>Free</option>
                        <option value={"paid"}>Paid</option>
                        <option value={"private"}>Private</option>
                      </select>
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <label htmlFor="event-type" className="text-white">
                        Event Type
                      </label>
                      <select
                      className="rounded-md"
                        name="virtual_event"
                        onChange={(e) => setEventType(e.target.value)}
                      >
                        <option value={"physical"}>Physical</option>
                        <option value={"virtual"}>Virtual</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 flex flex-col">
                      <label htmlFor="start-date" className="text-white">
                        Start Date
                      </label>
                      <input
                      className="rounded-md"
                        name="start_time"
                        type="datetime-local"
                        onChange={(e) => setStartDate(e.target.value)}

                      />
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <label htmlFor="start-date" className="text-white">
                        End Date
                      </label>
                      <input
                      className="rounded-md"
                        name="end_time"
                        type="datetime-local"
                        onChange={(e) => setEndDate(e.target.value)}

                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 flex flex-col">
                      <label htmlFor="start-date" className="text-white">
                        Event Description
                      </label>
                      <textarea
                      className="rounded-md"
                        name="description"
                        placeholder={"Describe your event..."}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                   
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <label htmlFor="start-date" className="text-white">
                        Event Image
                      </label>
                      <input
                        type="file"
                        name="img"
                        accept="image/*"
                        onChange={handleSelectImage} />
                      <div className="text-red-900 text-sm"></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    className="text-light-black hover:text-white bg-primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Event..." : "Create Event"}
                  </Button>
                </CardFooter>
              </form>
        
        </Card>
      </div>
  )
}

export default page