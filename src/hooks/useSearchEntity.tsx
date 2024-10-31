import { useState } from 'react';

export const useSearchEntity = () => {
  const [data, setData] = useState(null);

  type Payload = { [key: string]: any };

  const searchData = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {
    switch (entidad) {
      // case 'persona':
      //   console.log('Buscando persona', payload);
      //   break;
      case 'persona':
      case 'remision':
        console.log('Buscando remision', payload);
        try {
          const response = await fetch('http://localhost:8087/api/search/remisiones', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          const data = await response.json();
          setData(data.data.remisiones);
          console.log( 'RESPUESTA:',data.data.remisiones);
          return data;
        } catch (error) {
          console.error(error);
        }
        break;
      default:
        break;
    }
  };

  const searchPhone = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {
   
        console.log('Buscando Telefono', payload);
        try {
          const response = await fetch('http://localhost:8087/api/search/telefono', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          const data = await response.json();
          setData(data.data.remisiones);
          console.log( 'RESPUESTA:',data.data.remisiones);
          return data;
        } catch (error) {
          console.error(error);
        }
  };

  const searchContacts = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {
   
    console.log('Buscando Contactos', payload);
    try {
      const response = await fetch('http://localhost:8087/api/search/contactos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setData(data.data.remisiones);
      console.log( 'RESPUESTA:',data.data.remisiones);
      return data;
    } catch (error) {
      console.error(error);
    }
};



const searchHistorico = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {
   
  console.log('Buscando Historico', payload);
  try {
    const response = await fetch('http://localhost:8087/api/search/historico', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setData(data.data.historico);
    console.log( 'RESPUESTA:',data.data.historico);
    return data;
  } catch (error) {
    console.error(error);
  }
};
const searchInspeccion = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {
   
  console.log('Buscando Inspeccion', payload);
  try {
    const response = await fetch('http://localhost:8087/api/search/inspeccion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setData(data.data.inspeccion);
    console.log( 'RESPUESTA:',data.data.inspeccion);
    return data;
  } catch (error) {
    console.error(error);
  }
};


  return {
    searchData,
    searchPhone,
    searchContacts,
    searchHistorico,
    searchInspeccion,
    data,
  };
};