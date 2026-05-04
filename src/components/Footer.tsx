import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-gray-100 bg-gray-50/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 no-underline mb-3">
              <Briefcase className="w-5 h-5 text-primary" />
              <span className="font-bold text-lg text-gray-900">Careerz.az</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              {t("footer.desc")}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-3">
              {t("footer.platform")}
            </h4>
            <ul className="space-y-2 text-sm text-gray-500 list-none">
              <li>
                <Link to="/explore" className="hover:text-gray-900 transition-colors no-underline text-gray-500">
                  {t("nav.explore")}
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-gray-900 transition-colors no-underline text-gray-500">
                  {t("nav.jobs")}
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-gray-900 transition-colors no-underline text-gray-500">
                  {t("nav.signup")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-3">
              {t("footer.for_companies")}
            </h4>
            <ul className="space-y-2 text-sm text-gray-500 list-none">
              <li>
                <Link to="/company/signup" className="hover:text-gray-900 transition-colors no-underline text-gray-500">
                  {t("nav.company")}
                </Link>
              </li>
              <li>
                <Link to="/company" className="hover:text-gray-900 transition-colors no-underline text-gray-500">
                  {t("nav.dashboard")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-3">
              {t("footer.support")}
            </h4>
            <ul className="space-y-2 text-sm text-gray-500 list-none">
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors no-underline text-gray-500">
                  {t("footer.help")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors no-underline text-gray-500">
                  {t("footer.contact")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors no-underline text-gray-500">
                  {t("footer.privacy")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Careerz.az. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
