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
      // Add custom dragEnd event listener using vis.js network API
      if (graphRef.current) {
        const network = graphRef.current;

        // Listener for the 'dragEnd' event
        network.on('dragEnd', function(event :any) {
          const nodeId = event.nodes[0];  // Si se mueve un solo nodo, capturamos su ID
          const newPosition = event.pointer.canvas;  // Usamos las coordenadas canvas
          console.log("Nuevo posicion del nodo:", nodeId, newPosition);
        
          setData({
            nodes: data.nodes.map((node) => {
              if (node.id === nodeId) {
                return { ...node, x: newPosition.x, y: newPosition.y };
              }
              return node;
            }),
            edges: data.edges,  // Mantenemos las aristas sin cambios
          })
          
        });
        
      }

      // Cleanup the event listener when the component unmounts or re-renders
      return () => {
        if (graphRef.current) {
          const network = graphRef.current;
          network.off('dragEnd');  // Remove the event listener
        }
      };
    }, [onDragEnd]);


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
