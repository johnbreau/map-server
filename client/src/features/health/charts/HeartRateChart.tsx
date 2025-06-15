import { useState } from 'react';
import { Paper, Title, Text, SegmentedControl, useMantineTheme, Group, Stack, useMantineColorScheme } from '@mantine/core';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data - replace with real data from your API
const heartRateData = {
  day: [
    { time: '12 AM', bpm: 58 },
    { time: '2 AM', bpm: 56 },
    { time: '4 AM', bpm: 54 },
    { time: '6 AM', bpm: 65 },
    { time: '8 AM', bpm: 72 },
    { time: '10 AM', bpm: 75 },
    { time: '12 PM', bpm: 78 },
    { time: '2 PM', bpm: 76 },
    { time: '4 PM', bpm: 82 },
    { time: '6 PM', bpm: 85 },
    { time: '8 PM', bpm: 72 },
    { time: '10 PM', bpm: 65 },
  ],
  week: [
    { day: 'Mon', bpm: 68, resting: 58 },
    { day: 'Tue', bpm: 72, resting: 57 },
    { day: 'Wed', bpm: 70, resting: 56 },
    { day: 'Thu', bpm: 75, resting: 59 },
    { day: 'Fri', bpm: 78, resting: 60 },
    { day: 'Sat', bpm: 80, resting: 61 },
    { day: 'Sun', bpm: 65, resting: 57 },
  ],
  month: [
    { week: 'Week 1', avg: 68, min: 56, max: 85 },
    { week: 'Week 2', avg: 70, min: 55, max: 88 },
    { week: 'Week 3', avg: 72, min: 57, max: 90 },
    { week: 'Week 4', avg: 69, min: 56, max: 87 },
  ]
};

type TimeRange = 'day' | 'week' | 'month';

export const HeartRateChart = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Helper function to get theme colors
  const getThemeColor = (light: string, dark: string) => {
    const [lightColor, lightShade] = light.split('.');
    const [darkColor, darkShade] = dark.split('.');
    return isDark 
      ? theme.colors[darkColor][parseInt(darkShade)]
      : theme.colors[lightColor][parseInt(lightShade)];
  };
  
  // Theme-aware colors
  const gridColor = getThemeColor('gray.2', 'dark.5');
  const tickColor = getThemeColor('gray.7', 'gray.4');
  const tooltipBg = isDark ? theme.colors.dark[7] : theme.white;
  const tooltipBorder = getThemeColor('gray.3', 'dark.5');
  const [timeRange, setTimeRange] = useState<TimeRange>('day');
  
  const getChartData = () => {
    return heartRateData[timeRange];
  };

  const getXAxisKey = () => {
    switch(timeRange) {
      case 'day': return 'time';
      case 'week': return 'day';
      case 'month': return 'week';
      default: return 'time';
    }
  };

  const getYAxisLabel = () => {
    return 'BPM';
  };

  const renderChart = () => {
    const data = getChartData();
    const xAxisKey = getXAxisKey();
    
    if (timeRange === 'month') {
      return (
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey={xAxisKey} 
            tick={{ fill: tickColor }}
          />
          <YAxis 
            tick={{ fill: tickColor }}
            label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: theme.radius.md,
            }}
          />
          <Area 
            type="monotone" 
            dataKey="avg" 
            name="Average BPM" 
            stroke={theme.colors.red[6]} 
            fill={theme.colors.red[6]}
            fillOpacity={0.2}
          />
          <Area 
            type="monotone" 
            dataKey="min" 
            name="Min BPM" 
            stroke={theme.colors.blue[6]} 
            fill="transparent"
            strokeDasharray="5 5"
          />
          <Area 
            type="monotone" 
            dataKey="max" 
            name="Max BPM" 
            stroke={theme.colors.green[6]} 
            fill="transparent"
            strokeDasharray="5 5"
          />
        </AreaChart>
      );
    }
    
    if (timeRange === 'week') {
      return (
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey={xAxisKey} 
            tick={{ fill: tickColor }}
          />
          <YAxis 
            tick={{ fill: tickColor }}
            label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: theme.radius.md,
            }}
          />
          <Area 
            type="monotone" 
            dataKey="bpm" 
            name="Average BPM" 
            stroke={theme.colors.red[6]} 
            fill={theme.colors.red[6]}
            fillOpacity={0.2}
          />
          <Area 
            type="monotone" 
            dataKey="resting" 
            name="Resting BPM" 
            stroke={theme.colors.blue[6]} 
            fill={theme.colors.blue[6]}
            fillOpacity={0.1}
          />
        </AreaChart>
      );
    }
    
    // Default to day view
    return (
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis 
          dataKey={xAxisKey} 
          tick={{ fill: tickColor }}
        />
        <YAxis 
          tick={{ fill: tickColor }}
          label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: tooltipBg,
            border: `1px solid ${tooltipBorder}`,
            borderRadius: theme.radius.md,
          }}
        />
        <Area 
          type="monotone" 
          dataKey="bpm" 
          name="Heart Rate (BPM)" 
          stroke={theme.colors.red[6]} 
          fill={theme.colors.red[6]}
          fillOpacity={0.2}
        />
      </AreaChart>
    );
  };

  return (
    <Paper p="md" withBorder>
      <Group justify="space-between" mb="md">
        <Stack gap={0}>
          <Title order={3}>Heart Rate</Title>
          <Text c="dimmed">Your heart rate data over time</Text>
        </Stack>
        
        <SegmentedControl
          value={timeRange}
          onChange={(value) => setTimeRange(value as TimeRange)}
          data={[
            { label: 'Day', value: 'day' },
            { label: 'Week', value: 'week' },
            { label: 'Month', value: 'month' },
          ]}
        />
      </Group>
      
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          {renderChart()}
        </ResponsiveContainer>
      </div>
      
      <div style={{ marginTop: theme.spacing.md }}>
        <Title order={4} mb="sm">Heart Rate Summary</Title>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: theme.spacing.md }}>
          <div>
            <Text size="sm" c="dimmed">Current Heart Rate</Text>
            <Text size="lg" fw={500}>72 <Text span size="sm" c="dimmed">BPM</Text></Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">Resting Heart Rate</Text>
            <Text size="lg" fw={500}>58 <Text span size="sm" c="dimmed">BPM</Text></Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">Average Daily Max</Text>
            <Text size="lg" fw={500}>88 <Text span size="sm" c="dimmed">BPM</Text></Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">Heart Rate Variability</Text>
            <Text size="lg" fw={500}>42 <Text span size="sm" c="dimrem">ms</Text></Text>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default HeartRateChart;
