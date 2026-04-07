import type { AdminOrderStatus } from "@/modules/admin/domain/admin-order";
import { DbOrderRepository } from "@/modules/admin/infrastructure/db-order-repository";
import { DbProductRepository } from "@/modules/catalog/infrastructure/db-product-repository";
import { ensureBakeryBootstrap } from "@/modules/bootstrap/application/ensure-bakery-bootstrap";

const currentStatuses = new Set<AdminOrderStatus>(["pending", "baking", "ready"]);
const historyStatuses = new Set<AdminOrderStatus>(["delivered", "cancelled"]);

const orderRepository = new DbOrderRepository();
const productRepository = new DbProductRepository();

export async function getAdminDashboard() {
  await ensureBakeryBootstrap();

  const [orders, products] = await Promise.all([orderRepository.listAllForAdmin(), productRepository.listAll()]);

  const currentOrders = orders.filter((order) => currentStatuses.has(order.status));
  const orderHistory = orders.filter((order) => historyStatuses.has(order.status));

  const totalRevenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.amount, 0);

  return {
    currentOrders,
    orderHistory,
    products,
    productSummary: {
      total: products.length,
      active: products.filter((product) => product.isActive).length,
      inactive: products.filter((product) => !product.isActive).length,
    },
    stats: {
      activeOrders: currentOrders.length,
      completedOrders: orderHistory.filter((order) => order.status === "delivered").length,
      cancelledOrders: orderHistory.filter((order) => order.status === "cancelled").length,
      totalRevenue,
    },
  };
}
