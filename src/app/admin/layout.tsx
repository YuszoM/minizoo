export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f4ef] text-ink antialiased">{children}</div>
  );
}
