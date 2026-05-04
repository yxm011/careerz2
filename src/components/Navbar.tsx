import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Locale } from "@/i18n/translations";
import {
  Menu,
  X,
  Briefcase,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Globe,
} from "lucide-react";

const localeLabels: Record<Locale, string> = { en: "EN", az: "AZ", ru: "RU" };

export default function Navbar() {
  const { profile, loading, logout } = useAuth();
  const { t, locale, setLocale } = useLanguage();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  function getDashboardPath() {
    if (!profile) return "/login";
    if (profile.role === "company") return "/company";
    if (profile.role === "admin") return "/admin";
    return "/dashboard";
  }

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <Briefcase className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Careerz.az
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/explore"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors no-underline"
          >
            {t("nav.explore")}
          </Link>
          <Link
            to="/jobs"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors no-underline"
          >
            {t("nav.jobs")}
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              {localeLabels[locale]}
              <ChevronDown className="w-3 h-3" />
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-24 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                {(["en", "az", "ru"] as Locale[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLocale(l);
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-sm bg-transparent border-none cursor-pointer hover:bg-gray-50 ${
                      locale === l ? "font-bold text-primary" : "text-gray-600"
                    }`}
                  >
                    {localeLabels[l]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth */}
          {!loading && !profile && (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 no-underline px-3 py-1.5"
              >
                {t("nav.login")}
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium text-white bg-gradient-to-b from-gray-700 to-gray-900 rounded-xl px-4 py-2 no-underline hover:brightness-110 transition"
              >
                {t("nav.signup")}
              </Link>
            </div>
          )}

          {!loading && profile && (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to={getDashboardPath()}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 no-underline"
              >
                <LayoutDashboard className="w-4 h-4" />
                {t("nav.dashboard")}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                {t("nav.signout")}
              </button>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            className="md:hidden bg-transparent border-none cursor-pointer text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link
            to="/explore"
            onClick={() => setMobileOpen(false)}
            className="block text-base font-medium text-gray-600 hover:text-gray-900 no-underline"
          >
            {t("nav.explore")}
          </Link>
          <Link
            to="/jobs"
            onClick={() => setMobileOpen(false)}
            className="block text-base font-medium text-gray-600 hover:text-gray-900 no-underline"
          >
            {t("nav.jobs")}
          </Link>
          {!loading && !profile && (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-base font-medium text-gray-600 no-underline"
              >
                {t("nav.login")}
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="block text-center text-base font-medium text-white bg-gradient-to-b from-gray-700 to-gray-900 rounded-xl px-4 py-2 no-underline"
              >
                {t("nav.signup")}
              </Link>
            </>
          )}
          {!loading && profile && (
            <>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileOpen(false)}
                className="block text-base font-medium text-gray-600 no-underline"
              >
                {t("nav.dashboard")}
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="block text-base font-medium text-red-500 bg-transparent border-none cursor-pointer"
              >
                {t("nav.signout")}
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
