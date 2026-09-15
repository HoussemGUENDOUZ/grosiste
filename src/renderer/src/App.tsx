import { useState } from 'react';
import { useProducts } from './hooks/useProducts';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import type { Product } from '../../shared/types/product';

type View =
  | { mode: 'list' }
  | { mode: 'add' }
  | { mode: 'edit'; product: Product };

function App() {
  const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProducts();
  const [view, setView] = useState<View>({ mode: 'list' });
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: '#c0392b' }}>Error: {error}</p>;

  return (
    <div style={{ padding: 24 }}>
      {view.mode === 'list' && (
        <ProductList
          products={products}
          onAddClick={() => setView({ mode: 'add' })}
          onEdit={(product) => setView({ mode: 'edit', product })}
          onDelete={(product) => setProductToDelete(product)}
        />
      )}

      {view.mode === 'add' && (
        <ProductForm
          onSubmit={async (input) => {
            await createProduct(input);
            setView({ mode: 'list' });
          }}
          onCancel={() => setView({ mode: 'list' })}
        />
      )}

      {view.mode === 'edit' && (
        <ProductForm
          initialProduct={view.product}
          onSubmit={async (input) => {
            await updateProduct(view.product.id, input);
            setView({ mode: 'list' });
          }}
          onCancel={() => setView({ mode: 'list' })}
        />
      )}

      {productToDelete && (
        <DeleteConfirmModal
          product={productToDelete}
          onConfirm={async () => {
            await deleteProduct(productToDelete.id);
            setProductToDelete(null);
          }}
          onCancel={() => setProductToDelete(null)}
        />
      )}
    </div>
  );
}

export default App;