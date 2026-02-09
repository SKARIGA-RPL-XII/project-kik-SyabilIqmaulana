import CardStats from "../components/CardStats";

export default function Dashboard() {
  return (
    <div className="p-6 grid grid-cols-3 gap-6">
      <CardStats title="Total Students" value="320" />
      <CardStats title="Total Teachers" value="25" />
      <CardStats title="Classes" value="12" />
    </div>
  );
}
