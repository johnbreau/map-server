import { useState, useEffect } from 'react';
import { Button, Paper, Text, Group, LoadingOverlay, Box, Divider } from '@mantine/core';
import { IconFileZip, IconDatabaseImport } from '@tabler/icons-react';

export const AppleHealthImport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [dataPath, setDataPath] = useState('');

  useEffect(() => {
    // Check if appleHealthData folder exists and has files
    const checkDataFolder = async () => {
      try {
        const response = await fetch('/api/health/check-data');
        const data = await response.json();
        setHasData(data.exists);
        setDataPath(data.path || '');
      } catch (error) {
        console.error('Error checking data folder:', error);
      }
    };

    checkDataFolder();
  }, []);

  const handleProcessData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/health/process-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to process data');
      }
      
      // Handle successful processing
      // You might want to update the charts or show a success message
      setHasData(true);
    } catch (error) {
      console.error('Error processing data:', error);
      // Handle error (show notification, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box mt="xl">
      <Divider my="md" label="Data Management" labelPosition="center" />
      
      <Paper withBorder p="md" radius="md">
        <LoadingOverlay visible={isLoading} />
        
        <Group mb="md">
          <IconDatabaseImport size={24} />
          <div>
            <Text fw={500}>Apple Health Data</Text>
            <Text size="sm" c="dimmed">
              {hasData 
                ? 'Data found in appleHealthData folder. Click below to process.'
                : 'Place your Apple Health export in the appleHealthData folder and click below to process.'}
            </Text>
            {dataPath && (
              <Text size="xs" c="dimmed" mt={4}>
                Path: {dataPath}
              </Text>
            )}
          </div>
        </Group>
        
        <Button 
          leftSection={<IconFileZip size={18} />}
          onClick={handleProcessData}
          loading={isLoading}
          disabled={isLoading}
          fullWidth
        >
          {hasData ? 'Reprocess Data' : 'Process Data'}
        </Button>
        
        {hasData && (
          <Text size="sm" c="dimmed" mt="sm">
            Note: Updating the data may take a few moments to reflect in the charts.
          </Text>
        )}
      </Paper>
    </Box>
  );
};

export default AppleHealthImport;
