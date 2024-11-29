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
import { EditNodeForm } from "./components/EditNodeForm";
import Modal from 'react-modal';

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

  const graphRef = useRef<any>(null);

  useEffect(() => {
    console.log(options);
  }, []);

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
      console.log('ELIMINAR ESTA EN TRUE:', event);
      deleteNode(event, () => { });
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

  const handleEditAttributes = (node: NodeData) => {
    console.log("Edit attributes:", node);
    setSelectedNodeEdit(node);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedNodeEdit(null);
  };

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
      deleteNode(selectedNode, () => { });
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
    },
  };

  return (
    <div className="" onContextMenu={(e) => e.preventDefault()}>
      <div className="grid grid-cols-1 gap-4">
        <DropdownMenu data={data} setData={setData} handleMenuClick={handleMenuClick} addEdge={handleAddEdge} deleteElement={deleteElement} />
      </div>
      <div className="" style={{ height: '92vh' }}>
        <NetworkGraph
          data={data}
          options={options}
          onClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          onEdgeHover={handleEdgeHover}
          onContext={handleContextMenu}
          ref={graphRef}
        />
        {(contextMenu.edgeId || contextMenu.nodeId) && (
          <>
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              nodeId={contextMenu.nodeId}
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
            node={selectedNodeEdit}
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
        contentLabel="Edit Node"
      >
        {selectedNodeEdit && (
          <EditNodeForm
            node={selectedNodeEdit}
            setData={setData}
            getData={getData}
            isOpen={isEditModalOpen}
            onRequestClose={closeEditModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default App;