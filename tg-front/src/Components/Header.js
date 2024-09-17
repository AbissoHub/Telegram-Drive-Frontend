import * as React from 'react';
import { useColorScheme } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Avatar from '@mui/joy/Avatar';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Tooltip from '@mui/joy/Tooltip';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import ListDivider from '@mui/joy/ListDivider';
import Drawer from '@mui/joy/Drawer';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import { useSession } from './SessionContext'; // Importa il contesto per gestire il logout
import { toast } from 'sonner'; // Importa la libreria 'sonner' per mostrare il toast

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import BookRoundedIcon from '@mui/icons-material/BookRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';


import Navigation from './Navigation.js';

function ColorSchemeToggle() {
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return <IconButton size="sm" variant="outlined" color="primary" />;
    }
    return (
        <Tooltip title="Change theme" variant="outlined">
            <IconButton
                data-screenshot="toggle-mode"
                size="sm"
                variant="plain"
                color="neutral"
                sx={{ alignSelf: 'center' }}
                onClick={() => {
                    setMode(mode === 'light' ? 'dark' : 'light');
                }}
            >
                {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
            </IconButton>
        </Tooltip>
    );
}

export default function Header({baseUrl}) {
    const { logout } = useSession();
    const [open, setOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        toast.success('Logout successfully!');
    };

    const handleLanguageClick = () => {
        const fetchPromise = fetch(`${baseUrl["baseUrl"]}/ping-pong`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if (!response.ok) {
                throw new Error('Error fetching connection status.');
            }
            return response.json();
        });

        toast.promise(fetchPromise, {
            loading: 'Fetching connection status...',
            success: (data) => `Connection status: True`,
            error: (error) => error.message || 'Failed to fetch connection status.',
        });
    };


    return (
        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack
                direction="row"
                spacing={1}
                sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: { xs: 'none', sm: 'flex' },
                }}
            >
                <IconButton
                    size="md"
                    variant="outlined"
                    color="neutral"
                    sx={{ display: { xs: 'none', sm: 'inline-flex' }, borderRadius: '50%' }}
                    onClick={handleLanguageClick}
                >
                    <LanguageRoundedIcon />
                </IconButton>
            </Stack>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, justifyContent: 'center', px: 2 }}>
                <Input
                    size="sm"
                    variant="outlined"
                    placeholder="Search in drive ..."
                    startDecorator={<SearchRoundedIcon color="primary" />}
                    endDecorator={
                        <IconButton
                            variant="outlined"
                            color="neutral"
                            sx={{ bgcolor: 'background.level1' }}
                        >
                            <Typography level="title-sm" textColor="text.icon">
                                ⌘ K
                            </Typography>
                        </IconButton>
                    }
                    sx={{
                        alignSelf: 'center',
                        maxWidth: '800px',
                        width: '100%',
                    }}
                />
            </Box>

            <Box sx={{ display: { xs: 'inline-flex', sm: 'none' }, flexGrow: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                <IconButton variant="plain" color="neutral" onClick={() => setOpen(true)}>
                    <MenuRoundedIcon />
                </IconButton>
                <Drawer
                    sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                    open={open}
                    onClose={() => setOpen(false)}
                >
                    <ModalClose />
                    <DialogTitle>AbissoHub Drive</DialogTitle>
                    <Box sx={{ px: 1 }}>
                        <Navigation />
                    </Box>
                </Drawer>
                <IconButton
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    sx={{ alignSelf: 'center' }}
                >
                    <SearchRoundedIcon />
                </IconButton>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5, alignItems: 'center' }}>
                <ColorSchemeToggle />
                <Dropdown>
                    <MenuButton
                        variant="plain"
                        size="sm"
                        sx={{ maxWidth: '32px', maxHeight: '32px', borderRadius: '9999999px' }}
                    >
                        <Avatar
                            src="https://i.pravatar.cc/40?img=2"
                            srcSet="https://i.pravatar.cc/80?img=2"
                            sx={{ maxWidth: '32px', maxHeight: '32px' }}
                        />
                    </MenuButton>
                    <Menu
                        placement="bottom-end"
                        size="sm"
                        sx={{
                            zIndex: '99999',
                            p: 1,
                            gap: 1,
                            '--ListItem-radius': 'var(--joy-radius-sm)',
                        }}
                    >
                        <MenuItem>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar
                                    src="https://i.pravatar.cc/40?img=2"
                                    srcSet="https://i.pravatar.cc/80?img=2"
                                    sx={{ borderRadius: '50%' }}
                                />
                                <Box sx={{ ml: 1.5 }}>
                                    <Typography level="title-sm" textColor="text.primary">
                                        Rick Sanchez
                                    </Typography>
                                    <Typography level="body-xs" textColor="text.tertiary">
                                        rick@email.com
                                    </Typography>
                                </Box>
                            </Box>
                        </MenuItem>
                        <ListDivider />
                        <MenuItem>
                            <HelpRoundedIcon />
                            Help
                        </MenuItem>
                        <MenuItem>
                            <SettingsRoundedIcon />
                            Settings
                        </MenuItem>
                        <ListDivider />
                        <MenuItem
                            component="a"
                            href="https://github.com/mui/material-ui/tree/master/docs/data/joy/getting-started/templates/email"
                        >
                            Sourcecode
                            <OpenInNewRoundedIcon />
                        </MenuItem>
                        <ListDivider />
                        <MenuItem onClick={handleLogout}> {/* Usa handleLogout per il logout e il toast */}
                            <LogoutRoundedIcon />
                            Log out
                        </MenuItem>
                    </Menu>
                </Dropdown>
            </Box>
        </Box>
    );
}
