import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Network from "react-vis-network-graph";
import { GraphData } from "../interfaces/GraphData";
import { useNetwork } from '../context/NetworkContext';

interface NetworkGraphProps {
  data: GraphData;
  setData: (data: GraphData) => void;
  options: any;
  onClick: (event: any) => void;
  onContext: (event: any) => void;
  onNodeHover: (event: any) => void;
  onEdgeHover: (event: any) => void;
}

const NetworkGraph = forwardRef<any, NetworkGraphProps>(
  ({ data, setData, options, onClick, onNodeHover, onEdgeHover, onContext }, ref) => {
    const graphRef = useRef<any>(null); // Reference to the network container
    const { setNetwork } = useNetwork();

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

    const updateNodePositions = (event: any) => {
      if (event && event.nodes.length > 0) {
      };
   }

   useEffect(() => {
      if (graphRef.current) {
        graphRef.current.on('setData', (event: any) => {
          console.warn('se reseto la data desde el graph',event);
        });
      }
   }, [data, setData]);

    useEffect(() => {
      updateNodePositions({ nodes: data.nodes.map(node => node.id) });
      const network = graphRef.current;
      network.on('dragEnd', updateNodePositions);
      return () => {
        network.off('dragEnd', updateNodePositions);
      };
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
          setNetwork(network); // Set the network instance in the context
        }}
      />
    );
  }
);


export default NetworkGraph;