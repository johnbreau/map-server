import { Title, Container, Tabs, rem } from '@mantine/core';
import { IconActivity, IconBed, IconWalk, IconHeart, IconMeat, IconBrain } from '@tabler/icons-react';
import { AppleHealthImport } from '../features/health/AppleHealthImport';
import { 
  ActivityChart, 
  SleepChart, 
  HeartRateChart, 
  NutritionChart, 
  StepsChart, 
  StateOfMindTracker 
} from '../features/health/charts';

export const HealthPage = () => {
  const iconStyle = { width: rem(16), height: rem(16) };

  return (
    <Container size="xl" p="md">
      <Title order={1} mb="lg">Health Dashboard</Title>
      
      <Tabs defaultValue="activity" mb="xl">
        <Tabs.List>
          <Tabs.Tab 
            value="activity" 
            leftSection={<IconActivity style={iconStyle} />}
          >
            Activity
          </Tabs.Tab>
          <Tabs.Tab 
            value="sleep" 
            leftSection={<IconBed style={iconStyle} />}
          >
            Sleep
          </Tabs.Tab>
          <Tabs.Tab 
            value="heart" 
            leftSection={<IconHeart style={iconStyle} />}
          >
            Heart Rate
          </Tabs.Tab>
          <Tabs.Tab 
            value="nutrition" 
            leftSection={<IconMeat style={iconStyle} />}
          >
            Nutrition
          </Tabs.Tab>
          <Tabs.Tab 
            value="steps" 
            leftSection={<IconWalk style={iconStyle} />}
          >
            Steps
          </Tabs.Tab>
          <Tabs.Tab 
            value="stateOfMind" 
            leftSection={<IconBrain style={iconStyle} />}
          >
            State of Mind
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="activity" pt="md">
          <ActivityChart />
        </Tabs.Panel>
        
        <Tabs.Panel value="sleep" pt="md">
          <SleepChart />
        </Tabs.Panel>
        
        <Tabs.Panel value="heart" pt="md">
          <HeartRateChart />
        </Tabs.Panel>
        
        <Tabs.Panel value="nutrition" pt="md">
          <NutritionChart />
        </Tabs.Panel>
        <Tabs.Panel value="steps" pt="md">
          <StepsChart />
        </Tabs.Panel>
        <Tabs.Panel value="stateOfMind" pt="md">
          <StateOfMindTracker />
        </Tabs.Panel>
      </Tabs>
      
      <AppleHealthImport />
    </Container>
  );
};

export default HealthPage;
