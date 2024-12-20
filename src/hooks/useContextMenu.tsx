// useContextMenu.tsx
import { useState } from 'react';
import { GraphData } from '../interfaces/GraphData';
import { EdgeData } from '../interfaces/EdgeData';
import { useSearchEntity } from './useSearchEntity';
import { useGraphFunctions } from './useGraphFunctions';
import { createNodeData, NodeData } from '../interfaces/NodeData';

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
        buscarLlamadas911,
        searchHistorico,
        searchInspeccion,
        searchInspeccionVehiculo,
        searchVehiculoInspeccion,
        searchRemisionesTelefono,
        searchVehiculoRemision,
        buscarContactosPorTelefono,
        searchPersonaInspeccion,
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

    const handleSearchExtended = async(opcion:string) => {
        console.log('le pique a una opcion de search extended',contextMenu.nodeId,'opcion:',opcion);

        if (contextMenu.nodeId !== null) {
            const node = data.nodes.find(node => node.id === contextMenu.nodeId);
            if (node) {
                console.warn('Buscando entidad', node);
               
                if(opcion === 'Buscar Maestro')handleSearchMaestroPersona(node); //Buscar Remisiones e inspecciones por Nombre
                if(opcion === 'Buscar Remisiones')handleSearchRemisiones(node); //Buscar Remisiones por Nombre
                if(opcion === 'Consultas') handleSearchInspeccion(node); // Buscar inspecciones por nombre
                if(opcion === 'Telefono Remisiones') handleSearchRemisionesTelefono(node); //Busca Remisiones a partir de un telefono
                if(opcion === 'Telefono 911') handleSearchTelefono(node); // Buscar un telefono que se encuentra en atributos (911)
                if(opcion === 'Telefono Contactos') handleSearchContactosTelefono(node); // Buscar un telefono que se encuentra en atributos (Contactos)
                if(opcion === 'Extraer Vehiculos') handleSearchVehiculosInspeccion(node); //Busca Vehiculos a partir de una inspeccion
                if(opcion === 'Extraer Personas') handleSearchPersonasInspeccion(node); //Busca Personas a partir de una inspeccion
                /* --------- FUNCIONES QUE ME EXTRAEN DIRECTAMENTE SIN NECESIDAD DE MODAL ----------- */
                if(opcion === 'Extraer Telefonos') handleExtraerTelefonos(node); // Buscar Telefonos si hay remision
                /* --------- ESTAS FUNCIONES ME DISPARAN UN MODAL ----------- */
                if(opcion === 'Extraer Contactos') handleContactosModal(node); // Buscar Contactos si hay remision
                if(opcion === 'Detenido Con') handleDetenidoConModal(node); // Buscar Detenido Con si hay remision
            }
                
        } else {
            console.log('Node not found');
        }
        setContextMenu({ x: 0, y: 0, edgeId: null, nodeId: null });
    };

    /* FUNCIONES DE EXPANSION DE LA RED  */
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
        let respuesta:any;
        if(node.type === 'entrada-telefono'){
            respuesta =await  searchRemisionesTelefono({ entidad: node.type || '', 
                payload: { 
                    telefono: node.atributos.Telefono, 
                    tipo: node.type 
                } 
            });
            if(respuesta.data.remisiones.length > 0){
                respuesta.data.remisiones.map((item: any) => {
                    const newNode = createNodeData(
                        `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`,
                        `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, 
                        `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, 
                        "image", 
                        15, 
                        "blue", 
                        "persona",
                        'persona',
                        item,
                        {
                            "Nombre":item.Nombre,
                            "Ap_Paterno":item.Ap_Paterno,
                            "Ap_Materno":item.Ap_Materno,
                            "Telefono":item.Telefono
                        }
                    );
                    console.warn('NEW NODE TO EDGE:',newNode);
                    addNode(newNode, (data: any) => {
                        console.log('Node added:', data.status);
                        if (!data.status) {
                            console.error('Error adding node');

                        }
                        else{
                            addEdge({ from: node.id, to: newNode.id, label: 'Detenido Con' }, (data: any) => {
                                console.log('Edge added:', data);
                            });
                        }
                    });
                });
            
            }
        }
        if(node.type === 'entrada-persona' || node.type === 'persona'){
            respuesta = await searchData({ entidad: node.type || '', 
                payload: { 
                    label: `${node.atributos.Nombre} ${node.atributos.Ap_Paterno} ${node.atributos.Ap_Materno}`, 
                    tipo: node.type 
                } 
            });
            console.log('RESPUESTA:',respuesta);
            if (respuesta.data.remisiones.length > 0) {
                const updatedNodes = data.nodes.map(n => {
                if (n.id === node.id) {
                    let nodoModificado = n;
                    console.log('NODO MODIFICADO:',nodoModificado);
                    nodoModificado.data.remisiones = respuesta.data.remisiones;
                    nodoModificado.atributos.Telefono = respuesta.data.remisiones
                        .map((item: any) => item.Telefono)
                        .filter((telefono: string) => !["0", "000", "00", "0000", "00000", "000000", "sd", "s/d", "SD", "S/D"].includes(telefono))
                        .join(', ');
                    nodoModificado.image = `http://172.18.110.25/sarai/files/Remisiones/${respuesta.data.remisiones[0].Ficha}/FotosHuellas/${respuesta.data.remisiones[0].No_Remision}/rostro_frente.jpeg`
                    let viejosAtributos = nodoModificado.atributos;
                    nodoModificado.atributos = {
                        ...nodoModificado.atributos,
                        detenciones: {
                            sarai: respuesta.data.remisiones.map((item: any) => {
                                if (viejosAtributos.detenciones && viejosAtributos.detenciones.sarai) {
                                    if (viejosAtributos.detenciones.sarai.find((element:any) => element.No_Remision === item.No_Remision)) return null;
                                }
                                return {
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
                                    Telefono: item.Telefono,
                                };
                            })
                        },
                        
                    };
                        nodoModificado.label = ``;
                        nodoModificado.label = `${nodoModificado.id} \n <b>Remisiones: (${respuesta.data.remisiones.length})</b>`;
                        let aliasjoin, fechadetencionjoin, noremisionjoin, curpjoin, fechanacimientojoin;
                        
                        aliasjoin = respuesta.data.remisiones.map((item: any) => item.Alias_Detenido).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                        noremisionjoin = respuesta.data.remisiones.map((item: any) => item.No_Remision).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                        curpjoin = respuesta.data.remisiones.map((item: any) => item.CURP).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                        fechanacimientojoin = respuesta.data.remisiones.map((item: any) => new Date(item.Fecha_Nacimiento).toLocaleDateString()).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                        fechadetencionjoin = respuesta.data.remisiones.map((item: any) => new Date(item.Fecha_Registro_Detenido).toLocaleDateString()).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                        
                        nodoModificado.label = `${nodoModificado.label} \n <b>Alias: </b>${aliasjoin} \n<b>Fecha Detencion: </b>${fechadetencionjoin} \n<b>No Remision: </b>${noremisionjoin} \n<b>CRUP: </b>${curpjoin} \n<b>Fecha Nacimiento: </b> ${fechanacimientojoin}
                        `;
                    
                    
                    return nodoModificado;
                }
                return n;
                });
                console.log('ANTES DEL SET:', data.edges);
                setData({ ...data, nodes: updatedNodes, edges: data.edges });
            }
        }
        

    };


    const handleSearchHistorico = async(node:NodeData) => {
        const respuesta =await  searchHistorico({ entidad: node.type || '', payload: { label: node.id, tipo: node.type } });
        console.log('RESPUESTA:',respuesta.data.historico);
        if(respuesta.data.historico.length > 0){

            const updatedNodes = data.nodes.map(n => {
                if (n.id === node.id) {
                    let nodoModificado = n;
                    console.log('NODO MODIFICADO:',nodoModificado);
                    nodoModificado.data.historico = respuesta.data.historico;
                    let viejosAtributos = nodoModificado.atributos;
                    nodoModificado.atributos = {
                        ...nodoModificado.atributos,
                        detenciones_historicas: {
                            historico: respuesta.data.historico.map((item: any) => {
                                if (viejosAtributos.detenciones_historicas && viejosAtributos.detenciones_historicas.historico) {
                                    if (viejosAtributos.detenciones_historicas.historico.find((element: any) => element.Folio === item.Folio)) return null;
                                }
                                return {
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
                                };
                            })
                        }
                    };
                    
                    nodoModificado.label = `${nodoModificado.label} \n <b>Historico: (${respuesta.data.historico.length})</b>`;
                    let foliojoin, fecharemjoin;
                    foliojoin = respuesta.data.historico.map((item: any) => item.Folio).join(', ');
                    fecharemjoin = respuesta.data.historico.map((item: any) => new Date(item.Fecha_Rem).toLocaleDateString()).join(', ');
                    nodoModificado.label = `${nodoModificado.label} \n <b>Folio: </b>${foliojoin} \n<b>Fecha Remision: </b>${fecharemjoin}`;

                    return nodoModificado;
                }
                return n;
                });
            setData({ ...data, nodes: updatedNodes, edges: data.edges });
        }
    };

    const handleSearchInspeccion = async(node:NodeData) => {
        let payload = {};
        let respuesta:any;
        if(node.entidad === 'vehiculo'){
            payload = { placas: node.atributos.Placas, niv: node.atributos.NIV };
            respuesta =await  searchVehiculoInspeccion({ entidad: node.type || '', payload: payload }); //BUSCA UNA PLACA O NIV EN INSPECCIONES
            console.log('RESPUESTA:',respuesta.data.vehiculos);
            if(respuesta.data.vehiculos.length > 0){
                respuesta.data.vehiculos.map((item: any) => {
                    console.log('item:',item);
                    if(item.Telefono === '') return;
                    const newNode = createNodeData(
                        `${item.Coordenada_X}, ${item.Coordenada_Y}`,
                        `${item.Coordenada_X}, ${item.Coordenada_Y}`,
                        `${item.Coordenada_X}, ${item.Coordenada_Y}`,
                        "image",
                        15,
                        "blue",
                        "inspeccion",
                        'persona',
                        item,
                        {
                            Alias: item.Alias,
                            Fecha: new Date(item.Fecha_Hora_Inspeccion).toLocaleDateString(),
                            Colonia: item.Colonia,
                            Calle_1: item.Calle_1,
                            Calle_2: item.Calle_2,
                            No_Exterior: item.No_Ext,
                            Coordenada_X: item.Coordenada_X,
                            Coordenada_Y: item.Coordenada_Y,
                            Id_Inspeccion: item.Id_Inspeccion,
                        }
                    );
    
    
                    console.warn('NEW NODE TO EDGE:',newNode);
                    addNode(newNode, (data: any) => {
                        console.log('Node added:', data);
                        if (!data.status) {
                            console.error('Error adding node');
                            addEdge({ from: node.id, to: data.encontro.id, label: 'Inspeccion' }, (data: any) => {
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
        }
        if(node.entidad === 'persona'){
            payload =  { label: node.id };
            respuesta =await  searchInspeccion({ entidad: node.type || '', payload: payload });
            console.log('RESPUESTA:',respuesta.data.inspeccion);
            if(respuesta.data.inspeccion.length > 0){
                respuesta.data.inspeccion.map((item: any) => {
                    console.log('item:',item);
                    if(item.Telefono === '') return;
                    const newNode = createNodeData(
                        `${item.Coordenada_X}, ${item.Coordenada_Y}`,
                        `${item.Coordenada_X}, ${item.Coordenada_Y}`,
                        `${item.Coordenada_X}, ${item.Coordenada_Y}`,
                        "image",
                        15,
                        "blue",
                        "inspeccion",
                        'persona',
                        item,
                        {
                            Alias: item.Alias,
                            Fecha: new Date(item.Fecha_Hora_Inspeccion).toLocaleDateString(),
                            Colonia: item.Colonia,
                            Calle_1: item.Calle_1,
                            Calle_2: item.Calle_2,
                            No_Exterior: item.No_Ext,
                            Coordenada_X: item.Coordenada_X,
                            Coordenada_Y: item.Coordenada_Y,
                            Id_Inspeccion: item.Id_Inspeccion,
                        }
                    );
    
    
                    console.warn('NEW NODE TO EDGE:',newNode);
                    addNode(newNode, (data: any) => {
                        console.log('Node added:', data.status);
                        if (!data.status) {
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
        }
    };

    const handleSearchVehiculosInspeccion = async(node:NodeData) => {
    
        const respuesta =await  searchVehiculoInspeccion({ entidad: node.type || '', payload: { inspeccion: node.atributos.Id_Inspeccion, placas: node.atributos.Placas_Vehiculo, NIV: node.atributos.NIV } });
        console.log('RESPUESTA:',respuesta.data.vehiculos);
        if(respuesta.data.vehiculos.length > 0){
            respuesta.data.vehiculos.map((item: any) => {
                console.log('item:',item);
                if(item.Placas === '') return;
                const newNode = createNodeData(
                    `${item.Placas_Vehiculo}/${item.NIV}`,
                    `${item.Placas_Vehiculo}/${item.NIV}`,
                    `${item.Placas_Vehiculo}/${item.NIV}`,
                    "image",
                    15,
                    "blue",
                    "vehiculo",
                    'vehiculo',
                    item,
                    {
                        Marca: item.Marca,
                        Modelo: item.Modelo,
                        Tipo: item.Tipo,
                        Placas: item.Placas_Vehiculo,
                        Color: item.Color,
                        NIV: item.NIV,
                        Submarca: item.Submarca,
                        Colocacion_Placas: item.Colocacion_Placa,
                    }
                );
                console.warn('NEW NODE TO EDGE:',newNode);
                addNode(newNode, (data: any) => {
                    console.log('Node added:', data.status);
                    if (!data.status) {
                        console.error('Error adding node');
                        addEdge({ from: node.id, to: data.encontro.id, label: 'Vehiculo' }, (data: any) => {
                            console.log('Edge added:', data);
                        });
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

    const handleSearchTelefono = async(node:NodeData) => {
        
        const respuesta = await buscarLlamadas911({ entidad: node.type || '', payload: { telefono: node.atributos.Telefono } });
        console.log('RESPUESTA:',respuesta.data.llamadas);
        if(respuesta.data.llamadas.length){
            console.log('SI HAY LLAMADAS');
            respuesta.data.llamadas.map((item: any) => {
                console.log('item:',item);
                if(item.Telefono === '') return;
                const newNode = createNodeData(
                    `${item['Nom completo']}`, 
                    item['Nom completo'], 
                    item['Nom completo'], 
                    "image", 
                    15, 
                    "blue", 
                    "persona",
                    'persona',
                    item,
                    {
                        "Telefono":item.Telefono,
                        "Comentarios":item.Comentarios,
                        "Ubicacion":item.Ubicacion
                    }
                );
                console.warn('NEW NODE TO EDGE:',newNode);
                addNode(newNode, (data: any) => {
                    console.log('Node added:', data.status);
                    if (!data.status) {
                        console.error('Error adding node');
                    }
                });

                addEdge({ from: node.id, to: newNode.id, label:'Llamada al 911' }, (data: any) => {
                    console.log('Edge added:', data);
                });
            });
        }
    };
    
    const handleSearchRemisionesTelefono = async(node:NodeData) => { 

        const respuesta = await searchRemisionesTelefono({ entidad: node.type || '', payload: { telefono: node.atributos.Telefono } });
        console.log('RESPUESTA:',respuesta.data.remisiones);
        if (respuesta.data.remisiones.length > 0) {
            respuesta.data.remisiones.map((item: any) => {
                const newNode = createNodeData(
                    `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`,
                    `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, 
                    `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, 
                    "image", 
                    15, 
                    "blue", 
                    "persona",
                    'persona',
                    item,
                    {
                        "Nombre":item.Nombre,
                        "Ap_Paterno":item.Ap_Paterno,
                        "Ap_Materno":item.Ap_Materno,
                        "Telefono":item.Telefono
                    }
                );
                console.warn('NEW NODE TO EDGE:',newNode);
                addNode(newNode, (data: any) => {
                    console.log('Node added:', data.status);
                    if (!data.status) {
                        console.error('Error adding node');
                        addEdge({ from: node.id, to: newNode.id, label: 'Telefono dado por' }, (data: any) => {
                            console.log('Edge added:', data);
                        });
                    }
                    else{
                        addEdge({ from: node.id, to: newNode.id, label: `Dio el Telefono ${item.Telefono}` }, (data: any) => {
                            console.log('Edge added:', data);
                        });
                    }
                });
            });
        }
    };
// Buscar Contactos referidos a partir del telefono
    const handleSearchContactosTelefono = async(node:NodeData) => {
        const respuesta = await buscarContactosPorTelefono({ entidad: node.type || '', payload: { telefono: node.atributos.Telefono } });
        console.log('RESPUESTA:',respuesta.data.contactos);
        if(respuesta.data.contactos.length){
            console.log('SI HAY TELEFONOS');
            respuesta.data.contactos.map((item: any) => {
                console.log('item:',item);
                if(item.Telefono === '') return;
                const newNode = createNodeData(
                    `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, 
                    `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, 
                    `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, 
                    "image", 
                    15, 
                    "blue", 
                    "persona", 
                    'persona',
                    item,
                    {
                        "Telefono":item.Telefono,
                        "Nombre":item.Nombre,
                        "Ap_Paterno":item.Ap_Paterno,
                        "Ap_Materno":item.Ap_Materno,
                    }
                );
                console.warn('NEW NODE TO EDGE:',newNode);
                addNode(newNode, (data: any) => {
                    console.log('Node added:', data.status);
                    if (!data.status) {
                        console.error('Error adding node');
                        addEdge({ from: node.id, to: newNode.id, label: 'Telefono de Contacto' }, (data: any) => {
                            console.log('Edge added:', data);
                        });
                    }else{

                        addEdge({ from: node.id, to: newNode.id, label:'Telefono de Contacto' }, (data: any) => {
                            console.log('Edge added:', data);
                        });
                    }
                });

            });
        }
    };

    const handleSearchVehiculoRemision = async(node:NodeData) => {
        const respuesta = await searchVehiculoRemision({ entidad: node.type || '', payload: { placa: node.atributos.Placas, niv: node.atributos.NIV } });
        console.log('RESPUESTA:',respuesta.data.vehiculos);
        if(respuesta.data.vehiculos.length > 0){
            console.warn('SI HAY VEHICULOS');
            const updatedNodes = data.nodes.map(n => {
                if (n.id === node.id) {
                    let nodoModificado = n;
                    console.log('NODO MODIFICADO:',nodoModificado);
                    nodoModificado.data.vehiculos = respuesta.data.vehiculos;
                    let viejosAtributos = nodoModificado.atributos;

                    if (viejosAtributos.detenciones && viejosAtributos.detenciones.sarai) {
                        if (viejosAtributos.detenciones.sarai.find((element:any) => element.No_Remision === respuesta.data.vehiculos[0].No_Remision)) return n;
                    }

                    nodoModificado.atributos = {
                        ...nodoModificado.atributos,
                        detenciones: {
                            sarai: respuesta.data.vehiculos.map((item: any) => ({
                                Placa: item.Placa_Vehiculo,
                                Marca: item.Marca,
                                Submarca: item.Submarca,
                                Tipo: item.Tipo_Vehiculo,
                                Modelo: item.Modelo,
                                Color: item.Color,
                                Sena_Particular: item.Sena_Particular,
                                Observaciones: item.Observacion_Vehiculo,
                                NIV: item.No_Serie,
                                No_Remision: item.No_Remision,
                                Nombre: item.Nombre,
                                Ap_Paterno: item.Ap_Paterno,
                                Ap_Materno: item.Ap_Materno,	
                                Fecha_Remision: item.Fecha_Hora,
                                ID_VEHICULO: item.ID_VEHICULO
                            }))
                        }
                    };
                    nodoModificado.image = `http://172.18.110.25/sarai/public/files/Vehiculos/${respuesta.data.vehiculos[0].ID_VEHICULO}/Fotos/costado_conductor.jpeg`
                    nodoModificado.label = ``;
                    nodoModificado.label = `${nodoModificado.label} \n <b>Remisiones: (${respuesta.data.vehiculos.length})</b>`;
                    let placasjoin, nivjoin, nombresjoin, fechasjoin, remisionesjoin;
                    placasjoin = respuesta.data.vehiculos.map((item: any) => item.Placa_Vehiculo).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                    nivjoin = respuesta.data.vehiculos.map((item: any) => item.No_Serie).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                    nombresjoin = respuesta.data.vehiculos.map((item: any) => `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                    fechasjoin = respuesta.data.vehiculos.map((item: any) => new Date(item.Fecha_Hora).toLocaleDateString()).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                    remisionesjoin = respuesta.data.vehiculos.map((item: any) => item.No_Remision).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');

                    nodoModificado.label = `${nodoModificado.label} \n <b>Nombre: </b>${nombresjoin}\n<b>Placas: </b>${placasjoin} \n<b>Niv: </b>${nivjoin} \n<b>No Remision: </b>${remisionesjoin} \n<b>Fecha:</b> ${fechasjoin}`;

                    return nodoModificado;
                }
                return n;
                });
                console.log('ANTES DEL SET:', data.edges);
                setData({ ...data, nodes: updatedNodes, edges: data.edges });
                //Agregamos a las personas de los vehiculos
                respuesta.data.vehiculos.map((item: any) => {
                    const newNode = createNodeData(
                        `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`,
                        `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, 
                        `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, 
                        "image", 
                        15, 
                        "blue", 
                        "persona",
                        'persona',
                        item,
                        {
                            "Nombre":item.Nombre,
                            "Ap_Paterno":item.Ap_Paterno,
                            "Ap_Materno":item.Ap_Materno,
                            "Telefono":item.Telefono
                        }
                    );
                    console.warn('NEW NODE TO EDGE:',newNode);
                    addNode(newNode, (data: any) => {
                        console.log('Node added:', data.status);
                        if (!data.status) {
                            console.error('Error adding node');
                        }
                        else{
                            addEdge({ from: node.id, to: newNode.id, label: 'Detenido Con' }, (data: any) => {
                                console.log('Edge added:', data);
                            });
                        }
                    });
                });

        }
    }

    const handleExtraerTelefonos = async(node:NodeData) => { 

        if(node.type === 'contacto'){
            console.log('ES UN CONTACTO');
            if(node.atributos.Telefono === '') return;
            let invalidPhones = ["0", "000", "00", "0000", "00000", "000000", "sd", "s/d", "SD", "S/D"];
            if(invalidPhones.find(valor => valor === node.atributos.Telefono) ) return;
            const newNode = createNodeData(
                `${node.atributos.Telefono}`, 
                node.atributos.Telefono, 
                node.atributos.Telefono, 
                "image", 
                15, 
                "blue", 
                "telefono", 
                'telefono',
                node.atributos,
                {
                    "Telefono":node.atributos.Telefono
                }
            );
            console.warn('NEW NODE TO EDGE:',newNode);
            addNode(newNode, (data: any) => {
                console.log('Node added:', data.status);
                if (!data.status) {
                    console.error('Error adding node');
                }
            });

            addEdge({ from: node.id, to: newNode.id, label:'Telefono de Contacto' }, (data: any) => {
                console.log('Edge added:', data);
            });
        }else {

            const respuesta = node.data.remisiones;
            respuesta.map((item: any) => {
                console.log('item:',item);
                let invalidPhones = ["0", "000", "00", "0000", "00000", "000000", "sd", "s/d", "SD", "S/D"];
                if(invalidPhones.find(valor => valor === item.Telefono) ) return;
                const newNode = createNodeData(
                    `${item.Telefono}`, 
                    item.Telefono, 
                    item.Telefono, 
                    "image", 
                    15, 
                    "blue", 
                    "telefono", 
                    'telefono',
                    item,
                    {
                        "Telefono":item.Telefono
                    }
                );
                console.warn('NEW NODE TO EDGE:',newNode);
                addNode(newNode, (data: any) => {
                    console.log('Node added:', data.status);
                    if (!data.status) {
                        console.error('Error adding node');
                    }
                });
    
                addEdge({ from: node.id, to: newNode.id, label:'Telefono de Contacto' }, (data: any) => {
                    console.log('Edge added:', data);
                });
            });
        }

    }

    const handleSearchPersonasInspeccion = async(node:NodeData) => {

        const respuesta =await  searchPersonaInspeccion({ entidad: node.type || '', payload: { inspeccion: node.atributos.Id_Inspeccion } });
        console.log('RESPUESTA:',respuesta.data.personas);
        if(respuesta.data.personas.length > 0){
            respuesta.data.personas.map((item: any) => {
                console.log('item:',item);
                if(item.Placas === '') return;
                const newNode = createNodeData(
                    `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`,
                    `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`,
                    `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`,
                    "image",
                    15,
                    "blue",
                    "persona",
                    'persona',
                    item,
                    {
                        Nombre: item.Nombre,
                        Ap_Paterno: item.Ap_Paterno,
                        Ap_Materno: item.Ap_Materno,
                    }
                );
                console.warn('NEW NODE TO EDGE:',newNode);
                addNode(newNode, (data: any) => {
                    console.log('Node added:', data.status);
                    if (!data.status) {
                        console.error('Error adding node');
                        addEdge({ from: node.id, to: newNode.id, label: 'Persona Inspeccionada' }, (data: any) => {
                            console.log('Edge added:', data);
                        });
                    }
                    else{
                        addEdge({ from: node.id, to: newNode.id, label: 'Persona Inspeccionada' }, (data: any) => {
                            console.log('Edge added:', data);
                        });
                    }
                });
            });
        }


    }


    const handleSearchMaestroPersona = async(node:NodeData) => {
        if(node.type === 'entrada-vehiculo' || node.type === 'vehiculo'){
            handleSearchVehiculoRemision(node);
            return;
        }
        await handleSearchRemisiones(node); //Recuerda con el await lo hacemos secuencial para no repetir informacion en el label del nodo
        await handleSearchHistorico(node);
    };


    return {
        contextMenu,
        handleContextMenu,
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