import React from 'react'
import { useSearchEntity } from './useSearchEntity';
import { createNodeData, NodeData } from '../interfaces/NodeData';
import { useGraphFunctions } from './useGraphFunctions';

interface ModalFunctionsProps {
    data: any;
    setData: React.Dispatch<React.SetStateAction<any>>;
    getData: () => any;
}


export const useModalFunctions = ({data,setData,getData}:ModalFunctionsProps) => {

    const { searchDetenidoCon } = useSearchEntity();
    const { addNode,addEdge } = useGraphFunctions(setData,getData);


    const handleSearchDetenidoCon = async(node:NodeData,ficha: any,remision_primaria: any) => {
        
        const respuesta =await searchDetenidoCon({ entidad: 'persona', payload: { ficha: ficha, remision_primaria: remision_primaria} });
        

        console.log('RESPUESTA:',respuesta.data.remisiones);
        if(respuesta.data.remisiones.length){
            console.log('SI HAY DETENIDOS CON');
            respuesta.data.remisiones.map((item: any) => {
                console.log('item:',item);
                
                const newNode = createNodeData(`${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, "image", 15, "blue", "persona",'persona',item,{});
                console.warn('NEW NODE TO EDGE:',newNode);
                addNode(newNode, (success: boolean) => {
                    console.log('Node added:', success);
                    if (!success) {
                        console.error('Error adding node');
                       //ACA tocaria agregar peso al enlace por que significa que ya existe o verificar si es la forma correcta en arbol
                    }else{

                        addEdge({ from: node.id, to: newNode.id, label: 'Detenido Con' }, (data: any) => {
                            console.log('Edge added:', data);
                        });
                    }
                });

            });
        }
    }


  return {
    handleSearchDetenidoCon
  }
}
