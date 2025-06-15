import { useState } from 'react';
import { 
  Paper, 
  Title, 
  Text, 
  Button, 
  Group, 
  Textarea, 
  Stack, 
  Box,
  ActionIcon,
  SegmentedControl,
  Divider,
  Badge,
  Modal,
  Tabs,
  ThemeIcon,
  SimpleGrid,
  Card,
  Center,
  rem
} from '@mantine/core';
import { 
  IconMoodHappy, 
  IconMoodSmile, 
  IconMoodNeutral, 
  IconMoodSad, 
  IconMoodCry, 
  IconTrash, 
  IconEdit,
  IconPlus,
  IconMoodEmpty,
  IconMoodConfuzed,
  IconBolt,
  IconBoltOff,
  IconBoltFilled,
  IconChartLine,
  IconCalendar,
  IconList
} from '@tabler/icons-react';

interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  note: string;
}

const moodIcons = [
  { icon: <IconMoodCry size={24} />, color: 'red', label: 'Terrible' },
  { icon: <IconMoodSad size={24} />, color: 'orange', label: 'Bad' },
  { icon: <IconMoodNeutral size={24} />, color: 'yellow', label: 'Neutral' },
  { icon: <IconMoodSmile size={24} />, color: 'lime', label: 'Good' },
  { icon: <IconMoodHappy size={24} />, color: 'green', label: 'Great' },
];

export const MoodTracker = () => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const [mood, setMood] = useState<number>(3);
  const [note, setNote] = useState<string>('');
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  const handleAddEntry = () => {
    if (mood === 0) return;
    
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      mood,
      note,
    };
    
    setEntries([newEntry, ...entries]);
    setMood(3);
    setNote('');
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const getMoodLabel = (mood: number) => {
    return moodIcons[mood - 1]?.label || 'Unknown';
  };

  return (
    <Paper p="md" withBorder>
      <Title order={3} mb="md">Mood Tracker</Title>
      
      {/* Mood Selection */}
      <Box mb="md">
        <Text size="sm" mb="xs">How are you feeling?</Text>
        <Group spacing={4} mb="md">
          {moodIcons.map((moodIcon, index) => (
            <ActionIcon
              key={index}
              variant={mood === index + 1 ? 'filled' : 'light'}
              color={moodIcon.color}
              size="xl"
              onClick={() => setMood(index + 1)}
            >
              {moodIcon.icon}
            </ActionIcon>
          ))}
        </Group>
        
        <Textarea
          placeholder="Add a note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          mb="md"
        />
        
        <Button onClick={handleAddEntry} fullWidth>
          Log Mood
        </Button>
      </Box>
      
      {/* Recent Entries */}
      <Box>
        <Text size="sm" fw={500} mb="sm">Recent Entries</Text>
        <Stack spacing="sm">
          {entries.length > 0 ? (
            entries.map((entry) => (
              <Paper key={entry.id} p="sm" withBorder>
                <Group position="apart">
                  <Group>
                    <ActionIcon 
                      variant="light" 
                      color={moodIcons[entry.mood - 1]?.color} 
                      size="lg"
                    >
                      {moodIcons[entry.mood - 1]?.icon}
                    </ActionIcon>
                    <div>
                      <Text fw={500}>{getMoodLabel(entry.mood)}</Text>
                      <Text size="xs" c="dimmed">{entry.date}</Text>
                      {entry.note && <Text size="sm" mt={4}>{entry.note}</Text>}
                    </div>
                  </Group>
                  <ActionIcon 
                    color="red" 
                    variant="subtle"
                    onClick={() => handleDeleteEntry(entry.id)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Paper>
            ))
          ) : (
            <Text c="dimmed" ta="center" py="md">
              No mood entries yet. Add your first entry!
            </Text>
          )}
        </Stack>
      </Box>
    </Paper>
  );
};

export default MoodTracker;
