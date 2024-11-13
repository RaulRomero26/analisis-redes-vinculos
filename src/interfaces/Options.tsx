import { useState } from "react";
import { useGraphFunctions } from "../hooks/useGraphFunctions";
import { EdgeData } from "./EdgeData";
import { GraphData } from "./GraphData";
import { NodeData } from "./NodeData";

export const Options = () => {

  const [data, setData] = useState<GraphData>({
    nodes: [] as NodeData[],
    edges: [] as EdgeData[],
  });
  
  const getData = () => data;
  const { editNode, editEdge, addEdgeControl, addNode, deleteNode, deleteEdge } = useGraphFunctions(setData, getData);

  const options = {
    locale: 'es',
    interaction: { 
      selectable: true, 
      hover: true, 
      dragNodes: true,
      zoomSpeed: 1,
      zoomView: true ,
      navigationButtons: true,
      keyboard: true,
    }, // Permitir mover nodos
    manipulation: {
      enabled: true,
      initiallyActive: true,
      addNode: addNode,
      addEdge: addEdgeControl,
      editNode: editNode,
      editEdge: editEdge,
      deleteNode: deleteNode,
      deleteEdge: deleteEdge,
    },
    // edges: {
    //   smooth:{
    //     enabled: true,
    //     type: 'dinamyc',
    //     roundness: 0.2
    //   }
    // },
    physics: {
      enabled: true, // Habilitar la física para permitir el movimiento de nodos
      // solver: 'hierarchicalRepulsion',
      // hierarchicalRepulsion: {
      //   centralGravity: 0.0,
      //   springLength: 250, // Aumentar la longitud de los resortes para más espacio entre nodos
      //   springConstant: 0.01,
      //   nodeDistance: 450, // Aumentar la distancia entre nodos
      //   damping: 1, // Aumentar el damping para reducir el rebote
      //   avoidOverlap: 1, // Evitar la superposición de nodos
      // },
      stabilization: {
        enabled: true,
        iterations: 1000,
        updateInterval: 25,
        onlyDynamicEdges: false,
      },
    },
    layout: {
      hierarchical: {
        enabled: true,
        direction: 'UD', // 'UD' for Up-Down
        sortMethod: 'directed', // 'directed' or 'hubsize'
        nodeSpacing: 800, // Aumentar el espaciado entre nodos
        levelSeparation: 250, // Aumentar la separación entre niveles
        shakeTowards: 'roots', // 'roots' or 'leaves'
      },
    },
  };


  return{
    options
  }
}
