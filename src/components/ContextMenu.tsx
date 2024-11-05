import { useEffect, useState } from "react";
import { useGraphFunctions } from "../hooks/useGraphFunctions";
import { NodeData } from "../interfaces/NodeData";

interface ContextMenuProps {
    x: number;
    y: number;
    nodeId: string | null;
    getData: () => any;
    setData: React.Dispatch<React.SetStateAction<any>>;
    onAddData: () => void;
    onClose: () => void;
    onShowDetails: (node: NodeData) => void;
    onSearchExtended: (query: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, nodeId, getData, setData, onShowDetails, onSearchExtended, onClose }) => {

    const [nodeDetails, setNodeDetails] = useState<any>(null);

    const { findNodeDetails } = useGraphFunctions(setData, getData);

    useEffect(() => {
        if (nodeId) {
            console.log('Node ID:', nodeId);
            console.log(findNodeDetails(nodeId));
            const details = findNodeDetails(nodeId);
            console.warn('Details:', details);
            setNodeDetails(details);
        }
    }, [nodeId, findNodeDetails]);

    return (
        <div style={{ position: 'absolute', top: y, left: x, backgroundColor: 'white', border: '1px solid black', zIndex: 1000 }}>
            <ul>
                {
                    nodeDetails && (nodeDetails.type === 'persona' || nodeDetails.type === 'entrda-persona') && (
                        <>  
                            <li><b>Expandir Nodo</b></li>
                            <li onClick={() => onSearchExtended('Buscar Maestro')}>Consultar Nodo</li>
                        </>
                    )

                }
                <hr></hr>
                    {
                        nodeDetails && (nodeDetails.atributos.detenciones) ? (
                            <>
                                 <li><b>Expandir Red</b></li>
                                <li onClick={() => onSearchExtended('Telefono')}>Telefono</li>
                                <li onClick={() => onSearchExtended('Extraer Contactos')}>Extraer Contactos</li>
                                <li onClick={() => onSearchExtended('Detenido Con')}>Detenido Con</li>
                            </>
                        ):
                        (
                            <></>
                        )
                    }
               

                <li onClick={() => onShowDetails(nodeDetails)}>Mostrar Detalles</li>

                <li onClick={onClose}>Cerrar</li>
            </ul>
        </div>
    );
};

export default ContextMenu;