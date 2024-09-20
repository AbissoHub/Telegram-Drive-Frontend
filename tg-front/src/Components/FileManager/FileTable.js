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

export default function FileTable({ files, onFileClick, onFolderClick, baseUrl, setRefreshFiles, setProgress, setIsDownloadActive, isDownloadActive,progress }) {
    const [openModal, setOpenModal] = React.useState(false);
    const [modalType, setModalType] = React.useState('');
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [newName, setNewName] = React.useState('');
    const [newLocation, setNewLocation] = React.useState('');
    const [availableLocations, setAvailableLocations] = React.useState([]);
    const [loadingLocations, setLoadingLocations] = React.useState(false);

    const { token } = useSession();

    const [folderHandle, setFolderHandle] = React.useState(null);

    const handleOpenModal = (type, file) => {
        setModalType(type);
        setSelectedFile(file);
        setOpenModal(true);
        setNewName(file.name); // Imposta il nome del file corrente nel modal

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
        setFolderHandle(null); // Resetta l'handle della cartella
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
                const locations = [
                    { name: './', path: './' },
                    ...data.data.map(folder => ({
                        name: folder.locate_media,
                        path: folder.locate_media,
                    }))
                ];

                setAvailableLocations(locations);

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

        if (selectedFile.type === 'folder') {
            handleRenameFolder(name_change);
        } else {
            handleRenameFile(name_change);
        }
    };

    const handleRenameFolder = (new_folder_path) => {
        let options = {
            method: 'POST',
            headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                c: selectedFile.cluster_id,
                old_path_folder: selectedFile.locate_media,
                new_name: new_folder_path,
            }),
        };

        const fetchPromise = fetch(`${baseUrl["baseUrl"]}/rename-folder`, options)
            .then((response) => response.json())
            .catch((error) => {
                console.error("Error during rename:", error);
                throw error;
            });

        toast.promise(fetchPromise, {
            loading: 'Renaming folder...',
            success: (result) => {
                setRefreshFiles((prev) => !prev);
                return result.message;
            },
            error: (error) => error.message || 'Failed to rename folder.',
        });

        fetchPromise.finally(handleCloseModal);
    };

    const handleRenameFile = (name_change) => {
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
            .then((response) => response.json())
            .catch((error) => {
                console.error("Error during rename:", error);
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

        if (selectedFile.type === 'folder') {
            handleDeleteFolder();
        } else {
            handleDeleteFile();
        }
    };

    const handleDeleteFolder = () => {
        let options = {
            method: 'POST',
            headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                c: selectedFile.cluster_id,
                folder_id: selectedFile.id_message,
            }),
        };

        const fetchPromise = fetch(`${baseUrl["baseUrl"]}/delete-folder`, options)
            .then((response) => response.json())
            .catch((error) => {
                console.error("Error during delete:", error);
                throw error;
            });

        toast.promise(fetchPromise, {
            loading: 'Deleting folder...',
            success: (result) => {
                setRefreshFiles((prev) => !prev);
                return result.message;
            },
            error: (error) => error.message || 'Failed to delete folder.',
        });

        fetchPromise.finally(handleCloseModal);
    };

    const handleDeleteFile = () => {
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
            .then((response) => response.json())
            .catch((error) => {
                console.error("Error during delete:", error);
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
            loading: 'Moving file...',
            success: (result) => {
                setRefreshFiles((prev) => !prev);
                return result.message;
            },
            error: (error) => error.message,
        });

        fetchPromise.finally(handleCloseModal);
    };

    const handleDownload = async () => {
        if (isDownloadActive) {
            toast.error('There is another active download to be completed');
            return;
        }

        if (!selectedFile) {
            toast.error('Per favore, seleziona un file da scaricare.');
            return;
        }

        setIsDownloadActive(true);
        setProgress(0); // Reset della barra di progresso

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cluster_id: selectedFile.cluster_id,
                file_id: selectedFile.id_message,
                name_file: newName,
            }),
        };

        try {
            const response = await fetch(`${baseUrl["baseUrl"]}/download`, options);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Il server ha risposto con status ${response.status}`);
            }

            let filename = newName;
            const disposition = response.headers.get('Content-Disposition');
            if (disposition && disposition.includes('filename=')) {
                const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1];
                }
            }

            const contentLength = response.headers.get('Content-Length');
            const total = contentLength ? parseInt(contentLength, 10) : 0;

            if (!response.body) {
                throw new Error('ReadableStream non supportato in questa risposta.');
            }

            const reader = response.body.getReader();
            const chunks = [];
            let received = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
                received += value.length;
                if (total) {
                    const percentage = ((received / total) * 100).toFixed(2);
                    setProgress(parseInt(percentage, 10));
                }
            }

            const blob = new Blob(chunks);
            const url = window.URL.createObjectURL(blob);

            // Crea un elemento <a> temporaneo
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            // Rimuove l'elemento <a> e revoca l'URL oggetto
            a.remove();
            window.URL.revokeObjectURL(url);

            setProgress(100);
            setIsDownloadActive(false);
            toast.success(`File '${filename}' scaricato con successo!`);
            handleCloseModal();
        } catch (error) {
            setIsDownloadActive(false);
            console.error("Errore durante il download:", error);
            toast.error(error.message);
        }
    };




    return (
        <>
            <Table hoverRow size="sm" borderAxis="none" variant="soft">
                <thead>
                <tr>
                    <StyledTh>
                        <Typography level="title-sm">Nome</Typography>
                    </StyledTh>
                    <StyledTh sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        <Typography level="title-sm" endDecorator={<ArrowDropDownRoundedIcon />}>
                            Ultima modifica
                        </Typography>
                    </StyledTh>
                    <StyledTh sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        <Typography level="title-sm">Dimensione</Typography>
                    </StyledTh>
                    <StyledTh>
                        <Typography level="title-sm">Azioni</Typography>
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
                                                event.preventDefault();
                                                handleOpenModal('download', file);
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
                availableLocations={availableLocations}
                loading={loadingLocations}
                onDownload={handleDownload}
                folderHandle={folderHandle}
                setFolderHandle={setFolderHandle}
                setProgress={setProgress}
                setIsDownloadActive={setIsDownloadActive}
                isDownloadActive={isDownloadActive}
                progress={progress}
            />
        </>
    );
}
