// src/App.tsx
import React, { useEffect, useRef, useState } from "react";
import NetworkGraph from "./components/NetworkGraph";
import ContextMenu from "./components/ContextMenu";
import { GraphData } from "./interfaces/GraphData";
import { useGraphFunctions } from "./hooks/useGraphFunctions";
import useContextMenu from "./hooks/useContextMenu";
import { EdgeData } from "./interfaces/EdgeData";
import DropdownMenu from "./ui/DropDownMenu";
import { ModalSwitch, ModalFichas, ModalContactos } from "./components/Modals";
import { NodeData } from "./interfaces/NodeData";
import { useShowDetails } from "./hooks/useShowDetails";
import { EditNodeForm } from "./components/EditNodeForm";
import Modal from 'react-modal';
import FisicasCheck from "./components/FisicasCheck";
import { Toaster } from 'react-hot-toast';
import SearchNode from "./components/SearchNode";

Modal.setAppElement('#root');

const App: React.FC = () => {
  const [data, setData] = useState<GraphData>({
    nodes: [] as NodeData[],
    edges: [] as EdgeData[],
  });

  const getData = () => data;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entidad, setEntidad] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNodeEdit, setSelectedNodeEdit] = useState<NodeData | null>(null);
  const [selectedEdgeEdit, setSelectedEdgeEdit] = useState<EdgeData | null>(null);
  const [nodeIDClicked, setNodeIDClicked] = useState<string | null>(null);
  const [fisicas, setFisicas] = useState(false);

  const graphRef = useRef<any>(null);

  useEffect(() => {
    //console.log(options);
  }, [fisicas]);

  const { editNode, editEdge, addEdgeControl, addNode, deleteNode, deleteEdge } = useGraphFunctions(setData, getData);

  const { contextMenu, handleContextMenu, closeContextMenu, handleSearchExtended,
    isModalFichasOpen, selectedNode, setIsModalFichasOpen, isModalContactosOpen, setIsModalContactosOpen
  } = useContextMenu(data, setData, getData);
  const { showDetails } = useShowDetails();
  const handleNodeHover = (_event: any) => { };

  const handleEdgeHover = (_event: any) => { };

  const handleAddEdge = () => {
    if (graphRef.current) {
      graphRef.current.addEdgeMode(); // Habilita el modo de agregar edges
    } else {
      //console.warn("Graph reference is null.");
    }
  };

  const handleNodeClick = (event: any) => {
    console.log(event);
    setNodeIDClicked(event.nodes[0]);
    if (deleteMode) {
      // Eliminar el nodo
      //console.log('ELIMINAR ESTA EN TRUE:', event);
      deleteNode(event, () => { });
      setDeleteMode(false);
    } else {
      // Otro tipo de manejo de clic
      //console.log("Node clicked:", event);
    }
  };


  const toggleModal = (entidad?: string) => {
    setIsModalOpen(!isModalOpen);
    if (entidad) {
      setEntidad(entidad);
    }
  };

  const handleMenuClick = (entidad: string) => {
    //console.warn("Entidad:", entidad);
    toggleModal(entidad);
    //searchData({ entidad, payload: {} });
  };

  const handleShowDetails = (node: NodeData) => {
    showDetails(node);
  };


  const handleEditAttributes = (node?: NodeData, edge?: EdgeData ) => {
    //console.log("Edit attributes:", node);
    setSelectedNodeEdit(node || null);
    setSelectedEdgeEdit(edge || null);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedNodeEdit(null);
    setSelectedEdgeEdit(null)
  };

  const deleteElement = () => {
    if (graphRef.current) {
      //console.log("Delete element mode");
      setDeleteMode(true);
    } else {
      //console.warn("Graph reference is null.");
    }
  };

  useEffect(() => {
    console.log("Data CAMBIO:", data);
    setData(data);
  }, [data]);

  useEffect(() => {
    if (deleteMode && selectedNode) {
      // Eliminar el nodo
      //console.log('ELIMINAR ESTA EN TRUE:', selectedNode);
      deleteNode(selectedNode, () => { });
    }
  }, [deleteMode, selectedNode]);


  useEffect(() => {
    console.log('selectedNodeEdit', selectedNodeEdit);
  }, [selectedEdgeEdit]);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      console.log('efecto paste')
      if (items) {
        console.log(items)
        for (const item of items) {
          console.log(item)
          if (item.kind === 'file' && item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const imageUrl = e.target?.result as string;
                console.log('node clickeado', nodeIDClicked)
                if (nodeIDClicked) {
                  // Si hay un nodo seleccionado, buscar el nodo por ID y asignar la imagen a ese nodo
                  const nodeToUpdate = data.nodes.find((node) => node.id === nodeIDClicked);
                  console.log('UPDATE POR CLCK', nodeToUpdate)
                  if (nodeToUpdate) {
                    nodeToUpdate.image = imageUrl;
                    setData((prevData) => ({
                      ...prevData,
                      nodes: prevData.nodes.map((node) =>
                        node.id === nodeIDClicked ? nodeToUpdate : node
                      ),
                    }));
                  }
                } else {
                  // Si no hay un nodo seleccionado, buscar el nodo por nombre
                  console.log(file.name.split('.')[0])
                  const nodeName = file.name.split('.')[0];
                  const nodeToUpdate = data.nodes.find((node) => node.name === nodeName);
                  console.log('encontro?', nodeToUpdate)
                  if (nodeToUpdate) {
                    nodeToUpdate.image = imageUrl;
                    setData((prevData) => ({
                      ...prevData,
                      nodes: prevData.nodes.map((node) =>
                        node.id === nodeToUpdate.id ? nodeToUpdate : node
                      ),
                    }));
                  }
                }
              };
              reader.readAsDataURL(file);
            }
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [data, nodeIDClicked]);

  const options = {
    locale: 'es',
    interaction: {
      multiselect: true,
      hover: true,
      dragNodes: true,
      zoomSpeed: 1,
      zoomView: true,
      navigationButtons: true,
      keyboard: true,
    },
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
        direction: 'UD',
        sortMethod: 'hubsize',
        nodeSpacing: 400,
        levelSeparation: 250,
        shakeTowards: 'roots',
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
    nodes: {
      font: {
        size: 14,
        color: '#000000',
        face: 'arial',
        background: 'rgba(255, 255, 255, 0.8)',
        strokeWidth: 0,
      },
    },
    physics: {
      enabled: true,
      solver: 'hierarchicalRepulsion',
      hierarchicalRepulsion: {
        centralGravity: 0.0,
        springLength: 150,
        springConstant: 0,
        nodeDistance: 150,
        damping: 1,
        avoidOverlap: 1,
      },
      stabilization: {
        enabled: false,
        fit: false, // Ajusta la vista automáticamente
      },
    },
  };
  
  const noPhisicOptions = {
    locale: 'es',
    interaction: {
      multiselect: true,
      hover: true,
      dragNodes: true,
      dragView: true,
      zoomSpeed: 1,
      zoomView: true,
      navigationButtons: true,
      keyboard: true,
    },
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
        enabled: false,
      },
    },
    edges: {
      smooth: false,
      arrows: {
        to: { enabled: true, scaleFactor: 1 },
      },
      font: {
        background: 'rgba(255, 255, 255, 1)',
      },
    },
    nodes: {
      font: {
        size: 14,
        color: '#000000',
        face: 'arial',
        background: 'rgba(255, 255, 255, 0.8)',
        strokeWidth: 0,
      },
    },
    physics: {
      enabled: false,
      stabilization: {
        enabled: false,
        fit: false, // Desactiva el ajuste automático de la vista
      },
    },
  };

  const customStyles = {
    content: {
      width: '430px',
      height: 'auto',
      margin: 'auto',
      padding: '20px',
      borderRadius: '8px',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  };

  return (
    <div className="" onContextMenu={(e) => e.preventDefault()}>
      <div> 
     
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            fontSize: '20px', // Tamaño de la fuente
            padding: '22px', // Relleno para hacer el toast más grande
            background: '#333', // Color de fondo
            color: '#fff', // Color del texto
          }
        }}
      />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <DropdownMenu 
        data={data} 
        setData={setData} 
        handleMenuClick={handleMenuClick} 
        addEdge={handleAddEdge} 
        deleteElement={deleteElement}  
        />
        <div className="flex space-x-4">
          <FisicasCheck fisicas={fisicas} setFisicas={setFisicas}/>
          <SearchNode getData={getData} />
        </div>
      </div>
      <div className="" style={{ height: '92vh' }}>
        <NetworkGraph
          data={data}
          setData={setData}
          options={fisicas ? options : noPhisicOptions}
          onClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          onEdgeHover={handleEdgeHover}
          onContext={handleContextMenu}
          ref={graphRef}
          key={fisicas ? 'withPhysics' : 'withoutPhysics'}
        />
        {(contextMenu.edgeId || contextMenu.nodeId) && (
          <>
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              nodeId={contextMenu.nodeId}
              edgeId={contextMenu.edgeId}
              getData={getData}
              setData={setData}
              onSearchExtended={handleSearchExtended}
              onEditAttributes={handleEditAttributes}
              onClose={() => {
                closeContextMenu();
                options.interaction.zoomView = true;
              }}
              onShowDetails={handleShowDetails}
            />
            {options.interaction.zoomView = false}
          </>
        )}

        {isModalFichasOpen && (
          <ModalFichas
            node={selectedNode}
            isOpen={isModalOpen}
            onClose={() => setIsModalFichasOpen(false)}
            data={data}
            setData={setData}
            getData={getData}
          />
        )}

        {isModalContactosOpen && (
          <ModalContactos
            node={selectedNode}
            isOpen={isModalOpen}
            onClose={() => setIsModalContactosOpen(false)}
            data={data}
            setData={setData}
            getData={getData}
          />
        )}
      </div>
      <ModalSwitch entidad={entidad} isModalOpen={isModalOpen} toggleModal={toggleModal} setData={setData} getData={getData} />
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Node or Edge"
        style={customStyles}
      >
        {selectedNodeEdit || selectedEdgeEdit ? (
          <EditNodeForm
            node={selectedNodeEdit}
            edge={selectedEdgeEdit}
            setData={setData}
            getData={getData}
            onRequestClose={closeEditModal}
          />
        ) : null}
      </Modal>
    </div>
  );
};

export default App;