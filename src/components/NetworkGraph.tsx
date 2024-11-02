// src/components/NetworkGraph.tsx
import React, { useRef } from "react";
import Network from "react-vis-network-graph";
import { GraphData } from "../interfaces/GraphData";

interface NetworkGraphProps {
  data: GraphData;
  options: any;
  onClick: (event: any) => void;
  onContext: (event: any) => void;
  onNodeHover: (event: any) => void;
  onEdgeHover: (event: any) => void;
}



const NetworkGraph: React.FC<NetworkGraphProps> = ({ data, options, onClick, onNodeHover, onEdgeHover, onContext }) => {
  const graphRef = useRef<any>(null);

  return (
    <Network
      graph={data}
      ref={graphRef}
      options={options}
      events={{ 
        click: onClick,
        oncontext: onContext, // Pasar la propiedad onContext a los eventos
        hoverNode: onNodeHover,
        hoverEdge: onEdgeHover
      }}
    />
  );
};

export default NetworkGraph;