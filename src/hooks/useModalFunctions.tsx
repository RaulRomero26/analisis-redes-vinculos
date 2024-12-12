import React from 'react'
import { useSearchEntity } from './useSearchEntity';
import { createNodeData, NodeData } from '../interfaces/NodeData';
import { useGraphFunctions } from './useGraphFunctions';
import { useNetwork } from '../context/NetworkContext';

interface ModalFunctionsProps {
    data?: any;
    setData: React.Dispatch<React.SetStateAction<any>>;
    getData: () => any;
}


export const useModalFunctions = ({setData,getData}:ModalFunctionsProps) => {

    const { searchDetenidoCon, searchContacts } = useSearchEntity();
    const { addNode,addEdge } = useGraphFunctions(setData,getData);
    const { network } = useNetwork();


    const handleSearchDetenidoCon = async(node:NodeData,ficha: any,remision_primaria: any) => {
        
        const respuesta =await searchDetenidoCon({ entidad: 'persona', payload: { ficha: ficha, remision_primaria: remision_primaria} });
        

        //console.log('RESPUESTA:',respuesta.data.remisiones);
        if(respuesta.data.remisiones.length){
            //console.log('SI HAY DETENIDOS CON');
            respuesta.data.remisiones.map((item: any) => {
                //console.log('item:',item);
                
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
                //console.warn('NEW NODE TO EDGE:',newNode);
                addNode({newNode: newNode, parentPosition: network.getPosition(node.id)}, (data: any) => {
                    //console.log('Node added:', data.status);
                    if (data.status == false) {
                        console.error('Error adding node');
                       //ACA tocaria agregar peso al enlace por que significa que ya existe o verificar si es la forma correcta en arbol
                       addEdge({ from: node.id, to: newNode.id, label: 'Detenido Con' }, (data: any) => {  console.log('Edge added:', data); });
                    }else{

                        addEdge({ from: node.id, to: newNode.id, label: 'Detenido Con' }, (data: any) => {
                            console.log('Edge added:', data);
                        });
                    }
                });

            });
        }
    }

    const handleSearchContactos = async(node:NodeData,ficha: any,remision_primaria: any) => {
        
        const respuesta = await searchContacts({ entidad: 'persona', payload: { ficha: ficha, remision_primaria: remision_primaria} });
        //console.log('RESPUESTA:',respuesta.data.contactos);
        if(respuesta.data.contactos.length){
            //console.log('SI HAY CONTACTOS');
            respuesta.data.contactos.map((item: any) => {
                //console.log('item:',item);
                
                const newNode = createNodeData(
                    `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`.toUpperCase(), 
                    `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`.toUpperCase(), 
                    `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`.toUpperCase(), 
                    "image",
                    15,
                    "blue",
                    "contacto",
                    'persona',
                    item,
                    {
                        "Nombre":item.Nombre,
                        "Ap_Paterno":item.Ap_Paterno,
                        "Ap_Materno":item.Ap_Materno,
                        "Telefono":item.Telefono
                    }
                );
                //console.warn('NEW NODE TO EDGE:',newNode);
                addNode({newNode: newNode, parentPosition: network.getPosition(node.id) }, (data: any) => {
                    //console.log('SE PUEDE AGREGAR? :', data.status);
                    if (data.status == false){
                        console.error('Error adding node');
                       //ACA tocaria agregar peso al enlace por que significa que ya existe o verificar si es la forma correcta en arbol
                          addEdge({ from: node.id, to: newNode.id, label: 'Contacto' }, (data: any) => {  console.log('Edge added:', data); });
                    }else{

                        addEdge({ from: node.id, to: newNode.id, label: 'Contacto' }, (data: any) => {
                            console.log('Edge added:', data);
                        });
                    }
                });
            }
            );}
    }


  return {
    handleSearchDetenidoCon,
    handleSearchContactos
  }
}
