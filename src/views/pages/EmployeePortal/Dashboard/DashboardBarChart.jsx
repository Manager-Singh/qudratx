import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

// Below your component or inside same file
const DashboardBarChart = ({ data }) => {
  const chartData = [
    { name: 'Proposals', value: data.totalProposals || 0 },
    { name: 'Leads', value: data.totalLeads || 0 },
    { name: 'Clients', value: data.totalClients || 0 },
  ];

  return (
    <div className="mt-5">
      <h5 className="mb-3 fw-semibold">Overview Chart</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#5b5bd6" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardBarChart
