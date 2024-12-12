import React, { createContext, useContext, useState } from 'react';
// Importar vis-network como any para evitar errores de tipo


interface NetworkContextProps {
  network: any | null;
  setNetwork: (network: any) => void;
}

const NetworkContext = createContext<NetworkContextProps>({
  network: null,
  setNetwork: () => {},
});

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [network, setNetwork] = useState<any | null>(null);

  return (
    <NetworkContext.Provider value={{ network, setNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
};