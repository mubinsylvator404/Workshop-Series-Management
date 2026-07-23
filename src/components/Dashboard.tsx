import MyChamber from './MyChamber';

interface DashboardProps {
  studentProfile?: any;
  onXpBoost?: (xp: number, coins: number) => void;
  onNavigateToRegister?: () => void;
}

export default function Dashboard({ onNavigateToRegister }: DashboardProps) {
  return <MyChamber onNavigateToRegister={onNavigateToRegister} />;
}
