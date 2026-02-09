function Topbar() {
  return (
    <div style={{
      background: "white",
      padding: "10px 20px",
      display: "flex",
      justifyContent: "space-between",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <h3>Dashboard</h3>
      <div>Syabil (Admin)</div>
    </div>
  );
}

export default Topbar;
