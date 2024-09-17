import React, { useState, useEffect, useMemo, useRef } from 'react';
import BreadcrumbsNav from './BreadcrumbsNav';
import FileTable from './FileTable';
import FileActionsModal from './FileActionsModal';
import { toast } from 'sonner';
import { useSession } from '../SessionContext';

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

export default function FileManager({ onFileClick, selectedSection, baseUrl }) {
    const [data, setData] = useState([]);
    const [fileSystem, setFileSystem] = useState(null);
    const [currentPath, setCurrentPath] = useState([]);
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [newName, setNewName] = useState('');
    const hasFetchedInitially = useRef(false);


    const { token, clusterIdPrivate, clusterIdPublic } = useSession();
    const rootFolderName =
        selectedSection === 'myFiles'
            ? 'MyFiles'
            : selectedSection === 'sharedFiles'
                ? 'SharedFiles'
                : 'Trash';

    useEffect(() => {

        const fetchData = async () => {
            const url =
                selectedSection === 'sharedFiles'
                    ? `${baseUrl["baseUrl"]}/get-all-files-public`
                    : `${baseUrl["baseUrl"]}/get-all-files`;

            const clusterId = selectedSection === 'sharedFiles' ? clusterIdPublic : clusterIdPrivate;

            // Crea una funzione per gestire la richiesta fetch
            const fetchPromise = fetch(url, {
                method: 'POST', // Metodo POST
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cluster_id: clusterId }),
            });

            fetchPromise
                .then((response) => {
                    if (response.ok && response.status !== 204) {
                        return response.json();
                    } else {
                        throw new Error('Failed to fetch files');
                    }
                })
                .then((result) => {
                    if (result && result.status === 'success') {
                        setData(result.data);
                    } else if (result) {
                        throw new Error(result.message || 'Failed to fetch files');
                    }
                    return result;
                })
                .catch((error) => {
                    console.error(error);
                    throw error;
                });

            toast.promise(fetchPromise, {
                loading: 'Fetching files...',
                success: (result) => result.message || 'Files fetched successfully!',
                error: (error) => error.message || 'Failed to fetch files.',
            });
        };

        // Esegui la funzione solo se non è stata già eseguita al montaggio
        if (!hasFetchedInitially.current && token) {
            fetchData();
            hasFetchedInitially.current = true; // Segna che la prima esecuzione è stata completata
        } else if (token) {
            // Esegui fetchData solo per cambiamenti in `selectedSection`
            fetchData();
        }
    }, [selectedSection]); // Assicurati che `token` sia incluso nelle dipendenze




    // Build the file system when data changes
    useEffect(() => {
        setCurrentPath([rootFolderName]);
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
        // Implementa la logica per rinominare
        handleCloseModal();
    };

    const handleDelete = () => {
        // Implementa la logica per eliminare
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
                baseUrl={baseUrl}
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
