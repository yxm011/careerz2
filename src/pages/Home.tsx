import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Briefcase,
  GraduationCap,
  Building2,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Users,
  BarChart3,
} from "lucide-react";

export default function Home() {
  const { t } = useLanguage();

  const features = [
    { icon: GraduationCap, titleKey: "feature.learn.title", descKey: "feature.learn.desc" },
    { icon: Building2, titleKey: "feature.connect.title", descKey: "feature.connect.desc" },
    { icon: Trophy, titleKey: "feature.cert.title", descKey: "feature.cert.desc" },
    { icon: BarChart3, titleKey: "feature.track.title", descKey: "feature.track.desc" },
  ];

  const stats = [
    { value: "500+", key: "stats.simulations" },
    { value: "120+", key: "stats.companies" },
    { value: "15K+", key: "stats.seekers" },
    { value: "92%", key: "stats.hirerate" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/60 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-500 mb-6">
            <Briefcase className="w-4 h-4" />
            {t("hero.badge")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-tight text-gray-900">
            {t("hero.title1")}
            <br />
            <span className="text-primary">{t("hero.title2")}</span>
          </h1>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-3 px-6 rounded-xl no-underline hover:brightness-110 transition text-sm"
            >
              {t("hero.cta")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/company/signup"
              className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl no-underline hover:bg-gray-50 transition text-sm"
            >
              <Building2 className="w-4 h-4" />
              {t("hero.company_cta")}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-gray-50/50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.key}>
                <p className="text-3xl md:text-4xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{t(stat.key)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t("how.title")}
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              {t("how.subtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.titleKey}
                className="border border-gray-100 rounded-2xl bg-white p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t(f.titleKey)}
                </h3>
                <p className="text-sm text-gray-500">{t(f.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Job Seekers */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                For Job Seekers
              </h2>
              <p className="text-gray-500 mb-6">
                Stop guessing what employers want. Complete real job simulations,
                build your portfolio, and get hired.
              </p>
              <ul className="space-y-3 list-none p-0">
                {[
                  "Browse simulations across industries",
                  "Complete interactive tasks at your own pace",
                  "Earn certificates employers trust",
                  "Get discovered by top companies",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 mt-8 bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-2.5 px-5 rounded-xl no-underline hover:brightness-110 transition text-sm"
              >
                Start Exploring
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-8 flex items-center justify-center aspect-square max-w-md mx-auto w-full">
              <Users className="w-32 h-32 text-primary/20" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">{t("cta.title")}</h2>
          <p className="mt-4 text-gray-300 max-w-lg mx-auto">
            {t("cta.subtitle")}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center bg-white text-gray-900 font-medium py-3 px-6 rounded-xl no-underline hover:bg-gray-100 transition text-sm"
            >
              {t("cta.button")}
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center justify-center border border-white/20 text-white font-medium py-3 px-6 rounded-xl no-underline hover:bg-white/10 transition text-sm"
            >
              {t("cta.browse")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
