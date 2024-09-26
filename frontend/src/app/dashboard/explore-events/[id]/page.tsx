"use client";

import { Button } from "@/components/ui/button";
import { useReadContract, useAccount } from "@starknet-react/core";
import { useParams } from "next/navigation";
import React from "react";
import { BsCash } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import eventAbi from "../../../../Abis/eventAbi.json";
import { feltToString } from "@/helpers/helper";
import { CallData, Contract, ProviderInterface, RpcProvider, Uint256, cairo } from "starknet";
import token_abi from '@/Abis/strkAbi.json';

type Props = {};

const page = (props: Props) => {
  const params = useParams<{ id: string }>();
  const contractAddr =
    "0x05db5c273a4d43fb94758c49428c9c70fbb8185fe77cf91ccaacee8215cf1367";

  const STRK_SEPOLIA = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

  const { account, address } = useAccount();

  // RPC PROVIDER
  const provider = new RpcProvider({
    nodeUrl: "https://starknet-sepolia.public.blastapi.io",
  });

  // STRK SEPOLIA CONTRACT
  const strk_contract = new Contract(token_abi, STRK_SEPOLIA, provider);

  const { data } = useReadContract({
    functionName: "get_event",
    args: [Number(params.id)],
    abi: eventAbi,
    address: contractAddr,
    watch: true,
  });
  console.log(data);
  const attendee = true;

  // --------------implement buy ticket ------

  const handle_buy_ticket = async () => {
    try {
      if (!account) {
        return;
      }

      const approvedAmt: Uint256 = cairo.uint256(Number(data?.ticket_price) * 1e18);
      strk_contract.connect(account);
      const multicall = await account?.execute([
        // approve contract to spend ticket Amount
        {
          contractAddress: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
          entrypoint: "approve",
          calldata: CallData.compile({
            spender: contractAddr,
            amount: approvedAmt
          })
        },

        // purchase ticket
        {
          contractAddress: contractAddr,
          entrypoint: "purchase_ticket",
          calldata: CallData.compile({
            _event_id: Number(params.id)
          })
        }
      ])

      if(!multicall) {
        return
      }

      await provider.waitForTransaction(multicall.transaction_hash)
      
    } catch (error: any) {
      console.log(error.message);

    }finally{
      console.log('done')
    }

  }

  // -----------------------------------------
  return (
    <div>
      <div className="flex justify-between items-center my-4">
        <h1 className="text-white font-bold text-3xl">Event details</h1>
        {attendee === true ? (
          <Button onClick={handle_buy_ticket} className="font-semibold flex gap-3 text-light-black text-base p-4">
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
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-10">
            <h1 className="text-white font-bold text-3xl">
              {data ? feltToString(data.name) : ""}
            </h1>
            <p className="text-white text-base ">
              {data ? feltToString(data?.description) : ""}
            </p>
          </div>
          <div className="flex flex-col gap-10">
          <hr className="h2 text-white w-full " />
          <div className="flex gap-6 items-center">
            <div className="flex flex-col">
              <h1 className="text-white font-bold text-4xl">{`$STRK ${
                Number(data?.ticket_price) / 1e18
              }`}</h1>
              <p className="text-sm text-white italic text-right">per ticket</p>
            </div>

            <p className="text-white font-extralight text-5xl">|</p>

            <div className="flex flex-col">
              <h1 className="text-white font-bold text-4xl">
                {Number(data?.total_tickets)}
              </h1>
              <p className="text-sm text-white italic text-right">
                Total tickets
              </p>
            </div>

            <p className="text-white font-extralight text-5xl">|</p>

            <div className="flex flex-col">
              <h1 className="text-white font-bold text-4xl">
                {Number(data?.tickets_sold)}
              </h1>
              <p className="text-sm text-white italic text-right">
                sold tickets
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
