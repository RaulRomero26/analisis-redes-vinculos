import React, { useState } from 'react';
import { useNetwork } from '../context/NetworkContext';
import toast from 'react-hot-toast';

interface SearchNodeProps {
    getData: any;
}

const SearchNode: React.FC<SearchNodeProps> = ({ getData }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { network } = useNetwork();

    const handleSearch = () => {
        const data = getData();
        const nodes = data.nodes;
        const results = nodes.filter((n: any) => n.id.toLowerCase().includes(searchTerm) || n.label.toLowerCase().includes(searchTerm));
        setSearchResults(results);
        setCurrentIndex(0);

        if (results.length > 0) {
            focusNode(results[0]);
        } else {
            toast.error('Nodo no encontrado');
        }
    };

    const focusNode = (node: any) => {
        network.focus(node.id, {
            scale: 1.0,
            animation: {
                duration: 1000,
                easingFunction: 'easeInOutQuad'
            }
        });
        network.selectNodes([node.id]);
    };

    const handleNext = () => {
        if (searchResults.length > 0) {
            const nextIndex = (currentIndex + 1) % searchResults.length;
            setCurrentIndex(nextIndex);
            focusNode(searchResults[nextIndex]);
        }
    };

    const handlePrevious = () => {
        if (searchResults.length > 0) {
            const prevIndex = (currentIndex - 1 + searchResults.length) % searchResults.length;
            setCurrentIndex(prevIndex);
            focusNode(searchResults[prevIndex]);
        }
    };

    return (
        <div className="search-node flex items-center space-x-2">
            <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar nodo"
            className="border p-2 flex-grow"
            />
            <button onClick={handleSearch} className="p-2 bg-blue-500 text-white">
            Buscar
            </button>
            {searchResults.length > 0 && (
            <>
                <button onClick={handlePrevious} className="p-2 bg-gray-500 text-white">
                Anterior
                </button>
                <button onClick={handleNext} className="p-2 bg-gray-500 text-white">
                Siguiente
                </button>
            </>
            )}
        </div>
    );
};

export default SearchNode;