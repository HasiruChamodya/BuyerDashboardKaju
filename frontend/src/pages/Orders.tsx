import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Printer, RotateCcw, X } from "lucide-react";
import { orders } from "../data/mockData";
import type { Order, OrderStage } from "../types";
import { formatDate, formatLkr } from "../lib/format";
import OrderStepper from "../components/ui/OrderStepper";
import Button from "../components/ui/Button";
import { EmptyState } from "../components/ui/Misc";
import { useApp } from "../context/AppContext";

const STAGE_FILTERS: ("All" | OrderStage)[] = [
  "All",
  "Order Registered",
  "Payment Verified in Escrow",
  "Batch Dispatched",
  "Completed & Delivered",
];

const stageStyles: Record<OrderStage, string> = {
  "Order Registered": "bg-bg-soft text-text border-border",
  "Payment Verified in Escrow": "bg-amber-50 text-amber-600 border-amber-100",
  "Batch Dispatched": "bg-brand-50 text-brand-600 border-brand-100",
  "Completed & Delivered": "bg-success-50 text-success-600 border-success-100",
};

export default function Orders() {
  const { addToCart } = useApp();
  const [stageFilter, setStageFilter] = useState<"All" | OrderStage>("All");
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [reorderMessage, setReorderMessage] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    if (stageFilter === "All") return orders;
    return orders.filter((o) => o.stage === stageFilter);
  }, [stageFilter]);

  function handleReorder(order: Order) {
    order.items.forEach((item) => addToCart(item.listingId, item.quantityMt));
    setReorderMessage(`${order.items.length} item(s) from ${order.id} added to your cart.`);
    setTimeout(() => setReorderMessage(null), 4000);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text-h">Orders &amp; Logistics</h1>
          <p className="mt-1 text-sm text-text">
            Track active shipments and review your historical order ledger.
          </p>
        </div>
        {reorderMessage && (
          <div className="rounded-md border border-success-200 bg-success-50 px-3 py-2 text-xs font-medium text-success-700">
            {reorderMessage}
          </div>
        )}
      </div>

      {/* Stage filter */}
      <div className="flex flex-wrap gap-2">
        {STAGE_FILTERS.map((stage) => (
          <button
            key={stage}
            onClick={() => setStageFilter(stage)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              stageFilter === stage
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-border bg-white text-text hover:border-brand-200 hover:bg-brand-50"
            }`}
          >
            {stage}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={<Package className="h-6 w-6" />}
          title="No orders in this stage"
          description="Try selecting a different stage filter, or browse the marketplace to place a new order."
          action={
            <Link to="/marketplace">
              <Button variant="primary" size="sm">
                Browse marketplace
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="rounded-card border border-border bg-white p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-dashed border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="mono-num text-sm font-semibold text-text-h">{order.id}</span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${stageStyles[order.stage]}`}
                    >
                      {order.stage}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-text">
                    Placed {formatDate(order.date)} &middot; {order.vendor} &middot; Ship to{" "}
                    {order.district}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" icon={<Printer className="h-3.5 w-3.5" />} onClick={() => setInvoiceOrder(order)}>
                    Invoice
                  </Button>
                  <Button variant="secondary" size="sm" icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={() => handleReorder(order)}>
                    Reorder
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 py-4 lg:grid-cols-[1.4fr_1fr]">
                {/* Stepper */}
                <div>
                  <OrderStepper currentStage={order.stage} />
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.listingId} className="flex items-center justify-between text-xs">
                      <div>
                        <p className="font-medium text-text-h">{item.title}</p>
                        <p className="mono-num text-text">
                          Grade {item.grade} &middot; {item.quantityMt} MT &middot; {formatLkr(item.pricePerMt)} / MT
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-border pt-3 text-xs text-text">
                <span>
                  {order.shippingMethod === "Courier" ? "Scheduled courier transport" : "Direct warehouse pickup"}{" "}
                  &middot; {order.paymentMethod === "Digital" ? "Digital payment (escrow)" : "Cash on delivery"}
                </span>
                <span className="mono-num text-sm font-semibold text-text-h">{formatLkr(order.totalLkr)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice modal */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-card border border-border bg-white p-6 shadow-pop">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold text-text-h">Invoice</h2>
                <p className="mono-num text-xs text-text">{invoiceOrder.id}</p>
              </div>
              <button
                onClick={() => setInvoiceOrder(null)}
                className="rounded-md p-1 text-text hover:bg-bg-soft"
                aria-label="Close invoice"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-1 text-xs text-text">
              <p>Date: {formatDate(invoiceOrder.date)}</p>
              <p>Vendor: {invoiceOrder.vendor}</p>
              <p>Delivery district: {invoiceOrder.district}</p>
              <p>
                Shipping:{" "}
                {invoiceOrder.shippingMethod === "Courier" ? "Scheduled Courier Transport" : "Direct Warehouse Pick-Up"}
              </p>
              <p>
                Payment: {invoiceOrder.paymentMethod === "Digital" ? "Digital Payment (Escrow)" : "Cash on Delivery"}
              </p>
            </div>

            <div className="mt-4 divide-y divide-dashed divide-border border-y border-dashed border-border">
              {invoiceOrder.items.map((item) => (
                <div key={item.listingId} className="flex items-center justify-between py-2 text-xs">
                  <div>
                    <p className="font-medium text-text-h">{item.title}</p>
                    <p className="mono-num text-text">
                      {item.grade} &middot; {item.quantityMt} MT &times; {formatLkr(item.pricePerMt)}
                    </p>
                  </div>
                  <span className="mono-num font-medium text-text-h">
                    {formatLkr(item.pricePerMt * item.quantityMt)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-text-h">Total</span>
              <span className="mono-num text-base font-semibold text-text-h">{formatLkr(invoiceOrder.totalLkr)}</span>
            </div>

            <div className="mt-5 flex gap-2">
              <Button variant="secondary" fullWidth onClick={() => setInvoiceOrder(null)}>
                Close
              </Button>
              <Button variant="primary" fullWidth icon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>
                Print
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
