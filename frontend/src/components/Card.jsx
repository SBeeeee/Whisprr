export default function Card({ children, className = "" }) {
    return (
      <div className={`bg-white/80 backdrop-blur-xl border border-gray-100/50 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)] transition-all duration-300 ${className}`}>
        {children}
      </div>
    );
  }