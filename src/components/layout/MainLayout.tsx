import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import AlarmPanel from '../AlarmPanel';
import { useUiStore } from '@/store';

export default function MainLayout() {
  const { showAlarmPanel } = useUiStore();

  return (
    <div className="h-full flex overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>

      {showAlarmPanel && <AlarmPanel />}
    </div>
  );
}
