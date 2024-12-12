// src/context/NetworkContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { Network } from 'vis-network';

interface NetworkContextProps {
  network: Network | null;
  setNetwork: (network: Network) => void;
}

const NetworkContext = createContext<NetworkContextProps>({
  network: null,
  setNetwork: () => {},
});

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [network, setNetwork] = useState<Network | null>(null);

  return (
    <NetworkContext.Provider value={{ network, setNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
};