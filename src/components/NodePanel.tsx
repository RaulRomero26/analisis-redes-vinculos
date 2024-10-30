import { GraphData } from "../interfaces/GraphData";
import { NodeData } from "../interfaces/NodeData";
import nodeData from "../assets/data.json";

export const NodePanel: React.FC<{
    data: GraphData;
    setData: React.Dispatch<React.SetStateAction<GraphData>>;
  }> = ({ data, setData }) => {
    const handleDragEnd = (node: NodeData) => {
      setData({
        nodes: [
          ...data.nodes,
          { ...node, size: 15 },
        ],
        edges: [...data.edges, { from: node.id, to: "EC2", color: "red" }],
      });
    };
    return (
        <div className="md:w-1/6 p-2">
          <div className="flex flex-wrap">
            {nodeData.nodes.map((el: NodeData) => (
              <div
                draggable
                key={el.id}
                onDragEnd={() => handleDragEnd(el)}
                className="flex justify-center items-center rounded-full w-12 h-12 m-2 cursor-pointer border border-gray-300"
              >
                <img src={el.image} alt={el.name} className="w-3/5 h-3/5" />
              </div>
            ))}
          </div>
        </div>
      );
    };
    
export default NodePanel;