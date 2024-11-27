// src/App.tsx
import React, { useEffect, useRef, useState } from "react";
import NetworkGraph from "./components/NetworkGraph";

import ContextMenu from "./components/ContextMenu";

import { GraphData } from "./interfaces/GraphData";
import { useGraphFunctions } from "./hooks/useGraphFunctions";
import useContextMenu from "./hooks/useContextMenu";
import { EdgeData } from "./interfaces/EdgeData";
import DropdownMenu from "./ui/DropDownMenu";
import { useSearchEntity } from "./hooks/useSearchEntity";
import { ModalSwitch, ModalFichas, ModalContactos } from "./components/Modals";
import { NodeData } from "./interfaces/NodeData";
import { useShowDetails } from "./hooks/useShowDetails";

// import { Options } from "./interfaces/Options";

const App: React.FC = () => {
  const [data, setData] = useState<GraphData>({
    nodes: [] as NodeData[],
    edges: [] as EdgeData[],
  });

  // const [hoveredNode, setHoveredNode] = useState<string | number | null>(null); // Nodo en hover

  const getData = () => data;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entidad, setEntidad] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);

  // const {options} = Options();
  const graphRef = useRef<any>(null);

  useEffect(() => {
    console.log(options);
  }, []);

  // Pass getData correctly to useGraphFunctions
  const { editNode, editEdge, addEdgeControl, addNode, deleteNode, deleteEdge } = useGraphFunctions(setData, getData);

  const { contextMenu, handleContextMenu, closeContextMenu, handleSearchExtended,
    isModalFichasOpen, selectedNode, setIsModalFichasOpen, isModalContactosOpen, setIsModalContactosOpen
  } = useContextMenu(data, setData, getData);
  const { searchData } = useSearchEntity();
  const { showDetails } = useShowDetails();
  const handleNodeHover = (_event: any) => { };

  const handleEdgeHover = (_event: any) => { };

  const handleAddEdge = () => {
    if (graphRef.current) {
      graphRef.current.addEdgeMode(); // Habilita el modo de agregar edges
    } else {
      console.warn("Graph reference is null.");
    }
  };

  const handleNodeClick = (event: any) => {
	if (deleteMode) {
	  // Eliminar el nodo
	  console.log('ELIMINAR ESTA EN TRUE:',event);
	  deleteNode(event, ()=>{});
	  setDeleteMode(false);
	} else {
	  // Otro tipo de manejo de clic
	  console.log("Node clicked:", event);
	}
  };

  const toggleModal = (entidad?: string) => {
    setIsModalOpen(!isModalOpen);
    if (entidad) {
      setEntidad(entidad);
    }
  };

  const handleMenuClick = (entidad: string) => {
    console.warn("Entidad:", entidad);
    toggleModal(entidad);
    searchData({ entidad, payload: {} });
  };

  const handleShowDetails = (node: NodeData) => {
    showDetails(node);
  };

  // Agregar una función para eliminar elementos
const deleteElement = () => {
	if (graphRef.current) {
	  console.log("Delete element mode");
	  setDeleteMode(true);
	} else {
	  console.warn("Graph reference is null.");
	}
  };

  useEffect(() => {
    console.log("Data CAMBIO:", data);
  }, [data]);

useEffect(() => {
	if (deleteMode && selectedNode) {
		// Eliminar el nodo
		console.log('ELIMINAR ESTA EN TRUE:', selectedNode);
		deleteNode(selectedNode, () => {});
	}
}, [deleteMode, selectedNode]);

  const options = {
    locale: 'es',
    interaction: {
      selectable: true,
      hover: true,
      dragNodes: true,
      zoomSpeed: 1,
      zoomView: true,
      navigationButtons: true,
      keyboard: true,
    }, // Permitir mover nodos
    manipulation: {
      enabled: false,
      initiallyActive: false,
      addNode: addNode,
      addEdge: addEdgeControl,
      editNode: editNode,
      editEdge: editEdge,
      deleteNode: deleteNode,
      deleteEdge: deleteEdge,
    },
    layout: {
      hierarchical: {
        enabled: true,
        direction: 'UD', // 'UD' for Up-Down
        sortMethod: 'hubsize', // 'directed' or 'hubsize'
        nodeSpacing: 400, // Aumentar el espaciado entre nodos
        levelSeparation: 250, // Aumentar la separación entre niveles
        shakeTowards: 'roots', // 'roots' or 'leaves'
      },
    },
    edges: {
      smooth: {
        enabled: true,
        type: 'curvedCW',
        roundness: 0.1
      },
      font: {
        background: 'rgba(255, 255, 255, 1)'
      }
    },
    physics: {
      enabled: true, // Habilitar la física para permitir el movimiento de nodos
      solver: 'hierarchicalRepulsion',
      hierarchicalRepulsion: {
        centralGravity: 0.0,
        springLength: 150, // Aumentar la longitud de los resortes para más espacio entre nodos
        springConstant: 0,
        nodeDistance: 150, // Aumentar la distancia entre nodos
        damping: 1, // Aumentar el damping para reducir el rebote
        avoidOverlap: 1, // Evitar la superposición de nodos
      },
    },
  };

  return (
    <div className="" onContextMenu={(e) => e.preventDefault()}>
      <div className="grid grid-cols-1 gap-4">
        <DropdownMenu data={data} setData={setData} handleMenuClick={handleMenuClick} addEdge={handleAddEdge} deleteElement={deleteElement}/>
      </div>
      <div className="" style={{ height: '85vh' }}>
        <NetworkGraph
          data={data}
          options={options}
          onClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          onEdgeHover={handleEdgeHover}
          onContext={handleContextMenu}
          ref={graphRef} // Referencia añadida para poder acceder a los métodos del gráfico
        />
        {(contextMenu.edgeId || contextMenu.nodeId) && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            nodeId={contextMenu.nodeId}
            getData={getData}
            setData={setData}
            onSearchExtended={handleSearchExtended}
            onClose={closeContextMenu}
            onShowDetails={handleShowDetails}
          />
        )}

        {/* Modal que se muestra cuando isModalOpen es true */}
        {isModalFichasOpen && (
          <ModalFichas
            node={selectedNode}   // Pasa el nodo seleccionado al modal
            isOpen={isModalOpen}  // Controla la visibilidad
            onClose={() => setIsModalFichasOpen(false)}
            data={data}
            setData={setData}
            getData={getData}
          />
        )}

        {/* Modal que se muestra cuando isModalOpen es true */}
        {isModalContactosOpen && (
          <ModalContactos
            node={selectedNode}   // Pasa el nodo seleccionado al modal
            isOpen={isModalOpen}  // Controla la visibilidad
            onClose={() => setIsModalContactosOpen(false)}
            data={data}
            setData={setData}
            getData={getData}
          />
        )}
      </div>
      <ModalSwitch entidad={entidad} isModalOpen={isModalOpen} toggleModal={toggleModal} setData={setData} getData={getData} />
    </div>
  );
};

export default App;
