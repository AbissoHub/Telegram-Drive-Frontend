import * as React from 'react';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import Box from '@mui/joy/Box';
import { styled } from '@mui/joy/styles'; // Import styled
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';

interface FileItem {
    type: 'file';
    name: string;
    modified: string;
    size: string;
    owner: { avatar: string }[];
}

interface FolderItem {
    type: 'folder';
    name: string;
    modified: string;
    size: string;
    owner: { avatar: string }[];
    contents: Record<string, FileItem | FolderItem>;
}

interface FileTableProps {
    files: (FileItem | FolderItem)[];
    onFileClick: (file: FileItem) => void;
    onFolderClick: (folderName: string) => void;
    onOpenModal: (type: string, item: FileItem | FolderItem) => void;
}

// Create styled components
const StyledTh = styled('th')({});
const StyledTd = styled('td')({});

export default function FileTable({
                                      files,
                                      onFileClick,
                                      onFolderClick,
                                      onOpenModal,
                                  }: FileTableProps) {
    return (
        <Table hoverRow size="sm" borderAxis="none" variant="soft">
            <thead>
            <tr>
                <StyledTh>
                    <Typography level="title-sm">Name</Typography>
                </StyledTh>
                <StyledTh
                    sx={{
                        display: { xs: 'none', sm: 'table-cell' },
                    }}
                >
                    <Typography level="title-sm" endDecorator={<ArrowDropDownRoundedIcon />}>
                        Last modified
                    </Typography>
                </StyledTh>
                <StyledTh
                    sx={{
                        display: { xs: 'none', sm: 'table-cell' },
                    }}
                >
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
                    <StyledTd
                        sx={{
                            display: { xs: 'none', sm: 'table-cell' },
                        }}
                    >
                        <Typography level="body-sm">{file.modified}</Typography>
                    </StyledTd>
                    <StyledTd
                        sx={{
                            display: { xs: 'none', sm: 'table-cell' },
                        }}
                    >
                        <Typography level="body-sm">{file.size}</Typography>
                    </StyledTd>
                    <StyledTd>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {file.type === 'file' && (
                                <IconButton
                                    variant="plain"
                                    color="neutral"
                                    size="sm"
                                    aria-label="Download"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        // Implementa qui la logica di download
                                    }}
                                >
                                    <DownloadRoundedIcon />
                                </IconButton>
                            )}
                            <IconButton
                                variant="plain"
                                color="neutral"
                                size="sm"
                                aria-label="Rename"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onOpenModal('rename', file);
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
                                    onOpenModal('delete', file);
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
    );
}
