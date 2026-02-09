export default function CardStats({ title, value }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
