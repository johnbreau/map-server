import { Paper, Title, Text, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';

// Mock data - replace with real data from your API
const sleepData = [
  { 
    date: '2025-01-01', 
    inBed: 7.5, 
    asleep: 6.8, 
    deep: 1.8,
    rem: 1.5,
    light: 3.5,
    awake: 0.7
  },
  { 
    date: '2025-01-02', 
    inBed: 8.2, 
    asleep: 7.5, 
    deep: 2.1,
    rem: 1.7,
    light: 3.7,
    awake: 0.7
  },
  { 
    date: '2025-01-03', 
    inBed: 7.8, 
    asleep: 7.1, 
    deep: 1.9,
    rem: 1.6,
    light: 3.6,
    awake: 0.7
  },
  { 
    date: '2025-01-04', 
    inBed: 9.0, 
    asleep: 8.2, 
    deep: 2.3,
    rem: 1.8,
    light: 4.1,
    awake: 0.8
  },
  { 
    date: '2025-01-05', 
    inBed: 8.5, 
    asleep: 7.7, 
    deep: 2.0,
    rem: 1.7,
    light: 4.0,
    awake: 0.8
  },
  { 
    date: '2025-01-06', 
    inBed: 9.2, 
    asleep: 8.4, 
    deep: 2.4,
    rem: 1.9,
    light: 4.1,
    awake: 0.8
  },
  { 
    date: '2025-01-07', 
    inBed: 7.0, 
    asleep: 6.2, 
    deep: 1.5,
    rem: 1.2,
    light: 3.5,
    awake: 0.8
  },
];

export const SleepChart = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  
  // Format data for the chart
  const chartData = sleepData.map(day => ({
    ...day,
    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    // Calculate sleep efficiency
    efficiency: Math.round((day.asleep / day.inBed) * 100)
  }));

  return (
    <Paper p="md" withBorder>
      <Title order={3} mb="md">Sleep Analysis</Title>
      <Text c="dimmed" mb="lg">Your sleep patterns over the past 7 nights</Text>
      
      <div style={{ width: '100%', height: 400, minHeight: 0 }}>
        <ResponsiveContainer>
          <BarChart
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
              label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={[0, 100]}
              tick={{ fill: colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[7] }}
              label={{ value: 'Efficiency %', angle: 90, position: 'insideRight' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                border: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`,
                borderRadius: theme.radius.md,
              }}
              formatter={(value: string | number, name: string) => {
                if (name === 'efficiency') {
                  return [`${value}%`, 'Efficiency'];
                }
                return [value, name];
              }}
            />
            <Legend />
            <Bar 
              yAxisId="left"
              dataKey="deep" 
              name="Deep Sleep (hrs)" 
              stackId="a" 
              fill={theme.colors.blue[6]}
            />
            <Bar 
              yAxisId="left"
              dataKey="rem" 
              name="REM Sleep (hrs)" 
              stackId="a" 
              fill={theme.colors.violet[6]}
            />
            <Bar 
              yAxisId="left"
              dataKey="light" 
              name="Light Sleep (hrs)" 
              stackId="a" 
              fill={theme.colors.cyan[6]}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="efficiency" 
              name="Sleep Efficiency" 
              stroke={theme.colors.green[6]}
              strokeWidth={2}
              dot={true}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div style={{ marginTop: theme.spacing.md }}>
        <Title order={4} mb="sm">Sleep Summary</Title>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: theme.spacing.md }}>
          <div>
            <Text size="sm" c="dimmed">Average Time in Bed</Text>
            <Text size="lg" fw={500}>7.9 hrs</Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">Average Time Asleep</Text>
            <Text size="lg" fw={500}>7.3 hrs</Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">Average Sleep Efficiency</Text>
            <Text size="lg" fw={500}>92%</Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">Average Deep Sleep</Text>
            <Text size="lg" fw={500}>2.0 hrs</Text>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default SleepChart;
