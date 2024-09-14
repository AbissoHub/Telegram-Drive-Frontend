import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';

import FolderRoundedIcon from '@mui/icons-material/FolderRounded';

import Layout from '../Components/Layout.tsx';
import Navigation from '../Components/Navigation.tsx';
import Header from '../Components/Header.tsx';
import TableFiles from '../Components/FileManager/FileManager.tsx';
import FileDetails from '../Components/FileDetails.tsx';

export default function FilesExample() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState(null); // Stato per il file selezionato

    const handleFileClick = (file) => {
        setSelectedFile(file);
    };

    const handleCloseDetails = () => {
        setSelectedFile(null);
    };

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            {drawerOpen && (
                <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
                    <Navigation />
                </Layout.SideDrawer>
            )}

            <Stack
                id="tab-bar"
                direction="row"
                spacing={1}
                sx={{
                    justifyContent: 'space-around',
                    display: { xs: 'flex', sm: 'none' },
                    zIndex: '999',
                    bottom: 0,
                    position: 'fixed',
                    width: '100dvw',
                    py: 2,
                    backgroundColor: 'background.body',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Button
                    variant="plain"
                    color="neutral"
                    aria-pressed="true"
                    component="a"
                    href="/joy-ui/getting-started/templates/files/"
                    size="sm"
                    startDecorator={<FolderRoundedIcon />}
                    sx={{ flexDirection: 'column', '--Button-gap': 0 }}
                >
                    Files
                </Button>
            </Stack>
            <Layout.Root
                sx={[
                    {
                        gridTemplateColumns: selectedFile
                            ? { xs: '1fr', md: 'minmax(160px, 300px) minmax(600px, 1fr) minmax(300px, 420px)' } // Con tendina aperta
                            : { xs: '1fr', md: 'minmax(160px, 300px) 1fr' }, // Con tendina chiusa
                    },
                    drawerOpen && {
                        height: '100vh',
                        overflow: 'hidden',
                    },
                ]}
            >
                <Layout.Header>
                    <Header />
                </Layout.Header>
                <Layout.SideNav>
                    <Navigation />
                </Layout.SideNav>
                <Layout.Main>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                            gap: 2,
                        }}
                    >
                        <Sheet
                            variant="outlined"
                            sx={{
                                borderRadius: 'sm',
                                gridColumn: '1/-1',
                                display: { xs: 'none', md: 'flex' },
                            }}
                        >
                            <TableFiles onFileClick={handleFileClick} />
                        </Sheet>
                    </Box>
                </Layout.Main>
                {selectedFile && (
                    <FileDetails file={selectedFile} onClose={handleCloseDetails} />
                )}
            </Layout.Root>
        </CssVarsProvider>
    );
}
