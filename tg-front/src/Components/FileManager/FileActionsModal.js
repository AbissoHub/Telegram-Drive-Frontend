import * as React from 'react';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import {LinearProgress} from "@mui/joy";

export default function FileActionsModal({
                                             open,
                                             modalType,
                                             onClose,
                                             onRename,
                                             onDelete,
                                             onMove,
                                             onDownload,
                                             selectedFile,
                                             newName,
                                             setNewName,
                                             newLocation,
                                             setNewLocation,
                                             availableLocations,
                                             folderHandle,
                                             setFolderHandle,
                                             setProgress,
                                             setIsDownloadActive,
                                             isDownloadActive,
                                             progress
                                         }) {
    const fileName = selectedFile?.name || '';
    const lastDotIndex = fileName.lastIndexOf('.');
    const fileExtension = lastDotIndex !== -1 ? fileName.slice(lastDotIndex + 1) : '';
    const baseName = lastDotIndex !== -1 ? fileName.slice(0, lastDotIndex) : fileName;

    const isValidName = (name) => /^[a-zA-Z0-9\s._-]+$/.test(name);

    const handleRename = () => {
        if (selectedFile?.type === 'file') {
            const sanitizedNewName = newName.trim();
            const updatedFileName = `${sanitizedNewName}.${fileExtension}`;
            onRename(updatedFileName);
        } else {
            onRename(newName.trim());
        }
    };

    const handleSelectFolder = async () => {
        if (window.showDirectoryPicker) {
            try {
                const handle = await window.showDirectoryPicker();
                setFolderHandle(handle);
            } catch (error) {
                console.error('Error selecting folder :', error);
            }
        } else {
            alert('Your browser doesn\' support folder picker');
        }
    };


    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog>
                {modalType === 'rename' && (
                    <>
                        <DialogTitle>{selectedFile?.type === 'folder' ? 'Rinomina Cartella' : 'Rinomina File'}</DialogTitle>
                        <DialogContent>
                            <form onSubmit={(event) => {
                                event.preventDefault();
                                handleRename();
                            }}>
                                <Stack spacing={2}>
                                    <FormControl>
                                        <FormLabel>Nuovo Nome</FormLabel>
                                        <Stack direction="row" spacing={1}>
                                            <Input
                                                autoFocus
                                                required
                                                value={newName.split(".")[0]}
                                                onChange={(e) => setNewName(e.target.value)}
                                                placeholder={baseName || "Inserisci nuovo nome"}
                                                error={!isValidName(newName)}
                                                helperText={!isValidName(newName) ? "Sono consentiti solo caratteri alfanumerici, spazi, underscore, punti e trattini" : ""}
                                            />
                                            {selectedFile?.type === 'file' && (
                                                <Input
                                                    value={fileExtension ? `.${fileExtension}` : ''}
                                                    disabled
                                                    sx={{ width: 'auto' }}
                                                />
                                            )}
                                        </Stack>
                                    </FormControl>
                                    <Button type="submit" disabled={!isValidName(newName)}>Rinomina</Button>
                                </Stack>
                            </form>
                        </DialogContent>
                    </>
                )}

                {modalType === 'delete' && (
                    <>
                        <DialogTitle>Elimina {selectedFile?.type === 'folder' ? 'Cartella' : 'File'}</DialogTitle>
                        <DialogContent>Sei sicuro di voler eliminare questa {selectedFile?.type === 'folder' ? 'cartella' : 'file'}?</DialogContent>
                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="flex-end"
                            sx={{ p: 2 }}
                        >
                            <Button variant="plain" onClick={onClose}>Annulla</Button>
                            <Button variant="solid" color="danger" onClick={onDelete}>Elimina</Button>
                        </Stack>
                    </>
                )}

                {modalType === 'move' && (
                    <>
                        <DialogTitle>Sposta File</DialogTitle>
                        <DialogContent>
                            <form onSubmit={(event) => { event.preventDefault(); onMove(); }}>
                                <Stack spacing={2}>
                                    <FormControl>
                                        <FormLabel>Nuova Posizione</FormLabel>
                                        <Select
                                            autoFocus
                                            required
                                            value={newLocation}
                                            onChange={(e, newValue) => setNewLocation(newValue)}
                                            placeholder="Seleziona nuova posizione"
                                        >
                                            {availableLocations
                                                .filter(location => location.name && location.path)
                                                .map((location) => (
                                                    <Option key={location.path} value={location.path}>
                                                        {location.name}
                                                    </Option>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <Button type="submit">Sposta</Button>
                                </Stack>
                            </form>
                        </DialogContent>
                    </>
                )}

                {modalType === 'download' && (
                    <>
                        <DialogTitle>Download File</DialogTitle>
                        <DialogContent>
                            <Stack spacing={2}>
                                <form onSubmit={(event) => {
                                    event.preventDefault();
                                    onDownload();
                                }}>
                                    <Stack spacing={2}>
                                        <FormControl>
                                            <FormLabel>Nome del file</FormLabel>
                                            <Stack direction="row" spacing={1}>
                                                <Input
                                                    required
                                                    value={newName}
                                                    onChange={(e) => setNewName(e.target.value)}
                                                    placeholder={baseName || "Inserisci il nome del file"}
                                                    error={!isValidName(newName)}
                                                    helperText={!isValidName(newName) ? "Sono consentiti solo caratteri alfanumerici, spazi, underscore, punti e trattini" : ""}
                                                />
                                            </Stack>
                                        </FormControl>
                                        {isDownloadActive && (
                                            <LinearProgress variant="determinate" value={progress} />
                                        )}
                                        <Button type="submit" disabled={!isValidName(newName) || isDownloadActive}>
                                            {isDownloadActive ? `Download in corso: ${progress}%` : "Download"}
                                        </Button>
                                    </Stack>
                                </form>
                            </Stack>
                        </DialogContent>
                    </>
                )}


            </ModalDialog>
        </Modal>
    );
}