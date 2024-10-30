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

  return {
    searchData,
    data,
  };
};