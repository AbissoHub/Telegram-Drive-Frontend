import * as React from 'react';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import Box from '@mui/joy/Box';
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
                <th>
                    <Typography level="title-sm">Name</Typography>
                </th>
                <th>
                    <Typography level="title-sm" endDecorator={<ArrowDropDownRoundedIcon />}>
                        Last modified
                    </Typography>
                </th>
                <th>
                    <Typography level="title-sm">Size</Typography>
                </th>
                <th>
                    <Typography level="title-sm">Actions</Typography>
                </th>
            </tr>
            </thead>
            <tbody>
            {files.map((file, index) => (
                <tr
                    key={index}
                    onClick={() => file.type === 'file' && onFileClick(file)}
                    style={{ cursor: file.type === 'file' ? 'pointer' : 'default' }}
                >
                    <td>
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
                            onClick={() => file.type === 'folder' && onFolderClick(file.name)}
                        >
                            {file.name}
                        </Typography>
                    </td>
                    <td>
                        <Typography level="body-sm">{file.modified}</Typography>
                    </td>
                    <td>
                        <Typography level="body-sm">{file.size}</Typography>
                    </td>
                    <td>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton variant="plain" color="neutral" size="sm" aria-label="Download">
                                <DownloadRoundedIcon />
                            </IconButton>
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
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
}
