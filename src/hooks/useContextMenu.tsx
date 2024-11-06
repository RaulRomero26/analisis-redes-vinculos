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
    const [isModalFichasOpen, setIsModalFichasOpen] = useState(false);  // Añade estado para el modal
    const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
    const [isModalContactosOpen, setIsModalContactosOpen] = useState(false);  // Añade estado para el modal

    const {
        searchData,
        searchPhone,
        searchHistorico,
        searchInspeccion,
        searchVehiculoInspeccion,
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
                console.warn('Buscando entidad', node);
                switch (node.type) {
                    case 'persona':
                    case 'entrda-persona':
                    case 'contacto':
                    
                        if(opcion === 'Buscar Remisiones')handleSearchRemisiones(node);
                        if(opcion === 'Buscar Maestro')handleSearchMaestroPersona(node);
                        if(opcion === 'Telefono') handleSearchTelefono(node);
                        if(opcion === 'Consultas') handleSearchInspeccion(node);
                        if(opcion ==='Extraer Contactos') handleContactosModal(node);
                        if(opcion ==='Detenido Con') handleDetenidoConModal(node);
                        
                        break;
                    
                    case 'inspeccion':
                        if(opcion === 'Vehiculos') handleSearchVehiculosInspeccion(node);
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

    /* FUNCIONES DE EXPANSION DE LA RED  */

    const handleSearchTelefono = async(node:NodeData) => {
        const respuesta =await  searchPhone({ entidad: node.type || '', payload: { label: node.label } });
        console.log('RESPUESTA:',respuesta.data.remisiones);
        if(respuesta.data.remisiones.length){
            console.log('SI HAY TELEFONOS');
            respuesta.data.remisiones.map((item: any) => {
                console.log('item:',item);
                if(item.Telefono === '') return;
                const newNode = createNodeData(uuidv4(), item.Telefono, item.Telefono, "image", 15, "blue", "telefono",'telefono',item,{});
                console.warn('NEW NODE TO EDGE:',newNode);
                addNode(newNode, (success: boolean) => {
                    console.log('Node added:', success);
                    if (!success) {
                        console.error('Error adding node');
                    }
                });

                addEdge({ from: node.id, to: newNode.id, label:'Telefono de detenido' }, (data: any) => {
                    console.log('Edge added:', data);
                });
            });
        }
    };

    const handleContactosModal = (node: NodeData) => {
        console.log('Disparando el modal con el nodo:', node);
        setSelectedNode(node);  // Guarda el nodo seleccionado
        setIsModalContactosOpen(true);    // Abre el modal
    };

    const handleDetenidoConModal = (node: NodeData) => {
        console.log('Disparando el modal con el nodo:', node);
        setSelectedNode(node);  // Guarda el nodo seleccionado
        setIsModalFichasOpen(true);    // Abre el modal
    };


    /* FUNCIONES DE AGREGACION DE PROPIEDADES */

    
    const handleSearchRemisiones = async(node:NodeData) => {
        const respuesta =await  searchData({ entidad: node.type || '', payload: { label: node.label } });
        console.log('RESPUESTA:',respuesta);
        if (respuesta.data.remisiones.length > 0) {
            const updatedNodes = data.nodes.map(n => {
            if (n.id === node.id) {
                let nodoModificado = n;
                console.log('NODO MODIFICADO:',nodoModificado);
                nodoModificado.data.remisiones = respuesta.data.remisiones;
                nodoModificado.atributos = {
                    ...nodoModificado.atributos,
                    detenciones: {
                        sarai: respuesta.data.remisiones.map((item: any) => ({
                            Ficha: item.Ficha,
                            No_Remision: item.No_Remision,
                            CURP: item.CURP,
                            Fec_Nac: item.Fecha_Nacimiento,
                            Correo_Electronico: item.Correo_Electronico,
                            Alias: item.Alias_Detenido,
                            Fecha_Detencion: item.Fecha_Registro_Detenido,
                            Genero: item.Genero,
                            Nombre: item.Nombre,
                            Ap_Paterno: item.Ap_Paterno,
                            Ap_Materno: item.Ap_Materno,
                        }))
                    }
                };
                nodoModificado.label = `${nodoModificado.label} \n <b>Remisiones: (${respuesta.data.remisiones.length})</b>`;
                let aliasjoin, fechadetencionjoin, noremisionjoin, curpjoin, fechanacimientojoin;
                
                aliasjoin = respuesta.data.remisiones.map((item: any) => item.Alias_Detenido).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                noremisionjoin = respuesta.data.remisiones.map((item: any) => item.No_Remision).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                curpjoin = respuesta.data.remisiones.map((item: any) => item.CURP).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                fechanacimientojoin = respuesta.data.remisiones.map((item: any) => new Date(item.Fecha_Nacimiento).toLocaleDateString()).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                fechadetencionjoin = respuesta.data.remisiones.map((item: any) => new Date(item.Fecha_Registro_Detenido).toLocaleDateString()).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                
                nodoModificado.label = `${nodoModificado.label} \n <b>Alias: </b>${aliasjoin} <b>Fecha Detencion: </b>${fechadetencionjoin} <b>No Remision: </b>${noremisionjoin} \n<b>CRUP: </b>${curpjoin} <b>Fecha Nacimiento: </b> ${fechanacimientojoin}
                `;
                
                
                return nodoModificado;
            }
            return n;
            });
            console.log('ANTES DEL SET:', data.edges);
            setData({ ...data, nodes: updatedNodes, edges: data.edges });
        }
    };


    const handleSearchHistorico = async(node:NodeData) => {
        const respuesta =await  searchHistorico({ entidad: node.type || '', payload: { label: node.label } });
        console.log('RESPUESTA:',respuesta.data.historico);
        if(respuesta.data.historico.length > 0){

            const updatedNodes = data.nodes.map(n => {
                if (n.id === node.id) {
                    let nodoModificado = n;
                    console.log('NODO MODIFICADO:',nodoModificado);
                    nodoModificado.data.historico = respuesta.data.historico;
                    nodoModificado.atributos = {
                        ...nodoModificado.atributos,
                        detenciones_historicas: {
                            historico: respuesta.data.historico.map((item: any) => ({
                                Folio: item.Folio,
                                No_Remision: '',
                                CURP: '',
                                Fec_Nac: '',
                                Correo_Electronico: '',
                                Alias: '',
                                Fecha_Detencion: item.Fecha_Rem,
                                Genero: item.Sexo_d,
                                Nombre: item.Nombre_d,
                                Ap_Paterno: item.Ap_paterno_d,
                                Ap_Materno: item.Ap_materno_d,
                            }))
                        }
                    };
                    nodoModificado.label = `${nodoModificado.label} \n <b>Historico: (${respuesta.data.historico.length})</b>`;
                    let foliojoin, fecharemjoin;
                    foliojoin = respuesta.data.historico.map((item: any) => item.Folio).join(', ');
                    fecharemjoin = respuesta.data.historico.map((item: any) => new Date(item.Fecha_Rem).toLocaleDateString()).join(', ');
                    nodoModificado.label = `${nodoModificado.label} \n <b>Folio: </b>${foliojoin} <b>Fecha Remision: </b>${fecharemjoin}`;
                    return nodoModificado;
                }
                return n;
                });
            setData({ ...data, nodes: updatedNodes, edges: data.edges });
        }
    };

    const handleSearchInspeccion = async(node:NodeData) => {
        const respuesta =await  searchInspeccion({ entidad: node.type || '', payload: { label: node.id } });
        console.log('RESPUESTA:',respuesta.data.inspeccion);
        if(respuesta.data.inspeccion.length > 0){
            respuesta.data.inspeccion.map((item: any) => {
                console.log('item:',item);
                if(item.Telefono === '') return;
                const newNode = createNodeData(`${item.Coordenada_X}, ${item.Coordenada_Y}`,`${item.Coordenada_X}, ${item.Coordenada_Y}`,`${item.Coordenada_X}, ${item.Coordenada_Y}`, "image", 15, "blue", "inspeccion",'persona',item,{
                    Alias: item.Alias,
                    Fecha: new Date(item.Fecha_Hora_Inspeccion).toLocaleDateString(),
                    Colonia: item.Colonia,
                    Calle_1: item.Calle_1,
                    Calle_2: item.Calle_2,
                    No_Exterior: item.No_Ext,
                    Coordenada_X: item.Coordenada_X,
                    Coordenada_Y: item.Coordenada_Y,
                });


                console.warn('NEW NODE TO EDGE:',newNode);
                addNode(newNode, (success: boolean) => {
                    console.log('Node added:', success);
                    if (!success) {
                        console.error('Error adding node');
                        addEdge({ from: node.id, to: newNode.id, label: 'Inspeccion' }, (data: any) => {
                            console.log('Edge added:', data);
                        });
                    }
                    else{
                        addEdge({ from: node.id, to: newNode.id, label: 'Inspeccion' }, (data: any) => {
                            console.log('Edge added:', data);
                        });
                    }
                });
            });
        }
    };

    const handleSearchVehiculosInspeccion = async(node:NodeData) => {
    
        const respuesta =await  searchVehiculoInspeccion({ entidad: node.type || '', payload: { inspeccion: node.data.Id_Inspeccion } });
        console.log('RESPUESTA:',respuesta.data.vehiculos);
        if(respuesta.data.vehiculos.length > 0){
            respuesta.data.vehiculos.map((item: any) => {
                console.log('item:',item);
                if(item.Placas === '') return;
                const newNode = createNodeData(`${item.Placas_Vehiculo}/${item.NIV}`,`${item.Placas_Vehiculo}/${item.NIV}`,`${item.Placas_Vehiculo}/${item.NIV}`, "image", 15, "blue", "vehiculo",'vehiculo',item,{
                    Marca: item.Marca,
                    Modelo: item.Modelo,
                    Tipo: item.Tipo,
                    Placas: item.Placas_Vehiculo,
                    Color: item.Color,
                    NIV: item.NIV,
                    Submarca: item.Submarca,
                    Colocacion_Placas: item.Colocacion_Placa,
                });
                console.warn('NEW NODE TO EDGE:',newNode);
                addNode(newNode, (success: boolean) => {
                    console.log('Node added:', success);
                    if (!success) {
                        console.error('Error adding node');
                    }
                    else{
                        addEdge({ from: node.id, to: newNode.id, label: 'Vehiculo' }, (data: any) => {
                            console.log('Edge added:', data);
                        });
                    }
                });
            });
        }

    
    };



    const handleSearchMaestroPersona = async(node:NodeData) => {
        
        handleSearchRemisiones(node);
        handleSearchHistorico(node);

    };


    return {
        contextMenu,
        handleContextMenu,
        handleAddData,
        handleSearchExtended,
        handleDetenidoConModal,    // Exporta esta función para usarla
        isModalFichasOpen,
        selectedNode,
        setIsModalFichasOpen,
        isModalContactosOpen,
        setIsModalContactosOpen,
        closeContextMenu: () => setContextMenu({ x: 0, y: 0, edgeId: null, nodeId: null }),
    };
};

export default useContextMenu;