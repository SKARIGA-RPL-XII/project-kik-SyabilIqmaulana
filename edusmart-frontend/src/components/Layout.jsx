export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white p-5">
        <h2 className="text-2xl font-bold">EduSmart AI</h2>
        <ul className="mt-6 space-y-3">
          <li className="hover:bg-blue-700 p-2 rounded">Dashboard</li>
          <li className="hover:bg-blue-700 p-2 rounded">Students</li>
          <li className="hover:bg-blue-700 p-2 rounded">Teachers</li>
          <li className="hover:bg-blue-700 p-2 rounded">Logout</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
