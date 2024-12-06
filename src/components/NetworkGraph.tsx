import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Network from "react-vis-network-graph";
import { GraphData } from "../interfaces/GraphData";

interface NetworkGraphProps {
  data: GraphData;
  setData: (data: GraphData) => void;
  options: any;
  onClick: (event: any) => void;
  onContext: (event: any) => void;
  onNodeHover: (event: any) => void;
  onEdgeHover: (event: any) => void;
  onDragEnd: (event: any) => void;  // Custom onDragEnd event handler
}

const NetworkGraph = forwardRef<any, NetworkGraphProps>(
  ({ data, setData,options, onClick, onNodeHover, onEdgeHover, onContext, onDragEnd }, ref) => {
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
          graphRef.current.addEdgeMode();
        }
      },
      deleteNodeMode: () => {
        if (graphRef.current) {
          // Handle delete mode
        }
      },
    }));

    useEffect(() => {
      // Update the graph data
      if (graphRef.current) {
        graphRef.current.setData(data);
      }
    }, [data]);
   

    useEffect(() => {
      if (graphRef.current) {
      const network = graphRef.current;
      const updateNodePositions = (event: any) => {
        console.log('event',event);
        if (event && event.nodes.length > 0) { // Only update positions if nodes are being dragged
          const positions = network.getPositions();
          const updatedNodes = data.nodes.map(node => ({
            ...node,
            x: positions[node.id].x,
            y: positions[node.id].y,
          }));
          setData({ ...data, nodes: updatedNodes });
        }
      };

      // Update positions initially
      updateNodePositions();

      // Add event listeners for dragEnd and stabilization
      network.on('dragEnd', updateNodePositions);
      network.on('stabilizationIterationsDone', updateNodePositions);

      // Cleanup event listeners on unmount
      return () => {
        network.off('dragEnd', updateNodePositions);
        network.off('stabilizationIterationsDone', updateNodePositions);
      };
      }
    }, [data, setData]);


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
        }}
      />
    );
  }
);

export default NetworkGraph;
