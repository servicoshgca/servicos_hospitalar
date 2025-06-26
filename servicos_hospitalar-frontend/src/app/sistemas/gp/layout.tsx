import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sistema GP - Gestão de Pessoal',
  description: 'Sistema de Gestão de Pessoal do Hospital',
};

export default function SistemaGPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="sistema-gp-layout">
      {children}
    </div>
  );
} 