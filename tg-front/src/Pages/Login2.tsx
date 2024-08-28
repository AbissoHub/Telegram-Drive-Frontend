import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';

import FolderRoundedIcon from '@mui/icons-material/FolderRounded';

import Layout from '../ComponentsTSX/Layout.tsx';
import Navigation from '../ComponentsTSX/Navigation.tsx';
import Header from '../ComponentsTSX/Header.tsx';
import TableFiles from '../ComponentsTSX/TableFiles.tsx';
import FileDetails from '../ComponentsTSX/FileDetails.tsx';

export default function FilesExample() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
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
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'minmax(64px, 200px) minmax(450px, 1fr)',
                  md: 'minmax(160px, 300px) minmax(600px, 1fr) minmax(300px, 420px)',
                },
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
                <TableFiles />
              </Sheet>
            </Box>
          </Layout.Main>
          <FileDetails />
        </Layout.Root>
      </CssVarsProvider>
  );
}
