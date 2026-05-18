import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, Lock, Mail, Building2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { profile, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && profile) {
      navigateByRole(profile.role);
    }
  }, [authLoading, profile]);

  function navigateByRole(role: string) {
    if (role === "company") navigate("/company");
    else if (role === "admin") navigate("/admin");
    else navigate("/dashboard");
  }

  async function getRoleAndNavigate(uid: string) {
    try {
      const snap = await Promise.race([
        getDoc(doc(db, "users", uid)),
        new Promise<never>((_, r) => setTimeout(() => r(), 5000)),
      ]);
      navigateByRole(snap.exists() ? snap.data().role ?? "user" : "user");
    } catch {
      navigate("/dashboard");
    }
  }

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await getRoleAndNavigate(cred.user.uid);
    } catch (err: any) {
      setError(err.message ?? "Sign in failed.");
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await getRoleAndNavigate(cred.user.uid);
    } catch (err: any) {
      setError(err.message ?? "Google sign in failed.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] w-full flex items-center justify-center bg-white z-1 px-4">
      <div className="w-full max-w-sm bg-gradient-to-b from-sky-50/50 to-white rounded-3xl shadow-xl shadow-black/5 p-8 flex flex-col items-center border border-blue-100 text-black">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white mb-6 shadow-lg shadow-black/5">
          <LogIn className="w-7 h-7 text-black" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-center">
          {t("auth.signin")}
        </h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          {t("auth.signin.desc")}
        </p>
        <div className="w-full flex flex-col gap-3 mb-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              placeholder={t("auth.email")}
              type="email"
              value={email}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              placeholder={t("auth.password")}
              type="password"
              value={password}
              className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
            />
          </div>
          <div className="w-full flex justify-between items-center">
            {error && (
              <div className="text-sm text-red-500 text-left">{error}</div>
            )}
            <button className="text-xs hover:underline font-medium ml-auto bg-transparent border-none cursor-pointer text-gray-600">
              {t("auth.forgot")}
            </button>
          </div>
        </div>
        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-2 rounded-xl shadow hover:brightness-105 cursor-pointer transition mb-4 mt-2 disabled:opacity-50 border-none text-sm"
        >
          {loading ? "..." : t("auth.get_started")}
        </button>
        <div className="flex items-center w-full my-2">
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
          <span className="mx-2 text-xs text-gray-400">{t("auth.or")}</span>
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
        </div>
        <div className="flex gap-3 w-full justify-center mt-2">
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center w-12 h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 transition grow cursor-pointer"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-6 h-6"
            />
          </button>
          <button className="flex items-center justify-center w-12 h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 transition grow cursor-pointer">
            <img
              src="https://www.svgrepo.com/show/448224/facebook.svg"
              alt="Facebook"
              className="w-6 h-6"
            />
          </button>
          <button className="flex items-center justify-center w-12 h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 transition grow cursor-pointer">
            <img
              src="https://www.svgrepo.com/show/511330/apple-173.svg"
              alt="Apple"
              className="w-6 h-6"
            />
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          {t("auth.no_account")}{" "}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            {t("nav.signup")}
          </Link>
        </p>
        <div className="w-full mt-4 pt-4 border-t border-gray-100">
          <Link
            to="/company/signup"
            className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-700 font-medium py-2 rounded-xl hover:bg-gray-50 transition text-sm"
          >
            <Building2 className="w-4 h-4" />
            Sign up as Enterprise
          </Link>
        </div>
      </div>
    </div>
  );
}
