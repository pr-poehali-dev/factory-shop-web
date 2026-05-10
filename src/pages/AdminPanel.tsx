import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import type { AuthUser } from "./LoginPage";
import { api, type Client, type Order, type Product } from "@/api";

type AdminTab = "clients" | "orders" | "products" | "reports";
type AdminProduct = Product;

const STATUS_LABELS: Record<Order["status"], { label: string; color: string }> = {
  new: { label: "Новый", color: "bg-blue-100 text-blue-700 border-blue-200" },
  processing: { label: "В обработке", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  shipped: { label: "Отгружен", color: "bg-purple-100 text-purple-700 border-purple-200" },
  completed: { label: "Выполнен", color: "bg-green-100 text-green-700 border-green-200" },
  cancelled: { label: "Отменён", color: "bg-red-100 text-red-700 border-red-200" },
};

interface AdminPanelProps {
  user: AuthUser;
  onLogout: () => void;
}

export default function AdminPanel({ user, onLogout }: AdminPanelProps) {
  const [tab, setTab] = useState<AdminTab>("clients");
  const [clients, setClients] = useState<Client[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [c, o, p] = await Promise.all([api.getClients(), api.getOrders(), api.getProducts()]);
    setClients(c);
    setOrders(o);
    setProducts(p);
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const totalRevenue = orders.filter((o) => o.status === "completed").reduce((s, o) => s + o.amount, 0);
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const newOrders = orders.filter((o) => o.status === "new").length;

  const getClientName = (id: number) => clients.find((c) => c.id === id)?.company || "—";

  const deleteClient = async (id: number) => {
    if (!confirm("Удалить клиента?")) return;
    await api.deleteClient(id);
    setClients((p) => p.filter((c) => c.id !== id));
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Удалить товар?")) return;
    await api.deleteProduct(id);
    setProducts((p) => p.filter((c) => c.id !== id));
  };

  const deleteOrder = async (id: number) => {
    if (!confirm("Удалить заказ?")) return;
    await api.deleteOrder(id);
    setOrders((p) => p.filter((c) => c.id !== id));
  };

  const saveClient = async (c: Client) => {
    if (c.id) {
      const updated = await api.updateClient(c.id, { company: c.company, contact: c.contact, phone: c.phone, email: c.email });
      setClients((p) => p.map((x) => (x.id === c.id ? updated : x)));
    } else {
      const created = await api.createClient({ company: c.company, contact: c.contact, phone: c.phone, email: c.email });
      setClients((p) => [...p, created]);
    }
    setEditingClient(null);
  };

  const saveProduct = async (p: AdminProduct) => {
    if (p.id) {
      const updated = await api.updateProduct(p.id, { name: p.name, article: p.article, category: p.category, price: p.price, stock: p.stock });
      setProducts((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
    } else {
      const created = await api.createProduct({ name: p.name, article: p.article, category: p.category, price: p.price, stock: p.stock });
      setProducts((prev) => [...prev, created]);
    }
    setEditingProduct(null);
  };

  const updateOrderStatus = async (order: Order, status: Order["status"]) => {
    const updated = await api.updateOrder(order.id, { clientId: order.clientId, date: order.date, status, amount: order.amount });
    setOrders((p) => p.map((x) => (x.id === order.id ? updated : x)));
  };

  const NAV: { id: AdminTab; label: string; icon: string }[] = [
    { id: "clients", label: "Клиенты", icon: "Users" },
    { id: "orders", label: "Заказы", icon: "ClipboardList" },
    { id: "products", label: "Товары", icon: "Package" },
    { id: "reports", label: "Отчёты", icon: "BarChart3" },
  ];

  return (
    <div className="min-h-screen bg-[#f1f4f8] flex font-['Golos_Text',sans-serif]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0f2340] text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-[#1c3a5e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a9fd4] rounded-lg flex items-center justify-center">
              <Icon name="ShieldCheck" size={20} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-wide">Арсенал</div>
              <div className="text-[10px] text-[#7da8c9] uppercase tracking-widest">Учёт продаж</div>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-[#1c3a5e]">
          <div className="text-[10px] text-[#4a7fa0] uppercase tracking-wider mb-1">Администратор</div>
          <div className="text-sm font-medium">{user.name}</div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === n.id
                  ? "bg-[#1a9fd4] text-white shadow-md"
                  : "text-[#a0c4dd] hover:text-white hover:bg-[#1c3556]"
              }`}
            >
              <Icon name={n.icon} size={16} />
              {n.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-[#1c3a5e]">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#a0c4dd] hover:text-red-300 hover:bg-red-900/30 transition-all"
          >
            <Icon name="LogOut" size={16} />
            Выход
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#0f2340]">{NAV.find((n) => n.id === tab)?.label}</h1>
            <p className="text-sm text-gray-500 mt-1">Система учёта продаж</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <Icon name="Loader2" size={28} className="animate-spin mr-3" />
              Загрузка данных...
            </div>
          ) : (
            <>
              {tab === "clients" && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">Всего клиентов: <b className="text-[#0f2340]">{clients.length}</b></div>
                    <button
                      onClick={() => setEditingClient({ id: 0, company: "", contact: "", phone: "", email: "" })}
                      className="flex items-center gap-2 bg-[#1a9fd4] hover:bg-[#158ab8] text-white text-sm font-medium px-3 py-2 rounded-lg"
                    >
                      <Icon name="Plus" size={14} />
                      Добавить клиента
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-3 text-left">Компания</th>
                          <th className="px-4 py-3 text-left">Контактное лицо</th>
                          <th className="px-4 py-3 text-left">Телефон</th>
                          <th className="px-4 py-3 text-left">Email</th>
                          <th className="px-4 py-3 text-right">Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.map((c) => (
                          <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-[#0f2340]">{c.company}</td>
                            <td className="px-4 py-3 text-gray-700">{c.contact}</td>
                            <td className="px-4 py-3 text-gray-700 font-mono text-xs">{c.phone}</td>
                            <td className="px-4 py-3 text-[#1a9fd4]">{c.email}</td>
                            <td className="px-4 py-3 text-right">
                              <div className="inline-flex gap-1">
                                <button onClick={() => setEditingClient(c)} className="p-1.5 hover:bg-blue-100 text-[#1a9fd4] rounded">
                                  <Icon name="Pencil" size={14} />
                                </button>
                                <button onClick={() => deleteClient(c.id)} className="p-1.5 hover:bg-red-100 text-red-500 rounded">
                                  <Icon name="Trash2" size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tab === "orders" && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 text-sm text-gray-600">
                    Всего заказов: <b className="text-[#0f2340]">{orders.length}</b> · Сумма: <b className="text-[#0f2340]">{orders.reduce((s, o) => s + o.amount, 0).toLocaleString("ru-RU")} ₽</b>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-3 text-left">№</th>
                          <th className="px-4 py-3 text-left">Клиент</th>
                          <th className="px-4 py-3 text-left">Дата</th>
                          <th className="px-4 py-3 text-left">Статус</th>
                          <th className="px-4 py-3 text-right">Сумма</th>
                          <th className="px-4 py-3 text-right">Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => (
                          <tr key={o.id} className="border-t border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-xs text-gray-500">#{o.id}</td>
                            <td className="px-4 py-3 font-medium text-[#0f2340]">{getClientName(o.clientId)}</td>
                            <td className="px-4 py-3 text-gray-700 font-mono text-xs">{new Date(o.date + "T00:00:00").toLocaleDateString("ru-RU")}</td>
                            <td className="px-4 py-3">
                              <select
                                value={o.status}
                                onChange={(e) => updateOrderStatus(o, e.target.value as Order["status"])}
                                className={`text-xs font-medium px-2 py-1 rounded border ${STATUS_LABELS[o.status].color} cursor-pointer focus:outline-none`}
                              >
                                {(Object.keys(STATUS_LABELS) as Order["status"][]).map((s) => (
                                  <option key={s} value={s}>{STATUS_LABELS[s].label}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-[#0f2340]">{o.amount.toLocaleString("ru-RU")} ₽</td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={() => deleteOrder(o.id)} className="p-1.5 hover:bg-red-100 text-red-500 rounded">
                                <Icon name="Trash2" size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tab === "products" && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">Позиций: <b className="text-[#0f2340]">{products.length}</b></div>
                    <button
                      onClick={() => setEditingProduct({ id: 0, name: "", article: "", category: "Транзисторы", price: 0, stock: 0 })}
                      className="flex items-center gap-2 bg-[#1a9fd4] hover:bg-[#158ab8] text-white text-sm font-medium px-3 py-2 rounded-lg"
                    >
                      <Icon name="Plus" size={14} />
                      Добавить товар
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-3 text-left">Артикул</th>
                          <th className="px-4 py-3 text-left">Наименование</th>
                          <th className="px-4 py-3 text-left">Категория</th>
                          <th className="px-4 py-3 text-right">Цена</th>
                          <th className="px-4 py-3 text-right">Остаток</th>
                          <th className="px-4 py-3 text-right">Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-xs text-gray-700">{p.article}</td>
                            <td className="px-4 py-3 font-medium text-[#0f2340]">{p.name}</td>
                            <td className="px-4 py-3 text-gray-600">{p.category}</td>
                            <td className="px-4 py-3 text-right font-semibold">{p.price.toLocaleString("ru-RU")} ₽</td>
                            <td className="px-4 py-3 text-right">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded ${p.stock > 100 ? "bg-green-100 text-green-700" : p.stock > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                                {p.stock.toLocaleString("ru-RU")} шт
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="inline-flex gap-1">
                                <button onClick={() => setEditingProduct(p)} className="p-1.5 hover:bg-blue-100 text-[#1a9fd4] rounded">
                                  <Icon name="Pencil" size={14} />
                                </button>
                                <button onClick={() => deleteProduct(p.id)} className="p-1.5 hover:bg-red-100 text-red-500 rounded">
                                  <Icon name="Trash2" size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tab === "reports" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "Выручка", value: `${totalRevenue.toLocaleString("ru-RU")} ₽`, icon: "TrendingUp", color: "text-green-600", bg: "bg-green-50" },
                      { label: "Всего заказов", value: orders.length, icon: "ClipboardList", color: "text-blue-600", bg: "bg-blue-50" },
                      { label: "Выполнено", value: completedOrders, icon: "CheckCircle2", color: "text-emerald-600", bg: "bg-emerald-50" },
                      { label: "Новые", value: newOrders, icon: "Bell", color: "text-orange-600", bg: "bg-orange-50" },
                    ].map((s) => (
                      <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
                          <Icon name={s.icon} size={18} className={s.color} />
                        </div>
                        <div className="text-2xl font-bold text-[#0f2340]">{s.value}</div>
                        <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="font-semibold text-[#0f2340] mb-4 flex items-center gap-2">
                      <Icon name="BarChart3" size={18} />
                      Заказы по статусам
                    </h3>
                    <div className="space-y-2">
                      {(Object.keys(STATUS_LABELS) as Order["status"][]).map((s) => {
                        const count = orders.filter((o) => o.status === s).length;
                        const pct = orders.length ? (count / orders.length) * 100 : 0;
                        return (
                          <div key={s}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-700">{STATUS_LABELS[s].label}</span>
                              <span className="font-semibold text-[#0f2340]">{count}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div className="bg-[#1a9fd4] h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="font-semibold text-[#0f2340] mb-4 flex items-center gap-2">
                      <Icon name="Trophy" size={18} />
                      Топ клиентов
                    </h3>
                    <div className="space-y-2">
                      {clients
                        .map((c) => ({ ...c, total: orders.filter((o) => o.clientId === c.id).reduce((s, o) => s + o.amount, 0) }))
                        .sort((a, b) => b.total - a.total)
                        .slice(0, 5)
                        .map((c, i) => (
                          <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-[#1a9fd4]/10 text-[#1a9fd4] font-bold text-xs flex items-center justify-center">
                                {i + 1}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-[#0f2340]">{c.company}</div>
                                <div className="text-xs text-gray-500">{c.contact}</div>
                              </div>
                            </div>
                            <div className="font-semibold text-[#0f2340]">{c.total.toLocaleString("ru-RU")} ₽</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {editingClient && (
        <Modal title={editingClient.id ? "Редактировать клиента" : "Новый клиент"} onClose={() => setEditingClient(null)}>
          <ClientForm initial={editingClient} onSave={saveClient} onCancel={() => setEditingClient(null)} />
        </Modal>
      )}

      {editingProduct && (
        <Modal title={editingProduct.id ? "Редактировать товар" : "Новый товар"} onClose={() => setEditingProduct(null)}>
          <ProductForm initial={editingProduct} onSave={saveProduct} onCancel={() => setEditingProduct(null)} />
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="font-semibold text-[#0f2340]">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <Icon name="X" size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function ClientForm({ initial, onSave, onCancel }: { initial: Client; onSave: (c: Client) => void; onCancel: () => void }) {
  const [form, setForm] = useState(initial);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-3">
      {[
        { key: "company", label: "Название компании" },
        { key: "contact", label: "Контактное лицо (ФИО)" },
        { key: "phone", label: "Телефон" },
        { key: "email", label: "Email" },
      ].map((f) => (
        <div key={f.key}>
          <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">{f.label}</label>
          <input
            type={f.key === "email" ? "email" : "text"}
            required
            value={(form as unknown as Record<string, string>)[f.key]}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a9fd4]"
          />
        </div>
      ))}
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg text-sm">Отмена</button>
        <button type="submit" className="flex-1 bg-[#1a9fd4] hover:bg-[#158ab8] text-white font-medium py-2 rounded-lg text-sm">Сохранить</button>
      </div>
    </form>
  );
}

function ProductForm({ initial, onSave, onCancel }: { initial: AdminProduct; onSave: (p: AdminProduct) => void; onCancel: () => void }) {
  const [form, setForm] = useState(initial);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-3">
      <div>
        <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">Артикул</label>
        <input required value={form.article} onChange={(e) => setForm({ ...form, article: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a9fd4]" />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">Наименование</label>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a9fd4]" />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">Категория</label>
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a9fd4]">
          <option>Транзисторы</option>
          <option>Диоды</option>
          <option>НЧ соединители</option>
          <option>ВЧ кабельные сборки</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">Цена, ₽</label>
          <input type="number" min={0} required value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a9fd4]" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">Остаток</label>
          <input type="number" min={0} required value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a9fd4]" />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg text-sm">Отмена</button>
        <button type="submit" className="flex-1 bg-[#1a9fd4] hover:bg-[#158ab8] text-white font-medium py-2 rounded-lg text-sm">Сохранить</button>
      </div>
    </form>
  );
}
