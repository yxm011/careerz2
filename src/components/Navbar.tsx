import { Link, useNavigate, useLocation } from "react-router-dom";
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
  BookOpen,
  FileCheck,
  Users,
  Plus,
  Shield,
  AlertTriangle,
} from "lucide-react";

const localeLabels: Record<Locale, string> = { en: "EN", az: "AZ", ru: "RU" };

interface NavLink {
  to: string;
  label: string;
  icon?: React.ReactNode;
}

export default function Navbar() {
  const { profile, loading, logout } = useAuth();
  const { t, locale, setLocale } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  // Role-based navigation links
  const role = profile?.role;

  const guestLinks: NavLink[] = [
    { to: "/explore", label: t("nav.explore") },
    { to: "/jobs", label: t("nav.jobs") },
  ];

  const userLinks: NavLink[] = [
    { to: "/dashboard", label: t("nav.dashboard"), icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: "/explore", label: t("nav.explore") },
    { to: "/jobs", label: t("nav.jobs") },
  ];

  const companyLinks: NavLink[] = [
    { to: "/company", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: "/company/simulations/new", label: "Create Sim", icon: <Plus className="w-4 h-4" /> },
    { to: "/company/submissions", label: "Submissions", icon: <FileCheck className="w-4 h-4" /> },
    { to: "/company/talent-pool", label: "Talent Pool", icon: <Users className="w-4 h-4" /> },
  ];

  const adminLinks: NavLink[] = [
    { to: "/admin", label: "Dashboard", icon: <Shield className="w-4 h-4" /> },
    { to: "/admin/templates", label: "Templates", icon: <BookOpen className="w-4 h-4" /> },
    { to: "/admin/review", label: "Review", icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  const navLinks = !profile
    ? guestLinks
    : role === "company"
      ? companyLinks
      : role === "admin"
        ? adminLinks
        : userLinks;

  function isActive(path: string) {
    if (path === "/company" || path === "/admin" || path === "/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  }

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors ${
      isActive(path) ? "text-primary" : "text-gray-500 hover:text-gray-900"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Careerz.az
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`${linkClass(link.to)} flex items-center gap-1.5 px-3 py-2 rounded-lg ${
                isActive(link.to) ? "bg-blue-50/60" : "hover:bg-gray-50"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
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

          {/* Auth buttons */}
          {!loading && !profile && (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5"
              >
                {t("nav.login")}
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium text-white bg-gradient-to-b from-gray-700 to-gray-900 rounded-xl px-4 py-2 hover:brightness-110 transition"
              >
                {t("nav.signup")}
              </Link>
            </div>
          )}

          {!loading && profile && (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-gray-500 border-r border-gray-200 pr-3">
                {profile.displayName || profile.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer px-2 py-1.5"
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
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive(link.to) ? "text-primary bg-blue-50/60" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}

          <hr className="border-gray-100 my-2" />

          {!loading && !profile && (
            <div className="space-y-2 pt-1">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-base font-medium text-gray-600 px-3 py-2"
              >
                {t("nav.login")}
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="block text-center text-base font-medium text-white bg-gradient-to-b from-gray-700 to-gray-900 rounded-xl px-4 py-2.5"
              >
                {t("nav.signup")}
              </Link>
            </div>
          )}

          {!loading && profile && (
            <div className="pt-1">
              <p className="text-sm text-gray-400 px-3 mb-2">{profile.displayName || profile.email}</p>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-base font-medium text-red-500 bg-transparent border-none cursor-pointer rounded-lg hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                {t("nav.signout")}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
