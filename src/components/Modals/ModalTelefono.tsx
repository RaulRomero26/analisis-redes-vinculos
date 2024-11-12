// src/components/Modals/ModalNombre.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useGraphFunctions } from '../../hooks/useGraphFunctions';
import { GraphData } from '../../interfaces/GraphData';

interface ModalTelefonoProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  setData: React.Dispatch<React.SetStateAction<GraphData>>;
  getData: () => GraphData;
}

interface FormInputs {
  telefono: string;
}

const ModalTelefono: React.FC<ModalTelefonoProps> = ({ isModalOpen, toggleModal, setData, getData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();
  const { addNode } = useGraphFunctions(setData, getData);

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const nodeData = {
      id: `${data.telefono}`,
      label: `${data.telefono}`,
      name: `${data.telefono}`,
      shape: 'circle',
      size: 15,
      color: 'blue',
      type: 'entrada-telefono',
      entidad: 'telefono',
      data: {},
      atributos: {
        Telefono: data.telefono
      }
    };
    addNode(nodeData, (success: boolean) => {
      console.log('Node added:', success);
      if (!success) {
        console.error('Error adding node');
      }
    });
    
    toggleModal();
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded w-1/4 overflow-auto">
        <h2 className='text-xl'>Buscar Telefono</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="telefono" className="block text-gray-700">Número de Telefono</label>
            <input
              type="text"
              id="telefono"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="telefono"
              {...register('telefono', { required: true })}
            />
            {errors.telefono && <span className="text-red-500">Este campo es requerido</span>}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Buscar
          </button>
        </form>
        <button
          onClick={toggleModal}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalTelefono;