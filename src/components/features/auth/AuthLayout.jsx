import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import logo from "../../../assets/logo-leaf.png";

const AuthLayout = ({
  children,
  backgroundImage,
  title,
  subtitle,
  badge,
  stats = [],
  benefits = [],
  leftContent,
}) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-green-800/85 to-teal-900/90" />
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen items-stretch">
        {/* LEFT SIDE (Hidden on mobile) */}
        <div className="hidden lg:flex flex-1 animate-fade-in-left">
          <div className="flex flex-col px-8 lg:px-12 xl:px-16 py-8 text-white w-full justify-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group mb-12">
              <div className="relative">
                <img src={logo} alt="CleanStreet logo" className="h-14 w-14 rounded-full object-contain p-1 transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="leading-tight">
                <p className="text-3xl font-bold tracking-tight">CleanStreet</p>
                <p className="text-xs uppercase tracking-widest text-emerald-300">Smart Civic Engagement</p>
              </div>
            </Link>

            {/* Headline */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full mb-6 border border-white/20">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-medium">{badge}</span>
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6">
                {title}
              </h1>

              <p className="text-lg text-emerald-100/90 max-w-md leading-relaxed mb-10">
                {subtitle}
              </p>

              {/* Benefits */}
              {benefits.length > 0 && (
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 text-emerald-100">
                      <div className="w-8 h-8 bg-emerald-500/30 rounded-full flex items-center justify-center">
                        <benefit.icon className="w-4 h-4 text-emerald-300" />
                      </div>
                      <span>{benefit.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Stats */}
              {stats.length > 0 && (
                <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg">
                  {stats.map((stat) => (
                    <div key={stat.label} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center">
                      <stat.icon className="w-6 h-6 text-emerald-300 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-emerald-200">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {leftContent}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (FORM) */}
        <div className="flex w-full lg:w-[480px] xl:w-[540px] flex-col items-center justify-center px-4 py-8 animate-fade-in-right">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
              <img src={logo} alt="logo" className="w-10 h-10" />
              <span className="text-2xl font-bold text-white">CleanStreet</span>
            </div>

            {children}
          </div>
        </div>

        {/* FOOTER */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center z-20 w-full px-4">
          <p className="text-xs text-emerald-300/70">
            © 2025 CleanStreet. Making communities cleaner, one report at a time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
