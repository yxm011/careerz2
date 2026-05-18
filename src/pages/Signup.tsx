import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { UserPlus, Lock, Mail, User, Building2 } from "lucide-react";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { profile, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && profile) {
      if (profile.role === "company") navigate("/company");
      else if (profile.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    }
  }, [authLoading, profile, navigate]);

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: fullName });
      const write = setDoc(doc(db, "users", cred.user.uid), {
        displayName: fullName,
        email,
        role: "user",
        createdAt: new Date().toISOString(),
      });
      await Promise.race([write, new Promise((_, r) => setTimeout(() => r(), 8000))]).catch(() => {});
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Sign up failed.");
    }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const write = setDoc(
        doc(db, "users", cred.user.uid),
        {
          displayName: cred.user.displayName ?? "",
          email: cred.user.email ?? "",
          role: "user",
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );
      await Promise.race([write, new Promise((_, r) => setTimeout(() => r(), 8000))]).catch(() => {});
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Google sign up failed.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] w-full flex items-center justify-center bg-white z-1 px-4">
      <div className="w-full max-w-sm bg-gradient-to-b from-sky-50/50 to-white rounded-3xl shadow-xl shadow-black/5 p-8 flex flex-col items-center border border-blue-100 text-black">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white mb-6 shadow-lg shadow-black/5">
          <UserPlus className="w-7 h-7 text-black" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-center">
          {t("auth.signup")}
        </h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          {t("auth.signup.desc")}
        </p>
        <div className="w-full flex flex-col gap-3 mb-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <User className="w-4 h-4" />
            </span>
            <input
              placeholder={t("auth.fullname")}
              type="text"
              value={fullName}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
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
              onKeyDown={(e) => e.key === "Enter" && handleSignup()}
            />
          </div>
          {error && (
            <div className="text-sm text-red-500 text-left">{error}</div>
          )}
        </div>
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-2 rounded-xl shadow hover:brightness-105 cursor-pointer transition mb-4 mt-2 disabled:opacity-50 border-none text-sm"
        >
          {loading ? "..." : t("auth.create_account")}
        </button>
        <div className="flex items-center w-full my-2">
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
          <span className="mx-2 text-xs text-gray-400">{t("auth.or")}</span>
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
        </div>
        <div className="flex gap-3 w-full justify-center mt-2">
          <button
            onClick={handleGoogleSignup}
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
          {t("auth.has_account")}{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            {t("nav.login")}
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
