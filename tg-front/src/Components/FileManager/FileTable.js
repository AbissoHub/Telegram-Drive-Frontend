import * as React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
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
import FileActionsModal from './FileActionsModal'; // Importa il modal
import { useSession } from '../SessionContext';

const StyledTh = styled('th')({});
const StyledTd = styled('td')({});

export default function FileTable({ files, onFileClick, onFolderClick, baseUrl }) {
    const [openModal, setOpenModal] = React.useState(false);
    const [modalType, setModalType] = React.useState('');
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [newName, setNewName] = React.useState('');

    const handleOpenModal = (type, file) => {
        setModalType(type);
        setSelectedFile(file);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setModalType('');
        setSelectedFile(null);
        setNewName('');
    };

    const handleRename = () => {
        if (!selectedFile) return;
        const fetchPromise = axios.post(`${baseUrl["baseUrl"]}/rename-file`, {
            type_cluster: 'type_cluster_placeholder',
            file_id: selectedFile.id,
            new_name: newName
        });

        toast.promise(fetchPromise, {
            loading: 'Renaming file...',
            success: (result) => result.data.message || 'File renamed successfully!',
            error: (error) => error.message || 'Failed to rename file.',
        });

        fetchPromise.finally(handleCloseModal);
    };

    const handleDelete = () => {
        if (!selectedFile) return;
        const fetchPromise = axios.post(`${baseUrl["baseUrl"]}/move-to-trash`, {
            type_cluster: 'type_cluster_placeholder',
            file_id: selectedFile.id
        });

        toast.promise(fetchPromise, {
            loading: 'Deleting file...',
            success: (result) => result.data.message || 'File deleted successfully!',
            error: (error) => error.message || 'Failed to delete file.',
        });

        fetchPromise.finally(handleCloseModal);
    };

    const handleDownload = (file) => {
        const fetchPromise = axios.post(`${baseUrl["baseUrl"]}/download`, {
            cluster_id: 'cluster_id_placeholder',
            file_id: file.id,
            dest: 'destination_placeholder',
            name_file: file.name
        });

        toast.promise(fetchPromise, {
            loading: 'Downloading file...',
            success: (result) => result.data.message || 'File downloaded successfully!',
            error: (error) => error.message || 'Failed to download file.',
        });
    };

    const handleMove = (file) => {
        handleOpenModal('move', file);
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
                                                handleMove(file);
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

            {/* Modal per azioni */}
            <FileActionsModal
                open={openModal}
                modalType={modalType}
                onClose={handleCloseModal}
                onRename={handleRename}
                onDelete={handleDelete}
                selectedFile={selectedFile}
                newName={newName}
                setNewName={setNewName}
            />
        </>
    );
}
