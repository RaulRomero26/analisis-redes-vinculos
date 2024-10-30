// useContextMenu.tsx
import { useState } from 'react';
import { GraphData } from '../interfaces/GraphData';
import { EdgeData } from '../interfaces/EdgeData';
import { useSearchEntity } from './useSearchEntity';
import { useGraphFunctions } from './useGraphFunctions';
import { createNodeData } from '../interfaces/NodeData';
import { v4 as uuidv4 } from 'uuid';

interface ContextMenuState {
    x: number;
    y: number;
    edgeId: string | null;
    nodeId: string | null;
}

const useContextMenu = (data: GraphData, setData: React.Dispatch<React.SetStateAction<GraphData>>, getData: () => GraphData) => {
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({ x: 0, y: 0, edgeId: null, nodeId: null });

    const {searchData} = useSearchEntity();
    const { addNode,addEdge } = useGraphFunctions(setData,getData);

    const handleContextMenu = (event: any) => {
        event.event.preventDefault();
        if (event.edges.length > 0) {
            setContextMenu({ x: event.event.clientX, y: event.event.clientY, edgeId: event.edges[0], nodeId: null });
        } 
        if (event.nodes.length > 0) {
            setContextMenu({ x: event.event.clientX, y: event.event.clientY, edgeId: null, nodeId: event.nodes[0] });
        } 
    };

    const handleAddData = () => {
        console.log('le pique a una opcion de add data',contextMenu);
        if (contextMenu.edgeId !== null) {
            const newEdges = data.edges.map((edge: EdgeData) => {
                if (edge.id === contextMenu.edgeId) {
                    return { ...edge, data: { ...edge, newData: "Nuevo dato" } };
                }
                return edge;
            });
            setData({ ...data, edges: newEdges });
        }
        if (contextMenu.nodeId !== null) {
            const newNodes = data.nodes.map(node => {
                if (node.id === contextMenu.nodeId) {
                    return { ...node, data: { ...node, newData: "Nuevo dato" } };
                }
                return node;
            });
            setData({ ...data, nodes: newNodes });
            console.log(data);
        }
        setContextMenu({ x: 0, y: 0, edgeId: null, nodeId: null });
    };

    const handleSearchExtended = async() => {
        console.log('le pique a una opcion de search extended',contextMenu.nodeId);

        if (contextMenu.nodeId !== null) {
            const node = data.nodes.find(node => node.id === contextMenu.nodeId);
            if (node) {
                console.log('Buscando entidad', node);
                
                const respuesta =await  searchData({ entidad: node.type || '', payload: { label: node.label } });
                console.log('RESPUESTA:',respuesta.data.remisiones);
                if(respuesta.data.remisiones.length > 0){

                    respuesta.data.remisiones.map((item: any) => {
                        console.log('item:',item);
                        
                        const newNode = createNodeData(uuidv4(), item.No_Remision, item.No_Remision, "image", 15, "blue", "remision", item.No_Remision);
                        console.warn('NEW NODE TO EDGE:',newNode);
                        addNode(newNode , (data: any) => {
                            console.warn('Node added:', data);
                        });

                        addEdge({ from: node.id, to: newNode.id }, (data: any) => {
                            console.log('Edge added:', data);
                        });
                    });
                }
                
            } else {
            console.log('Node not found');
            }
        }

        setContextMenu({ x: 0, y: 0, edgeId: null, nodeId: null });
    };

    return {
        contextMenu,
        handleContextMenu,
        handleAddData,
        handleSearchExtended,
        closeContextMenu: () => setContextMenu({ x: 0, y: 0, edgeId: null, nodeId: null }),
    };
};

export default useContextMenu;