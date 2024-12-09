import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

Modal.setAppElement('#root'); // o el elemento raíz apropiado de tu aplicación

interface EditNodeFormProps {
  node?: any;
  edge?: any;
  getData: () => any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  onRequestClose: () => void;
}

const recreateLabel = (node: any) => {
  if (!node) return '';
  let newLabel = '';
  const allEditablesEmpty = Object.values(node.editables || {}).every(value => !value);
  if (allEditablesEmpty) {
    return node.label;
  }

  switch (node.type) {
    case 'persona':
    case 'entrada-persona':
      newLabel = [
        node.visibles?.label && node.editables?.label || node.id || '',
        node.visibles?.remisiones_label && node.editables?.remisiones_label || '',
        node.visibles?.alias && node.editables?.alias ? `<b>Alias:</b> ${node.editables.alias}` : '',
        node.visibles?.fecha_detencion && node.editables?.fecha_detencion ? `<b>Fecha Detencion:</b> ${node.editables.fecha_detencion}` : '',
        node.visibles?.no_remision && node.editables?.no_remision ? `<b>No Remision:</b> ${node.editables.no_remision}` : '',
        node.visibles?.curp && node.editables?.curp ? `<b>CURP:</b> ${node.editables.curp}` : '',
        node.visibles?.fecha_nacimiento && node.editables?.fecha_nacimiento ? `<b>Fecha Nacimiento:</b> ${node.editables.fecha_nacimiento}` : '',
        node.visibles?.delitos && node.editables?.delitos ? `<b>Delitos:</b> ${node.editables.delitos}` : '',
        node.visibles?.domicilio && node.editables?.domicilio ? `<b>Domicilio:</b> ${node.editables.domicilio}` : '',
        node.visibles?.historico_label && node.editables?.historico_label || '',
        node.visibles?.historico_folios && node.editables?.historico_folios ? `<b>Folio:</b> ${node.editables.historico_folios}` : '',
        node.visibles?.historico_fechas && node.editables?.historico_fechas ? `<b>Fecha Remision:</b> ${node.editables.historico_fechas}` : '',
        node.visibles?.historico_motivo && node.editables?.historico_motivo ? `<b>Motivo:</b> ${node.editables.historico_motivo}` : '',
        node.visibles?.historico_domicilio && node.editables?.historico_domicilio ? `<b>Domicilio:</b> ${node.editables.historico_domicilio}` : ''
      ].filter(Boolean).join('\n');
      break;
    default:
      newLabel = node.label;
      break;
  }
  return newLabel;
};

export const EditNodeForm = ({ node, setData, getData, onRequestClose }: EditNodeFormProps) => {
  const [editables, setEditables] = useState(node?.editables || {});
  const [visibles, setVisibles] = useState(node?.visibles || {});
  const [label, setLabel] = useState(node?.label || '');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [showAddAttribute, setShowAddAttribute] = useState(false);

  const handleChange = (key: string, value: string) => {
    setEditables((prevEditables: any) => ({
      ...prevEditables,
      [key]: value
    }));
  };

  const handleVisibilidad = (key: string, value: boolean) => {
    setVisibles((prevVisibles: any) => ({
      ...prevVisibles,
      [key]: value
    }));
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
    setEditables(node?.editables || {});
    setVisibles(node?.visibles || {});
    setLabel(node?.label || '');
  }, [node]);

  useEffect(() => {
    setLabel(recreateLabel({ ...node, editables, visibles }));
  }, [editables, visibles, node]);

  const handleSave = () => {
    const data = getData();
    if (node?.from && node?.to) {
      // Es una arista (edge)
      const index = data.edges.findIndex((e: any) => e.id === node.id);
      if (index >= 0) {
        data.edges[index] = {
          ...data.edges[index],
          editables,
          label
        };
      }
    } else {
      // Es un nodo
      const index = data.nodes.findIndex((n: any) => n.id === node.id);
      if (index >= 0) {
        data.nodes[index] = {
          ...data.nodes[index],
          editables,
          visibles,
          label: recreateLabel({ ...data.nodes[index], editables, visibles })
        };
      }
    }
    setData({ nodes: data.nodes, edges: data.edges });
    onRequestClose();
  };

  return (
    <div>
      {Object.keys(editables).map(key => (
        <div key={key} className="mb-4 flex items-center">
          <label className="font-bold">{key}</label>
          <input
            type="text"
            value={editables[key]}
            onChange={e => handleChange(key, e.target.value)}
            className="ml-2 p-1 border border-gray-300 flex-grow"
          />
          <label
            htmlFor="show"
            className="ml-2 cursor-pointer flex-shrink-0"
            onClick={() => handleVisibilidad(key, !visibles[key])}
          >
            {visibles[key] ? <FaEye /> : <FaEyeSlash />}
          </label>
        </div>
      ))}

      {showAddAttribute ? (
        <>
          <div className="mb-4">
            <label className="font-bold">Clave</label>
            <select
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              className="ml-2 p-1 border border-gray-300"
            >
              <option value="">Seleccione una clave</option>
              <option value="alias">Alias</option>
              <option value="fecha_detencion">Fecha de Detencion</option>
              <option value="no_remision">No Remision</option>
              <option value="curp">CURP</option>
              <option value="fecha_nacimiento">Fecha de Nacimiento</option>
              <option value="delitos">Delitos</option>
              <option value="domicilio">Domicilio</option>
              <option value="otra">Otra</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="font-bold">Valor</label>
            <input
              type="text"
              value={newValue}
              onChange={e => setNewValue(e.target.value)}
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
