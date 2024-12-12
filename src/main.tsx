
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { NetworkProvider } from './context/NetworkContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <NetworkProvider>
        <App />
    </NetworkProvider>

)
