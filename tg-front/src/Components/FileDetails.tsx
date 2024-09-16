import * as React from 'react';
import {
    Box,
    Sheet,
    Typography,
    IconButton,
    Divider,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    AspectRatio,
    Button,
} from '@mui/joy';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import FileActionsModal from '../Components/FileManager/FileActionsModal.tsx'; // Assicurati che il percorso del file sia corretto

export default function FileDetails({ file, onClose }) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [modalType, setModalType] = React.useState('');
    const [newName, setNewName] = React.useState('');

    const handleOpenModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalType('');
    };

    const handleRename = () => {
        // Implementa la logica per rinominare il file
        console.log('Renaming file to:', newName);
        handleCloseModal();
    };

    const handleDelete = () => {
        // Implementa la logica per eliminare il file
        console.log('Deleting file:', file.name);
        handleCloseModal();
    };

    return (
        <>
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
                        <Box sx={{ py: 2, px: 1, display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button variant="plain" size="sm" startDecorator={<DownloadRoundedIcon />}>
                                Download
                            </Button>
                            <Button variant="plain" size="sm" startDecorator={<DriveFileRenameOutlineRoundedIcon />} onClick={() => handleOpenModal('rename')}>
                                Rename
                            </Button>
                            <Button variant="plain" size="sm" startDecorator={<DeleteRoundedIcon />} onClick={() => handleOpenModal('delete')}>
                                Delete
                            </Button>
                        </Box>
                    </TabPanel>
                    {/* Activity tab could be customized similarly */}
                </Tabs>
            </Sheet>

            {/* Modale per le azioni di file */}
            <FileActionsModal
                open={isModalOpen}
                modalType={modalType}
                onClose={handleCloseModal}
                onRename={handleRename}
                onDelete={handleDelete}
                selectedFile={file}
                newName={newName}
                setNewName={setNewName}
            />
        </>
    );
}
