import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar />
      <Navbar />
      <div className="ml-64 mt-4">
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
