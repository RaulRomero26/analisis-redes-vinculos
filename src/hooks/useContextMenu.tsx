// useContextMenu.tsx
import { useState } from 'react';
import { GraphData } from '../interfaces/GraphData';
import { EdgeData } from '../interfaces/EdgeData';
import { useSearchEntity } from './useSearchEntity';
import { useGraphFunctions } from './useGraphFunctions';
import { createNodeData, NodeData } from '../interfaces/NodeData';
import { v4 as uuidv4 } from 'uuid';

interface ContextMenuState {
    x: number;
    y: number;
    edgeId: string | null;
    nodeId: string | null;
}

const useContextMenu = (data: GraphData, setData: React.Dispatch<React.SetStateAction<GraphData>>, getData: () => GraphData) => {
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({ x: 0, y: 0, edgeId: null, nodeId: null });

    const {
        searchData,
        searchPhone,
        searchContacts,
        searchHistorico,
        searchInspeccion,
        searchDetenidoCon
    } = useSearchEntity();

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

    const handleSearchExtended = async(opcion:string) => {
        console.log('le pique a una opcion de search extended',contextMenu.nodeId,'opcion:',opcion);

        if (contextMenu.nodeId !== null) {
            const node = data.nodes.find(node => node.id === contextMenu.nodeId);
            if (node) {
                console.log('Buscando entidad', node);
                switch (node.type) {
                    case 'persona':
                        if(opcion === 'Buscar Remisiones')handleSearchRemisiones(node);
                        if(opcion === 'Buscar Maestro')handleSearchMaestroPersona(node);
                        break;
                    case 'remision':
                        if(opcion === 'Telefono') handleSearchTelefono(node);
                        if(opcion ==='Extraer Contactos') handleSearchContactos(node);
                        if(opcion ==='Detenido Con') handleSearchDetenidoCon(node);
                        break;
                    
                    case 'telefono':

                        break;

                
                    default:
                        break;
                }
                
              
                
            } else {
            console.log('Node not found');
            }
        }

        setContextMenu({ x: 0, y: 0, edgeId: null, nodeId: null });
    };

    const handleSearchRemisiones = async(node:NodeData) => {
        const respuesta =await  searchData({ entidad: node.type || '', payload: { label: node.label } });
        console.log('RESPUESTA:',respuesta.data.remisiones);
        if(respuesta.data.remisiones.length > 0){

            respuesta.data.remisiones.map((item: any) => {
                console.log('item:',item);
                
                const newNode = createNodeData(uuidv4(), item.No_Remision, item.No_Remision, "image", 15, "blue", "remision", 'persona', item);
                console.warn('NEW NODE TO EDGE:',newNode);
                addNode(newNode , (data: any) => {
                    console.warn('Node added:', data);
                });

                addEdge({ from: node.id, to: newNode.id, label: `Remitido ${new Date(newNode.data.Fecha_Registro_Detenido).toLocaleDateString()}` }, (data: any) => {
                    console.log('Edge added:', data);
                });
            });
        }
    };

    const handleSearchTelefono = async(node:NodeData) => {
        const respuesta =await  searchPhone({ entidad: node.type || '', payload: { label: node.label } });
        console.log('RESPUESTA:',respuesta.data.remisiones);
        if(respuesta.data.remisiones.length){
            console.log('SI HAY TELEFONOS');
            respuesta.data.remisiones.map((item: any) => {
                console.log('item:',item);
                if(item.Telefono === '') return;
                const newNode = createNodeData(uuidv4(), item.Telefono, item.Telefono, "image", 15, "blue", "telefono",'telefono',item);
                console.warn('NEW NODE TO EDGE:',newNode);
                addNode(newNode , (data: any) => {
                    console.warn('Node added:', data);
                });

                addEdge({ from: node.id, to: newNode.id, label:'Telefono de detenido' }, (data: any) => {
                    console.log('Edge added:', data);
                });
            });
        }
    };

    const handleSearchContactos = async(node:NodeData) => {
        const respuesta =await  searchContacts({ entidad: node.type || '', payload: { label: node.label,data: node.data } });
        console.log('RESPUESTA:',respuesta.data.remisiones);
        if(respuesta.data.remisiones.length){
            console.log('SI HAY CONTACTOS');
            respuesta.data.remisiones.map((item: any) => {
                console.log('item:',item);
                
                const newNode = createNodeData(uuidv4(), `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, item.Telefono, "image", 15, "blue", "persona", 'persona',item);
                console.warn('NEW NODE TO EDGE:',newNode);
                addNode(newNode , (data: any) => {
                    console.warn('Node added:', data);
                });

                addEdge({ from: node.id, to: newNode.id, label: 'Contacto de detenido' }, (data: any) => {
                    console.log('Edge added:', data);
                });

                if(newNode.data.Telefono !== '' || newNode.data.Telefono !== '0') {
                    const newNodePhone = createNodeData(uuidv4(), newNode.data.Telefono, newNode.data.Telefono, "image", 15, "blue", "telefono",'telefono',newNode.data);

                    addNode(newNodePhone , (data: any) => {
                        console.warn('Node added:', data);
                    });

                    addEdge({ from: newNode.id, to: newNodePhone.id, label:'Telefono de contacto' }, (data: any) => {
                        console.log('Edge added:', data);
                    });

                }

                addNode
            });
        }
    };

    const handleSearchHistorico = async(node:NodeData) => {
        const respuesta =await  searchHistorico({ entidad: node.type || '', payload: { label: node.label } });
        console.log('RESPUESTA:',respuesta.data.historico);
        if(respuesta.data.historico.length > 0){

            respuesta.data.historico.map((item: any) => {
                console.log('item HISTORICO:',item);
                
                const newNode = createNodeData(uuidv4(), item.Folio, item.Folio, "image", 15, "blue", "remision-historica",'persona',item);
                console.warn('NEW NODE TO EDGE:',newNode);
                addNode(newNode , (data: any) => {
                    console.warn('Node added:', data);
                });

                addEdge({ from: node.id, to: newNode.id, label: `Detencion Historica ` }, (data: any) => {
                    console.log('Edge added:', data);
                });
            });
        }
    };

    const handleSearchInspeccion = async(node:NodeData) => {
        const respuesta =await  searchInspeccion({ entidad: node.type || '', payload: { label: node.label } });
        console.log('RESPUESTA:',respuesta.data.inspeccion);
        if(respuesta.data.inspeccion.length > 0){

            respuesta.data.inspeccion.map((item: any) => {
                console.log('item:',item);
                
                const newNode = createNodeData(uuidv4(), item.Id_Inspeccion, item.Id_Inspeccion, "image", 15, "blue", "inspeccion",'persona',item);
                console.warn('NEW NODE TO EDGE:',newNode);
                addNode(newNode , (data: any) => {
                    console.warn('Node added:', data);
                });

                addEdge({ from: node.id, to: newNode.id, label: `Inspeccionado ${new Date(newNode.data.Fecha_Hora_Inspeccion).toLocaleDateString()}`} , (data: any) => {
                    console.log('Edge added:', data);
                });
            });
        }
    };

    const handleSearchDetenidoCon = async(node:NodeData) => {
        const respuesta =await  searchDetenidoCon({ entidad: node.type || '', payload: { Ficha: node.data.Ficha, RemisionPrimaria: node.data.No_Remision} });
        console.log('RESPUESTA:',respuesta.data.remisiones);
        if(respuesta.data.remisiones.length){
            console.log('SI HAY DETENIDOS CON');
            respuesta.data.remisiones.map((item: any) => {
                console.log('item:',item);
                
                const newNode = createNodeData(uuidv4(), `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, "image", 15, "blue", "persona",'persona',item);
                console.warn('NEW NODE TO EDGE:',newNode);
                addNode(newNode , (data: any) => {
                    console.warn('Node added:', data);
                });

                addEdge({ from: node.id, to: newNode.id, label: 'Detenido Con' }, (data: any) => {
                    console.log('Edge added:', data);
                });
            });
        }
    };

    const handleSearchMaestroPersona = async(node:NodeData) => {
        
        handleSearchRemisiones(node);
        handleSearchHistorico(node);
        handleSearchInspeccion(node);

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