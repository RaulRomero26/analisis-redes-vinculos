import Swal from 'sweetalert2';

export const useShowDetails = () => {


    const showDetails = (node: any) => {
        //console.log('Mostrando detalles de la remisión:', node);

        switch(node.type){
            case 'remision':
                showRemisionDetails(node);
                break;
            default:
                break;
        }
      
    }


    const showRemisionDetails = (node:any) => {
        Swal.fire({
            title: 'Detalles de la Remisión',
            html: `
            <p>Información del nodo: </p>
            <img src="http://172.18.110.25/sarai/public/files/Remisiones/${node.data.Ficha}/FotosHuellas/${node.data.No_Remision}/rostro_frente.jpeg" alt="Imagen de la remisión" style="width: 100%; height: auto;"/>
            `,
            icon: 'info',
            confirmButtonText: 'Cerrar',
            width: '600px'
        });
    }


  return {
    showDetails
  }
}
