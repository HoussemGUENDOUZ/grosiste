import { useState } from 'react';
import { useProducts } from './hooks/useProducts';
import { useClients } from './hooks/useClients';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';
import { ClientList } from './components/ClientList';
import { ClientForm } from './components/ClientForm';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import type { Product } from '../../shared/types/product';
import type { Client } from '../../shared/types/client';

type Tab = 'products' | 'clients';

type ProductView =
  | { mode: 'list' }
  | { mode: 'add' }
  | { mode: 'edit'; product: Product };

type ClientView =
  | { mode: 'list' }
  | { mode: 'add' }
  | { mode: 'edit'; client: Client };

function App() {
  const [tab, setTab] = useState<Tab>('products');

  const productsApi = useProducts();
  const clientsApi = useClients();

  const [productView, setProductView] = useState<ProductView>({ mode: 'list' });
  const [clientView, setClientView] = useState<ClientView>({ mode: 'list' });

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  return (
    <div style={{ padding: 24 }}>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '1px solid #ccc' }}>
        <button onClick={() => setTab('products')} style={{ fontWeight: tab === 'products' ? 'bold' : 'normal' }}>
          Products
        </button>
        <button onClick={() => setTab('clients')} style={{ fontWeight: tab === 'clients' ? 'bold' : 'normal' }}>
          Clients
        </button>
      </nav>

      {tab === 'products' && (
        <>
          {productsApi.loading && <p>Loading...</p>}
          {productsApi.error && <p style={{ color: '#c0392b' }}>Error: {productsApi.error}</p>}

          {!productsApi.loading && productView.mode === 'list' && (
            <ProductList
              products={productsApi.products}
              onAddClick={() => setProductView({ mode: 'add' })}
              onEdit={(product) => setProductView({ mode: 'edit', product })}
              onDelete={(product) => setProductToDelete(product)}
            />
          )}
          {productView.mode === 'add' && (
            <ProductForm
              onSubmit={async (input) => { await productsApi.createProduct(input); setProductView({ mode: 'list' }); }}
              onCancel={() => setProductView({ mode: 'list' })}
            />
          )}
          {productView.mode === 'edit' && (
            <ProductForm
              initialProduct={productView.product}
              onSubmit={async (input) => { await productsApi.updateProduct(productView.product.id, input); setProductView({ mode: 'list' }); }}
              onCancel={() => setProductView({ mode: 'list' })}
            />
          )}
          {productToDelete && (
            <DeleteConfirmModal
              itemName={productToDelete.name}
              onConfirm={async () => { await productsApi.deleteProduct(productToDelete.id); setProductToDelete(null); }}
              onCancel={() => setProductToDelete(null)}
            />
          )}
        </>
      )}

      {tab === 'clients' && (
        <>
          {clientsApi.loading && <p>Loading...</p>}
          {clientsApi.error && <p style={{ color: '#c0392b' }}>Error: {clientsApi.error}</p>}

          {!clientsApi.loading && clientView.mode === 'list' && (
            <ClientList
              clients={clientsApi.clients}
              onAddClick={() => setClientView({ mode: 'add' })}
              onEdit={(client) => setClientView({ mode: 'edit', client })}
              onDelete={(client) => setClientToDelete(client)}
            />
          )}
          {clientView.mode === 'add' && (
            <ClientForm
              onSubmit={async (input) => { await clientsApi.createClient(input); setClientView({ mode: 'list' }); }}
              onCancel={() => setClientView({ mode: 'list' })}
            />
          )}
          {clientView.mode === 'edit' && (
            <ClientForm
              initialClient={clientView.client}
              onSubmit={async (input) => { await clientsApi.updateClient(clientView.client.id, input); setClientView({ mode: 'list' }); }}
              onCancel={() => setClientView({ mode: 'list' })}
            />
          )}
          {clientToDelete && (
            <DeleteConfirmModal
              itemName={clientToDelete.name}
              onConfirm={async () => { await clientsApi.deleteClient(clientToDelete.id); setClientToDelete(null); }}
              onCancel={() => setClientToDelete(null)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;