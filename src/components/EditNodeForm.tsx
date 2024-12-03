import { useEffect, useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // or the appropriate root element of your app

interface EditNodeFormProps {
  node?: any;
  edge?: any;
  getData: () => any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  onRequestClose: () => void;
}

const recreateLabel = (node: any) => {
  let newLabel = '';

  const allEditablesEmpty = Object.values(node.editables || {}).every(value => !value);
  if (allEditablesEmpty) {
    return node.label;
  }

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
                  <b>Folio: </b> ${node.editables?.historico_folios || ''}
                  <b>Fecha Remision: </b> ${node.editables?.historico_fechas || ''}`;
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
      newLabel = node.label
      break;
  }
  return newLabel;
};

export const EditNodeForm = ({ node, setData, getData, onRequestClose }: EditNodeFormProps) => {
  const [editables, setEditables] = useState(node?.editables || {});
  const [label, setLabel] = useState(node?.label || '');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [showAddAttribute, setShowAddAttribute] = useState(false);

  const handleChange = (key: string, value: string) => {
    setEditables({
      ...editables,
      [key]: value
    });
  };

  const handleAddAttribute = () => {
    if (newKey && newValue) {
      setEditables((prevEditables:any) => ({
        ...prevEditables,
        [newKey]: newValue
      }));
      setNewKey('');
      setNewValue('');
      setShowAddAttribute(false);
    }
  };

  useEffect(() => {
    console.log(node);
    setEditables(node?.editables || {});
    setLabel(node?.label || '');
  }, [node]);

  const handleSave = () => {
    const data = getData();
    if (node?.from && node?.to) {
      // Es una arista (edge)
      const index = data.edges.findIndex((e: any) => e.id === node.id);
      data.edges[index] = {
        ...data.edges[index],
        editables: editables,
        label: label || node.label
      };
    } else {
      // Es un nodo
      const index = data.nodes.findIndex((n: any) => n.id === node.id);
      data.nodes[index] = {
        ...data.nodes[index],
        editables: editables,
        label: recreateLabel({ ...data.nodes[index], editables })
      };
    }
    setData((prevData: any) => ({ ...prevData, nodes: data.nodes, edges: data.edges }));
    onRequestClose();
  };



  return (
    
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
        {node?.from && node?.to && (
          <div className="mb-4">
            <label className="font-bold">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="ml-2 p-1 border border-gray-300"
            />
          </div>
        )}
        {showAddAttribute ? (
          <>
            <div className="mb-4">
              <label className="font-bold">Clave</label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="ml-2 p-1 border border-gray-300"
              />
            </div>
            <div className="mb-4">
              <label className="font-bold">Valor</label>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="ml-2 p-1 border border-gray-300"
              />
            </div>
            <button onClick={handleAddAttribute} className="mt-4 p-2 mr-2 bg-green-500 text-white">Añadir Atributo</button>
          </>
        ) : (
          <button onClick={() => setShowAddAttribute(true)} className="mt-4 p-2 mr-2 bg-blue-500 text-white">Añadir Atributo</button>
        )}
        <button onClick={handleSave} className="mt-4 p-2 bg-blue-500 text-white">Guardar</button>
      </div>
    
  );
};