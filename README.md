# Inventory & Order Management System
A MERN Stack mini application for managing products, stock, and customer orders.

## Tech Stack
- **Frontend:** React.js (Vite), Ant Design, Axios, React Router DOM
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB

---

## Project Structure
```
exhibyte_practical/
├── backend/
│   ├── middleware/errorHandler.js
│   ├── models/
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── dashboard.js
│   ├── .env
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/layout/AppLayout.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Products.jsx
    │   │   └── Orders.jsx
    │   ├── services/api.js
    │   ├── App.jsx
    │   └── main.jsx
    └── .env
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. Backend Setup
```bash
cd backend
npm install
# Edit .env if needed (default: mongodb://localhost:27017/inventory_db, port 5000)
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Edit .env if needed (default: VITE_API_URL=http://localhost:5000/api)
npm run dev
```

The app will be available at `http://localhost:5173`

---

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (supports `?search=&category=`) |
| POST | `/api/products` | Create a new product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get all orders |
| POST | `/api/orders` | Create a new order (validates & deducts stock) |
| PUT | `/api/orders/:id/status` | Update order status (restores stock on Cancel) |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/summary` | Get summary counts |

---

## Business Logic
- **Stock Validation:** Order creation checks stock availability per item; insufficient stock prevents order.
- **Stock Deduction:** Stock is atomically deducted on successful order placement (MongoDB transaction).
- **Total Calculation:** `totalAmount` is computed server-side as `Σ (quantity × product.price)`.
- **Order Cancellation:** Cancelling an order restores all product stock atomically.
- **Low Stock Detection:** Products where `stock <= reorderLevel` are counted on the dashboard.
- **Unique SKU:** SKU uniqueness is enforced at the database level and validated at the API level.

---

## Planning & Understanding Answers

### Business Understanding
1. **Simultaneous orders for the same product?**
   MongoDB transactions are used for order creation. If two requests hit concurrently, the second will see the already-deducted stock and fail with "Insufficient stock". For high-throughput systems, a queue or optimistic locking pattern would be used.

2. **Why calculate totalAmount on the backend?**
   Frontend values can be tampered with. Backend calculation uses the canonical price from the database, preventing price manipulation.

3. **Handling returned products?**
   Add a `Returned` status to orders and restore stock when transitioning to it. Optionally create a Returns module with reason tracking.

4. **Useful reports for store owners?**
   Sales by product/category, daily/weekly revenue trends, low stock alerts, top-selling products, order fulfillment rate.

5. **Cancelling vs deleting an order?**
   Cancelling changes status to `Cancelled` and restores stock — the order record is preserved for audit. Deleting removes the record permanently with no audit trail.

6. **Securing APIs for different user roles?**
   JWT Authentication middleware on protected routes. Role field on User model (admin, staff). Middleware checks role before allowing destructive actions (delete product, cancel orders, etc.).

### Project Planning
1. **Development task division:**
   Phase 1 — DB schemas + Product CRUD APIs → Phase 2 — Order APIs with business logic → Phase 3 — Dashboard API → Phase 4 — Frontend pages → Phase 5 — Integration testing.

2. **Which APIs first?**
   Products API first — orders depend on products. Dashboard is derived data and comes last.

3. **Edge cases to test:**
   - Order with quantity > available stock
   - Order with a product that has been deactivated
   - Duplicate SKU on create/update
   - Cancelling an already-cancelled order
   - Order with 0 items
   - Concurrent order requests for the same low-stock item

4. **Time estimate:**
   Backend: 1.5h | Frontend: 1.5h | Integration + testing: 0.5h | Documentation: 0.5h = ~4h total.

5. **Questions for the client:**
   - Should order deletion be allowed (or only cancellation)?
   - Are categories fixed or user-defined?
   - Is multi-user / role-based access needed from day one?
   - Should stock be replenishable from the UI (manual stock-in)?
   - What currency should prices use?
