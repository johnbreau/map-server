import { Paper, Title, Text, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data - replace with real data from your API
const activityData = [
  { date: '2025-01-01', steps: 8432, calories: 420, distance: 5.7 },
  { date: '2025-01-02', steps: 10234, calories: 510, distance: 6.9 },
  { date: '2025-01-03', steps: 7567, calories: 380, distance: 5.1 },
  { date: '2025-01-04', steps: 12045, calories: 590, distance: 8.1 },
  { date: '2025-01-05', steps: 9234, calories: 460, distance: 6.3 },
  { date: '2025-01-06', steps: 11023, calories: 540, distance: 7.4 },
  { date: '2025-01-07', steps: 7890, calories: 400, distance: 5.5 },
];

export const ActivityChart = () => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  
  // Format data for the chart
  const chartData = activityData.map(day => ({
    ...day,
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <Paper p="md" withBorder>
      <Title order={3} mb="md">Daily Activity</Title>
      <Text c="dimmed" mb="lg">Your activity over the past 7 days</Text>
      
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[7] }}
            />
            <YAxis 
              yAxisId="left" 
              tick={{ fill: colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[7] }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={[0, 15]}
              tick={{ fill: colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[7] }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                border: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`,
                borderRadius: theme.radius.md,
              }}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="steps" 
              name="Steps" 
              stroke={theme.colors.blue[6]} 
              activeDot={{ r: 8 }} 
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="calories" 
              name="Calories (active)" 
              stroke={theme.colors.red[6]} 
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="distance" 
              name="Distance (km)" 
              stroke={theme.colors.green[6]}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Paper>
  );
};

export default ActivityChart;
