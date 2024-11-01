
//data arreglo de el grfo
//find mi nodo que voy a buscar en el data
//

const findSameEntity = (data: any, find: any) => {


    let result = data.nodes.find((node: any) => {
        if(node.entity === find.entity){
            
            return node;
        }
    });
    return result;

};