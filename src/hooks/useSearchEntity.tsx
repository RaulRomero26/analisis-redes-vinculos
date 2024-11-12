import { useState } from 'react';

export const useSearchEntity = () => {
  const [data, setData] = useState(null);

  type Payload = { [key: string]: any };

  const searchData = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {
    console.log('Buscando Remisiones', payload);
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
      
  };

  const searchPhone = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {
   
        console.log('Buscando Telefono', payload);
        try {
          const response = await fetch('http://localhost:8087/api/search/telefono-contacto', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          const data = await response.json();
          setData(data.data.telefono);
          console.log( 'RESPUESTA:',data.data.telefono);
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

const searchDetenidoCon = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {

  console.log('Buscando Detenido Con', payload);
  try {
    const response = await fetch('http://localhost:8087/api/search/detenidoCon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setData(data.data.detenidoCon);
    console.log( 'RESPUESTA:',data.data.detenidoCon);
    return data;
  } catch (error) {
    console.error(error);
  }
}

const searchVehiculoInspeccion = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {

  console.log('Buscando Vehiculo Inspeccion', payload);
  try {
    const response = await fetch('http://localhost:8087/api/search/vehiculoInspeccion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setData(data.data.vehiculos);
    console.log( 'RESPUESTA:',data.data.vehiculos);
    return data;
  } catch (error) {
    console.error(error);
  }
}

const  searchRemisionesTelefono = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {
  
    console.log('Buscando Remisiones Telefono', payload);
    try {
      const response = await fetch('http://localhost:8087/api/search/remisionesTelefono', {
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
}


  return {
    searchData,
    searchPhone,
    searchContacts,
    searchHistorico,
    searchInspeccion,
    searchDetenidoCon,
    searchVehiculoInspeccion,
    searchRemisionesTelefono,
    data,
  };
};