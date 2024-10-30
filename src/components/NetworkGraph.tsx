// src/components/NetworkGraph.tsx
import React, { useRef } from "react";
import Network from "react-vis-network-graph";
import { GraphData } from "../interfaces/GraphData";

export const NetworkGraph: React.FC<{
    data: GraphData;
    options: any;
    onClick: (event: any) => void;
    onContext: (event: any) => void; // Añadir la propiedad onContext
  }> = ({ data, options, onClick, onContext }) => {
    const graphRef = useRef<any>(null);
  
    return (
      <Network
        graph={data}
        ref={graphRef}
        options={options}
        events={{ 
          click: onClick,
          oncontext: onContext // Pasar la propiedad onContext a los eventos
        }}
      />
    );
  };

export default NetworkGraph;