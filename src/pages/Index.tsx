import { useState } from "react";
import Icon from "@/components/ui/icon";
import type { AuthUser } from "./LoginPage";

type Category = "transistors" | "diodes" | "lf-connectors" | "hf-cables";

interface Product {
  id: number;
  name: string;
  article: string;
  category: Category;
  price: number;
  unit: string;
  specs: { label: string; value: string }[];
  inStock: boolean;
}

interface CartItem {
  product: Product;
  qty: number;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Транзистор КТ815А",
    article: "КТ815А",
    category: "transistors",
    price: 18,
    unit: "шт",
    inStock: true,
    specs: [
      { label: "Тип", value: "NPN, кремниевый" },
      { label: "Uкэ макс.", value: "40 В" },
      { label: "Iк макс.", value: "1.5 А" },
      { label: "h21э", value: "40–250" },
    ],
  },
  {
    id: 2,
    name: "Транзистор КТ817В",
    article: "КТ817В",
    category: "transistors",
    price: 22,
    unit: "шт",
    inStock: true,
    specs: [
      { label: "Тип", value: "NPN, кремниевый" },
      { label: "Uкэ макс.", value: "60 В" },
      { label: "Iк макс.", value: "3 А" },
      { label: "h21э", value: "25–200" },
    ],
  },
  {
    id: 3,
    name: "Транзистор КТ3102Е",
    article: "КТ3102Е",
    category: "transistors",
    price: 12,
    unit: "шт",
    inStock: true,
    specs: [
      { label: "Тип", value: "NPN, малосигнальный" },
      { label: "Uкэ макс.", value: "50 В" },
      { label: "Iк макс.", value: "100 мА" },
      { label: "h21э", value: "400–1000" },
    ],
  },
  {
    id: 4,
    name: "Диод 1N4007",
    article: "1N4007",
    category: "diodes",
    price: 6,
    unit: "шт",
    inStock: true,
    specs: [
      { label: "Тип", value: "Выпрямительный" },
      { label: "Uобр. макс.", value: "1000 В" },
      { label: "Iпр.", value: "1 А" },
      { label: "Падение напр.", value: "1.1 В" },
    ],
  },
  {
    id: 5,
    name: "Диод КД202А",
    article: "КД202А",
    category: "diodes",
    price: 35,
    unit: "шт",
    inStock: true,
    specs: [
      { label: "Тип", value: "Выпрямительный, мощный" },
      { label: "Uобр. макс.", value: "20 В" },
      { label: "Iпр.", value: "5 А" },
      { label: "Корпус", value: "ТО-220" },
    ],
  },
  {
    id: 6,
    name: "Стабилитрон КС156А",
    article: "КС156А",
    category: "diodes",
    price: 14,
    unit: "шт",
    inStock: false,
    specs: [
      { label: "Тип", value: "Стабилитрон" },
      { label: "Uстаб.", value: "5.6 В" },
      { label: "Мощность", value: "0.3 Вт" },
      { label: "Iстаб.", value: "3–10 мА" },
    ],
  },
  {
    id: 7,
    name: "Соединитель РС-10ТВ",
    article: "РС-10ТВ",
    category: "lf-connectors",
    price: 145,
    unit: "шт",
    inStock: true,
    specs: [
      { label: "Контактов", value: "10" },
      { label: "Ток нагрузки", value: "до 3 А" },
      { label: "Напряжение", value: "250 В" },
      { label: "Исполнение", value: "Вилка на плату" },
    ],
  },
  {
    id: 8,
    name: "Соединитель ОНЦ-ВГ-4/16Р",
    article: "ОНЦ-ВГ-4/16Р",
    category: "lf-connectors",
    price: 380,
    unit: "шт",
    inStock: true,
    specs: [
      { label: "Контактов", value: "16" },
      { label: "Ток нагрузки", value: "до 5 А" },
      { label: "Напряжение", value: "500 В" },
      { label: "Степень защиты", value: "IP54" },
    ],
  },
  {
    id: 9,
    name: "Соединитель СНО-64-4Х4",
    article: "СНО-64-4Х4",
    category: "lf-connectors",
    price: 520,
    unit: "шт",
    inStock: true,
    specs: [
      { label: "Контактов", value: "4×4" },
      { label: "Ток нагрузки", value: "до 3 А" },
      { label: "Напряжение", value: "200 В" },
      { label: "Тип контакта", value: "Круглый, золочёный" },
    ],
  },
  {
    id: 10,
    name: "ВЧ сборка РК50-2-21",
    article: "РК50-2-21",
    category: "hf-cables",
    price: 890,
    unit: "м",
    inStock: true,
    specs: [
      { label: "Волновое сопротивление", value: "50 Ом" },
      { label: "Диапазон частот", value: "до 1 ГГц" },
      { label: "Затухание", value: "6.5 дБ/100м" },
      { label: "Диаметр", value: "5.8 мм" },
    ],
  },
  {
    id: 11,
    name: "Кабельная сборка СР-50-73Ф",
    article: "СР-50-73Ф",
    category: "hf-cables",
    price: 1240,
    unit: "шт",
    inStock: true,
    specs: [
      { label: "Разъём", value: "СР-50 (BNC)" },
      { label: "Длина кабеля", value: "0.5 м" },
      { label: "Сопротивление", value: "50 Ом" },
      { label: "Рабочая частота", value: "до 4 ГГц" },
    ],
  },
  {
    id: 12,
    name: "Сборка ВЧ АМ-50-3/18",
    article: "АМ-50-3/18",
    category: "hf-cables",
    price: 2100,
    unit: "шт",
    inStock: false,
    specs: [
      { label: "Разъём", value: "SMA-мама / N-папа" },
      { label: "Длина кабеля", value: "1 м" },
      { label: "Сопротивление", value: "50 Ом" },
      { label: "Рабочая частота", value: "до 18 ГГц" },
    ],
  },
];

const CATEGORIES = [
  { id: "transistors" as Category, label: "Транзисторы", icon: "Zap" },
  { id: "diodes" as Category, label: "Диоды", icon: "ArrowRight" },
  { id: "lf-connectors" as Category, label: "НЧ соединители", icon: "Plug" },
  { id: "hf-cables" as Category, label: "ВЧ кабельные сборки", icon: "Cable" },
];

type Tab = "products" | "support" | "about";

interface IndexProps {
  user: AuthUser;
  onLogout: () => void;
}

export default function Index({ user, onLogout }: IndexProps) {
  const [tab, setTab] = useState<Tab>("products");
  const [activeCategory, setActiveCategory] = useState<Category>("transistors");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [supportSent, setSupportSent] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [supportForm, setSupportForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [orderForm, setOrderForm] = useState({ name: "", company: "", email: "", phone: "", comment: "" });

  const filteredProducts = PRODUCTS.filter((p) => p.category === activeCategory);

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.qty * i.product.price, 0);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 300);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  };

  const changeQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((i) => i.product.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    );
  };

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderDone(true);
    setCart([]);
    setCartOpen(false);
  };

  const handleSupport = (e: React.FormEvent) => {
    e.preventDefault();
    setSupportSent(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] font-['Golos_Text',sans-serif]">
      {/* HEADER */}
      <header className="bg-[#0f2340] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#1a9fd4] rounded flex items-center justify-center">
                <Icon name="Cpu" size={18} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-base leading-tight tracking-wide">Арсенал</div>
                <div className="text-[10px] text-[#7da8c9] font-mono-tech uppercase tracking-widest">Завод электронных компонентов</div>
              </div>
            </div>

            {/* NAV */}
            <nav className="hidden sm:flex items-center gap-1">
              {([
                { id: "products", label: "Продукция", icon: "Package" },
                { id: "support", label: "Тех. поддержка", icon: "Headphones" },
                { id: "about", label: "О компании", icon: "Building2" },
              ] as { id: Tab; label: string; icon: string }[]).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-all ${
                    tab === t.id
                      ? "bg-[#1a9fd4] text-white"
                      : "text-[#a0c4dd] hover:text-white hover:bg-[#1c3556]"
                  }`}
                >
                  <Icon name={t.icon} size={14} />
                  {t.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {/* USER BADGE */}
              <div className="hidden sm:flex items-center gap-2 bg-[#1c3556] px-3 py-1.5 rounded text-sm">
                <Icon name={user.role === "admin" ? "ShieldCheck" : "User"} size={14} className={user.role === "admin" ? "text-yellow-400" : "text-[#7da8c9]"} />
                <span className="text-white font-medium">{user.name}</span>
                {user.role === "admin" && (
                  <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">Admin</span>
                )}
              </div>

              {/* CART BUTTON */}
              <button
                onClick={() => setCartOpen(true)}
                className={`relative flex items-center gap-2 bg-[#1a9fd4] hover:bg-[#158ab8] text-white px-3 py-1.5 rounded text-sm font-medium transition-all ${cartBounce ? "cart-bounce" : ""}`}
              >
                <Icon name="ShoppingCart" size={16} />
                <span className="hidden sm:inline">Корзина</span>
                {totalQty > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalQty}
                  </span>
                )}
              </button>

              {/* LOGOUT */}
              <button
                onClick={onLogout}
                title="Выйти"
                className="flex items-center justify-center w-8 h-8 rounded bg-[#1c3556] hover:bg-red-900/40 text-[#7da8c9] hover:text-red-400 transition-all"
              >
                <Icon name="LogOut" size={15} />
              </button>
            </div>
          </div>

          {/* MOBILE NAV */}
          <div className="flex sm:hidden gap-1 pb-2">
            {([
              { id: "products", label: "Продукция", icon: "Package" },
              { id: "support", label: "Поддержка", icon: "Headphones" },
              { id: "about", label: "О компании", icon: "Building2" },
            ] as { id: Tab; label: string; icon: string }[]).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-xs font-medium transition-all ${
                  tab === t.id ? "bg-[#1a9fd4] text-white" : "text-[#a0c4dd] hover:text-white"
                }`}
              >
                <Icon name={t.icon} size={12} />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* =================== TAB: PRODUCTS =================== */}
        {tab === "products" && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#0f2340]">Каталог продукции</h1>
              <p className="text-sm text-gray-500 mt-1">Собственное производство. Продукция соответствует ГОСТ и ТУ.</p>
            </div>

            {/* CATEGORY TABS */}
            <div className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded border text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? "bg-[#0f2340] text-white border-[#0f2340]"
                      : "bg-white text-[#0f2340] border-gray-200 hover:border-[#1a9fd4] hover:text-[#1a9fd4]"
                  }`}
                >
                  <Icon name={cat.icon} size={14} />
                  {cat.label}
                </button>
              ))}
            </div>

            {/* PRODUCTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product, i) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-200 hover:border-[#1a9fd4] hover:shadow-md transition-all animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-[#0f2340] text-[15px] leading-tight">{product.name}</div>
                        <div className="font-mono-tech text-xs text-gray-400 mt-0.5">{product.article}</div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${product.inStock ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {product.inStock ? "В наличии" : "Под заказ"}
                      </span>
                    </div>

                    {/* SPECS */}
                    <div className="space-y-1.5 mb-4">
                      {product.specs.map((spec) => (
                        <div key={spec.label} className="flex justify-between items-baseline">
                          <span className="text-xs text-gray-400">{spec.label}</span>
                          <span className="font-mono-tech text-xs text-[#0f2340] font-medium">{spec.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-[#0f2340]">{product.price.toLocaleString("ru-RU")} ₽</span>
                        <span className="text-xs text-gray-400 ml-1">/ {product.unit}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="px-2 py-1.5 rounded border border-gray-200 text-gray-500 hover:border-[#1a9fd4] hover:text-[#1a9fd4] transition-all text-xs"
                        >
                          <Icon name="Info" size={14} />
                        </button>
                        <button
                          onClick={() => addToCart(product)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1a9fd4] hover:bg-[#158ab8] text-white text-xs font-semibold transition-all"
                        >
                          <Icon name="Plus" size={12} />
                          В корзину
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================== TAB: SUPPORT =================== */}
        {tab === "support" && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#0f2340]">Техническая поддержка</h1>
              <p className="text-sm text-gray-500 mt-1">Ответим в течение 2 рабочих часов в пн–пт с 08:00 до 17:00.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* CONTACTS */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h2 className="font-semibold text-[#0f2340] mb-3 text-sm uppercase tracking-wide">Контакты</h2>
                  <div className="space-y-3">
                    {[
                      { icon: "Phone", label: "Телефон", value: "+7 (495) 123-45-67" },
                      { icon: "Mail", label: "E-mail", value: "support@elektrokomponent.ru" },
                      { icon: "Clock", label: "Режим работы", value: "Пн–Пт, 08:00–17:00" },
                    ].map((c) => (
                      <div key={c.label} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded bg-[#e8f4fb] flex items-center justify-center flex-shrink-0">
                          <Icon name={c.icon} size={14} className="text-[#1a9fd4]" />
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-400 uppercase tracking-wide">{c.label}</div>
                          <div className="text-sm font-medium text-[#0f2340]">{c.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQ */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h2 className="font-semibold text-[#0f2340] mb-3 text-sm uppercase tracking-wide">Частые вопросы</h2>
                  <div className="space-y-3">
                    {[
                      { q: "Каков минимальный заказ?", a: "От 10 штук на позицию для продукции с маркировкой «В наличии»." },
                      { q: "Есть ли документация?", a: "Паспорт изделия и протокол испытаний прилагаются к каждой партии." },
                      { q: "Сроки поставки?", a: "3–5 рабочих дней по РФ при наличии на складе." },
                    ].map((f) => (
                      <div key={f.q} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                        <div className="text-xs font-semibold text-[#0f2340] mb-0.5">{f.q}</div>
                        <div className="text-xs text-gray-500">{f.a}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* FORM */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  {supportSent ? (
                    <div className="text-center py-12 animate-fade-in">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="CheckCircle" size={32} className="text-green-600" />
                      </div>
                      <h3 className="text-lg font-bold text-[#0f2340] mb-2">Заявка отправлена!</h3>
                      <p className="text-sm text-gray-500 mb-6">Наш специалист свяжется с вами в ближайшее время.</p>
                      <button
                        onClick={() => { setSupportSent(false); setSupportForm({ name: "", email: "", phone: "", message: "" }); }}
                        className="px-4 py-2 bg-[#1a9fd4] text-white rounded text-sm font-medium hover:bg-[#158ab8] transition-all"
                      >
                        Отправить ещё одну заявку
                      </button>
                    </div>
                  ) : (
                    <>
                      <h2 className="font-bold text-[#0f2340] mb-4">Отправить запрос</h2>
                      <form onSubmit={handleSupport} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Имя *</label>
                            <input
                              required
                              value={supportForm.name}
                              onChange={(e) => setSupportForm(f => ({ ...f, name: e.target.value }))}
                              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1a9fd4] transition-colors"
                              placeholder="Иван Иванов"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Телефон</label>
                            <input
                              value={supportForm.phone}
                              onChange={(e) => setSupportForm(f => ({ ...f, phone: e.target.value }))}
                              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1a9fd4] transition-colors"
                              placeholder="+7 (___) ___-__-__"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">E-mail *</label>
                          <input
                            required
                            type="email"
                            value={supportForm.email}
                            onChange={(e) => setSupportForm(f => ({ ...f, email: e.target.value }))}
                            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1a9fd4] transition-colors"
                            placeholder="your@email.ru"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Описание вопроса *</label>
                          <textarea
                            required
                            rows={5}
                            value={supportForm.message}
                            onChange={(e) => setSupportForm(f => ({ ...f, message: e.target.value }))}
                            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1a9fd4] transition-colors resize-none"
                            placeholder="Опишите вашу проблему или вопрос..."
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-6 py-2.5 bg-[#0f2340] hover:bg-[#1c3556] text-white rounded text-sm font-semibold transition-all"
                        >
                          Отправить заявку
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================== TAB: ABOUT =================== */}
        {tab === "about" && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#0f2340]">О компании</h1>
              <p className="text-sm text-gray-500 mt-1">Производство электронных компонентов с 2006 года.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {/* ABOUT CARD */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#0f2340] rounded flex items-center justify-center">
                      <Icon name="Factory" size={20} className="text-[#1a9fd4]" />
                    </div>
                    <div>
                      <h2 className="font-bold text-[#0f2340]">Арсенал</h2>
                      <div className="font-mono-tech text-xs text-gray-400">ООО «Арсенал»</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    Завод «Арсенал» основан в 1982 году и специализируется на производстве электронных компонентов
                    для промышленной, военной и гражданской электроники. За более чем 40 лет работы мы поставили продукцию
                    более чем 1 200 предприятиям России и СНГ.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Производство сертифицировано по ГОСТ Р ISO 9001:2015. Все изделия проходят 100% выходной контроль
                    с оформлением паспорта качества и протокола испытаний.
                  </p>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { value: "40+", label: "лет на рынке" },
                    { value: "1 200+", label: "предприятий-клиентов" },
                    { value: "850+", label: "наименований продукции" },
                    { value: "ISO 9001", label: "сертификат качества" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                      <div className="font-mono-tech text-xl font-bold text-[#1a9fd4]">{s.value}</div>
                      <div className="text-xs text-gray-500 mt-1 leading-tight">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* DIRECTIONS */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="font-bold text-[#0f2340] mb-4">Направления деятельности</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: "Zap", title: "Транзисторы", desc: "NPN/PNP, мощные и малосигнальные серии" },
                      { icon: "ArrowRight", title: "Диоды", desc: "Выпрямительные, стабилитроны, высокочастотные" },
                      { icon: "Plug", title: "НЧ соединители", desc: "Прямоугольные и круглые, IP40–IP68" },
                      { icon: "Cable", title: "ВЧ кабельные сборки", desc: "50/75 Ом, до 18 ГГц, разъёмы SMA, N, BNC" },
                    ].map((d) => (
                      <div key={d.title} className="flex gap-3 p-3 rounded-lg bg-[#f5f7fa] border border-gray-100">
                        <div className="w-8 h-8 bg-[#0f2340] rounded flex items-center justify-center flex-shrink-0">
                          <Icon name={d.icon} size={14} className="text-[#1a9fd4]" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#0f2340]">{d.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{d.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SIDEBAR */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h2 className="font-semibold text-[#0f2340] mb-3 text-sm uppercase tracking-wide">Реквизиты</h2>
                  <div className="space-y-2.5">
                    {[
                      { label: "Полное наименование", value: "ООО «Арсенал»" },
                      { label: "ИНН", value: "7701234567" },
                      { label: "КПП", value: "770101001" },
                      { label: "ОГРН", value: "1027700123456" },
                      { label: "Юр. адрес", value: "г. Москва, ул. Промышленная, д. 14, стр. 2" },
                    ].map((r) => (
                      <div key={r.label}>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wide">{r.label}</div>
                        <div className="font-mono-tech text-xs text-[#0f2340] mt-0.5">{r.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h2 className="font-semibold text-[#0f2340] mb-3 text-sm uppercase tracking-wide">Адрес производства</h2>
                  <div className="flex gap-2 mb-3">
                    <Icon name="MapPin" size={14} className="text-[#1a9fd4] flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-600">г. Москва, ул. Промышленная, д. 14</span>
                  </div>
                  <div className="bg-[#f5f7fa] rounded-lg h-32 flex items-center justify-center border border-gray-100">
                    <div className="text-center text-gray-400">
                      <Icon name="Map" size={24} className="mx-auto mb-1 text-gray-300" />
                      <div className="text-xs">Карта производства</div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0f2340] rounded-lg p-4 text-white">
                  <h2 className="font-semibold text-sm mb-2">Стать партнёром</h2>
                  <p className="text-xs text-[#a0c4dd] mb-3">Дилерские условия, отсрочка платежа, технический партнёр.</p>
                  <button
                    onClick={() => setTab("support")}
                    className="w-full py-2 bg-[#1a9fd4] hover:bg-[#158ab8] text-white rounded text-xs font-semibold transition-all"
                  >
                    Связаться с нами
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =================== CART DRAWER =================== */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="relative ml-auto w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#0f2340] text-white">
              <div className="flex items-center gap-2">
                <Icon name="ShoppingCart" size={18} />
                <span className="font-bold">Корзина</span>
                {totalQty > 0 && <span className="bg-[#1a9fd4] text-white text-xs px-2 py-0.5 rounded-full">{totalQty} поз.</span>}
              </div>
              <button onClick={() => setCartOpen(false)} className="text-[#a0c4dd] hover:text-white transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <Icon name="ShoppingCart" size={48} className="text-gray-200 mb-4" />
                <div className="font-semibold text-gray-400">Корзина пуста</div>
                <div className="text-sm text-gray-300 mt-1">Добавьте товары из каталога</div>
              </div>
            ) : orderDone ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-fade-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Icon name="CheckCircle" size={32} className="text-green-600" />
                </div>
                <h3 className="font-bold text-[#0f2340] text-lg mb-2">Заказ оформлен!</h3>
                <p className="text-sm text-gray-500">Менеджер свяжется с вами для подтверждения.</p>
              </div>
            ) : (
              <>
                {/* ITEMS */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-3 bg-[#f5f7fa] rounded-lg p-3 border border-gray-100">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[#0f2340] text-sm leading-tight">{item.product.name}</div>
                        <div className="font-mono-tech text-[10px] text-gray-400">{item.product.article}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.product.price.toLocaleString("ru-RU")} ₽ / {item.product.unit}
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button onClick={() => removeFromCart(item.product.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                          <Icon name="Trash2" size={14} />
                        </button>
                        <div className="flex items-center gap-2">
                          <button onClick={() => changeQty(item.product.id, -1)} className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#1a9fd4] hover:text-[#1a9fd4] transition-all">
                            <Icon name="Minus" size={10} />
                          </button>
                          <span className="font-mono-tech text-sm font-bold text-[#0f2340] w-6 text-center">{item.qty}</span>
                          <button onClick={() => changeQty(item.product.id, 1)} className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#1a9fd4] hover:text-[#1a9fd4] transition-all">
                            <Icon name="Plus" size={10} />
                          </button>
                        </div>
                        <div className="font-mono-tech text-xs font-bold text-[#0f2340]">
                          {(item.product.price * item.qty).toLocaleString("ru-RU")} ₽
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* TOTAL + ORDER FORM */}
                <div className="border-t border-gray-200 p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#0f2340]">Итого:</span>
                    <span className="font-mono-tech text-xl font-bold text-[#0f2340]">{totalPrice.toLocaleString("ru-RU")} ₽</span>
                  </div>

                  <form onSubmit={handleOrder} className="space-y-2.5">
                    <input
                      required
                      value={orderForm.name}
                      onChange={(e) => setOrderForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1a9fd4] transition-colors"
                      placeholder="Ваше имя *"
                    />
                    <input
                      value={orderForm.company}
                      onChange={(e) => setOrderForm(f => ({ ...f, company: e.target.value }))}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1a9fd4] transition-colors"
                      placeholder="Название компании"
                    />
                    <input
                      required
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1a9fd4] transition-colors"
                      placeholder="Телефон *"
                    />
                    <input
                      type="email"
                      value={orderForm.email}
                      onChange={(e) => setOrderForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1a9fd4] transition-colors"
                      placeholder="E-mail"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#1a9fd4] hover:bg-[#158ab8] text-white rounded font-bold text-sm transition-all"
                    >
                      Оформить заказ
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* PRODUCT MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedProduct(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full animate-fade-in p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-[#0f2340] text-lg">{selectedProduct.name}</h3>
                <div className="font-mono-tech text-xs text-gray-400">{selectedProduct.article}</div>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-gray-600 ml-4">
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="space-y-2 mb-6">
              {selectedProduct.specs.map((s) => (
                <div key={s.label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-500">{s.label}</span>
                  <span className="font-mono-tech text-sm font-semibold text-[#0f2340]">{s.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                className="flex-1 py-2.5 bg-[#1a9fd4] hover:bg-[#158ab8] text-white rounded font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Icon name="ShoppingCart" size={16} />
                В корзину
              </button>
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2.5 border border-gray-200 rounded text-sm font-medium text-gray-600 hover:border-gray-300 transition-all"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-[#0a1a2e] text-[#7da8c9] mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-mono-tech text-xs">© 2024 ООО «Арсенал». Все права защищены.</div>
          <div className="font-mono-tech text-xs">ГОСТ Р ISO 9001:2015 · ИНН 7701234567</div>
        </div>
      </footer>
    </div>
  );
}