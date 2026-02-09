import { useEffect } from "react";

export default function Dashboard() {

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
    }
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Hello {user?.name}</p>
    </div>
  );
}
 