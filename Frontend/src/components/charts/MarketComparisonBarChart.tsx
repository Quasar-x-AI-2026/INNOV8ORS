import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface MarketDataPoint {
  marketName: string;
  avgActualPrice: number;
  avgPredictedPrice: number;
  deviation: number;
}

interface MarketComparisonBarChartProps {
  data: MarketDataPoint[];
}

const MarketComparisonBarChart = ({ data }: MarketComparisonBarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300} className="sm:h-100!">
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="marketName"
          tick={{ fill: '#6b7280', fontSize: 10 }}
          stroke="#9ca3af"
          angle={-45}
          textAnchor="end"
          height={80}
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
          iconType="rect"
        />
        <Bar
          dataKey="avgActualPrice"
          fill="#2563eb"
          name="Actual Price"
          radius={[6, 6, 0, 0]}
        />
        <Bar
          dataKey="avgPredictedPrice"
          fill="#10b981"
          name="AI Predicted Price"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MarketComparisonBarChart;