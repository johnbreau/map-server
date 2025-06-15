import { Paper, Title, Text, useMantineTheme, useMantineColorScheme, SegmentedControl, Group, Box } from '@mantine/core';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Helper function to generate mock data for a date range
const generateMockData = (startDate: Date, days: number) => {
  const data = [];
  const date = new Date(startDate);
  
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(date);
    currentDate.setDate(date.getDate() - i);
    
    // Base values with some randomness
    const baseCalories = 2000 + Math.floor(Math.random() * 800) - 400;
    const baseProtein = 100 + Math.floor(Math.random() * 60) - 30;
    const baseCarbs = 200 + Math.floor(Math.random() * 100) - 50;
    const baseFat = 70 + Math.floor(Math.random() * 40) - 20;
    
    data.push({
      date: currentDate.toISOString().split('T')[0],
      calories: Math.round(baseCalories),
      protein: Math.round(baseProtein),
      carbs: Math.round(baseCarbs),
      fat: Math.round(baseFat),
      fiber: Math.round(15 + Math.random() * 20),
      sugar: Math.round(30 + Math.random() * 40)
    });
  }
  
  return data.reverse(); // Return in chronological order
};

// Generate mock data for different time ranges
const today = new Date();
today.setHours(0, 0, 0, 0);

const mockData = {
  '1w': generateMockData(today, 7),
  '4w': generateMockData(today, 28),
  '6w': generateMockData(today, 42)
};

type TimeRange = keyof typeof mockData;

interface NutritionData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  fullDate?: string;
}

export const NutritionChart = () => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const [timeRange, setTimeRange] = useState<TimeRange>('1w');
  
  // Get data for the selected time range
  const nutritionData = mockData[timeRange];
  
  // Format data for the chart based on time range
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (timeRange === '1w') {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (timeRange === '4w') {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    } else {
      // For 6 weeks, show week numbers
      const oneJan = new Date(date.getFullYear(), 0, 1);
      const weekNumber = Math.ceil((((date.getTime() - oneJan.getTime()) / 86400000) + oneJan.getDay() + 1) / 7);
      return `W${weekNumber}`;
    }
  };
  
  const chartData: NutritionData[] = nutritionData.map(day => ({
    ...day,
    date: formatDate(day.date),
    fullDate: day.date
  }));

  // Calculate averages for the selected time range
  const calculateAverages = () => {
    const days = nutritionData.length;
    return {
      calories: Math.round(nutritionData.reduce((sum, day) => sum + day.calories, 0) / days),
      protein: Math.round(nutritionData.reduce((sum, day) => sum + day.protein, 0) / days),
      carbs: Math.round(nutritionData.reduce((sum, day) => sum + day.carbs, 0) / days),
      fat: Math.round(nutritionData.reduce((sum, day) => sum + day.fat, 0) / days),
      fiber: Math.round(nutritionData.reduce((sum, day) => sum + day.fiber, 0) / days),
      sugar: Math.round(nutritionData.reduce((sum, day) => sum + day.sugar, 0) / days),
    };
  };
  
  const averages = calculateAverages();
  
  // Group data by week for 4w and 6w views
  const groupDataByWeek = (data: NutritionData[]) => {
    if (timeRange === '1w') return data;
    
    const weeks: Record<string, NutritionData[]> = {};
    
    data.forEach(day => {
      const date = new Date(day.fullDate || day.date);
      const oneJan = new Date(date.getFullYear(), 0, 1);
      const weekNumber = Math.ceil((((date.getTime() - oneJan.getTime()) / 86400000) + oneJan.getDay() + 1) / 7);
      const weekKey = `Week ${weekNumber}`;
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = [];
      }
      weeks[weekKey].push(day);
    });
    
    return Object.entries(weeks).map(([week, days]) => ({
      date: week,
      calories: Math.round(days.reduce((sum, day) => sum + day.calories, 0) / days.length),
      protein: Math.round(days.reduce((sum, day) => sum + day.protein, 0) / days.length),
      carbs: Math.round(days.reduce((sum, day) => sum + day.carbs, 0) / days.length),
      fat: Math.round(days.reduce((sum, day) => sum + day.fat, 0) / days.length),
      fiber: Math.round(days.reduce((sum, day) => sum + day.fiber, 0) / days.length),
      sugar: Math.round(days.reduce((sum, day) => sum + day.sugar, 0) / days.length),
    }));
  };
  
  const displayData = timeRange === '1w' ? chartData : groupDataByWeek(chartData);

  // Colors for the chart
  const colors = {
    calories: '#FF6B6B',
    protein: '#4ECDC4',
    carbs: '#45B7D1',
    fat: '#FFD166',
    fiber: '#06D6A0',
    sugar: '#EF476F',
  };

  return (
    <Paper p="md" withBorder>
      <Group justify="space-between" mb="md" align="center">
        <div>
          <Title order={3}>Nutrition Overview</Title>
          <Text c="dimmed">
            {timeRange === '1w' 
              ? 'Daily nutritional intake' 
              : timeRange === '4w' 
                ? 'Weekly averages over 4 weeks' 
                : 'Weekly averages over 6 weeks'}
          </Text>
        </div>
        <SegmentedControl
          value={timeRange}
          onChange={(value) => setTimeRange(value as TimeRange)}
          data={[
            { value: '1w', label: '1 Week' },
            { value: '4w', label: '4 Weeks' },
            { value: '6w', label: '6 Weeks' },
          ]}
          size="sm"
        />
      </Group>
      
      <Box style={{ width: '100%', height: 400, minHeight: 0 }} mt="md">
        <ResponsiveContainer>
          <BarChart
            data={displayData}
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
              tick={{ fill: colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[7] }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                borderColor: colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
              }}
              itemStyle={{ color: colorScheme === 'dark' ? theme.white : theme.black }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="calories" name="Calories (kcal)" fill={colors.calories} />
            <Bar yAxisId="left" dataKey="protein" name="Protein (g)" fill={colors.protein} />
            <Bar yAxisId="left" dataKey="carbs" name="Carbs (g)" fill={colors.carbs} />
            <Bar yAxisId="left" dataKey="fat" name="Fat (g)" fill={colors.fat} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      
      <Title order={4} mt="xl" mb="md">
        {timeRange === '1w' ? 'Daily' : timeRange === '4w' ? '4-Week' : '6-Week'} Averages
      </Title>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <Paper p="md" withBorder>
          <Text size="sm" c="dimmed">Calories</Text>
          <Text fw={700} size="xl">{averages.calories} <Text span fw={400} size="sm" c="dimmed">kcal</Text></Text>
        </Paper>
        <Paper p="md" withBorder>
          <Text size="sm" c="dimmed">Protein</Text>
          <Text fw={700} size="xl">{averages.protein} <Text span fw={400} size="sm" c="dimmed">g</Text></Text>
        </Paper>
        <Paper p="md" withBorder>
          <Text size="sm" c="dimmed">Carbs</Text>
          <Text fw={700} size="xl">{averages.carbs} <Text span fw={400} size="sm" c="dimmed">g</Text></Text>
        </Paper>
        <Paper p="md" withBorder>
          <Text size="sm" c="dimmed">Fat</Text>
          <Text fw={700} size="xl">{averages.fat} <Text span fw={400} size="sm" c="dimmed">g</Text></Text>
        </Paper>
        <Paper p="md" withBorder>
          <Text size="sm" c="dimmed">Fiber</Text>
          <Text fw={700} size="xl">{averages.fiber} <Text span fw={400} size="sm" c="dimmed">g</Text></Text>
        </Paper>
        <Paper p="md" withBorder>
          <Text size="sm" c="dimmed">Sugar</Text>
          <Text fw={700} size="xl">{averages.sugar} <Text span fw={400} size="sm" c="dimmed">g</Text></Text>
        </Paper>
      </div>
    </Paper>
  );
};

export default NutritionChart;
