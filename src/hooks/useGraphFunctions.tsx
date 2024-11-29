import Swal from 'sweetalert2';
import { GraphData } from '../interfaces/GraphData';
import { NodeData, createNodeData } from '../interfaces/NodeData';
import { v4 as uuidv4 } from 'uuid';

export const useGraphFunctions = (
  setData: React.Dispatch<React.SetStateAction<GraphData>>,
  getData: () => GraphData
) => {

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
    console.warn('ENTRE A AGREGAR NODO');
    let prevData = getData();
    try {
        let alreadyExist = nodeExists(nodeData);
        console.warn(alreadyExist);
        if (alreadyExist) {
            Swal.fire({
                title: 'Error',
                text: `Ya existe una entidad identificada ${nodeData.label}`,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            setData({...prevData})
            callback({ status: false, encontro: nodeData });
            return prevData;
        } 

            const newNode: NodeData = createNodeData(
                nodeData.id.toString().toUpperCase(), // Generate a unique ID
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
            newNode.font = { multi: 'html', size: 12 };

            // Validaciones especiales de acuerdo al type diferente a entidad
            if (newNode.type === 'contacto') {
                newNode.label = `${newNode.label} \n <b>Telefono: </b> ${newNode.atributos.Telefono}`;
            }

            if (newNode.type === 'inspeccion') {
                newNode.label = `${newNode.label} \n <b>Fecha: </b> ${newNode.atributos.Fecha} \n <b>Ubicación: </b> ${newNode.atributos.Colonia}, ${newNode.atributos.Calle_1},\n ${newNode.atributos.Calle_2}, ${newNode.atributos.No_Ext}`;
            }

            if (newNode.type === 'vehiculo') {
                newNode.label = `<b>Placas: </b> ${newNode.atributos.Placas} <b>NIV: </b> ${newNode.atributos.NIV} \n <b>Marca: </b> ${newNode.atributos.Marca} \n <b>Modelo: </b> ${newNode.atributos.Modelo} \n <b>Color: </b> ${newNode.atributos.Color}`;
            }

            prevData.nodes.push(newNode)
            console.log('NEW DATA:', prevData);
            setData({...prevData})
            callback({ status: true }); // Indicate that the node was added successfully
            return prevData;
        
    } catch (error) {
        console.log('ERROR DESDE EL ADD:', error);
    }
};
  
    //callback(newNode);

  const addEdge = (edgeData: any, callback: (data: any) => void) => {
    try {
      setData((prevData) => {
        // Check if edge with same id exists and filter it out
        //console.log('DATA:', prevData);
        // const filteredEdges = prevData.edges.filter(edge => edge.id !== edgeData.id);
        //console.log('Me esta llegando:', edgeData);
        const newEdge = {
          id: uuidv4(), // Generate a unique ID
          from: edgeData.from,
          to: edgeData.to,
          label: edgeData.label || "Nueva Arista",
          color: edgeData.color || "black",
          width: edgeData.width || 1,
        };
        //console.warn("New edge DESDE GRAPH FUNCRIONS:", newEdge);
        //console.log([...filteredEdges, newEdge])
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
    nodeExists,
    edgeExists
  };
};