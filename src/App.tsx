// src/App.tsx
import React, { SetStateAction, useEffect, useState } from "react";
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
import SaveNetwork from "./components/SaveNetwork";
import { useShowDetails } from "./hooks/useShowDetails";

const App: React.FC = () => {
  const [networks, setNetworks] = useState<GraphData[]>([
    { nodes: [] as NodeData[], edges: [] as EdgeData[] }
  ]);
  const [currentNetworkIndex, setCurrentNetworkIndex] = useState(0);

  const getData = () => networks[currentNetworkIndex];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entidad, setEntidad] = useState('');

  useEffect(() => {	
    console.log(options);
  }, []);

  const { editNode, editEdge, addEdgeControl, addNode, deleteNode, deleteEdge } = useGraphFunctions(
    (value: SetStateAction<GraphData>) => {
      setNetworks(prevNetworks => {
        const updatedNetworks = [...prevNetworks];
        updatedNetworks[currentNetworkIndex] = typeof value === 'function' ? value(prevNetworks[currentNetworkIndex]) : value;
        return updatedNetworks;
      });
    },
    getData
  );

  const { contextMenu, handleContextMenu, closeContextMenu, handleSearchExtended,
    isModalFichasOpen, selectedNode, setIsModalFichasOpen, isModalContactosOpen, setIsModalContactosOpen
  } = useContextMenu(
    networks[currentNetworkIndex],
    (value: SetStateAction<GraphData>) => {
      setNetworks(prevNetworks => {
        const updatedNetworks = [...prevNetworks];
        updatedNetworks[currentNetworkIndex] = typeof value === 'function' ? value(prevNetworks[currentNetworkIndex]) : value;
        return updatedNetworks;
      });
    },
    getData
  );

  const { searchData } = useSearchEntity();
  const { showDetails } = useShowDetails();

  const handleNodeClick = (event: any) => {
    console.log("Node clicked:", event);
  };

  const handleNodeHover = (event: any) => {
    console.log("Node hovered:", event);
  };

  const handleNodeBlur = () => {};

  const handleEdgeHover = (event: any) => {
    console.log("Edge hovered:", event);
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

  useEffect(() => {
    console.log("Data CAMBIO:", networks[currentNetworkIndex]);
  }, [networks, currentNetworkIndex]);

  const addNewNetwork = () => {
    setNetworks([...networks, { nodes: [] as NodeData[], edges: [] as EdgeData[] }]);
    setCurrentNetworkIndex(networks.length);
  };

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
    <div onContextMenu={(e) => e.preventDefault()}>
      <div className="grid grid-cols-1">
        <DropdownMenu handleMenuClick={handleMenuClick} />
		<div className="flex items-center bg-blue-950">
			{networks.map((network, index) => (
				<button 
					key={index} 
					onClick={() => setCurrentNetworkIndex(index)} 
					className="bg-green-500 text-white p-2 m-2 rounded"
				>
					Red {index + 1}
				</button>
			))}
			<button onClick={addNewNetwork} className="float-right bg-yellow-500 text-white p-2 mr-5 rounded">Agregar Nueva Red</button>
			<SaveNetwork data={networks[currentNetworkIndex]} setData={(value: SetStateAction<GraphData>) => {
				setNetworks(prevNetworks => {
				const updatedNetworks = [...prevNetworks];
				updatedNetworks[currentNetworkIndex] = typeof value === 'function' ? value(prevNetworks[currentNetworkIndex]) : value;
				return updatedNetworks;
				});
			}} />
		</div>
      </div>
      <div className="" style={{ height: '85vh' }}>
        <NetworkGraph
          data={networks[currentNetworkIndex]}
          options={options}
          onClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          onEdgeHover={handleEdgeHover}
          onContext={handleContextMenu}
          onNodeBlur={handleNodeBlur} 
        />
        {(contextMenu.edgeId || contextMenu.nodeId) && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            nodeId={contextMenu.nodeId}
            getData={getData}
            setData={(newData: GraphData) => {
              setNetworks(prevNetworks => {
                const updatedNetworks = [...prevNetworks];
                updatedNetworks[currentNetworkIndex] = newData;
                return updatedNetworks;
              });
            }}
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
            data={networks[currentNetworkIndex]}
            setData={(newData: GraphData) => {
              setNetworks(prevNetworks => {
                const updatedNetworks = [...prevNetworks];
                updatedNetworks[currentNetworkIndex] = newData;
                return updatedNetworks;
              });
            }}
            getData={getData}
          />
        )}

        {/* Modal que se muestra cuando isModalOpen es true */}
        {isModalContactosOpen && (
          <ModalContactos
            node={selectedNode}   // Pasa el nodo seleccionado al modal
            isOpen={isModalOpen}  // Controla la visibilidad
            onClose={() => setIsModalContactosOpen(false)}
            data={networks[currentNetworkIndex]}
            setData={(newData: GraphData) => {
              setNetworks(prevNetworks => {
                const updatedNetworks = [...prevNetworks];
                updatedNetworks[currentNetworkIndex] = newData;
                return updatedNetworks;
              });
            }}
            getData={getData}
          />
        )}
      </div>
      <ModalSwitch entidad={entidad} isModalOpen={isModalOpen} toggleModal={toggleModal} setData={(newData: GraphData) => {
        setNetworks(prevNetworks => {
          const updatedNetworks = [...prevNetworks];
          updatedNetworks[currentNetworkIndex] = newData;
          return updatedNetworks;
        });
      }} getData={getData} />
      {/* <ModalNombre isModalOpen={isModalOpen} toggleModal={toggleModal} setData={setData} getData={getData} /> */}
      
    </div>
  );
};

export default App;