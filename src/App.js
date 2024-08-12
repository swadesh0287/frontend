
import './App.css';
import Dashboard from './components/Dashboard';
import { DashboardProvider } from './context/DashboardContext';


function App() {
  return (
    <DashboardProvider>
    <Dashboard />
  </DashboardProvider>
  );
}

export default App;
