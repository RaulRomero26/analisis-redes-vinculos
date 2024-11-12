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

const puedenExpandir = ['entrada-persona','entrada-telefono','entrada-vehiculo','persona','telefono','vehiculo','contacto'];
const puedenTenerConsultas = ['entrada-persona','entrada-vehiculo','persona','vehiculo'];
const puedenConsultarTelefono = ['entrada-persona','persona','telefono','contacto'];
const puedeConsultarVehiculo = ['entrada-vehiculo','vehiculo','inspeccion'];

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
                    nodeDetails && ( puedenExpandir.find(type => type == nodeDetails.type)) && (
                        <>  
                            <li><b>Expandir Nodo</b></li>
                            <li onClick={() => onSearchExtended('Buscar Maestro')}>Buscar Atributos</li>
                            
                        </>
                    )
                }
                {
                    nodeDetails && ( puedenTenerConsultas.find(type => type == nodeDetails.type)) && (
                        <>
                        <hr></hr>
                        <li><b>Expandir Por Consulta</b></li>
                        <li onClick={() => onSearchExtended('Consultas')}>Consultas</li>
                        </>
                    )
                }
                {
                    nodeDetails && (nodeDetails.atributos.detenciones ) && (
                        <>  
                            <hr></hr>
                            <li><b>Expandir Red</b></li>
                            <li onClick={() => onSearchExtended('Extraer Contactos')}>Extraer Contactos</li>
                            <li onClick={() => onSearchExtended('Detenido Con')}>Detenido Con</li>
                            
                        </>
                    )
                }
                {
                    nodeDetails && ( puedenConsultarTelefono.find( type => type == nodeDetails.type) ) && (
                        <>
                            <hr></hr>
                            <li><b>Expandir Telefono</b></li>
                            <li onClick={() => onSearchExtended('Telefono')}>Consultar Telefono 911</li> 
                            <li onClick={() => onSearchExtended('Telefono Remisiones')}>Buscar Telefono En Remisiones</li>
                        </>
                    )
                }
                {
                    nodeDetails && ( puedeConsultarVehiculo.find( type => type == nodeDetails.type)) && (
                        <li onClick={() => onSearchExtended('Vehiculos')}>Buscar Vehiculo</li>
                    )
                }
               

                {/* <li onClick={() => onShowDetails(nodeDetails)}>Mostrar Detalles</li> */}
                <hr></hr>
                <li><b>Funciones Generales</b></li>
                <li onClick={onClose}>Cerrar</li>
            </ul>
        </div>
    );
};

export default ContextMenu;