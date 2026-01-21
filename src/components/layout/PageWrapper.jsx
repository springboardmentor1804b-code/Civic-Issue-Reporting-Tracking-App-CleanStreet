import DecorativeBackground from "./DecorativeBackground";

const PageWrapper = ({ children, background = "default", className = "" }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/30 ${className}`}>
      <DecorativeBackground variant={background} />
      {children}
    </div>
  );
};

export default PageWrapper;
