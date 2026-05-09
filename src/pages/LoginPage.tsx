import { useState } from "react";
import Icon from "@/components/ui/icon";

export type UserRole = "admin" | "user";

export interface AuthUser {
  login: string;
  role: UserRole;
  name: string;
}

const USERS: { login: string; password: string; role: UserRole; name: string }[] = [
  { login: "admin", password: "admin", role: "admin", name: "Администратор" },
  { login: "nik", password: "000", role: "user", name: "Nik" },
];

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      const found = USERS.find(
        (u) => u.login === login.trim() && u.password === password
      );
      if (found) {
        onLogin({ login: found.login, role: found.role, name: found.name });
      } else {
        setError("Неверный логин или пароль");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0a1625] flex items-center justify-center font-['Golos_Text',sans-serif]">
      {/* Background grid */}
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
        <div className="bg-[#0f2340] border border-[#1c3a5e] rounded-2xl p-8 shadow-2xl">
          <h1 className="text-white text-lg font-semibold mb-1">Вход в систему</h1>
          <p className="text-[#4a7fa0] text-sm mb-6">Введите данные для доступа</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#7da8c9] text-xs uppercase tracking-wider mb-1.5">
                Логин
              </label>
              <div className="relative">
                <Icon
                  name="User"
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a7fa0]"
                />
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
              <label className="block text-[#7da8c9] text-xs uppercase tracking-wider mb-1.5">
                Пароль
              </label>
              <div className="relative">
                <Icon
                  name="Lock"
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a7fa0]"
                />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  autoComplete="current-password"
                  required
                  className="w-full bg-[#0a1625] border border-[#1c3a5e] rounded-lg pl-9 pr-10 py-2.5 text-white text-sm placeholder-[#2a4a6a] focus:outline-none focus:border-[#1a9fd4] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a7fa0] hover:text-[#7da8c9] transition-colors"
                >
                  <Icon name={showPass ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/50 rounded-lg px-3 py-2.5">
                <Icon name="AlertCircle" size={15} className="text-red-400 shrink-0" />
                <span className="text-red-300 text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a9fd4] hover:bg-[#158ab8] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-all mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Проверка...
                </span>
              ) : (
                "Войти"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[#2a4a6a] text-xs mt-6">
          © 2024 ООО «Арсенал» · Защищённый доступ
        </p>
      </div>
    </div>
  );
}
