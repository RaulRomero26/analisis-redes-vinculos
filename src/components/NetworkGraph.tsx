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
  onNodeBlur: (event: any) => void;
}

const NetworkGraph = forwardRef<any, NetworkGraphProps>(({ data, options, onClick, onNodeHover, onEdgeHover, onContext }, ref) => {
  const graphRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    setOptions: (options: any) => {
      if (graphRef.current) {
        graphRef.current.Network.setOptions(options);
      }
    },
    getCanvas: () => {
      if (graphRef.current) {
        return graphRef.current.Network.canvas.frame.canvas;
      }
      return null;
    },
  }));

  useEffect(() => {
    console.log("Data changed:", data);
    if (graphRef.current) {
      graphRef.current.Network.setData(data);
    }
  }, [data]);

  return (
    <Network
      graph={data}
      ref={graphRef}
      options={options}
      events={{
        click: onClick,
        oncontext: onContext,
        hoverNode: onNodeHover,
        hoverEdge: onEdgeHover,
      }}
    />
  );
});

export default NetworkGraph;