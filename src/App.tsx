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
import { ModalSwitch, ModalNombre } from "./components/Modals";
import { NodeData } from "./interfaces/NodeData";

const App: React.FC = () => {
  const [data, setData] = useState<GraphData>({
    nodes: [] as NodeData[],
    edges: [] as EdgeData[],
  });

  const getData = () => data;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entidad, setEntidad] = useState('');

  //uso del hook
  // Pass getData correctly to useGraphFunctions
  const { editNode, editEdge, addNode, findNodeDetails } = useGraphFunctions(setData, getData);

  const { contextMenu, handleContextMenu, handleAddData, closeContextMenu, handleSearchExtended } = useContextMenu(data, setData, getData);
  const { searchData } = useSearchEntity();

  const handleNodeClick = (event: any) => {
    console.log("Node clicked:", event);
  };

  const toggleModal = (entidad?: string) => {
    setIsModalOpen(!isModalOpen);
    if (entidad) {
      setEntidad(entidad);
    }
  };

  const handleMenuClick = (entidad: string) => {
    toggleModal(entidad);
    searchData({ entidad, payload: {} }); 
  };

  useEffect(() => {
    console.log("Data CAMBIO:", data);
  }
  , [data]);

  const options = {
    interaction: { selectable: true, hover: true },
    manipulation: {
      enabled: true,
      initiallyActive: true,
      addNode: addNode,
      addEdge: true,
      editNode: editNode,
      editEdge: editEdge,
      deleteNode: true,
      deleteEdge: true,
    },
  };

  return (
    <div className="" onContextMenu={(e) => e.preventDefault()}>
      <div className="grid grid-cols-1 gap-4">
        <DropdownMenu handleMenuClick={handleMenuClick} />
      </div>
      <div className="" style={{ height: '80vh' }}>
        <NetworkGraph data={data} options={options} onClick={handleNodeClick} onContext={handleContextMenu} />
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
          />
        )}
      </div>
      <ModalSwitch entidad={entidad} isModalOpen={isModalOpen} toggleModal={toggleModal} setData={setData} getData={getData}/>
      <ModalNombre isModalOpen={isModalOpen} toggleModal={toggleModal} setData={setData} getData={getData} />
    </div>
  );
};

export default App;