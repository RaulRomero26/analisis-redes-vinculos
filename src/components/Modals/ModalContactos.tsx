import React from 'react';
import { NodeData } from '../../interfaces/NodeData';
import { useModalFunctions } from '../../hooks/useModalFunctions';

interface ModalContactosProps {
    node: NodeData | null;
    isOpen: boolean;
    onClose: () => void; 
    data: any;
    setData: React.Dispatch<React.SetStateAction<any>>;
    getData: () => any;
}

const ModalContactos: React.FC<ModalContactosProps> = ({ node, isOpen, onClose,data,setData,getData }) => {
    console.log('MODAL CONTACTOS', node);
    const handleClose = () => {
        onClose();
    };

    const { handleSearchContactos }  = useModalFunctions({data,setData,getData});
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 9999 }}>
            <div className="bg-white p-4 rounded w-1/4 overflow-auto">
                <div className="flex justify-between items-center">
                    <h2 className='text-xl'>EXPANDIR CONTACTOS</h2>
                    <button onClick={handleClose} className="text-black">
                        &times;
                    </button>
                </div>
                {node && (
                    <div>
                        {node.atributos.detenciones.sarai.map((remision:any, index:any) => (
                            <div key={index}>
                                <p>{remision.No_Remision}</p>
                                <button 
                                    onClick={() => handleSearchContactos(node,remision.Ficha,remision.No_Remision)} 
                                    className="ml-2 p-1 bg-blue-500 text-white rounded"
                                >
                                    Expandir
                                </button>
                            </div>
                            
                        ))}
                    </div>
     
            )}
            </div>
        </div>
    );
};

export default ModalContactos;