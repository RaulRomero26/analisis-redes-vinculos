// src/components/EditNodeForm.tsx
import { useState } from 'react';
import Modal from 'react-modal';

interface EditNodeFormProps {
  node: any;
  getData: () => any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  isOpen: boolean;
  onRequestClose: () => void;
}

const recreateLabel = (node: any) => {
    let newLabel ='';

    switch (node.type) {
        case 'persona':
            newLabel = `${node.editables?.label || ''}
                        ${node.editables?.remisiones_label || ''}
                        <b>Alias:</b> ${node.editables?.alias || ''}
                        <b>Fecha Detencion: </b>${node.editables?.fecha_detencion || ''}
                        <b>No Remision: </b>${node.editables?.no_remision || ''}
                        <b>CURP: </b>${node.editables?.curp || ''}
                        <b>Fecha Nacimiento:</b> ${node.editables?.fecha_nacimiento || ''}
                        <b>Delitos: </b>${node.editables?.delitos || ''}
                        <b>Domicilios: </b>${node.editables?.domicilio || ''}
                        ${node.editables?.historico_label || ''}
                        <b>Folio: </> ${node.editables?.historico_folios || ''}
                        <b>Fecha Remision: </> ${node.editables?.historico_fechas || ''}`;
            break;
        case 'entrada-persona':
            newLabel = `${node.editables?.label || ''}
                        ${node.editables?.remisiones_label || ''}
                        <b>Alias:</b> ${node.editables?.alias || ''}
                        <b>Fecha Detencion: </b>${node.editables?.fecha_detencion || ''}
                        <b>No Remision: </b>${node.editables?.no_remision || ''}
                        <b>CURP: </b>${node.editables?.curp || ''}
                        <b>Fecha Nacimiento:</b> ${node.editables?.fecha_nacimiento || ''}
                        <b>Delitos: </b>${node.editables?.delitos || ''}
                        <b>Domicilios: </b>${node.editables?.domicilio || ''}
                        ${node.editables?.historico_label || ''}
                        <b>Folio: </b> ${node.editables?.historico_folios || ''}
                        <b>Fecha Remision: </b> ${node.editables?.historico_fechas || ''}`;
            break;
        default:
            break;
   
    }
    return newLabel;
};


export const EditNodeForm = ({ node, setData, getData, isOpen, onRequestClose }: EditNodeFormProps) => {
  const [editables, setEditables] = useState(node.editables || {});

  const handleChange = (key: string, value: string) => {
    setEditables({
      ...editables,
      [key]: value
    });
  };

  
const handleSave = () => {
    const data = getData();
    const index = data.nodes.findIndex((n: any) => n.id === node.id);
    console.log('EDITABLES:', editables);
    data.nodes[index] = {
        ...data.nodes[index],
        editables: editables,
        label: recreateLabel({ ...data.nodes[index], editables })
    };
    setData((prevData: any) => ({ ...prevData, nodes: data.nodes }));
    onRequestClose();
};

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Edit Node">
      <div>
        {Object.keys(editables).map(key => (
          <div key={key} className="mb-4">
            <label className="font-bold">{key}</label>
            <input
              type="text"
              value={editables[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="ml-2 p-1 border border-gray-300"
            />
          </div>
        ))}
        <button onClick={handleSave} className="mt-4 p-2 bg-blue-500 text-white">Guardar</button>
      </div>
    </Modal>
  );
};