import React, { useState, useEffect, useMemo } from 'react';
import BreadcrumbsNav from './BreadcrumbsNav';
import FileTable from './FileTable';
import FileActionsModal from './FileActionsModal';

// Funzione per formattare la data
function formatModifiedDate(dateStr) {
    const date = new Date(dateStr);
    const options = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    };
    return date.toLocaleString('it-IT', options);
}

// Funzione per formattare la dimensione del file
function formatSize(sizeInMB) {
    if (sizeInMB >= 1024) {
        return (sizeInMB / 1024).toFixed(1) + 'GB';
    } else if (sizeInMB >= 1) {
        return sizeInMB.toFixed(1) + 'MB';
    } else {
        return (sizeInMB * 1024).toFixed(1) + 'KB';
    }
}

// Funzione per costruire la struttura del file system dai dati
function buildFileSystem(data, rootFolderName) {
    const rootFolder = {
        type: 'folder',
        name: rootFolderName,
        modified: '',
        size: '',
        owner: [],
        contents: {},
    };

    data.forEach((item) => {
        let path = item.locate_media.replace(/^\.\//, '');
        let name = item.media_name;

        if (item.is_folder) {
            if (name === 'None') {
                const pathParts = path.split('/').filter(Boolean);
                if (pathParts.length > 0) {
                    name = pathParts.pop();
                    path = pathParts.join('/');
                } else {
                    name = rootFolderName;
                    path = '';
                }
            }
        } else {
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
                currentFolder.contents[part] = {
                    type: 'file',
                    name: part,
                    modified: formatModifiedDate(item.date),
                    size: formatSize(item.media_size),
                    owner: [],
                };
            } else {
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
                    currentFolder = currentFolder.contents[part];
                } else {
                    console.warn(`Expected a folder at ${part}, but found a file.`);
                    break;
                }
            }
        }
    });

    return rootFolder;
}

// Funzione helper per ottenere la cartella corrente in base al percorso
function getFolderFromPath(root, path) {
    let currentFolder = root;
    for (let i = 1; i < path.length; i++) {
        const folderName = path[i];
        if (
            currentFolder.contents[folderName] &&
            currentFolder.contents[folderName].type === 'folder'
        ) {
            currentFolder = currentFolder.contents[folderName];
        } else {
            return null;
        }
    }
    return currentFolder;
}

export default function FileManager({ onFileClick, selectedSection }) {
    const [data, setData] = useState([]);
    const [fileSystem, setFileSystem] = useState(null);
    const [currentPath, setCurrentPath] = useState([]);
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [newName, setNewName] = useState('');

    const rootFolderName =
        selectedSection === 'myFiles'
            ? 'MyFiles'
            : selectedSection === 'sharedFiles'
                ? 'SharedFiles'
                : 'Trash';

    // Fetch data when selectedSection changes
    // Fetch data when selectedSection changes
    React.useEffect(() => {
        // Reset current path
        setCurrentPath([rootFolderName]);

        // Simulate data fetching
        const fetchData = async () => {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Simulate data for each section
            let sectionData = []

            if (selectedSection === 'myFiles') {
                // Use your responseData as an example
                sectionData = [
                    // Root level files
                    {
                        id_message: '20001',
                        media_name: 'rootFile1.txt',
                        locate_media: './',
                        media_size: 0.5,
                        media_type: 'text/plain',
                        message_text: 'rootFile1.txt@./',
                        date: '2024-09-14T10:00:00',
                        is_folder: false,
                    },
                    {
                        id_message: '20002',
                        media_name: 'rootFile2.docx',
                        locate_media: './',
                        media_size: 1.2,
                        media_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        message_text: 'rootFile2.docx@./',
                        date: '2024-09-14T11:00:00',
                        is_folder: false,
                    },
                    // First-level folder
                    {
                        id_message: '-1',
                        media_name: 'None',
                        locate_media: './Documents',
                        media_size: 0,
                        media_type: 'None',
                        message_text: 'None',
                        date: '2024-09-14T09:00:00',
                        is_folder: true,
                    },
                    // Files in Documents folder
                    {
                        id_message: '20003',
                        media_name: 'resume.pdf',
                        locate_media: './Documents',
                        media_size: 0.8,
                        media_type: 'application/pdf',
                        message_text: 'resume.pdf@./Documents',
                        date: '2024-09-13T14:00:00',
                        is_folder: false,
                    },
                    {
                        id_message: '20004',
                        media_name: 'cover_letter.pdf',
                        locate_media: './Documents',
                        media_size: 0.6,
                        media_type: 'application/pdf',
                        message_text: 'cover_letter.pdf@./Documents',
                        date: '2024-09-13T15:00:00',
                        is_folder: false,
                    },
                    // Second-level folder inside Documents
                    {
                        id_message: '-1',
                        media_name: 'None',
                        locate_media: './Documents/Work',
                        media_size: 0,
                        media_type: 'None',
                        message_text: 'None',
                        date: '2024-09-13T12:00:00',
                        is_folder: true,
                    },
                    // Files in Documents/Work folder
                    {
                        id_message: '20005',
                        media_name: 'project_plan.xlsx',
                        locate_media: './Documents/Work',
                        media_size: 2.5,
                        media_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        message_text: 'project_plan.xlsx@./Documents/Work',
                        date: '2024-09-12T10:30:00',
                        is_folder: false,
                    },
                    {
                        id_message: '20006',
                        media_name: 'budget.xlsx',
                        locate_media: './Documents/Work',
                        media_size: 1.9,
                        media_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        message_text: 'budget.xlsx@./Documents/Work',
                        date: '2024-09-12T11:00:00',
                        is_folder: false,
                    },
                    // Third-level folder inside Documents/Work
                    {
                        id_message: '-1',
                        media_name: 'None',
                        locate_media: './Documents/Work/Reports',
                        media_size: 0,
                        media_type: 'None',
                        message_text: 'None',
                        date: '2024-09-11T09:00:00',
                        is_folder: true,
                    },
                    // Files in Documents/Work/Reports folder
                    {
                        id_message: '20007',
                        media_name: 'report1.pdf',
                        locate_media: './Documents/Work/Reports',
                        media_size: 0.7,
                        media_type: 'application/pdf',
                        message_text: 'report1.pdf@./Documents/Work/Reports',
                        date: '2024-09-10T16:00:00',
                        is_folder: false,
                    },
                    {
                        id_message: '20008',
                        media_name: 'report2.pdf',
                        locate_media: './Documents/Work/Reports',
                        media_size: 0.9,
                        media_type: 'application/pdf',
                        message_text: 'report2.pdf@./Documents/Work/Reports',
                        date: '2024-09-10T17:00:00',
                        is_folder: false,
                    },
                    // Another first-level folder
                    {
                        id_message: '-1',
                        media_name: 'None',
                        locate_media: './Pictures',
                        media_size: 0,
                        media_type: 'None',
                        message_text: 'None',
                        date: '2024-09-14T08:00:00',
                        is_folder: true,
                    },
                    // Files in Pictures folder
                    {
                        id_message: '20009',
                        media_name: 'vacation_photo1.jpg',
                        locate_media: './Pictures',
                        media_size: 3.2,
                        media_type: 'image/jpeg',
                        message_text: 'vacation_photo1.jpg@./Pictures',
                        date: '2024-09-01T10:00:00',
                        is_folder: false,
                    },
                    {
                        id_message: '20010',
                        media_name: 'vacation_photo2.jpg',
                        locate_media: './Pictures',
                        media_size: 2.8,
                        media_type: 'image/jpeg',
                        message_text: 'vacation_photo2.jpg@./Pictures',
                        date: '2024-09-01T11:00:00',
                        is_folder: false,
                    },
                    // Second-level folder inside Pictures
                    {
                        id_message: '-1',
                        media_name: 'None',
                        locate_media: './Pictures/Family',
                        media_size: 0,
                        media_type: 'None',
                        message_text: 'None',
                        date: '2024-09-05T09:00:00',
                        is_folder: true,
                    },
                    // Files in Pictures/Family folder
                    {
                        id_message: '20011',
                        media_name: 'family_photo1.jpg',
                        locate_media: './Pictures/Family',
                        media_size: 2.5,
                        media_type: 'image/jpeg',
                        message_text: 'family_photo1.jpg@./Pictures/Family',
                        date: '2024-09-05T10:00:00',
                        is_folder: false,
                    },
                    {
                        id_message: '20012',
                        media_name: 'family_photo2.jpg',
                        locate_media: './Pictures/Family',
                        media_size: 2.6,
                        media_type: 'image/jpeg',
                        message_text: 'family_photo2.jpg@./Pictures/Family',
                        date: '2024-09-05T11:00:00',
                        is_folder: false,
                    },
                    // Cartella aggiuntiva con file
                    {
                        id_message: '-1',
                        media_name: 'None',
                        locate_media: './Videos',
                        media_size: 0,
                        media_type: 'None',
                        message_text: 'None',
                        date: '2024-09-08T09:00:00',
                        is_folder: true,
                    },
                    {
                        id_message: '20013',
                        media_name: 'video1.mp4',
                        locate_media: './Videos',
                        media_size: 700,
                        media_type: 'video/mp4',
                        message_text: 'video1.mp4@./Videos',
                        date: '2024-09-08T10:00:00',
                        is_folder: false,
                    },
                    {
                        id_message: '20014',
                        media_name: 'video2.mp4',
                        locate_media: './Videos',
                        media_size: 850,
                        media_type: 'video/mp4',
                        message_text: 'video2.mp4@./Videos',
                        date: '2024-09-08T11:00:00',
                        is_folder: false,
                    },
                    // Terzo livello di cartelle
                    {
                        id_message: '-1',
                        media_name: 'None',
                        locate_media: './Videos/Edited',
                        media_size: 0,
                        media_type: 'None',
                        message_text: 'None',
                        date: '2024-09-09T12:00:00',
                        is_folder: true,
                    },
                    {
                        id_message: '20015',
                        media_name: 'edited_video1.mp4',
                        locate_media: './Videos/Edited',
                        media_size: 500,
                        media_type: 'video/mp4',
                        message_text: 'edited_video1.mp4@./Videos/Edited',
                        date: '2024-09-09T13:00:00',
                        is_folder: false,
                    },
                ];
            } else if (selectedSection === 'sharedFiles') {
                // Dati simulati per "Shared files"
                sectionData = [
                    {
                        id_message: '30001',
                        media_name: 'sharedDoc1.pdf',
                        locate_media: './',
                        media_size: 1.0,
                        media_type: 'application/pdf',
                        message_text: 'sharedDoc1.pdf@./',
                        date: '2024-09-15T10:00:00',
                        is_folder: false,
                    },
                    {
                        id_message: '30002',
                        media_name: 'sharedPresentation.pptx',
                        locate_media: './',
                        media_size: 2.5,
                        media_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                        message_text: 'sharedPresentation.pptx@./',
                        date: '2024-09-15T11:00:00',
                        is_folder: false,
                    },
                    {
                        id_message: '-1',
                        media_name: 'None',
                        locate_media: './TeamProjects',
                        media_size: 0,
                        media_type: 'None',
                        message_text: 'None',
                        date: '2024-09-15T09:00:00',
                        is_folder: true,
                    },
                    {
                        id_message: '30003',
                        media_name: 'team_notes.docx',
                        locate_media: './TeamProjects',
                        media_size: 1.2,
                        media_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        message_text: 'team_notes.docx@./TeamProjects',
                        date: '2024-09-14T10:00:00',
                        is_folder: false,
                    },
                    {
                        id_message: '-1',
                        media_name: 'None',
                        locate_media: './TeamProjects/Designs',
                        media_size: 0,
                        media_type: 'None',
                        message_text: 'None',
                        date: '2024-09-14T11:00:00',
                        is_folder: true,
                    },
                    {
                        id_message: '30004',
                        media_name: 'logo_design.png',
                        locate_media: './TeamProjects/Designs',
                        media_size: 2.0,
                        media_type: 'image/png',
                        message_text: 'logo_design.png@./TeamProjects/Designs',
                        date: '2024-09-13T12:00:00',
                        is_folder: false,
                    },
                    // Altri file e cartelle
                    {
                        id_message: '-1',
                        media_name: 'None',
                        locate_media: './SharedMusic',
                        media_size: 0,
                        media_type: 'None',
                        message_text: 'None',
                        date: '2024-09-12T08:00:00',
                        is_folder: true,
                    },
                    {
                        id_message: '30005',
                        media_name: 'collab_song.mp3',
                        locate_media: './SharedMusic',
                        media_size: 6.0,
                        media_type: 'audio/mpeg',
                        message_text: 'collab_song.mp3@./SharedMusic',
                        date: '2024-09-12T09:00:00',
                        is_folder: false,
                    },
                ];
            } else if (selectedSection === 'trash') {
                // Dati simulati per "Trash"
                sectionData = [
                    {
                        id_message: '40001',
                        media_name: 'deletedFile1.txt',
                        locate_media: './',
                        media_size: 0.5,
                        media_type: 'text/plain',
                        message_text: 'deletedFile1.txt@./',
                        date: '2024-09-13T10:00:00',
                        is_folder: false,
                    },
                    {
                        id_message: '40002',
                        media_name: 'old_resume.pdf',
                        locate_media: './',
                        media_size: 0.8,
                        media_type: 'application/pdf',
                        message_text: 'old_resume.pdf@./',
                        date: '2024-09-12T09:00:00',
                        is_folder: false,
                    },
                    {
                        id_message: '-1',
                        media_name: 'None',
                        locate_media: './OldProjects',
                        media_size: 0,
                        media_type: 'None',
                        message_text: 'None',
                        date: '2024-09-11T08:00:00',
                        is_folder: true,
                    },
                    {
                        id_message: '40003',
                        media_name: 'old_project.zip',
                        locate_media: './OldProjects',
                        media_size: 15.0,
                        media_type: 'application/zip',
                        message_text: 'old_project.zip@./OldProjects',
                        date: '2024-09-10T07:00:00',
                        is_folder: false,
                    },
                    // Altri file cancellati
                    {
                        id_message: '40004',
                        media_name: 'unused_image.png',
                        locate_media: './',
                        media_size: 1.5,
                        media_type: 'image/png',
                        message_text: 'unused_image.png@./',
                        date: '2024-09-09T06:00:00',
                        is_folder: false,
                    },
                ];
            }

            // Set data
            setData(sectionData);
        };

        fetchData();
    }, [selectedSection]);

    // Build the file system when data changes
    useEffect(() => {
        const newFileSystem = buildFileSystem(data, rootFolderName);
        setFileSystem(newFileSystem);
    }, [data, rootFolderName]);

    const currentFolder = useMemo(() => {
        if (!fileSystem) return null;
        return getFolderFromPath(fileSystem, currentPath);
    }, [fileSystem, currentPath]);

    const files = currentFolder ? Object.values(currentFolder.contents) : [];

    const sortedFiles = useMemo(() => {
        const folders = files
            .filter((item) => item.type === 'folder')
            .sort((a, b) => a.name.localeCompare(b.name));
        const filesOnly = files
            .filter((item) => item.type === 'file')
            .sort((a, b) => a.name.localeCompare(b.name));
        return [...folders, ...filesOnly];
    }, [files]);

    const handleOpenModal = (type, file) => {
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
        // Implement rename logic
        handleCloseModal();
    };

    const handleDelete = () => {
        // Implement delete logic
        handleCloseModal();
    };

    const handleFolderClick = (folderName) => {
        setCurrentPath([...currentPath, folderName]);
    };

    const handleBreadcrumbClick = (index) => {
        setCurrentPath(currentPath.slice(0, index + 1));
    };

    return (
        <div>
            <BreadcrumbsNav
                currentPath={currentPath}
                onBreadcrumbClick={handleBreadcrumbClick}
            />
            <FileTable
                files={sortedFiles}
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
