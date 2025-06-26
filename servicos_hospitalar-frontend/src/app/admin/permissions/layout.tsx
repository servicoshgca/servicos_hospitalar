import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center space-x-6">
            <Link href="/admin/permissions" className="text-blue-600 font-medium">
              Permissões
            </Link>
            <Link href="/admin/configuracoes" className="text-gray-600 hover:text-gray-900">
              Configurações
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Voltar ao Início
            </Link>
          </nav>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
} 