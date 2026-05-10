import { useState } from "react";
import Icon from "@/components/ui/icon";

export type UserRole = "admin" | "user";

export interface AuthUser {
  login: string;
  role: UserRole;
  name: string;
}

interface StoredUser {
  login: string;
  password: string;
  role: UserRole;
  name: string;
}

const DEFAULT_USERS: StoredUser[] = [
  { login: "admin", password: "admin", role: "admin", name: "Администратор" },
  { login: "nik", password: "000", role: "user", name: "Nik" },
];

function getUsers(): StoredUser[] {
  try {
    const saved = localStorage.getItem("arsenal_users");
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem("arsenal_users", JSON.stringify(users));
}

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

type PageTab = "login" | "register";

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [tab, setTab] = useState<PageTab>("login");

  // Login form
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form
  const [regName, setRegName] = useState("");
  const [regLogin, setRegLogin] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPassword2, setRegPassword2] = useState("");
  const [showRegPass, setShowRegPass] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    setTimeout(() => {
      const users = getUsers();
      const found = users.find((u) => u.login === login.trim() && u.password === password);
      if (found) {
        onLogin({ login: found.login, role: found.role, name: found.name });
      } else {
        setLoginError("Неверный логин или пароль");
      }
      setLoginLoading(false);
    }, 400);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (regName.trim().length < 2) {
      setRegError("Введите имя (минимум 2 символа)");
      return;
    }
    if (regLogin.trim().length < 3) {
      setRegError("Логин должен быть не короче 3 символов");
      return;
    }
    if (regPassword.length < 3) {
      setRegError("Пароль должен быть не короче 3 символов");
      return;
    }
    if (regPassword !== regPassword2) {
      setRegError("Пароли не совпадают");
      return;
    }

    setRegLoading(true);
    setTimeout(() => {
      const users = getUsers();
      if (users.find((u) => u.login === regLogin.trim())) {
        setRegError("Такой логин уже занят, выберите другой");
        setRegLoading(false);
        return;
      }
      const newUser: StoredUser = {
        login: regLogin.trim(),
        password: regPassword,
        role: "user",
        name: regName.trim(),
      };
      saveUsers([...users, newUser]);
      setRegSuccess(true);
      setRegLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0a1625] flex items-center justify-center font-['Golos_Text',sans-serif]">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#1a9fd4 1px, transparent 1px), linear-gradient(90deg, #1a9fd4 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#1a9fd4] rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-[#1a9fd4]/30">
            <Icon name="Shield" size={28} className="text-white" />
          </div>
          <div className="text-white font-bold text-2xl tracking-wide">Арсенал</div>
          <div className="text-[#4a7fa0] text-xs uppercase tracking-widest mt-0.5">
            Завод электронных компонентов
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#0f2340] border border-[#1c3a5e] rounded-2xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[#1c3a5e]">
            <button
              onClick={() => { setTab("login"); setLoginError(""); }}
              className={`flex-1 py-3.5 text-sm font-semibold transition-all ${
                tab === "login"
                  ? "text-white border-b-2 border-[#1a9fd4] bg-[#0f2340]"
                  : "text-[#4a7fa0] hover:text-[#7da8c9] bg-[#0a1a2e]"
              }`}
            >
              Войти
            </button>
            <button
              onClick={() => { setTab("register"); setRegError(""); setRegSuccess(false); }}
              className={`flex-1 py-3.5 text-sm font-semibold transition-all ${
                tab === "register"
                  ? "text-white border-b-2 border-[#1a9fd4] bg-[#0f2340]"
                  : "text-[#4a7fa0] hover:text-[#7da8c9] bg-[#0a1a2e]"
              }`}
            >
              Зарегистрироваться
            </button>
          </div>

          <div className="p-8">
            {/* LOGIN */}
            {tab === "login" && (
              <>
                <p className="text-[#4a7fa0] text-sm mb-6">Введите данные для доступа</p>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-[#7da8c9] text-xs uppercase tracking-wider mb-1.5">Логин</label>
                    <div className="relative">
                      <Icon name="User" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a7fa0]" />
                      <input
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        placeholder="Введите логин"
                        autoComplete="username"
                        required
                        className="w-full bg-[#0a1625] border border-[#1c3a5e] rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-[#2a4a6a] focus:outline-none focus:border-[#1a9fd4] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#7da8c9] text-xs uppercase tracking-wider mb-1.5">Пароль</label>
                    <div className="relative">
                      <Icon name="Lock" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a7fa0]" />
                      <input
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Введите пароль"
                        autoComplete="current-password"
                        required
                        className="w-full bg-[#0a1625] border border-[#1c3a5e] rounded-lg pl-9 pr-10 py-2.5 text-white text-sm placeholder-[#2a4a6a] focus:outline-none focus:border-[#1a9fd4] transition-colors"
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a7fa0] hover:text-[#7da8c9] transition-colors">
                        <Icon name={showPass ? "EyeOff" : "Eye"} size={16} />
                      </button>
                    </div>
                  </div>
                  {loginError && (
                    <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/50 rounded-lg px-3 py-2.5">
                      <Icon name="AlertCircle" size={15} className="text-red-400 shrink-0" />
                      <span className="text-red-300 text-sm">{loginError}</span>
                    </div>
                  )}
                  <button type="submit" disabled={loginLoading}
                    className="w-full bg-[#1a9fd4] hover:bg-[#158ab8] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-all mt-2">
                    {loginLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Icon name="Loader2" size={16} className="animate-spin" />
                        Проверка...
                      </span>
                    ) : "Войти"}
                  </button>
                </form>
                <p className="text-center text-[#4a7fa0] text-xs mt-5">
                  Нет аккаунта?{" "}
                  <button onClick={() => setTab("register")} className="text-[#1a9fd4] hover:underline">
                    Зарегистрируйтесь
                  </button>
                </p>
              </>
            )}

            {/* REGISTER */}
            {tab === "register" && !regSuccess && (
              <>
                <p className="text-[#4a7fa0] text-sm mb-6">Создайте новый аккаунт</p>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-[#7da8c9] text-xs uppercase tracking-wider mb-1.5">Ваше имя</label>
                    <div className="relative">
                      <Icon name="CircleUser" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a7fa0]" />
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Как вас зовут?"
                        required
                        className="w-full bg-[#0a1625] border border-[#1c3a5e] rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-[#2a4a6a] focus:outline-none focus:border-[#1a9fd4] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#7da8c9] text-xs uppercase tracking-wider mb-1.5">Логин</label>
                    <div className="relative">
                      <Icon name="AtSign" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a7fa0]" />
                      <input
                        type="text"
                        value={regLogin}
                        onChange={(e) => setRegLogin(e.target.value)}
                        placeholder="Придумайте логин"
                        autoComplete="off"
                        required
                        className="w-full bg-[#0a1625] border border-[#1c3a5e] rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-[#2a4a6a] focus:outline-none focus:border-[#1a9fd4] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#7da8c9] text-xs uppercase tracking-wider mb-1.5">Пароль</label>
                    <div className="relative">
                      <Icon name="Lock" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a7fa0]" />
                      <input
                        type={showRegPass ? "text" : "password"}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Придумайте пароль"
                        autoComplete="new-password"
                        required
                        className="w-full bg-[#0a1625] border border-[#1c3a5e] rounded-lg pl-9 pr-10 py-2.5 text-white text-sm placeholder-[#2a4a6a] focus:outline-none focus:border-[#1a9fd4] transition-colors"
                      />
                      <button type="button" onClick={() => setShowRegPass(!showRegPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a7fa0] hover:text-[#7da8c9] transition-colors">
                        <Icon name={showRegPass ? "EyeOff" : "Eye"} size={16} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#7da8c9] text-xs uppercase tracking-wider mb-1.5">Повторите пароль</label>
                    <div className="relative">
                      <Icon name="LockKeyhole" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a7fa0]" />
                      <input
                        type={showRegPass ? "text" : "password"}
                        value={regPassword2}
                        onChange={(e) => setRegPassword2(e.target.value)}
                        placeholder="Повторите пароль"
                        autoComplete="new-password"
                        required
                        className="w-full bg-[#0a1625] border border-[#1c3a5e] rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-[#2a4a6a] focus:outline-none focus:border-[#1a9fd4] transition-colors"
                      />
                    </div>
                  </div>
                  {regError && (
                    <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/50 rounded-lg px-3 py-2.5">
                      <Icon name="AlertCircle" size={15} className="text-red-400 shrink-0" />
                      <span className="text-red-300 text-sm">{regError}</span>
                    </div>
                  )}
                  <button type="submit" disabled={regLoading}
                    className="w-full bg-[#1a9fd4] hover:bg-[#158ab8] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-all mt-2">
                    {regLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Icon name="Loader2" size={16} className="animate-spin" />
                        Создаём аккаунт...
                      </span>
                    ) : "Создать аккаунт"}
                  </button>
                </form>
                <p className="text-center text-[#4a7fa0] text-xs mt-5">
                  Уже есть аккаунт?{" "}
                  <button onClick={() => setTab("login")} className="text-[#1a9fd4] hover:underline">
                    Войти
                  </button>
                </p>
              </>
            )}

            {/* SUCCESS */}
            {tab === "register" && regSuccess && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="CheckCircle2" size={36} className="text-green-400" />
                </div>
                <h2 className="text-white font-bold text-lg mb-2">Аккаунт создан!</h2>
                <p className="text-[#4a7fa0] text-sm mb-6">
                  Добро пожаловать, <span className="text-white font-medium">{regName}</span>!<br />
                  Теперь вы можете войти в систему.
                </p>
                <button
                  onClick={() => {
                    setTab("login");
                    setLogin(regLogin);
                    setRegSuccess(false);
                  }}
                  className="w-full bg-[#1a9fd4] hover:bg-[#158ab8] text-white font-semibold py-2.5 rounded-lg transition-all"
                >
                  Перейти к входу
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-[#2a4a6a] text-xs mt-6">
          © 2024 ООО «Арсенал» · Защищённый доступ
        </p>
      </div>
    </div>
  );
}
