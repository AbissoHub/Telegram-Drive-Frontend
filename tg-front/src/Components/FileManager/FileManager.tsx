import * as React from 'react';
import BreadcrumbsNav from './BreadcrumbsNav.tsx';
import FileTable from './FileTable.tsx';
import FileActionsModal from './FileActionsModal.tsx';

// Type definitions for File and Folder
type FileItem = {
    type: 'file';
    name: string;
    modified: string;
    size: string;
    owner: { avatar: string }[];
};

type FolderItem = {
    type: 'folder';
    name: string;
    modified: string;
    size: string;
    owner: { avatar: string }[];
    contents: Record<string, FileItem | FolderItem>;
};

// Type for the data items provided
type DataItem = {
    id_message: string;
    media_name: string;
    locate_media: string;
    media_size: number;
    media_type: string;
    message_text: string;
    date: string;
    is_folder: boolean;
};

// Function to format the date
function formatModifiedDate(dateStr: string): string {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    };
    return date.toLocaleString('it-IT', options);
}

// Function to format the file size
function formatSize(sizeInMB: number): string {
    if (sizeInMB >= 1024) {
        return (sizeInMB / 1024).toFixed(1) + 'GB';
    } else if (sizeInMB >= 1) {
        return sizeInMB.toFixed(1) + 'MB';
    } else {
        return (sizeInMB * 1024).toFixed(1) + 'KB';
    }
}

// Function to build the file system structure from the data
function buildFileSystem(data: DataItem[]): FolderItem {
    const rootFolder: FolderItem = {
        type: 'folder',
        name: 'MyFiles',
        modified: '',
        size: '',
        owner: [],
        contents: {},
    };

    data.forEach((item) => {
        let path = item.locate_media.replace(/^\.\//, '');
        let name = item.media_name;

        if (item.is_folder) {
            // For folders, get the folder name from the path if media_name is 'None'
            if (name === 'None') {
                const pathParts = path.split('/').filter(Boolean);
                if (pathParts.length > 0) {
                    name = pathParts.pop()!;
                    path = pathParts.join('/');
                } else {
                    name = 'MyFiles';
                    path = '';
                }
            }
        } else {
            // For files, skip if media_name is 'None'
            if (name === 'None') {
                return;
            }
        }

        const fullPath = path ? `${path}/${name}` : name;
        const pathParts = fullPath.split('/').filter(Boolean);

        let currentFolder = rootFolder;

        for (let i = 0; i < pathParts.length; i++) {
            const part = pathParts[i];
            const isLastPart = i === pathParts.length - 1;

            if (isLastPart && !item.is_folder) {
                // It's a file
                currentFolder.contents[part] = {
                    type: 'file',
                    name: part,
                    modified: formatModifiedDate(item.date),
                    size: formatSize(item.media_size),
                    owner: [],
                };
            } else {
                // It's a folder
                if (!currentFolder.contents[part]) {
                    currentFolder.contents[part] = {
                        type: 'folder',
                        name: part,
                        modified: isLastPart ? formatModifiedDate(item.date) : '',
                        size: '',
                        owner: [],
                        contents: {},
                    };
                }

                if (currentFolder.contents[part].type === 'folder') {
                    currentFolder = currentFolder.contents[part] as FolderItem;
                } else {
                    console.warn(`Expected a folder at ${part}, but found a file.`);
                    break;
                }
            }
        }
    });

    return rootFolder;
}

// Helper function to get the current folder based on the path
function getFolderFromPath(root: FolderItem, path: string[]): FolderItem | null {
    let currentFolder = root;
    for (let i = 1; i < path.length; i++) {
        const folderName = path[i];
        if (
            currentFolder.contents[folderName] &&
            currentFolder.contents[folderName].type === 'folder'
        ) {
            currentFolder = currentFolder.contents[folderName] as FolderItem;
        } else {
            return null;
        }
    }
    return currentFolder;
}

export default function FileManager({ onFileClick }) {
    // Replace this with your actual data fetching logic
    const responseData = {
        status: 'success',
        message: 'Get all files successfully',
        data: [
            {
                id_message: '13528',
                media_name: 'sample.pdf',
                locate_media: './test/upload',
                media_size: 0.02,
                media_type: 'application/pdf',
                message_text: 'sample.pdf@./test/upload',
                date: '2024-07-27T09:40:54',
                is_folder: false,
            },
            {
                id_message: '13410',
                media_name: 'ano1.jpg',
                locate_media: './',
                media_size: 0.03,
                media_type: 'image/jpeg',
                message_text: 'ano1.jpg@./@all',
                date: '2024-07-18T20:01:52',
                is_folder: false,
            },
            {
                id_message: -1,
                media_name: 'None',
                locate_media: './test/upload',
                media_size: 0,
                media_type: 'None',
                message_text: 'None',
                date: '2024-09-12T17:36:45',
                is_folder: true,
            },
            {
                id_message: -1,
                media_name: 'None',
                locate_media: './aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                media_size: 0,
                media_type: 'None',
                message_text: 'None',
                date: '2024-09-12T17:38:43',
                is_folder: true,
            },
        ],
    };

    const data: DataItem[] = responseData.data;

    // Build the file system from the data
    const fileSystem = React.useMemo(() => buildFileSystem(data), [data]);

    const [currentPath, setCurrentPath] = React.useState<string[]>(['MyFiles']);
    const [open, setOpen] = React.useState(false);
    const [modalType, setModalType] = React.useState('');
    const [selectedFile, setSelectedFile] = React.useState<FileItem | FolderItem | null>(null);
    const [newName, setNewName] = React.useState('');

    const currentFolder = React.useMemo(() => {
        return getFolderFromPath(fileSystem, currentPath);
    }, [fileSystem, currentPath]);

    const files = currentFolder ? Object.values(currentFolder.contents) : [];

    const handleOpenModal = (type: string, file: FileItem | FolderItem) => {
        setModalType(type);
        setSelectedFile(file);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setModalType('');
        setSelectedFile(null);
        setNewName('');
    };

    const handleRename = () => {
        // Implement rename logic here
        handleCloseModal();
    };

    const handleDelete = () => {
        // Implement delete logic here
        handleCloseModal();
    };

    const handleFolderClick = (folderName: string) => {
        setCurrentPath([...currentPath, folderName]);
    };

    const handleBreadcrumbClick = (index: number) => {
        setCurrentPath(currentPath.slice(0, index + 1));
    };

    return (
        <div>
            <BreadcrumbsNav currentPath={currentPath} onBreadcrumbClick={handleBreadcrumbClick} />
            <FileTable
                files={files}
                onFileClick={onFileClick}
                onFolderClick={handleFolderClick}
                onOpenModal={handleOpenModal}
            />
            <FileActionsModal
                open={open}
                modalType={modalType}
                onClose={handleCloseModal}
                onRename={handleRename}
                onDelete={handleDelete}
                selectedFile={selectedFile}
                newName={newName}
                setNewName={setNewName}
            />
        </div>
    );
}
