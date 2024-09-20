import React, { useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';

import FolderRoundedIcon from '@mui/icons-material/FolderRounded';

import Layout from '../Components/Layout';
import Navigation from '../Components/Navigation';
import Header from '../Components/Header';
import TableFiles from '../Components/FileManager/FileManager';
import FileDetails from '../Components/FileDetails';


export default function Drive (baseUrl) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedSection, setSelectedSection] = useState('myFiles');
    const [progress, setProgress] = React.useState(0);
    const [isDownloadActive, setIsDownloadActive] = React.useState(false);

    const [refreshFiles, setRefreshFiles] = useState(false);


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
                    <Navigation
                        baseUrl={baseUrl}
                        selectedSection={selectedSection}
                        onSectionChange={setSelectedSection}
                    />
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
                    size="sm"
                    startDecorator={<FolderRoundedIcon />}
                    sx={{ flexDirection: 'column', '--Button-gap': 0 }}
                    onClick={() => setDrawerOpen(true)}
                >
                    Files
                </Button>
            </Stack>
            <Layout.Root
                sx={[
                    {
                        gridTemplateColumns: selectedFile
                            ? {
                                xs: '1fr',
                                md: 'minmax(160px, 300px) minmax(600px, 1fr) minmax(300px, 420px)',
                            }
                            : { xs: '1fr', md: 'minmax(160px, 300px) 1fr' },
                    },
                    drawerOpen && {
                        height: '100vh',
                        overflow: 'hidden',
                    },
                ]}
            >
                <Layout.Header>
                    <Header baseUrl={baseUrl} />
                </Layout.Header>
                <Layout.SideNav
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                    }}
                >
                    <Navigation
                        baseUrl={baseUrl}
                        selectedSection={selectedSection}
                        onSectionChange={setSelectedSection}
                        isDownloadActive={isDownloadActive}
                        progress={progress}
                        setRefreshFiles={setRefreshFiles}
                    />
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
                                display: 'flex',
                            }}
                        >
                            <TableFiles
                                onFileClick={handleFileClick}
                                selectedSection={selectedSection}
                                baseUrl={baseUrl}
                                setProgress={setProgress}
                                setIsDownloadActive={setIsDownloadActive}
                                isDownloadActive={isDownloadActive}
                                progress={progress}
                                refreshFiles={refreshFiles}
                                setRefreshFiles={setRefreshFiles}
                            />
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
