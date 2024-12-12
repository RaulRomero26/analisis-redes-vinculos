
import { GraphData } from '../interfaces/GraphData';
import { NodeData, createNodeData } from '../interfaces/NodeData';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { useNetwork } from '../context/NetworkContext';

export const useGraphFunctions = (
  setData: React.Dispatch<React.SetStateAction<GraphData>>,
  getData: () => GraphData
) => {


  const {network} = useNetwork();

  const editNode = (data: any, callback: (data: any) => void) => {
    //console.log("Edit node:", data);
    data.label = "editado";
    callback(data); // Llamar al callback con los datos modificados
  };

  const editEdge = (data: any, callback: (data: any) => void) => {
    //console.log("Edit edge:", data);
    data.label = "edge editado";
    callback(data); // Llamar al callback con los datos modificados
  };

  const addEdgeControl = (edgeData: any, callback: (data: any) => void) => {
    //console.log(edgeData);
    setData(prevData => {
      const newEdge = { ...edgeData, id: edgeData.id || `${edgeData.from}-${edgeData.to}` };
      const newEdges = [...prevData.edges, newEdge];
      const newData = { ...prevData, edges: newEdges };
      callback(newData);
      return newData;
    });
  };
 
  const deleteNode = (nodeId: any, callback: (data: any) => void) => {
    //console.log('Delete node:', nodeId);
    if(nodeId.nodes && nodeId.nodes.length > 0) {
      setData(prevData => {
        const newData = {
          ...prevData,
          nodes: prevData.nodes.filter(n => n.id !== nodeId.nodes[0]),
          edges: prevData.edges.filter(e => e.from !== nodeId.nodes[0] && e.to !== nodeId.nodes[0]),
        };
        callback(newData);
        return newData;
      });
    }
    if(nodeId.edges && nodeId.edges.length > 0) {
      setData(prevData => {
        const newData = {
          ...prevData,
          edges: prevData.edges.filter(e => e.id !== nodeId.edges[0]),
        };
        callback(newData);
        return newData;
      });
  };
  };

  const deleteEdge = (edgeId: any, callback: (data: any) => void) => {
    //console.log('Delete node:', edgeId.edges[0], 'DATA:');
    setData(prevData => {
      const newData = {
        ...prevData,
        edges: prevData.edges.filter(n => n.id !== edgeId.edges[0]),
      };
      callback(newData);
      return newData;
    });
  };

  const addNode = (nodeData: any, callback: (data: any) => void) => {
    console.log('node data:', nodeData);
    console.log('network:', network);
    const {newNode, parentPosition} = nodeData;
    let prevData = getData();
    try {
        let alreadyExist = nodeExists(newNode);
        console.warn(alreadyExist);
        if (alreadyExist) {

          toast.error(`Ya existe una entidad identificada ${newNode.label}`)
            setData({...prevData})
            callback({ status: false, encontro: newNode });
            return prevData;
        } 

            let addNode: NodeData = createNodeData(
              newNode.id.toString().toUpperCase(), // Generate a unique ID
              newNode.label.toString().toUpperCase() || "Nuevo Nodo",
              newNode.name || "Nuevo Nodo",
              "image", // newNode.shape is always "image"
              newNode.size || 15,
              newNode.color || "blue",
              newNode.type || "persona",
              newNode.entidad, // No default value needed
              newNode.data || {},
              newNode.atributos || {},
              newNode.x || parentPosition.x + Math.floor(Math.random() * (350 - 270 + 1)) + 270,
              newNode.y || parentPosition.y + Math.floor(Math.random() * (350 - 270 + 1)) + 270,
            
            );
            addNode.font = { multi: 'html', size: 12 };

            // Validaciones especiales de acuerdo al type diferente a entidad
            console.log('NEW NODE:', newNode.type);
            if (newNode.type === 'contacto') {
                addNode.label = `${addNode.label} \n <b>Telefono: </b> ${addNode.atributos.Telefono}`;
            }

            if (newNode.type === 'inspeccion') {"inspeccion"
               addNode.label = `${addNode.label} \n <b>Fecha: </b> ${addNode.atributos.Fecha} \n <b>Ubicación: </b> ${addNode.atributos.Colonia}, ${addNode.atributos.Calle_1},\n ${addNode.atributos.Calle_2}, ${addNode.atributos.No_Ext}`;
            }

            if (newNode.type === 'vehiculo') {
               addNode.label = `<b>Placas: </b> ${addNode.atributos.Placas} <b>NIV: </b> ${addNode.atributos.NIV} \n <b>Marca: </b> ${addNode.atributos.Marca} \n <b>Modelo: </b> ${addNode.atributos.Modelo} \n <b>Color: </b> ${addNode.atributos.Color}`;
            }
            
            prevData.nodes.push(addNode)
            console.log('NEW DATA:', addNode);
            setData({...prevData})
            callback({ status: true }); // Indicate that the node was added successfully
            return prevData;
        
    } catch (error) {
        console.log('ERROR DESDE EL ADD:', error);
    }
  };
  
    //callback(newNode);

  const addEdge = (edgeData: any, callback: (data: any) => void) => {
    console.log('disparo el addEdge')
    try {
      console.log('edge data:', edgeData);
      console.warn(hasMoreThanOneEdgeFromTheSameNode(edgeData.from));
      setData((prevData) => {
        const newEdge = {
          id: uuidv4(), // Generate a unique ID
          from: edgeData.from,
          to: edgeData.to,
          label: edgeData.label || "Nueva Arista",
          color: edgeData.color || "black",
          width: edgeData.width || 1,
        };
        
        callback(true);
        prevData.edges.push(newEdge);
        setData({...prevData})
        return prevData;
      });
  
    } catch (error) {
      console.error("Error adding edge:", error);
      callback(false);
    }
    
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

  const findEdgeDetails = (edgeId: string) => {
    if(typeof getData === 'function'){
      const currentData = getData();
      return currentData.edges.find(edge => edge.id === edgeId);
    } else {
      console.error("getData is not a function or is undefined");
      return null;
    }
  }

  const hasMoreThanOneEdgeFromTheSameNode = (nodeId: string): boolean => {
    const currentData = getData();
    const edgesFromSameNode = currentData.edges.filter(edge => 
      (edge.from === nodeId || edge.to === nodeId)
    );
    return edgesFromSameNode.length > 1;
  }

  const nodeExists = (node: any): boolean => {
    const currentData = getData();
    let bandExistencia = currentData.nodes.some(oldNode => oldNode.id === node.id);
    if (node.type === 'vehiculo') {
      bandExistencia = currentData.nodes.some(oldNode => 
        (oldNode.atributos.NIV !== 'sd' && oldNode.atributos.NIV !== 'SD' && oldNode.atributos.NIV !== 's/d' && oldNode.atributos.NIV !== 'S/D' && oldNode.atributos.NIV === node.atributos.NIV) || 
        (oldNode.atributos.Placas !== 'sd' && oldNode.atributos.Placas !== 'SD' && oldNode.atributos.Placas !== 's/d' && oldNode.atributos.Placas !== 'S/D' && oldNode.atributos.Placas === node.atributos.Placas)
      );
    }
    return !!bandExistencia;
  };

  const edgeExists = (edgeId: string): boolean => {
    const currentData = getData();
    return currentData.edges.some(edge => edge.id === edgeId);
  }
  
  return {
    editNode,
    editEdge,
    addNode,
    addEdge,
    addEdgeControl,
    deleteNode,
    deleteEdge,
    findNodeDetails,
    findEdgeDetails,
    nodeExists,
    edgeExists
  };
};