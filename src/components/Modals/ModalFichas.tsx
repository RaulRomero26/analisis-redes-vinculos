import React, { useState, useEffect } from 'react';
import { NodeData } from '../../interfaces/NodeData';

interface ModalFichasProps {
    node: NodeData | null;
    isOpen: boolean;
    onClose: () => void;    
}

const ModalFichas: React.FC<ModalFichasProps> = ({ node, isOpen, onClose }) => {
    console.log('MODAL FICHAS MODAL FICHAS', node);
    const handleClose = () => {
        onClose();
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 9999 }}>
            <div className="bg-white p-4 rounded w-1/4 overflow-auto">
                <div className="flex justify-between items-center">
                    <h2 className='text-xl'>EXPANDIR FICHA</h2>
                    <button onClick={handleClose} className="text-black">
                        &times;
                    </button>
                </div>
                {node && (
                    <div>
                        {node.atributos.detenciones.sarai.map((remision:any, index:any) => (
                            <div key={index}>
                                <p>{remision.Ficha}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModalFichas;