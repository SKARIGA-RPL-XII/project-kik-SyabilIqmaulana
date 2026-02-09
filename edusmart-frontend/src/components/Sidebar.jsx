import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-blue-800 text-white fixed">
      <h2 className="text-2xl font-bold p-4">EduSmart</h2>

      <ul className="p-4 space-y-3">
        <li className="hover:bg-blue-600 p-2 rounded">
          <Link to="/">Dashboard</Link>
        </li>

        <li className="hover:bg-blue-600 p-2 rounded">
          <Link to="/students">Students</Link>
        </li>

        <li className="hover:bg-blue-600 p-2 rounded">Teachers</li>
        <li className="hover:bg-blue-600 p-2 rounded">Classes</li>
        <li className="hover:bg-blue-600 p-2 rounded">AI Chat</li>
      </ul>
    </div>
  );
}
