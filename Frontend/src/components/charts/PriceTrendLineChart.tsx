import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TrendDataPoint {
  date: string;
  avgActualPrice: number;
  avgPredictedPrice: number;
}

interface PriceTrendLineChartProps {
  data: TrendDataPoint[];
}

const PriceTrendLineChart = ({ data }: PriceTrendLineChartProps) => {
  const formattedData = data.map((item) => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={300} className="sm:h-100!">
      <LineChart data={formattedData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="displayDate"
          tick={{ fill: '#6b7280', fontSize: 10 }}
          stroke="#9ca3af"
          angle={-45}
          textAnchor="end"
          height={60}
          className="sm:text-xs"
        />
        <YAxis
          tick={{ fill: '#6b7280', fontSize: 10 }}
          stroke="#9ca3af"
          label={{ 
            value: 'Price (₹)', 
            angle: -90, 
            position: 'insideLeft', 
            fill: '#6b7280',
            style: { fontSize: 10 }
          }}
          className="sm:text-xs"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value: any) => `₹${value}`}
        />
        <Legend
          wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
          iconType="line"
        />
        <Line
          type="monotone"
          dataKey="avgActualPrice"
          stroke="#2563eb"
          strokeWidth={2}
          name="Actual Price"
          dot={{ fill: '#2563eb', r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="avgPredictedPrice"
          stroke="#10b981"
          strokeWidth={2}
          name="AI Predicted Price"
          dot={{ fill: '#10b981', r: 3 }}
          activeDot={{ r: 5 }}
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceTrendLineChart;