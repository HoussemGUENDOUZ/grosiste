import { useState } from 'react'
import { useProducts } from './hooks/useProducts'
import { useClients } from './hooks/useClients'
import { ProductList } from './components/ProductList'
import { ProductForm } from './components/ProductForm'
import { ClientList } from './components/ClientList'
import { ClientForm } from './components/ClientForm'
import { SaleList } from './components/SaleList'
import { SaleDetail } from './components/SaleDetail'
import { useSales } from './hooks/useSales'
import type { Sale } from '../../shared/types/sale'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
import { SaleTabs } from './components/SaleTabs'
import type { Product } from '../../shared/types/product'
import type { Client } from '../../shared/types/client'

type Tab = 'products' | 'clients' | 'sales'

type ProductView = { mode: 'list' } | { mode: 'add' } | { mode: 'edit'; product: Product }

type ClientView = { mode: 'list' } | { mode: 'add' } | { mode: 'edit'; client: Client }

function App() {
  const [tab, setTab] = useState<Tab>('products')

  const productsApi = useProducts()
  const clientsApi = useClients()
  const salesApi = useSales()
  type SalesSubView = 'new' | 'history' | { mode: 'detail'; sale: Sale }
  const [salesSubView, setSalesSubView] = useState<SalesSubView>('new')

  const [productView, setProductView] = useState<ProductView>({ mode: 'list' })
  const [clientView, setClientView] = useState<ClientView>({ mode: 'list' })

  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)

  return (
    <div style={{ padding: 24 }}>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '1px solid #ccc' }}>
        <button
          onClick={() => setTab('products')}
          style={{ fontWeight: tab === 'products' ? 'bold' : 'normal' }}
        >
          Products
        </button>
        <button
          onClick={() => setTab('clients')}
          style={{ fontWeight: tab === 'clients' ? 'bold' : 'normal' }}
        >
          Clients
        </button>
        <button
          onClick={() => setTab('sales')}
          style={{ fontWeight: tab === 'sales' ? 'bold' : 'normal' }}
        >
          Sales
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
              onSubmit={async (input) => {
                await productsApi.createProduct(input)
                setProductView({ mode: 'list' })
              }}
              onCancel={() => setProductView({ mode: 'list' })}
            />
          )}
          {productView.mode === 'edit' && (
            <ProductForm
              initialProduct={productView.product}
              onSubmit={async (input) => {
                await productsApi.updateProduct(productView.product.id, input)
                setProductView({ mode: 'list' })
              }}
              onCancel={() => setProductView({ mode: 'list' })}
            />
          )}
          {productToDelete && (
            <DeleteConfirmModal
              itemName={productToDelete.name}
              onConfirm={async () => {
                await productsApi.deleteProduct(productToDelete.id)
                setProductToDelete(null)
              }}
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
              onSubmit={async (input) => {
                await clientsApi.createClient(input)
                setClientView({ mode: 'list' })
              }}
              onCancel={() => setClientView({ mode: 'list' })}
            />
          )}
          {clientView.mode === 'edit' && (
            <ClientForm
              initialClient={clientView.client}
              onSubmit={async (input) => {
                await clientsApi.updateClient(clientView.client.id, input)
                setClientView({ mode: 'list' })
              }}
              onCancel={() => setClientView({ mode: 'list' })}
            />
          )}
          {clientToDelete && (
            <DeleteConfirmModal
              itemName={clientToDelete.name}
              onConfirm={async () => {
                await clientsApi.deleteClient(clientToDelete.id)
                setClientToDelete(null)
              }}
              onCancel={() => setClientToDelete(null)}
            />
          )}
        </>
      )}

      {tab === 'sales' && (
        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <button onClick={() => setSalesSubView('new')}>New Sale</button>
            <button onClick={() => setSalesSubView('history')}>History</button>
          </div>

          {/* SaleTabs stays mounted always (display:none when hidden) so its 4 drafts are never lost */}
          <div style={{ display: salesSubView === 'new' ? 'block' : 'none' }}>
            <SaleTabs />
          </div>

          {salesSubView === 'history' && (
            <SaleList
              sales={salesApi.sales}
              onSelect={(sale) => setSalesSubView({ mode: 'detail', sale })}
            />
          )}

          {typeof salesSubView === 'object' && salesSubView.mode === 'detail' && (
            <SaleDetail sale={salesSubView.sale} onBack={() => setSalesSubView('history')} />
          )}
        </div>
      )}
    </div>
  )
}

export default App
