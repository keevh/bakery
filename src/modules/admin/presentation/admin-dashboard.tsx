import {
  createAdminProductAction,
  logoutAdminAction,
  toggleAdminProductAvailabilityAction,
  updateAdminProductAction,
  updateOrderStatusAction,
} from "@/app/admin/actions";
import type { getAdminDashboard } from "@/modules/admin/application/get-admin-dashboard";

type DashboardData = Awaited<ReturnType<typeof getAdminDashboard>>;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function statusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "baking":
      return "Horneando";
    case "ready":
      return "Listo";
    case "delivered":
      return "Entregado";
    case "cancelled":
      return "Cancelado";
    default:
      return status;
  }
}

function statusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-[#FFDC39] text-[#3C2317]";
    case "baking":
      return "bg-[#FF9B71] text-white";
    case "ready":
      return "bg-[#9BE1E8] text-white";
    case "delivered":
      return "bg-[#4ADE80] text-white";
    case "cancelled":
      return "bg-stone-300 text-stone-700";
    default:
      return "bg-stone-200 text-stone-700";
  }
}

function OrderCard({
  order,
}: {
  order: DashboardData["currentOrders"][number] | DashboardData["orderHistory"][number];
}) {
  return (
    <article className="rounded-[2rem] border-2 border-[#3C2317]/10 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8B5CF6]">{order.id}</p>
          <h3 className="text-2xl font-black uppercase tracking-tight text-[#3C2317]">{order.client}</h3>
          <p className="text-sm font-medium text-[#3C2317]/60">Entrega {order.date}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${statusColor(order.status)}`}>
          {statusLabel(order.status)}
        </span>
      </div>

      <div className="mb-4 grid gap-3 rounded-[1.5rem] bg-[#FDFBF7] p-4 md:grid-cols-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3C2317]/40">Contacto</p>
          <p className="text-sm font-bold text-[#3C2317]">{order.contactValue}</p>
        </div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3C2317]/40">Canal</p>
          <p className="text-sm font-bold uppercase text-[#3C2317]">{order.contactChannel}</p>
        </div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3C2317]/40">Monto</p>
          <p className="text-sm font-black text-[#FF9B71]">{formatCurrency(order.amount)}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#3C2317]/40">Items</p>
        <div className="flex flex-wrap gap-2">
          {order.items.map((item) => (
            <span
              key={`${order.id}-${item.productName}`}
              className="rounded-full border border-[#3C2317]/10 bg-[#FDFBF7] px-3 py-2 text-xs font-bold uppercase text-[#3C2317]"
            >
              {item.productName} · {item.quantity}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-[#3C2317]/10 bg-stone-50 p-4">
        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#3C2317]/40">Notas</p>
        <p className="text-sm font-medium text-[#3C2317]/70">{order.notes}</p>
      </div>

      <form action={updateOrderStatusAction} className="mt-4 flex flex-wrap items-center gap-3">
        <input type="hidden" name="orderNumber" value={order.id} />
        <select
          name="status"
          defaultValue={order.status}
          className="rounded-full border border-[#3C2317]/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#3C2317]"
        >
          <option value="pending">Pendiente</option>
          <option value="baking">Horneando</option>
          <option value="ready">Listo</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
        </select>
        <button
          type="submit"
          className="rounded-full border border-[#3C2317] bg-[#3C2317] px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white"
        >
          Actualizar estado
        </button>
      </form>
    </article>
  );
}

function ProductFormFields({ product }: { product?: DashboardData["products"][number] }) {
  return (
    <>
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-[#3C2317]/40">Slug</span>
          <input
            type="text"
            name="slug"
            defaultValue={product?.slug ?? ""}
            className="w-full rounded-2xl border border-[#3C2317]/10 bg-[#FDFBF7] px-4 py-3 text-sm font-bold text-[#3C2317]"
            required
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-[#3C2317]/40">Categoria</span>
          <select
            name="category"
            defaultValue={product?.category ?? "sourdough"}
            className="w-full rounded-2xl border border-[#3C2317]/10 bg-[#FDFBF7] px-4 py-3 text-sm font-bold text-[#3C2317]"
          >
            <option value="sourdough">Sourdough</option>
            <option value="brioche">Brioche</option>
          </select>
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-[#3C2317]/40">Nombre ES</span>
          <input
            type="text"
            name="nameEs"
            defaultValue={product?.name.es ?? ""}
            className="w-full rounded-2xl border border-[#3C2317]/10 bg-[#FDFBF7] px-4 py-3 text-sm font-bold text-[#3C2317]"
            required
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-[#3C2317]/40">Nombre EN</span>
          <input
            type="text"
            name="nameEn"
            defaultValue={product?.name.en ?? ""}
            className="w-full rounded-2xl border border-[#3C2317]/10 bg-[#FDFBF7] px-4 py-3 text-sm font-bold text-[#3C2317]"
            required
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-[#3C2317]/40">Descripcion ES</span>
          <textarea
            name="descriptionEs"
            defaultValue={product?.description.es ?? ""}
            className="min-h-24 w-full rounded-2xl border border-[#3C2317]/10 bg-[#FDFBF7] px-4 py-3 text-sm font-medium text-[#3C2317]"
            required
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-[#3C2317]/40">Descripcion EN</span>
          <textarea
            name="descriptionEn"
            defaultValue={product?.description.en ?? ""}
            className="min-h-24 w-full rounded-2xl border border-[#3C2317]/10 bg-[#FDFBF7] px-4 py-3 text-sm font-medium text-[#3C2317]"
            required
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-[#3C2317]/40">Precio</span>
          <input
            type="number"
            step="0.01"
            min="0.01"
            name="price"
            defaultValue={product?.price ?? ""}
            className="w-full rounded-2xl border border-[#3C2317]/10 bg-[#FDFBF7] px-4 py-3 text-sm font-bold text-[#3C2317]"
            required
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-[#3C2317]/40">Min. pedido</span>
          <input
            type="number"
            min="1"
            name="minOrder"
            defaultValue={product?.minOrder ?? ""}
            className="w-full rounded-2xl border border-[#3C2317]/10 bg-[#FDFBF7] px-4 py-3 text-sm font-bold text-[#3C2317]"
            required
          />
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-[#3C2317]/10 bg-[#FDFBF7] px-4 py-3 md:mt-7">
          <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} />
          <span className="text-sm font-black uppercase text-[#3C2317]">Activo</span>
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-[#3C2317]/40">Imagen URL</span>
        <input
          type="url"
          name="image"
          defaultValue={product?.image ?? ""}
          className="w-full rounded-2xl border border-[#3C2317]/10 bg-[#FDFBF7] px-4 py-3 text-sm font-bold text-[#3C2317]"
          required
        />
      </label>
    </>
  );
}

function FeedbackBanner({ feedback, error }: { feedback?: string; error?: string }) {
  if (!feedback && !error) {
    return null;
  }

  return (
    <div
      className={`mb-6 rounded-[1.75rem] border px-5 py-4 text-sm font-bold ${
        error
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-[#9BE1E8] bg-[#ECFCFD] text-[#3C2317]"
      }`}
    >
      {error ??
        (feedback === "product-created"
          ? "Producto creado."
          : feedback === "product-updated"
            ? "Producto actualizado."
            : feedback === "product-toggled"
              ? "Disponibilidad actualizada."
              : feedback === "order-updated"
                ? "Estado del pedido actualizado."
                : "Cambios guardados.")}
    </div>
  );
}

export function AdminDashboard({
  data,
  feedback,
  error,
}: {
  data: DashboardData;
  feedback?: string;
  error?: string;
}) {
  return (
    <main className="min-h-screen bg-stone-100 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <FeedbackBanner feedback={feedback} error={error} />

        <div className="mb-8 flex flex-col gap-4 rounded-[2.5rem] border-2 border-[#3C2317]/10 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 inline-block rounded-full bg-[#FFDC39] px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#3C2317]">
              Rollin. Admin CMS
            </p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-[#3C2317] md:text-5xl">
              Pedidos y catalogo
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-[#3C2317]/70">
              Panel reformulado para operar pedidos actuales, revisar historial y tener una lectura rapida del catalogo sin romper la identidad visual de la marca.
            </p>
          </div>

          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="rounded-full border-2 border-[#3C2317] bg-[#3C2317] px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white shadow-[4px_4px_0px_0px_#FFDC39] transition-colors hover:bg-stone-800"
            >
              Cerrar sesion
            </button>
          </form>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[2rem] border-2 border-[#3C2317]/10 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3C2317]/40">Pedidos activos</p>
            <p className="mt-2 text-4xl font-black text-[#3C2317]">{data.stats.activeOrders}</p>
          </div>
          <div className="rounded-[2rem] border-2 border-[#3C2317]/10 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3C2317]/40">Entregados</p>
            <p className="mt-2 text-4xl font-black text-[#3C2317]">{data.stats.completedOrders}</p>
          </div>
          <div className="rounded-[2rem] border-2 border-[#3C2317]/10 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3C2317]/40">Cancelados</p>
            <p className="mt-2 text-4xl font-black text-[#3C2317]">{data.stats.cancelledOrders}</p>
          </div>
          <div className="rounded-[2rem] border-2 border-[#3C2317]/10 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3C2317]/40">Revenue</p>
            <p className="mt-2 text-4xl font-black text-[#FF9B71]">{formatCurrency(data.stats.totalRevenue)}</p>
          </div>
        </section>

        <section className="mb-8 grid gap-8 xl:grid-cols-[2fr_1fr]">
          <div className="rounded-[2.5rem] border-2 border-[#3C2317]/10 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8B5CF6]">Live queue</p>
                <h2 className="text-3xl font-black uppercase tracking-tight text-[#3C2317]">Pedidos actuales</h2>
              </div>
              <span className="rounded-full bg-[#FDFBF7] px-4 py-2 text-xs font-black uppercase text-[#3C2317]">
                {data.currentOrders.length} activos
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {data.currentOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2.5rem] border-2 border-[#3C2317]/10 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8B5CF6]">Catalog snapshot</p>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-[#3C2317]">Productos</h2>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-[#FDFBF7] px-4 py-3">
                  <span className="text-sm font-bold uppercase text-[#3C2317]">Total</span>
                  <span className="text-xl font-black text-[#3C2317]">{data.productSummary.total}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-[#FDFBF7] px-4 py-3">
                  <span className="text-sm font-bold uppercase text-[#3C2317]">Activos</span>
                  <span className="text-xl font-black text-[#4ADE80]">{data.productSummary.active}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-[#FDFBF7] px-4 py-3">
                  <span className="text-sm font-bold uppercase text-[#3C2317]">Inactivos</span>
                  <span className="text-xl font-black text-stone-400">{data.productSummary.inactive}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[2.5rem] border-2 border-[#3C2317]/10 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8B5CF6]">Admin access</p>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-[#3C2317]">Sesion protegida</h2>
              <p className="mt-4 text-sm font-medium text-[#3C2317]/70">
                El acceso ya se valida contra admin_users, la sesion se firma en cookie HTTP-only y el bootstrap carga datos iniciales para desarrollo o ambientes vacios.
              </p>
            </div>
          </aside>
        </section>

        <section className="mb-8 rounded-[2.5rem] border-2 border-[#3C2317]/10 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8B5CF6]">Catalog CMS</p>
              <h2 className="text-3xl font-black uppercase tracking-tight text-[#3C2317]">Crear producto</h2>
            </div>
          </div>

          <form action={createAdminProductAction} className="space-y-4">
            <ProductFormFields />
            <button
              type="submit"
              className="rounded-full border-2 border-[#3C2317] bg-[#3C2317] px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white shadow-[4px_4px_0px_0px_#FFDC39]"
            >
              Crear producto
            </button>
          </form>
        </section>

        <section className="mb-8 rounded-[2.5rem] border-2 border-[#3C2317]/10 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8B5CF6]">Catalog inventory</p>
              <h2 className="text-3xl font-black uppercase tracking-tight text-[#3C2317]">Editar productos</h2>
            </div>
            <span className="rounded-full bg-[#FDFBF7] px-4 py-2 text-xs font-black uppercase text-[#3C2317]">
              {data.products.length} registros
            </span>
          </div>

          <div className="space-y-5">
            {data.products.map((product) => (
              <article key={product.id} className="rounded-[2rem] border border-[#3C2317]/10 bg-[#FDFBF7] p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8B5CF6]">#{product.id}</p>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-[#3C2317]">{product.name.es}</h3>
                  </div>

                  <form action={toggleAdminProductAvailabilityAction}>
                    <input type="hidden" name="id" value={product.id} />
                    <input type="hidden" name="nextIsActive" value={String(!product.isActive)} />
                    <button
                      type="submit"
                      className="rounded-full border border-[#3C2317] bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#3C2317]"
                    >
                      {product.isActive ? "Desactivar" : "Activar"}
                    </button>
                  </form>
                </div>

                <form action={updateAdminProductAction} className="space-y-4">
                  <ProductFormFields product={product} />
                  <button
                    type="submit"
                    className="rounded-full border-2 border-[#3C2317] bg-[#3C2317] px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white"
                  >
                    Guardar cambios
                  </button>
                </form>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2.5rem] border-2 border-[#3C2317]/10 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8B5CF6]">Archive</p>
              <h2 className="text-3xl font-black uppercase tracking-tight text-[#3C2317]">Historial de pedidos</h2>
            </div>
            <span className="rounded-full bg-[#FDFBF7] px-4 py-2 text-xs font-black uppercase text-[#3C2317]">
              {data.orderHistory.length} registros
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {data.orderHistory.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
