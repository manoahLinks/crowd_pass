"use client"

import React from 'react';
import { Button } from '../ui/button';
import { argent, braavos, useAccount, useConnect, useInjectedConnectors } from '@starknet-react/core';
import { useRouter } from 'next/navigation';

const ConnectWallet = () => {
  const router = useRouter();
  const { address } = useAccount();
  const { connect } = useConnect();
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "onlyIfNoConnectors",
    order: "random",
  });

  React.useEffect(() => {
    if (address) {
      router.push('/dashboard');
    }
  }, [address, router]);

  return (
    <div>
      {connectors.map((connector) => (
        <Button className="bg-primary text-light-black hover:bg-primary hover:text-deep-blue ml-4" key={connector.name} onClick={() => connect({connector})}>
          Connect {connector.name}
        </Button>
      ))}
    </div>
  );
};

export default ConnectWallet;