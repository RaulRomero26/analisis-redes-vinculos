import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useGraphFunctions } from '../../hooks/useGraphFunctions';
import { GraphData } from '../../interfaces/GraphData';

interface ModalVehiculoProps {
    isModalOpen: boolean;
    toggleModal: () => void;
    setData: React.Dispatch<React.SetStateAction<GraphData>>;
    getData: () => GraphData;
}

interface FormInputs {
    placa: string;
    niv: string;
}

const ModalVehiculo: React.FC<ModalVehiculoProps> = ({ isModalOpen, toggleModal, setData, getData }) => {
    const { register, handleSubmit, watch,formState: { errors } } = useForm<FormInputs>({
        mode: 'onBlur',
        reValidateMode: 'onChange',
        criteriaMode: 'all',
        shouldFocusError: true,
        defaultValues: {
            placa: '',
            niv: ''
        },
        resolver: async (values) => {
            const errors: any = {};
            if (!values.placa && !values.niv) {
                errors.placa = { type: 'required', message: 'Este campo es requerido si NIV está vacío' };
                errors.niv = { type: 'required', message: 'Este campo es requerido si Placa está vacío' };
            }
            return { values, errors };
        }
    });
    const { addNode } = useGraphFunctions(setData, getData);

    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        const nodeData = {
            id: `${data.placa}/${data.niv}`,
            label: `${data.placa}/${data.niv}`,
            name: `${data.placa}/${data.niv}`,
            shape: 'circle',
            size: 15,
            color: 'blue',
            type: 'entrada-vehiculo',
            entidad: 'vehiculo',
            data: {},
            atributos: {
                Placas: data.placa,
                NIV: data.niv
            }
        };
        addNode(nodeData, (data: any) => {
            console.log('Node added:', data.status);
            if (!data.status) {
                console.error('Error adding node');
            }
        });
        
        toggleModal();
    };

    const placa = watch('placa');
    const niv = watch('niv');

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded w-1/4 overflow-auto">
                <h2 className='text-xl'>Buscar Vehiculo</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="placa" className="block text-gray-700">Placa</label>
                        <input
                            type="text"
                            id="placa"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="placa"
                            {...register('placa', {
                                validate: value => value || niv || 'Este campo es requerido si NIV está vacío'
                            })}
                        />
                        {errors.placa && <span className="text-red-500">{errors.placa.message}</span>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="niv" className="block text-gray-700">NIV</label>
                        <input
                            type="text"
                            id="niv"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="niv"
                            {...register('niv', {
                                validate: value => value || placa || 'Este campo es requerido si Placa está vacío'
                            })}
                        />
                        {errors.niv && <span className="text-red-500">{errors.niv.message}</span>}
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

export default ModalVehiculo;