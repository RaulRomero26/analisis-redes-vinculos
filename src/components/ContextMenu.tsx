import { useEffect, useState } from "react";
import { useGraphFunctions } from "../hooks/useGraphFunctions";
import { NodeData } from "../interfaces/NodeData";
import { FaArrowRight } from "react-icons/fa";

interface ContextMenuProps {
    x: number;
    y: number;
    nodeId: string | null;
    getData: () => any;
    setData: React.Dispatch<React.SetStateAction<any>>;
    onClose: () => void;
    onShowDetails: (node: NodeData) => void;
    onSearchExtended: (query: string) => void;
    onEditAttributes: (node: NodeData) => void;
}

const rules: { [key: string]: (node: NodeData) => boolean | any } = {
    'Buscar Maestro': (node: NodeData) => (node.type === 'persona' || node.type === 'entrada-persona' || node.type === 'entada-vehiculo' || node.type === 'vehiculo' || node.type === 'contacto') ,
    'Extraer Telefonos': (node: NodeData) => node.entidad === 'persona' && node.atributos.Telefono,
    'Telefono Remisiones': (node: NodeData) => node.type === 'telefono' || node.type === 'entrada-telefono',
    'Telefono Contactos': (node: NodeData) => node.type === 'telefono' || node.type === 'entrada-telefono',
    'Telefono 911': (node: NodeData) => node.type === 'telefono' || node.type === 'entrada-telefono',
    'Consultas': (node: NodeData) => (node.entidad === 'persona' || node.entidad === 'vehiculo')  && node.type != 'inspeccion',
    'Extraer Personas': (node: NodeData) => node.type === 'inspeccion',
    'Extraer Vehiculos': (node: NodeData) => node.type === 'inspeccion',
    'Detenido Con': (node: NodeData) => node.entidad === 'persona' && node.atributos.detenciones && node.atributos.detenciones.sarai,
    'Extraer Contactos': (node: NodeData) => node.entidad === 'persona' && node.atributos.detenciones && node.atributos.detenciones.sarai,
    // Agrega más reglas según sea necesario
  };


const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, nodeId, getData, setData, onSearchExtended, onClose, onEditAttributes }) => {

    const [_nodeDetails, setNodeDetails] = useState<any>(null);

    const { findNodeDetails } = useGraphFunctions(setData, getData);

    useEffect(() => {
        if (nodeId) {
            //console.log('Node ID:', nodeId);
            //console.log(findNodeDetails(nodeId));
            const details = findNodeDetails(nodeId);
            //console.warn('Details:', details);
            setNodeDetails(details);
        }
    }, [nodeId, findNodeDetails]);

    const isOptionEnabled = (option: string) => {
        if (!_nodeDetails) return false;
        const rule = rules[option as keyof typeof rules];
        return rule ? rule(_nodeDetails) : true;
      };
    

    return (
        <>        
            <div style={{ position: 'absolute', top: y, left: x, zIndex: 1000 }} className="shadow-lg ring-1 w-50 ring-[#1f283a] ring-opacity-5 bg-white">
                <ul className=" ">
                    <li className="font-bold p-1">AÑADIR ATRIBUTOS</li>
                    <li className={`p-1 px-4 ${!isOptionEnabled('Buscar Maestro') ? 'bg-gray-300 cursor-not-allowed disabled' : 'cursor-pointer hover:bg-gray-200'}`} onClick={() => onSearchExtended('Buscar Maestro')} >CONSULTAR<span>&#8250;</span></li>
                    <li className="cursor-pointer hover:bg-gray-200 p-1 px-4">
                        <button className="flex w-full items-center justify-between space-x-3">
                            <span>INSERTAR MANUAL</span>
                            <FaArrowRight />
                        </button>
                    </li>
                    <li className="font-bold">EXPANDIR NODOS</li>
                    <li className="group relative px-4 hover:bg-gray-200" >
                        <button className="flex w-full items-center justify-between space-x-3 ">
                            <span>AGREGAR</span>
                            <FaArrowRight />
                        </button>
                        <div className="invisible absolute top-0 left-full w-60 transform opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 z-50">
                            <ul className="mt-1 shadow-lg ring-1 ring-[#1f283a] ring-opacity-5 bg-white">
                                <li className="font-bold">NO TELEFONICO</li>
                                <li className={`p-1 ${!isOptionEnabled('Extraer Telefonos') ? 'bg-gray-300 cursor-not-allowed disabled' : 'cursor-pointer hover:bg-gray-200'}`} onClick={() => onSearchExtended('Extraer Telefonos')}>EXTRAER TELEFONO(S)</li>
                                <li className={`p-1 ${!isOptionEnabled('Telefono Remisiones') ? 'bg-gray-300 cursor-not-allowed disabled' : 'cursor-pointer hover:bg-gray-200'}`} onClick={() => onSearchExtended('Telefono Remisiones')}>BUSCAR EN DETENIDOS</li>
                                <li className={`p-1 ${!isOptionEnabled('Telefono Contactos') ? 'bg-gray-300 cursor-not-allowed disabled' : 'cursor-pointer hover:bg-gray-200'}`} onClick={() => onSearchExtended('Telefono Contactos')}>BUSCAR EN CONTACTOS</li>
                                <li className={`p-1 ${!isOptionEnabled('Telefono 911') ? 'bg-gray-300 cursor-not-allowed disabled' : 'cursor-pointer hover:bg-gray-200'}`} onClick={() => onSearchExtended('Telefono 911')}>BUSCAR EN 911</li>
                                <li className="font-bold">INSPECCIONES</li>
                                <li className={`p-1 ${!isOptionEnabled('Consultas') ? 'bg-gray-300 cursor-not-allowed disabled' : 'cursor-pointer hover:bg-gray-200'}`} onClick={() => onSearchExtended('Consultas')} >CONSULTAR</li>
                                <li className={`p-1 ${!isOptionEnabled('Extraer Personas') ? 'bg-gray-300 cursor-not-allowed disabled' : 'cursor-pointer hover:bg-gray-200'}`} onClick={() => onSearchExtended('Extraer Personas')} >EXTRAER PERSONAS</li>
                                <li className={`p-1 ${!isOptionEnabled('Extraer Vehiculos') ? 'bg-gray-300 cursor-not-allowed disabled' : 'cursor-pointer hover:bg-gray-200'}`} onClick={() => onSearchExtended('Extraer Vehiculos')} >EXTRAER VEHICULOS</li>
                                <li className="font-bold">REMISIONES</li>
                                <li className={`p-1 ${!isOptionEnabled('Detenido Con') ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'}`} onClick={() => onSearchExtended('Detenido Con')}>DETENIDO CON</li>
                                <li className={`p-1 ${!isOptionEnabled('Extraer Contactos') ? 'bg-gray-300 cursor-not-allowed': 'cursor-pointer hover:bg-gray-200'}`} onClick={() => onSearchExtended('Extraer Contactos')} >CONTACTOS REF</li>
                            </ul>
                        </div>
                    </li>
                    <li className={`cursor-pointer hover:bg-gray-200 p-1 px-4`} onClick={() => onEditAttributes(_nodeDetails)}>EDITAR ATRIBUTOS</li>
                    <li  className="cursor-pointer hover:bg-gray-200 p-1 px-4"onClick={onClose}>CERRAR</li>
                </ul>
            </div>
        </>
    );
};

export default ContextMenu;