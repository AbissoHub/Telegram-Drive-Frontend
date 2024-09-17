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
                                             setNewLocation
                                         }) {
    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog>
                {modalType === 'rename' && (
                    <>
                        <DialogTitle>Rename File</DialogTitle>
                        <DialogContent>
                            <form onSubmit={(event) => { event.preventDefault(); onRename(); }}>
                                <Stack spacing={2}>
                                    <FormControl>
                                        <FormLabel>New Name</FormLabel>
                                        <Input
                                            autoFocus
                                            required
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                        />
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
                                        <Input
                                            autoFocus
                                            required
                                            value={newLocation}
                                            onChange={(e) => setNewLocation(e.target.value)}
                                        />
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
