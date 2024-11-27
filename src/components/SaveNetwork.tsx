import React, { useRef } from 'react';
import { GraphData } from '../interfaces/GraphData';
import { MdOutlineSave, MdOutlineUploadFile  } from "react-icons/md";

interface SaveNetworkProps {
  data: GraphData;
  setData: React.Dispatch<React.SetStateAction<GraphData>>;
}

const SaveNetwork: React.FC<SaveNetworkProps> = ({ data, setData }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Función para guardar el grafo en un archivo JSON
    const saveGraph = () => {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'graph.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Función para cargar el grafo desde un archivo JSON
    const loadGraph = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const json = e.target?.result as string;
                const graphData = JSON.parse(json);
                //setData(graphData);
                // Merge the loaded graph with the existing graph
                const mergedNodes = [...data.nodes];
                const mergedEdges = [...data.edges];

                // Add nodes from the loaded graph if they don't exist in the current graph
                graphData.nodes.forEach((node: any) => {
                    if (!mergedNodes.some((n: any) => n.id === node.id)) {
                        mergedNodes.push(node);
                    }
                });

                // Add edges from the loaded graph if they don't exist in the current graph
                graphData.edges.forEach((edge: any) => {
                    if (!mergedEdges.some((e: any) => e.id === edge.id)) {
                        mergedEdges.push(edge);
                    }
                });

                // Update the data with the merged graph
                setData({ nodes: mergedNodes, edges: mergedEdges });
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="flex flex-row items-center space-x-4">
            <button
                onClick={saveGraph}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 flex items-center space-x-2"
            >
                <MdOutlineSave className="mr-2" />
                Guardar Grafo
            </button>
            <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={loadGraph}
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 flex items-center space-x-2"
            >
                <MdOutlineUploadFile />
                <span>Cargar Grafo</span>
            </button>
        </div>
    );
};

export default SaveNetwork;