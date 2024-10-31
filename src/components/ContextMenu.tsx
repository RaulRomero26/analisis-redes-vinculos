import { useEffect, useState } from "react";
import { useGraphFunctions } from "../hooks/useGraphFunctions";

interface ContextMenuProps {
    x: number;
    y: number;
    nodeId: string | null;
    getData: () => any;
    setData: React.Dispatch<React.SetStateAction<any>>;
    onAddData: () => void;
    onClose: () => void;
    onSearchExtended: (query: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, nodeId,getData,setData,onSearchExtended, onClose }) => {

    const [nodeDetails, setNodeDetails] = useState<any>(null);

    const {findNodeDetails} = useGraphFunctions(setData,getData);

    useEffect(() => {
        if (nodeId) {
            console.log('Node ID:',nodeId);
            console.log(findNodeDetails(nodeId));
            const details = findNodeDetails(nodeId);
            console.log('Details:',details);
            setNodeDetails(details);
          
        }
    }, []);

    return (
        <div style={{ position: 'absolute', top: y, left: x, backgroundColor: 'white', border: '1px solid black', zIndex: 1000 }}>
            <ul>
                {
                    nodeDetails && nodeDetails.type === 'persona' && (
                        <>
                            <li onClick={() => onSearchExtended('Buscar Remisiones')}>Buscar Remisiones</li>
                            <li onClick={() => onSearchExtended('Buscar Maestro')}>Buscador Mestro</li>
                        </>
                    )
                }
                {
                    nodeDetails && nodeDetails.type === 'remision' && (
                        <li onClick={() => onSearchExtended('Telefono')}>Telefono</li>
                    )
                }
                {
                    nodeDetails && nodeDetails.type === 'remision' && (
                        <li onClick={() => onSearchExtended('Extraer Contactos')}>Extraer Contactos</li>
                    )
                }
                
                <li onClick={onClose}>Cerrar</li>
            </ul>
        </div>
    );
};

export default ContextMenu;