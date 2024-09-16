import React, { useState } from 'react';
import Button from '@mui/joy/Button';
import SvgIcon from '@mui/joy/SvgIcon';
import Modal from '@mui/joy/Modal';
import Box from '@mui/joy/Box';
import { styled } from '@mui/joy/styles';
import { Typography, Select, Option } from "@mui/joy";

// Componente styled per l'input nascosto
const VisuallyHiddenInput = styled('input')`
  display: none;
`;

const UploadButton = () => {
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState('');
    const [destinationPath, setDestinationPath] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file.name);
        }
    };

    const handleDestinationChange = (event, newValue) => {
        if (newValue) {
            setDestinationPath(newValue);
        }
    };

    const handleUpload = () => {
        if (selectedFile && destinationPath) {
            alert(`The file ${selectedFile} will be uploaded to ${destinationPath}.`);
            handleClose();
        } else {
            alert('Please select a file and a destination path.');
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
                    <SvgIcon>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                            />
                        </svg>
                    </SvgIcon>
                }
            >
                Upload File
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
                        Select File and Destination
                    </Typography>

                    {!selectedFile && (
                        <Button
                            component="label"
                            variant="outlined"
                            color="primary"
                            sx={{ mb: 2 }}
                        >
                            Choose File to Upload
                            <VisuallyHiddenInput type="file" onChange={handleFileSelect} />
                        </Button>
                    )}

                    {selectedFile && (
                        <Typography level="body1" sx={{ mb: 2 }}>
                            Selected file: {selectedFile}
                        </Typography>
                    )}

                    <Select
                        placeholder="Select Destination Path"
                        onChange={handleDestinationChange}
                        sx={{ mb: 2 }}
                        value={destinationPath}
                    >
                        <Option value="Path 1">Path 1</Option>
                        <Option value="Path 2">Path 2</Option>
                        <Option value="Path 3">Path 3</Option>
                    </Select>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button onClick={handleClose} variant="outlined" color="danger">
                            Cancel
                        </Button>
                        <Button onClick={handleUpload} variant="solid" color="success">
                            Confirm
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default UploadButton;
