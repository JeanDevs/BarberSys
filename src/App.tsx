import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import AppLayout from './layout/AppLayout'
import DashboardPage from './features/dashboard/DashboardPage'
import AgendaPage from './features/agenda/AgendaPage'
import CustomersPage from './features/customers/CustomersPage'
import ConversationsPage from './features/conversations/ConversationsPage'
import CallsPage from './features/calls/CallsPage'
import InsightsPage from './features/insights/InsightsPage'
import SettingsPage from './features/settings/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="agenda" element={<AgendaPage />} />
        <Route path="clientes" element={<CustomersPage />} />
        <Route path="conversaciones" element={<ConversationsPage />} />
        <Route path="llamadas" element={<CallsPage />} />
        <Route path="insights" element={<InsightsPage />} />
        <Route path="configuracion" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}
