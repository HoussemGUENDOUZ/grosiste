import './assets/main.css'

import { createRoot } from 'react-dom/client'
import App from './App'
import { ProductsProvider } from './hooks/useProducts'
import { ClientsProvider } from './hooks/useClients'
import { SalesProvider } from './hooks/useSales'

createRoot(document.getElementById('root')!).render(
  <ProductsProvider>
    <ClientsProvider>
      <SalesProvider>
        <App />
      </SalesProvider>
    </ClientsProvider>
  </ProductsProvider>
)
