"use client";

import React from "react";
import { Button } from "../ui/button";
import {
  argent,
  braavos,
  useAccount,
  useConnect,
  useInjectedConnectors,
} from "@starknet-react/core";
import { useRouter } from "next/navigation";
import Preloader from "../Preloader";

const ConnectWallet = () => {
  const router = useRouter();
  const { address } = useAccount();
  const { connectAsync, status } = useConnect();
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "onlyIfNoConnectors",
    order: "random",
  });

  React.useEffect(() => {
    if (address) {
      router.push("/dashboard");
    }
  }, [address, router]);

  return (
    <div>
        {status === "pending" && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <Preloader />
        </div>
      )}
      {connectors.map((connector) => (
        <Button
          className="bg-primary text-light-black hover:bg-primary hover:text-deep-blue ml-4"
          key={connector.name}
          onClick={async () => await connectAsync({ connector })}
        >
          Connect {connector.name}
        </Button>
      ))}
    </div>
  );
};

export default ConnectWallet;
