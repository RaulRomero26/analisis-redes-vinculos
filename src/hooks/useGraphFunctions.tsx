import { GraphData } from '../interfaces/GraphData';
import { NodeData, createNodeData } from '../interfaces/NodeData';
import { v4 as uuidv4 } from 'uuid';

export const useGraphFunctions = (
  setData: React.Dispatch<React.SetStateAction<GraphData>>,
  getData: () => GraphData
) => {

  const editNode = (data: any, callback: (data: any) => void) => {
    console.log("Edit node:", data);
    data.label = "editado";
    callback(data); // Llamar al callback con los datos modificados
  };

  const editEdge = (data: any, callback: (data: any) => void) => {
    console.log("Edit edge:", data);
    data.label = "edge editado";
    callback(data); // Llamar al callback con los datos modificados
  };

  const addNode = (nodeData: any, callback: (data: any) => void) => {
    setData!((prevData) => {
      // Check if node with same id exists and filter it out
      const filteredNodes = prevData.nodes.filter(node => node.id !== nodeData.id);
      console.log('Me esta llegando:', nodeData);
      const newNode: NodeData = createNodeData(
        nodeData.id, // Generate a unique ID
        nodeData.label =  nodeData.label.toString().toUpperCase() || "Nuevo Nodo",
        nodeData.name || "Nuevo Nodo",
        nodeData.shape = "image",
        nodeData.size || 15,
        nodeData.color || "blue",
        nodeData.type = nodeData.type || "persona",
        nodeData.data = nodeData.data || {},
      );
      console.log("New node:", newNode);
      return {
        ...prevData,
        nodes: [...filteredNodes, newNode],
      };
    });
  
    //callback(newNode);
  };

  const addEdge = (edgeData: any, callback: (data: any) => void) => {
    setData!((prevData) => {
      // Check if edge with same id exists and filter it out
      const filteredEdges = prevData.edges.filter(edge => edge.id !== edgeData.id);
      console.log('Me esta llegando:', edgeData);
      const newEdge = {
        id: uuidv4(), // Generate a unique ID
        from: edgeData.from,
        to: edgeData.to,
        label: edgeData.label || "Nueva Arista",
        color: edgeData.color || "black",
        width: edgeData.width || 1,
      };
      console.log("New edge:", newEdge);
      return {
        ...prevData,
        edges: [...filteredEdges, newEdge],
      };
    });

    callback(edgeData);
  };

  const findNodeDetails = (nodeId: string) => {
    if (typeof getData === 'function') {
      const currentData = getData();
      return currentData.nodes.find(node => node.id === nodeId);
    } else {
      console.error("getData is not a function or is undefined");
      return null;
    }
  }
  

  return {
    editNode,
    editEdge,
    addNode,
    addEdge,
    findNodeDetails
  };
};