import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Хвост — журнал здоровья вашей собаки',
  description:
    'Прививки, обработки, напоминания и AI-помощник для владельцев собак. Держите здоровье питомца под контролем.',
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
