export default function Logo() {
  return (
    <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}}>
      <div style={{
        width:50,
        height:50,
        background:"linear-gradient(135deg,#2563eb,#9333ea)",
        borderRadius:"12px",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        color:"white",
        fontSize:"24px",
        fontWeight:"bold"
      }}>
        AI
      </div>
      <div>
        <h2 style={{margin:0}}>EduSmart</h2>
        <small style={{color:"gray"}}>Smart Learning System</small>
      </div>
    </div>
  );
}
