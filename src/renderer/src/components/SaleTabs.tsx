import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useClients } from '../hooks/useClients';
import { useSales } from '../hooks/useSales';
import { SaleTab } from './SaleTab';
import { createEmptyDraft, SaleDraft } from '../types/saleDraft';
import type { NewSaleInput } from '../../../shared/types/sale';

const MAX_TABS = 4;

function newTabId() {
  return crypto.randomUUID();
}

export function SaleTabs() {
  const { products, refresh } = useProducts();
  const { clients } = useClients();
  const { createSale } = useSales();

  const [drafts, setDrafts] = useState<SaleDraft[]>([createEmptyDraft(newTabId())]);
  const [activeTabId, setActiveTabId] = useState<string>(drafts[0].tabId);
  const [lastFinalizedMessage, setLastFinalizedMessage] = useState<string | null>(null);

  const activeDraft = drafts.find((d) => d.tabId === activeTabId)!;

  const addTab = () => {
    if (drafts.length >= MAX_TABS) return;
    const draft = createEmptyDraft(newTabId());
    setDrafts([...drafts, draft]);
    setActiveTabId(draft.tabId);
  };

  const closeTab = (tabId: string) => {
    const remaining = drafts.filter((d) => d.tabId !== tabId);
    if (remaining.length === 0) {
      const fresh = createEmptyDraft(newTabId());
      setDrafts([fresh]);
      setActiveTabId(fresh.tabId);
    } else {
      setDrafts(remaining);
      if (activeTabId === tabId) setActiveTabId(remaining[0].tabId);
    }
  };

  const updateDraft = (updated: SaleDraft) => {
    setDrafts(drafts.map((d) => (d.tabId === updated.tabId ? updated : d)));
  };

  const finalizeDraft = async (tabId: string, input: NewSaleInput) => {
  const sale = await createSale(input);
  await refresh(); // products context is now shared with the Products tab — this line fixes the bug
  setLastFinalizedMessage(`Sale #${sale.id} completed successfully.`);
  closeTab(tabId);
};

  return (
    <div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 12, borderBottom: '1px solid #ccc' }}>
        {drafts.map((d, i) => (
          <div
            key={d.tabId}
            style={{
              padding: '6px 12px', cursor: 'pointer',
              fontWeight: d.tabId === activeTabId ? 'bold' : 'normal',
              borderBottom: d.tabId === activeTabId ? '2px solid black' : 'none',
            }}
            onClick={() => setActiveTabId(d.tabId)}
          >
            Sale {i + 1}
            {drafts.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); closeTab(d.tabId); }}
                style={{ marginLeft: 6 }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button onClick={addTab} disabled={drafts.length >= MAX_TABS}>+ New</button>
      </div>

      {lastFinalizedMessage && (
        <p style={{ color: 'green' }}>{lastFinalizedMessage}</p>
      )}

      <SaleTab
        key={activeDraft.tabId}
        draft={activeDraft}
        products={products}
        clients={clients}
        onChange={updateDraft}
        onFinalize={(input) => finalizeDraft(activeDraft.tabId, input)}
      />
    </div>
  );
}