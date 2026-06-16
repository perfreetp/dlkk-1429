import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from '@/pages/dashboard/Dashboard';
import DeviceList from '@/pages/resources/DeviceList';
import CascadeRelation from '@/pages/cascade/CascadeRelation';
import VideoWall from '@/pages/cascade/VideoWall';
import AlarmCenter from '@/pages/events/AlarmCenter';
import Playback from '@/pages/events/Playback';
import Conference from '@/pages/events/Conference';
import ReportOverview from '@/pages/reports/ReportOverview';
import DeviceReport from '@/pages/reports/DeviceReport';
import AlarmReport from '@/pages/reports/AlarmReport';
import UserManagement from '@/pages/permissions/UserManagement';
import RoleManagement from '@/pages/permissions/RoleManagement';
import DutyHandover from '@/pages/permissions/DutyHandover';
import OperationAudit from '@/pages/permissions/OperationAudit';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          <Route path="resources">
            <Route index element={<Navigate to="devices" replace />} />
            <Route path="devices" element={<DeviceList />} />
          </Route>
          
          <Route path="cascade">
            <Route index element={<Navigate to="relation" replace />} />
            <Route path="relation" element={<CascadeRelation />} />
            <Route path="wall" element={<VideoWall />} />
          </Route>
          
          <Route path="events">
            <Route index element={<Navigate to="alarms" replace />} />
            <Route path="alarms" element={<AlarmCenter />} />
            <Route path="playback" element={<Playback />} />
            <Route path="conference" element={<Conference />} />
          </Route>
          
          <Route path="reports">
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<ReportOverview />} />
            <Route path="device" element={<DeviceReport />} />
            <Route path="alarm" element={<AlarmReport />} />
          </Route>
          
          <Route path="permissions">
            <Route index element={<Navigate to="users" replace />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="roles" element={<RoleManagement />} />
            <Route path="handover" element={<DutyHandover />} />
            <Route path="audit" element={<OperationAudit />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
