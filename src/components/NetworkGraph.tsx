import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
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

const NetworkGraph = forwardRef<any, NetworkGraphProps>(
  ({ data, options, onClick, onNodeHover, onEdgeHover, onContext }, ref) => {
    const graphRef = useRef<any>(null); // Reference to the network container

    useImperativeHandle(ref, () => ({
      setOptions: (options: any) => {
        if (graphRef.current) {
          graphRef.current.setOptions(options);
        }
      },
      getCanvas: () => {
        if (graphRef.current) {
          return graphRef.current.canvas.frame.canvas;
        }
        return null;
      },
      addEdgeMode: () => {
        if (graphRef.current) {
          console.log("Add edge mode");
          graphRef.current.addEdgeMode();
        }
      },
      deleteNodeMode: () => {
        if (graphRef.current) {
          console.log("Delete node mode");  
        }
      },
    }));

    useEffect(() => {
      console.log("Data changed:", data);
      if (graphRef.current) {
        graphRef.current.setData(data);
      }
    }, [data]);

    return (
      <Network
        graph={data}
        options={options}
        events={{
          click: onClick,
          oncontext: onContext,
          hoverNode: onNodeHover,
          hoverEdge: onEdgeHover,
        }}
        getNetwork={(network: any) => {
          graphRef.current = network; // Capture the vis.js network instance
          console.log("Network instance:", network);
        }}
      />
    );
  }
);

export default NetworkGraph;
