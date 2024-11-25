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

//import { Options } from "./interfaces/Options";

const App: React.FC = () => {
	const [data, setData] = useState<GraphData>({
		nodes: [] as NodeData[],
		edges: [] as EdgeData[],
	});

	//const [hoveredNode, setHoveredNode] = useState<string | number | null>(null); // Nodo en hover

	const getData = () => data;

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [entidad, setEntidad] = useState('');
	//const {options} = Options();

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


	const handleNodeClick = (event: any) => {
		console.log("Node clicked:", event);
	};

	const handleNodeHover = (event: any) => {
		
		console.log("Node hovered:", event);
		/*if (!event || !event.node) return; // Verifica que haya un nodo en hover
		setHoveredNode(event.node);
	
		// Cambia dinámicamente el estilo del nodo al hacer hover
		setData((prevData) => ({
			...prevData,
			nodes: prevData.nodes.map((node) =>
				node.id === event.node
					? {
						  ...node,
						  font: {
							  size: 20, // Aumenta el tamaño de la etiqueta
							  color: '#000000', // Color del texto
							  background: 'rgba(255, 255, 255, 1)', // Fondo blanco sólido
							  bold: true, // Texto en negrita
							  multi: true, // Permite múltiples líneas
						  },
					  }
					: node
			),
		}));*/
	}

	const handleNodeBlur = () => {
		/*if (hoveredNode !== null) {
		  // Restaura el estilo del nodo anterior
		  setData((prevData) => ({
			...prevData,
			nodes: prevData.nodes.map((node) =>
			  node.id === String(hoveredNode)
				? {
					...node,
					font: {
					  size: 14, // Tamaño original
					  color: "#000", // Color original
					  background: "rgba(255,255,255,0.7)", // Fondo original
					  bold: false,
					},
				  }
				: node
			),
		  }));
		  setHoveredNode(null); // Limpia el nodo en hover
		}
		  */
	};

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
	//   edges: {
	// 	smooth:{
	// 	  enabled: true,
	// 	  type: 'curvedCW',
	// 	  roundness: 0.5
	// 	}
	//   },
	  physics: {
		enabled: true, // Habilitar la física para permitir el movimiento de nodos
		solver: 'hierarchicalRepulsion',
		hierarchicalRepulsion: {
		  centralGravity: 0.0,
		  springLength: 250, // Aumentar la longitud de los resortes para más espacio entre nodos
		  springConstant: 0,
		  nodeDistance: 450, // Aumentar la distancia entre nodos
		  damping: 1, // Aumentar el damping para reducir el rebote
		  avoidOverlap: 1, // Evitar la superposición de nodos
		},
		stabilization: {
		  enabled: false,
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
					onNodeBlur={handleNodeBlur} 
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