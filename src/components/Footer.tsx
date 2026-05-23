export default function Footer() {
  return (
    <footer className="w-full py-12 bg-[#f9f9f9] border-t border-zinc-200 mt-auto">
      <div className="flex flex-col items-center justify-center gap-4 px-4 md:px-12 w-full max-w-[1200px] mx-auto text-center">
        <div className="text-xl font-bold text-black select-none">
          Matchi
        </div>
        <p className="text-sm text-zinc-500 max-w-xs">
          Your CV is processed securely and never stored.
        </p>
        <nav className="flex gap-6 mt-2">
          <a className="text-zinc-500 text-sm hover:text-black transition-colors" href="#">Security</a>
          <a className="text-zinc-500 text-sm hover:text-black transition-colors" href="#">Privacy Policy</a>
          <a className="text-zinc-500 text-sm hover:text-black transition-colors" href="#">Terms of Service</a>
        </nav>
        <div className="text-sm text-zinc-400 mt-2">
          © 2024 Matchi. Secure &amp; Private.
        </div>
      </div>
    </footer>
  );
}
