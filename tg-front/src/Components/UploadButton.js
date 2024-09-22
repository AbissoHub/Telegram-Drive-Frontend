import React, { useState } from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import Box from '@mui/joy/Box';
import { styled } from '@mui/joy/styles';
import { Typography, Select, Option, CircularProgress } from "@mui/joy";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { toast } from "sonner"; // Assicurati di avere questa libreria installata
import { useSession } from './SessionContext'; // Assicurati di avere questo contesto

const VisuallyHiddenInput = styled('input')`
  display: none;
`;

const UploadButton = ({ baseUrl, setRefreshFiles }) => {
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedDrive, setSelectedDrive] = useState('');
    const [selectedSubfolder, setSelectedSubfolder] = useState('');
    const [availableDrives, setAvailableDrives] = useState([]);
    const [availableSubfolders, setAvailableSubfolders] = useState([]);
    const [loadingDrives, setLoadingDrives] = useState(false);
    const [loadingSubfolders, setLoadingSubfolders] = useState(false);
    const { token } = useSession();

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setSelectedFile(null);
        setSelectedDrive('');
        setSelectedSubfolder('');
        setAvailableDrives([]);
        setAvailableSubfolders([]);
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            fetchDrives();
        }
    };

    const handleDriveChange = (event, newValue) => {
        if (newValue) {
            setSelectedDrive(newValue);
            fetchSubfolders(newValue);
        } else {
            setSelectedDrive('');
            setAvailableSubfolders([]);
            setSelectedSubfolder('');
        }
    };

    const handleSubfolderChange = (event, newValue) => {
        if (newValue) {
            setSelectedSubfolder(newValue);
        } else {
            setSelectedSubfolder('');
        }
    };

    const fetchDrives = async () => {
        setLoadingDrives(true);
        try {
            const response = await fetch(`${baseUrl["baseUrl"]}/get-clusters-info`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.status === 'success') {
                const privateKey = Object.keys(data.data).find(key => key.includes('Private'));
                const sharedKey = Object.keys(data.data).find(key => key.includes('Shared'));

                const privateKeyValue = privateKey ? data.data[privateKey] : null;
                const sharedKeyValue = sharedKey ? data.data[sharedKey] : null;

                const formattedDrives = [];

                if (privateKeyValue) {
                    formattedDrives.push({ name: 'My Files', value: privateKeyValue });
                }

                if (sharedKeyValue) {
                    formattedDrives.push({ name: 'Shared Files', value: sharedKeyValue });
                }

                setAvailableDrives(formattedDrives);
            } else {
                throw new Error(data.message || 'Failed to fetch drives');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to fetch drives');
        } finally {
            setLoadingDrives(false);
        }
    };

    const fetchSubfolders = async (driveId) => {
        setLoadingSubfolders(true);
        try {
            const response = await fetch(`${baseUrl["baseUrl"]}/get-folders`, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    c: parseInt(driveId),
                }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                const locations = [
                    { name: './', path: './' },
                    ...data.data.map(folder => ({
                        name: folder.locate_media,
                        path: folder.locate_media,
                    }))
                ];

                setAvailableSubfolders(locations);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoadingSubfolders(false);
        }
    };

    const uploadFile = async () => {
        if (selectedFile && selectedDrive && selectedSubfolder) {

            const fileSize = selectedFile.size;

            const destination = `${selectedDrive}/${selectedSubfolder}`;

            const clusterId = 'IL_TUO_CLUSTER_ID';

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('destination', destination);
            formData.append('c', clusterId);
            formData.append('file_size', fileSize.toString());

            try {
                const response = await fetch(`${baseUrl["baseUrl"]}/upload`, {
                    method: 'POST',
                    headers: {
                        Authorization: `${token}`,
                    },
                    body: formData,
                });

                const data = await response.json();

                if (data.status === 'success') {
                    toast.success('File caricato con successo!');
                    handleClose();
                    if (setRefreshFiles) {
                        setRefreshFiles(prev => !prev);
                    }
                } else {
                    throw new Error(data.message || 'Upload fallito');
                }
            } catch (error) {
                toast.error(error.message || 'Upload fallito');
            }
        } else {
            toast.error('Per favore, seleziona un file, un drive e una destinazione.');
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
                    <CloudUploadIcon/>
                }
            >
                Upload File
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        maxWidth: 500,
                        mx: 'auto',
                        p: 3,
                        mt: '10%',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                >
                    <Typography level="h5" sx={{ mb: 2 }}>
                        Carica un File
                    </Typography>

                    {!selectedFile && (
                        <Button
                            component="label"
                            variant="outlined"
                            color="primary"
                            sx={{ mb: 2 }}
                        >
                            Scegli File da Caricare
                            <VisuallyHiddenInput type="file" onChange={handleFileSelect} />
                        </Button>
                    )}

                    {selectedFile && (
                        <Typography level="body1" sx={{ mb: 2 }}>
                            File selezionato: {selectedFile.name}
                        </Typography>
                    )}

                    {selectedFile && (
                        <>
                            <Select
                                placeholder={loadingDrives ? 'Caricamento drive...' : 'Seleziona Drive'}
                                onChange={handleDriveChange}
                                sx={{ mb: 2 }}
                                value={selectedDrive}
                                disabled={loadingDrives || availableDrives.length === 0}
                                startDecorator={loadingDrives && <CircularProgress size="sm" />}
                            >
                                {availableDrives.map((drive) => (
                                    <Option key={drive.value} value={drive.value}>
                                        {drive.name}
                                    </Option>
                                ))}
                            </Select>

                            <Select
                                placeholder={loadingSubfolders ? 'Caricamento sottocartelle...' : 'Seleziona Sottocartella'}
                                onChange={handleSubfolderChange}
                                sx={{ mb: 2 }}
                                value={selectedSubfolder}
                                disabled={!selectedDrive || loadingSubfolders || availableSubfolders.length === 0}
                                startDecorator={loadingSubfolders && <CircularProgress size="sm" />}
                            >
                                {availableSubfolders.map((subfolder, index) => (
                                    <Option key={index} value={subfolder.path}>
                                        {subfolder.name}
                                    </Option>
                                ))}
                            </Select>
                        </>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button onClick={handleClose} variant="outlined" color="danger">
                            Annulla
                        </Button>
                        <Button
                            onClick={uploadFile}
                            variant="solid"
                            color="success"
                            disabled={!selectedFile || !selectedDrive || !selectedSubfolder}
                        >
                            Upload
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default UploadButton;
