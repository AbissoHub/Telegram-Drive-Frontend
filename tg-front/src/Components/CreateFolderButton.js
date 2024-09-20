import React, { useState } from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import Box from '@mui/joy/Box';
import { styled } from '@mui/joy/styles';
import { Typography, Input, Select, Option } from "@mui/joy";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

// Componente styled per l'input nascosto
const VisuallyHiddenInput = styled('input')`
  display: none;
`;

const CreateFolderButton = () => {
    const [open, setOpen] = useState(false);
    const [folderName, setFolderName] = useState('');
    const [selectedDrive, setSelectedDrive] = useState('');
    const [selectedSubfolder, setSelectedSubfolder] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleFolderNameChange = (event) => {
        setFolderName(event.target.value);
    };

    const handleDriveChange = (event, newValue) => {
        if (newValue) {
            setSelectedDrive(newValue);
        }
    };

    const handleSubfolderChange = (event, newValue) => {
        if (newValue) {
            setSelectedSubfolder(newValue);
        }
    };

    const handleCreateFolder = () => {
        if (folderName && selectedDrive && selectedSubfolder) {
            alert(`The folder "${folderName}" will be created in ${selectedDrive}/${selectedSubfolder}.`);
            handleClose();
        } else {
            alert('Please fill out all fields.');
        }
    };

    return (
        <>
            <Button
                onClick={handleOpen}
                variant="solid"
                color="primary"
                sx={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '10px',
                    backgroundColor: '#007BFF',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: '#0056b3',
                    },
                }}
                startDecorator={
                    <CreateNewFolderIcon/>
                }
            >
                Create Folder
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        maxWidth: 400,
                        mx: 'auto',
                        p: 3,
                        mt: '10%',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                >
                    <Typography level="h5" sx={{ mb: 2 }}>
                        Create New Folder
                    </Typography>

                    <Input
                        placeholder="Folder Name"
                        value={folderName}
                        onChange={handleFolderNameChange}
                        sx={{ mb: 2 }}
                    />

                    <Select
                        placeholder="Select Drive"
                        onChange={handleDriveChange}
                        sx={{ mb: 2 }}
                        value={selectedDrive}
                    >
                        <Option value="Drive A">Drive A</Option>
                        <Option value="Drive B">Drive B</Option>
                        <Option value="Drive C">Drive C</Option>
                    </Select>

                    <Select
                        placeholder="Select Subfolder"
                        onChange={handleSubfolderChange}
                        sx={{ mb: 2 }}
                        value={selectedSubfolder}
                    >
                        <Option value="Subfolder 1">Subfolder 1</Option>
                        <Option value="Subfolder 2">Subfolder 2</Option>
                        <Option value="Subfolder 3">Subfolder 3</Option>
                    </Select>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button onClick={handleClose} variant="outlined" color="danger">
                            Cancel
                        </Button>
                        <Button onClick={handleCreateFolder} variant="solid" color="success">
                            Create
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default CreateFolderButton;
