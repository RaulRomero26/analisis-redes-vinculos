import Swal from 'sweetalert2';
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

  const addEdgeControl = (edgeData: any, callback: (data: any) => void) => {
    console.log(edgeData);
    setData(prevData => {
      const newEdge = { ...edgeData, id: edgeData.id || `${edgeData.from}-${edgeData.to}` };
      const newEdges = [...prevData.edges, newEdge];
      const newData = { ...prevData, edges: newEdges };
      callback(newData);
      return newData;
    });
  };

 
  const deleteNode = (nodeId: any, callback: (data: any) => void) => {
    console.log('Delete node:', nodeId.nodes[0], 'DATA:');
    setData(prevData => {
      const newData = {
        ...prevData,
        nodes: prevData.nodes.filter(n => n.id !== nodeId.nodes[0]),
        edges: prevData.edges.filter(e => e.from !==  nodeId.nodes[0] && e.to !==  nodeId.nodes[0]),
      };
      callback(newData);
      return newData;
    });
  };

  const deleteEdge = (edgeId: any, callback: (data: any) => void) => {
    console.log('Delete node:', edgeId.edges[0], 'DATA:');
    setData(prevData => {
      const newData = {
        ...prevData,
        edges: prevData.edges.filter(n => n.id !== edgeId.edges[0]),
      };
      callback(newData);
      return newData;
    });
  };

  const addNode = (nodeData: any) => {
    setData((prevData) => {
      // Check if node with same id exists
      const nodeExists = prevData.nodes.find(node => node.id === nodeData.id);
      console.log('Node exists:', nodeExists);
      if (nodeExists) {
        console.error("Node with same ID already exists");
        Swal.fire({
          title: 'Error',
          text: `Ya existe una entidad identificada ${nodeData.label}`,
          icon: 'error',
          confirmButtonText: 'Ok'
          }).then(() => {});
          return prevData;
        }
      console.warn('Me esta llegando:', nodeData);
      const newNode: NodeData = createNodeData(
        nodeData.id, // Generate a unique ID
        nodeData.label.toString().toUpperCase() || "Nuevo Nodo",
        nodeData.name || "Nuevo Nodo",
        "image", // nodeData.shape is always "image"
        nodeData.size || 15,
        nodeData.color || "blue",
        nodeData.type || "persona",
        nodeData.entidad, // No default value needed
        nodeData.data || {},
        nodeData.atributos || {}
      );
      newNode.font = {multi: 'html', size: 12};

      console.log("New node:", newNode);
      return {
        ...prevData,
        nodes: [...prevData.nodes, newNode],
      };
    });
  };
  
    //callback(newNode);

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
    addEdgeControl,
    deleteNode,
    deleteEdge,
    findNodeDetails
  };
};