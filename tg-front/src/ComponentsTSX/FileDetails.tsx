import * as React from 'react';
import { Box, Sheet, Typography, IconButton, Divider, Tabs, TabList, Tab, TabPanel, AspectRatio, AvatarGroup, Avatar, Button, Chip } from '@mui/joy';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';

export default function FileDetails({ file, onClose }) {
    return (
        <Sheet
            sx={{
                display: { xs: 'none', sm: 'initial' },
                borderLeft: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <Typography level="title-md" sx={{ flex: 1 }}>
                    {file.name}
                </Typography>
                <IconButton component="span" variant="plain" color="neutral" size="sm" onClick={onClose}>
                    <CloseRoundedIcon />
                </IconButton>
            </Box>
            <Divider />
            <Tabs>
                <TabList>
                    <Tab sx={{ flexGrow: 1 }}>
                        <Typography level="title-sm">Details</Typography>
                    </Tab>
                    <Tab sx={{ flexGrow: 1 }}>
                        <Typography level="title-sm">Activity</Typography>
                    </Tab>
                </TabList>
                <TabPanel value={0} sx={{ p: 0 }}>
                    <AspectRatio ratio="21/9">
                        <img
                            alt={file.name}
                            src={file.imageUrl || 'https://via.placeholder.com/400'}
                            srcSet={file.imageUrl ? file.imageUrl + ' 2x' : 'https://via.placeholder.com/800 2x'}
                        />
                    </AspectRatio>
                    <Box sx={{ p: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Typography level="title-sm" sx={{ mr: 1 }}>
                            Shared with
                        </Typography>
                        <AvatarGroup size="sm" sx={{ '--Avatar-size': '24px' }}>
                            {file.owner.map((user, index) => (
                                <Avatar
                                    key={index}
                                    src={user.avatar}
                                    srcSet={user.avatar + ' 2x'}
                                />
                            ))}
                        </AvatarGroup>
                    </Box>
                    <Divider />
                    <Box
                        sx={{
                            gap: 2,
                            p: 2,
                            display: 'grid',
                            gridTemplateColumns: 'auto 1fr',
                            '& > *:nth-child(odd)': { color: 'text.secondary' },
                        }}
                    >
                        <Typography level="title-sm">Type</Typography>
                        <Typography level="body-sm" textColor="text.primary">
                            {file.type}
                        </Typography>
                        <Typography level="title-sm">Size</Typography>
                        <Typography level="body-sm" textColor="text.primary">
                            {file.size}
                        </Typography>
                        <Typography level="title-sm">Location</Typography>
                        <Typography level="body-sm" textColor="text.primary">
                            Unknown
                        </Typography>
                        <Typography level="title-sm">Owner</Typography>
                        <Typography level="body-sm" textColor="text.primary">
                            Multiple Users
                        </Typography>
                        <Typography level="title-sm">Modified</Typography>
                        <Typography level="body-sm" textColor="text.primary">
                            {file.modified}
                        </Typography>
                        <Typography level="title-sm">Created</Typography>
                        <Typography level="body-sm" textColor="text.primary">
                            Unknown
                        </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ py: 2, px: 1 }}>
                        <Button variant="plain" size="sm" endDecorator={<EditRoundedIcon />}>
                            Add a description
                        </Button>
                    </Box>
                </TabPanel>
                {/* Activity tab could be customized similarly */}
            </Tabs>
        </Sheet>
    );
}
