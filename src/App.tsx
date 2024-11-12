// src/App.tsx
import React, { useEffect, useState } from "react";
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

import { Options } from "./interfaces/Options";

const App: React.FC = () => {
	const [data, setData] = useState<GraphData>({
		nodes: [] as NodeData[],
		edges: [] as EdgeData[],
	});

	const getData = () => data;

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [entidad, setEntidad] = useState('');
	const {options} = Options();

	useEffect(() => {	
		console.log(options);
	}, []);
	// Pass getData correctly to useGraphFunctions
	//const { editNode, editEdge, addEdgeControl, addNode, deleteNode, deleteEdge } = useGraphFunctions(setData, getData);

	const { contextMenu, handleContextMenu, handleAddData, closeContextMenu, handleSearchExtended,
		isModalFichasOpen, selectedNode, setIsModalFichasOpen, isModalContactosOpen, setIsModalContactosOpen
	} = useContextMenu(data, setData, getData);
	const { searchData } = useSearchEntity();
	const { showDetails } = useShowDetails();


	const handleNodeClick = (event: any) => {
		console.log("Node clicked:", event);
	};

	const handleNodeHover = (event: any) => {
		console.log("Node hovered:", event);
	}

	const handleEdgeHover = (event: any) => {
		console.log("Edge hovered:", event);
	}

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
		console.log("Data CAMBIO:", data);
	}
		, [data]);

	/*
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
	  edges: {
		smooth:{
		  enabled: true,
		  type: 'curvedCW',
		  roundness: 0.5
		}
	  },
	  physics: {
		enabled: true, // Habilitar la física para permitir el movimiento de nodos
		solver: 'hierarchicalRepulsion',
		hierarchicalRepulsion: {
		  centralGravity: 0.0,
		  springLength: 250, // Aumentar la longitud de los resortes para más espacio entre nodos
		  springConstant: 0.01,
		  nodeDistance: 450, // Aumentar la distancia entre nodos
		  damping: 1, // Aumentar el damping para reducir el rebote
		  avoidOverlap: 1, // Evitar la superposición de nodos
		},
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
  */


	return (
		<div className="" onContextMenu={(e) => e.preventDefault()}>
			<div className="grid grid-cols-1 gap-4">
				<DropdownMenu handleMenuClick={handleMenuClick} />
			</div>
			<div className="" style={{ height: '85vh' }}>
				<NetworkGraph
					data={data}
					options={options}
					onClick={handleNodeClick}
					onNodeHover={handleNodeHover}
					onEdgeHover={handleEdgeHover}
					onContext={handleContextMenu}
				/>
				{(contextMenu.edgeId || contextMenu.nodeId) && (
					<ContextMenu
						x={contextMenu.x}
						y={contextMenu.y}
						nodeId={contextMenu.nodeId}
						getData={getData}
						setData={setData}
						onAddData={handleAddData}
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
					// Función para cerrar el modal
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
					// Función para cerrar el modal
					/>
				)}
			</div>
			<ModalSwitch entidad={entidad} isModalOpen={isModalOpen} toggleModal={toggleModal} setData={setData} getData={getData} />
			{/* <ModalNombre isModalOpen={isModalOpen} toggleModal={toggleModal} setData={setData} getData={getData} /> */}
			<SaveNetwork data={data} setData={setData} />

		</div>
	);
};

export default App;