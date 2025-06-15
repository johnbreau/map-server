import { Paper, Title, Text, useMantineTheme, useMantineColorScheme, SegmentedControl, Group, Box } from '@mantine/core';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Helper function to generate mock steps data for a date range
const generateMockStepsData = (startDate: Date, days: number) => {
  const data = [];
  const date = new Date(startDate);
  
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(date);
    currentDate.setDate(date.getDate() - i);
    
    // Base steps with some randomness (between 5000-15000 steps)
    const steps = 5000 + Math.floor(Math.random() * 10000);
    const distance = (steps * 0.0008).toFixed(2); // Approx. 0.8m per step in km
    const calories = Math.round(steps * 0.04); // Rough estimate of calories burned
    
    data.push({
      date: currentDate.toISOString().split('T')[0],
      steps,
      distance: parseFloat(distance),
      calories
    });
  }
  
  return data.reverse(); // Return in chronological order
};

// Generate mock data for different time ranges
const today = new Date();
today.setHours(0, 0, 0, 0);

const mockData = {
  '1w': generateMockStepsData(today, 7),
  '2w': generateMockStepsData(today, 14),
  '1m': generateMockStepsData(today, 30)
};

type TimeRange = keyof typeof mockData;

interface StepsData {
  date: string;
  steps: number;
  distance: number;
  calories: number;
  fullDate?: string;
}

export const StepsChart = () => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const [timeRange, setTimeRange] = useState<TimeRange>('1w');
  
  // Get data for the selected time range
  const stepsData = mockData[timeRange];
  
  // Format data for the chart based on time range
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (timeRange === '1w') {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (timeRange === '2w') {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    } else {
      // For 1 month, show week numbers
      const oneJan = new Date(date.getFullYear(), 0, 1);
      const weekNumber = Math.ceil((((date.getTime() - oneJan.getTime()) / 86400000) + oneJan.getDay() + 1) / 7);
      return `Week ${weekNumber}`;
    }
  };
  
  const chartData: StepsData[] = stepsData.map(day => ({
    ...day,
    date: formatDate(day.date),
    fullDate: day.date
  }));

  // Calculate averages for the selected time range
  const calculateAverages = () => {
    const days = stepsData.length;
    const totalSteps = stepsData.reduce((sum, day) => sum + day.steps, 0);
    const totalDistance = stepsData.reduce((sum, day) => sum + day.distance, 0);
    const totalCalories = stepsData.reduce((sum, day) => sum + day.calories, 0);
    
    return {
      steps: Math.round(totalSteps / days),
      distance: parseFloat((totalDistance / days).toFixed(2)),
      calories: Math.round(totalCalories / days)
    };
  };
  
  const averages = calculateAverages();

  // Colors for the chart
  const colors = {
    steps: '#4ECDC4',
    distance: '#FF6B6B',
    calories: '#FFD166'
  };

  return (
    <Paper p="md" withBorder>
      <Group justify="space-between" mb="md" align="center">
        <div>
          <Title order={3}>Steps & Activity</Title>
          <Text c="dimmed">
            {timeRange === '1w' 
              ? 'Daily steps and activity' 
              : timeRange === '2w' 
                ? 'Bi-weekly steps and activity' 
                : 'Monthly steps and activity'}
          </Text>
        </div>
        <SegmentedControl
          value={timeRange}
          onChange={(value) => setTimeRange(value as TimeRange)}
          data={[
            { value: '1w', label: '1 Week' },
            { value: '2w', label: '2 Weeks' },
            { value: '1m', label: '1 Month' },
          ]}
          size="sm"
        />
      </Group>
      
      <Box style={{ width: '100%', height: 400, minHeight: 0 }} mt="md">
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
              interval={timeRange === '1w' ? 0 : 'preserveStartEnd'}
              minTickGap={timeRange === '1w' ? 0 : 10}
            />
            <YAxis 
              yAxisId="left"
              orientation="left"
              tick={{ fill: colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[7] }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fill: colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[7] }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                borderColor: colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
              }}
              itemStyle={{ color: colorScheme === 'dark' ? theme.white : theme.black }}
              formatter={(value, name) => {
                if (name === 'steps') return [value, 'Steps'];
                if (name === 'distance') return [value, 'Distance (km)'];
                return [value, name];
              }}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="steps" 
              name="Steps" 
              stroke={colors.steps} 
              activeDot={{ r: 6 }} 
              strokeWidth={2}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="distance" 
              name="Distance (km)" 
              stroke={colors.distance} 
              strokeDasharray="5 5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      
      <Title order={4} mt="xl" mb="md">
        {timeRange === '1w' ? 'Daily' : timeRange === '2w' ? 'Bi-weekly' : 'Monthly'} Averages
      </Title>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <Paper p="md" withBorder>
          <Text size="sm" c="dimmed">Steps</Text>
          <Text fw={700} size="xl">
            {averages.steps.toLocaleString()}
          </Text>
        </Paper>
        <Paper p="md" withBorder>
          <Text size="sm" c="dimmed">Distance</Text>
          <Text fw={700} size="xl">
            {averages.distance} <Text span fw={400} size="sm" c="dimmed">km</Text>
          </Text>
        </Paper>
        <Paper p="md" withBorder>
          <Text size="sm" c="dimmed">Calories</Text>
          <Text fw={700} size="xl">
            {averages.calories} <Text span fw={400} size="sm" c="dimmed">kcal</Text>
          </Text>
        </Paper>
      </div>
    </Paper>
  );
};

export default StepsChart;
