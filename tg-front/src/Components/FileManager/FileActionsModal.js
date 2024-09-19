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

export default function FileActionsModal({
                                             open,
                                             modalType,
                                             onClose,
                                             onRename,
                                             onDelete,
                                             onMove,
                                             selectedFile,
                                             newName,
                                             setNewName,
                                             newLocation,
                                             setNewLocation,
                                             availableLocations
                                         }) {

    const fileName = selectedFile?.name || '';
    const lastDotIndex = fileName.lastIndexOf('.');
    const fileExtension = lastDotIndex !== -1 ? fileName.slice(lastDotIndex + 1) : '';
    const baseName = lastDotIndex !== -1 ? fileName.slice(0, lastDotIndex) : fileName;

    const handleRename = () => {
        const sanitizedNewName = newName.split('.').slice(0, -1).join('.') || newName;
        const updatedFileName = `${sanitizedNewName}.${fileExtension}`;
        onRename(updatedFileName);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog>
                {modalType === 'rename' && (
                    <>
                        <DialogTitle>Rename File</DialogTitle>
                        <DialogContent>
                            <form onSubmit={(event) => {
                                event.preventDefault();
                                handleRename();
                            }}>
                                <Stack spacing={2}>
                                    <FormControl>
                                        <FormLabel>New Name</FormLabel>
                                        <Stack direction="row" spacing={1}>
                                            {/* Input per modificare solo il nome del file */}
                                            <Input
                                                autoFocus
                                                required
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                placeholder={baseName || "Enter new name"}
                                            />
                                            {/* Input disabilitato per mostrare l'estensione */}
                                            <Input
                                                value={fileExtension ? `.${fileExtension}` : ''}
                                                disabled
                                                sx={{ width: 'auto' }}
                                            />
                                        </Stack>
                                    </FormControl>
                                    <Button type="submit">Rename</Button>
                                </Stack>
                            </form>
                        </DialogContent>
                    </>
                )}

                {modalType === 'delete' && (
                    <>
                        <DialogTitle>Delete File</DialogTitle>
                        <DialogContent>Are you sure you want to delete this file?</DialogContent>
                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="flex-end"
                            sx={{ p: 2 }}
                        >
                            <Button variant="plain" onClick={onClose}>Cancel</Button>
                            <Button variant="solid" color="danger" onClick={onDelete}>Delete</Button>
                        </Stack>
                    </>
                )}

                {modalType === 'move' && (
                    <>
                        <DialogTitle>Move File</DialogTitle>
                        <DialogContent>
                            <form onSubmit={(event) => { event.preventDefault(); onMove(); }}>
                                <Stack spacing={2}>
                                    <FormControl>
                                        <FormLabel>New Location</FormLabel>
                                        <Select
                                            autoFocus
                                            required
                                            value={newLocation}
                                            onChange={(e, newValue) => setNewLocation(newValue)}
                                            placeholder="Select new location"
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
                                    <Button type="submit">Move</Button>
                                </Stack>
                            </form>
                        </DialogContent>
                    </>
                )}
            </ModalDialog>
        </Modal>
    );
}
