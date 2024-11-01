// src/interfaces/NodeData.ts

// Importar las imágenes
import persona from '../assets/persona.png';
import vehiculo from '../assets/vehiculo.png';
import telefono from '../assets/telefono-inteligente.png';
import inspeccion from '../assets/inspeccion.png';
import direccion from '../assets/ubicacion.png';
import detencion from '../assets/detencion.png';
import detencionHistorico from '../assets/detenicion-historico.png';

export interface NodeData {
  id: string;
  label: string;
  name: string;
  shape: string;
  image: string;
  size: number;
  color: string;
  type: string;
  entidad: string;
  data: any;
}

export function getImageForType(type?: string): string {
  switch (type) {
    case 'persona':
      return persona;
    case 'vehiculo':
      return vehiculo;
    case 'telefono':
      return telefono;
    case 'inspeccion':
      return inspeccion;
    case 'direccion':
      return direccion;
    case 'remision':
      return detencion;
    case 'remision-historica':
      return detencionHistorico;
    default:
      return persona;
  }
}

export function createNodeData(id: string, label: string, name: string, shape: string, size: number, color: string, type: string, entidad: string, data:any ,): NodeData {
  return {
    id,
    label,
    name,
    shape,
    image: getImageForType(type),
    size,
    color,
    type,
    entidad,
    data
  };
}