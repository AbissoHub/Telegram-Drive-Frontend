import * as React from 'react';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import Box from '@mui/joy/Box';
import { styled } from '@mui/joy/styles';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import MoveIcon from '@mui/icons-material/DriveFileMove';
import FileActionsModal from './FileActionsModal';
import { useSession } from '../SessionContext';
import { toast } from 'sonner';

const StyledTh = styled('th')({});
const StyledTd = styled('td')({});

export default function FileTable({ files, onFileClick, onFolderClick, baseUrl, setRefreshFiles }) {
    const [openModal, setOpenModal] = React.useState(false);
    const [modalType, setModalType] = React.useState('');
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [newName, setNewName] = React.useState('');
    const [newLocation, setNewLocation] = React.useState('');
    const [availableLocations, setAvailableLocations] = React.useState([]);
    const [loadingLocations, setLoadingLocations] = React.useState(false);
    const { token } = useSession();

    const handleOpenModal = (type, file) => {
        setModalType(type);
        setSelectedFile(file);
        setOpenModal(true);

        if (type === 'move') {
            fetchFolders(file.cluster_id);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setModalType('');
        setSelectedFile(null);
        setNewName('');
        setNewLocation('');
    };

    const fetchFolders = async (clusterId) => {
        setLoadingLocations(true);
        try {
            const response = await fetch(`${baseUrl["baseUrl"]}/get-folders`, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    c: clusterId,
                }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                setAvailableLocations(data.data.map(folder => ({
                    name: folder.locate_media,
                    path: folder.locate_media,
                })));
                //console.log(availableLocations)
            } else {
                throw new Error(data.message || 'Failed to fetch folders');
            }
        } catch (error) {
            console.error("Error fetching folders:", error);
            toast.error(error.message || 'Failed to fetch folders');
        } finally {
            setLoadingLocations(false);
        }
    };

    const handleRename = (name_change) => {
        if (!selectedFile) return;

        let options = {
            method: 'POST',
            headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                c: selectedFile.cluster_id,
                file_id: selectedFile.id_message,
                new_name: name_change,
            }),
        };

        const fetchPromise = fetch(`${baseUrl["baseUrl"]}/rename-file`, options)
            .then((response) => {
                if (response.ok && response.status !== 204) {
                    return response.json();
                }
                return response.json().then((error) => {
                    throw new Error(error.message || 'Rename failed');
                });
            })
            .then((result) => {
                if (result && result.status === 'success') {
                    return result;
                }
                throw new Error(result.message);
            })
            .catch((error) => {
                throw error;
            });

        toast.promise(fetchPromise, {
            loading: 'Renaming file...',
            success: (result) => {
                setRefreshFiles((prev) => !prev);
                return result.message;
            },
            error: (error) => error.message || 'Failed to rename file.',
        });

        fetchPromise.finally(handleCloseModal);
    };

    const handleDelete = () => {
        if (!selectedFile) return;

        let options = {
            method: 'POST',
            headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                c: selectedFile.cluster_id,
                file_id: selectedFile.id_message,
            }),
        };

        const fetchPromise = fetch(`${baseUrl["baseUrl"]}/delete-file`, options)
            .then((response) => {
                if (response.ok && response.status !== 204) {
                    return response.json();
                }
                return response.json().then((error) => {
                    throw new Error(error.message || 'Delete failed');
                });
            })
            .then((result) => {
                if (result && result.status === 'success') {
                    return result;
                }
                throw new Error(result.message || 'Delete failed');
            })
            .catch((error) => {
                throw error;
            });

        toast.promise(fetchPromise, {
            loading: 'Deleting file...',
            success: (result) => {
                setRefreshFiles((prev) => !prev);
                return result.message;
            },
            error: (error) => error.message,
        });

        fetchPromise.finally(handleCloseModal);
    };

    const handleMove = () => {
        if (!selectedFile || !newLocation) return;

        let options = {
            method: 'POST',
            headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                c: selectedFile.cluster_id,
                file_id: selectedFile.id_message,
                new_location: newLocation,
            }),
        };

        const fetchPromise = fetch(`${baseUrl["baseUrl"]}/move-file`, options)
            .then((response) => response.json())
            .catch((error) => {
                console.error("Error during moving:", error);
                throw error;
            });

        toast.promise(fetchPromise, {
            loading: 'Deleting file...',
            success: (result) => {
                setRefreshFiles((prev) => !prev);
                return result.message;
            },
            error: (error) => error.message,
        });

        fetchPromise.finally(handleCloseModal);
    };

    // Funzione per scaricare un file
    const handleDownload = (file) => {
        let options = {
            method: 'POST',
            headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cluster_id: 'cluster_id_placeholder',
                file_id: file.id,
                dest: 'destination_placeholder',
                name_file: file.name,
            }),
        };

        const fetchPromise = fetch(`${baseUrl["baseUrl"]}/download, options`)
            .then((response) => response.json())
            .catch((error) => {
                console.error("Error during download:", error);
                throw error;
            });

        toast.promise(fetchPromise, {
            loading: 'Downloading file...',
            success: (result) => result.message || 'File downloaded successfully!',
            error: (error) => error.message || 'Failed to download file.',
        });
    };

    return (
        <>
            <Table hoverRow size="sm" borderAxis="none" variant="soft">
                <thead>
                <tr>
                    <StyledTh>
                        <Typography level="title-sm">Name</Typography>
                    </StyledTh>
                    <StyledTh sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        <Typography level="title-sm" endDecorator={<ArrowDropDownRoundedIcon />}>
                            Last modified
                        </Typography>
                    </StyledTh>
                    <StyledTh sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        <Typography level="title-sm">Size</Typography>
                    </StyledTh>
                    <StyledTh>
                        <Typography level="title-sm">Actions</Typography>
                    </StyledTh>
                </tr>
                </thead>
                <tbody>
                {files.map((file, index) => (
                    <tr
                        key={index}
                        onClick={() => {
                            if (file.type === 'file') {
                                onFileClick(file);
                            } else if (file.type === 'folder') {
                                onFolderClick(file.name);
                            }
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <StyledTd>
                            <Typography
                                level="title-sm"
                                startDecorator={
                                    file.type === 'folder' ? (
                                        <FolderRoundedIcon color="primary" />
                                    ) : (
                                        <InsertDriveFileIcon color="secondary" />
                                    )
                                }
                                sx={{ alignItems: 'flex-start' }}
                            >
                                {file.name}
                            </Typography>
                        </StyledTd>
                        <StyledTd sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                            <Typography level="body-sm">{file.modified}</Typography>
                        </StyledTd>
                        <StyledTd sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                            <Typography level="body-sm">{file.size}</Typography>
                        </StyledTd>
                        <StyledTd>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {file.type === 'file' && (
                                    <>
                                        <IconButton
                                            variant="plain"
                                            color="neutral"
                                            size="sm"
                                            aria-label="Download"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleDownload(file);
                                            }}
                                        >
                                            <DownloadRoundedIcon />
                                        </IconButton>
                                        <IconButton
                                            variant="plain"
                                            color="neutral"
                                            size="sm"
                                            aria-label="Move"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleOpenModal('move', file);
                                            }}
                                        >
                                            <MoveIcon />
                                        </IconButton>
                                    </>
                                )}
                                <IconButton
                                    variant="plain"
                                    color="neutral"
                                    size="sm"
                                    aria-label="Rename"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleOpenModal('rename', file);
                                    }}
                                >
                                    <EditRoundedIcon />
                                </IconButton>
                                <IconButton
                                    variant="plain"
                                    color="neutral"
                                    size="sm"
                                    aria-label="Delete"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleOpenModal('delete', file);
                                    }}
                                >
                                    <DeleteRoundedIcon />
                                </IconButton>
                            </Box>
                        </StyledTd>
                    </tr>
                ))}
                </tbody>
            </Table>

            <FileActionsModal
                open={openModal}
                modalType={modalType}
                onClose={handleCloseModal}
                onRename={handleRename}
                onDelete={handleDelete}
                onMove={handleMove}
                selectedFile={selectedFile}
                newName={newName}
                setNewName={setNewName}
                newLocation={newLocation}
                setNewLocation={setNewLocation}
                availableLocations={availableLocations}  // Passa le cartelle disponibili al modal
                loading={loadingLocations}  // Stato di caricamento
            />
        </>
    );
}
