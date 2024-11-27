import { useState } from 'react';
import { FaUser,FaPhone, FaCarAlt   } from 'react-icons/fa'; // Instalación: yarn add react-icons
import { SiSmartthings } from "react-icons/si";
import SaveNetwork  from '../components/SaveNetwork';
import graph from '../assets/graph.png';

import { IoAnalyticsOutline } from "react-icons/io5";
import { FaTrashAlt } from "react-icons/fa";
// import { FaLocationDot, FaMagnifyingGlass  } from "react-icons/fa6";
// import { MdFollowTheSigns } from "react-icons/md";
// import { GiPoliceOfficerHead } from "react-icons/gi";

interface DropdownMenuProps {
  handleMenuClick: (entidad: string) => void;
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  addEdge: () => void;
  deleteElement: (arg0: boolean) => void;
}


const DropdownMenu: React.FC<DropdownMenuProps> = ({ handleMenuClick,data,setData,addEdge,deleteElement }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGraphMenuOpen, setIsGraphMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleGraphMenu = () => {
    setIsGraphMenuOpen(!isGraphMenuOpen);
  };

  return (
    <nav className="bg-blue-950 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src={graph} alt="Graph" className="h-8 w-8 mr-2" />
          <div className="text-white text-lg">Analisis de Redes</div>
        </div>
        <div>
          <SaveNetwork data={data} setData={setData} />
        </div>

        <div className='relative'>
          <button
            onClick={toggleGraphMenu}
            className="text-white bg-blue-700 hover:bg-blue-600 p-2 rounded-md flex items-center"
          >
            <IoAnalyticsOutline className="mr-2" />
            Grafo
          </button>
          {isGraphMenuOpen && ( 
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
              <a  className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={() => {addEdge(); toggleGraphMenu();}}>
                <IoAnalyticsOutline className="mr-2"  /> Añadir Arista
              </a>
              <a className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={() => {deleteElement(true);toggleGraphMenu();}}>
                <FaTrashAlt className="mr-2" /> Eliminar Elemento
              </a>
            </div>
          )

          }
        </div>

        <div className="relative">
            <button
            onClick={toggleMenu}
            className="text-white bg-blue-700 hover:bg-blue-600 p-2 rounded-md flex items-center"
            >
            <SiSmartthings className="mr-2" />Agregar entidad
            </button>
          {/* Menú desplegable */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
              <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200"  onClick={() =>{ handleMenuClick('persona');toggleMenu();}}>
                <FaUser className="mr-2" /> Persona
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={() => {handleMenuClick('telefono');toggleMenu();}}>
                <FaPhone  className="mr-2" /> Telefono
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={() => {handleMenuClick('vehiculo');toggleMenu();}}>
                <FaCarAlt  className="mr-2" /> Vehiculo
              </a>
              {/* <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={() => handleMenuClick('ubicacion')}>
                <FaLocationDot className="mr-2" /> Ubicacion
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={() => handleMenuClick('seguimiento')}>
                <MdFollowTheSigns  className="mr-2" /> Seguimiento
              </a> */}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default DropdownMenu;
