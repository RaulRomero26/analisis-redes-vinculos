import { useState } from 'react';
import { FaUser,FaPhone, FaCarAlt   } from 'react-icons/fa'; // Instalación: yarn add react-icons
import { SiSmartthings } from "react-icons/si";
import { FaLocationDot, FaMagnifyingGlass  } from "react-icons/fa6";
import { MdFollowTheSigns } from "react-icons/md";
import { GiPoliceOfficerHead } from "react-icons/gi";

interface DropdownMenuProps {
  handleMenuClick: (entidad: string) => void;
}


const DropdownMenu: React.FC<DropdownMenuProps> = ({ handleMenuClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-blue-950 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src="/graph.png" alt="Graph" className="h-8 w-8 mr-2" />
          <div className="text-white text-lg">Analisis de Redes</div>
        </div>
        <div className="relative">
            <button
            onClick={toggleMenu}
            className="text-white bg-blue-700 hover:bg-blue-600 p-2 rounded-md flex items-center"
            >
            <SiSmartthings className="mr-2" /> Agregar entidad
            </button>
          {/* Menú desplegable */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
              <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200"  onClick={() => handleMenuClick('persona')}>
                <FaUser className="mr-2" /> Persona
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200"  onClick={() => handleMenuClick('remision')}>
                <GiPoliceOfficerHead className="mr-2" /> Remision
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200">
                <FaMagnifyingGlass  className="mr-2" /> Inspeccion
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200">
                <MdFollowTheSigns  className="mr-2" /> Seguimiento
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200">
                <FaPhone  className="mr-2" /> Telefono
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200">
                <FaLocationDot className="mr-2" /> Direccion
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200">
                <FaCarAlt  className="mr-2" /> Vehiculo
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default DropdownMenu;
