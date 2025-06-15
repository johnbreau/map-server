import { Group, Text, ActionIcon, useMantineColorScheme, Button, Container } from '@mantine/core';
import { IconSun, IconMoonStars, IconSearch, IconRobot, IconNotebook, IconBook, IconHeart } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const location = useLocation();

  const links = [
    { link: '/search', label: 'Search', icon: <IconSearch size={18} /> },
    { link: '/ai', label: 'AI Chat', icon: <IconRobot size={18} /> },
    { link: '/journals', label: 'Journals', icon: <IconNotebook size={18} /> },
    { link: '/books', label: 'Books', icon: <IconBook size={18} /> },
    { link: '/health', label: 'Health', icon: <IconHeart size={18} /> },
  ];

  const items = links.map((link) => (
    <Button
      key={link.label}
      component={Link}
      to={link.link}
      variant={location.pathname === link.link ? 'light' : 'subtle'}
      leftSection={link.icon}
      size="sm"
    >
      {link.label}
    </Button>
  ));

  return (
    <Container size="xl" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
      <Group justify="space-between" style={{ width: '100%' }}>
        <Group>
          <Text fw={700} size="lg">
            Breau Bot
          </Text>
          <Group gap="xs">
            {items}
          </Group>
        </Group>
        
        <ActionIcon
          variant="default"
          onClick={() => toggleColorScheme()}
          size={30}
          title="Toggle color scheme"
        >
          {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoonStars size={18} />}
        </ActionIcon>
      </Group>
    </Container>
  );
}
