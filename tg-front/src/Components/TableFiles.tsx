import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import AvatarGroup from '@mui/joy/AvatarGroup';
import Typography from '@mui/joy/Typography';
import Table from '@mui/joy/Table';
import IconButton from '@mui/joy/IconButton';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';

import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';

export default function TableFiles({ onFileClick }) {
  const [files, setFiles] = React.useState([
    // Array dei file
    {
      name: 'Travel pictures',
      type: 'folder',
      modified: '21 Oct 2023, 3PM',
      size: '987.5MB',
      owner: [
        { avatar: 'https://i.pravatar.cc/24?img=6' },
        { avatar: 'https://i.pravatar.cc/24?img=7' },
        { avatar: 'https://i.pravatar.cc/24?img=8' },
        { avatar: 'https://i.pravatar.cc/24?img=9' },
      ],
    },
    {
      name: 'Important documents',
      type: 'folder',
      modified: '26 Sep 2023, 7PM',
      size: '232.3MB',
      owner: [
        { avatar: 'https://i.pravatar.cc/24?img=1' },
        { avatar: 'https://i.pravatar.cc/24?img=9' },
        { avatar: 'https://i.pravatar.cc/24?img=2' },
        { avatar: 'https://i.pravatar.cc/24?img=3' },
        { additional: 3 },
      ],
    },
    {
      name: 'Projects',
      type: 'folder',
      modified: '12 Aug 2021, 7PM',
      size: '1.6GB',
      owner: [
        { avatar: 'https://i.pravatar.cc/24?img=4' },
        { avatar: 'https://i.pravatar.cc/24?img=8' },
        { avatar: 'https://i.pravatar.cc/24?img=5' },
      ],
    },
    {
      name: 'Invoices',
      type: 'folder',
      modified: '14 Mar 2021, 7PM',
      size: '123.3KB',
      owner: [{ avatar: 'https://i.pravatar.cc/24?img=2' }],
    },
    {
      name: 'VideoLaureaExample',
      type: 'file',
      modified: '14 Mar 2021, 7PM',
      size: '123.3KB',
      owner: [{ avatar: 'https://i.pravatar.cc/24?img=2' }],
    },
  ]);

  const [open, setOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [newName, setNewName] = React.useState('');

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
    setFiles((prevFiles) =>
        prevFiles.map((file) =>
            file.name === selectedFile.name ? { ...file, name: newName } : file
        )
    );
    handleCloseModal();
  };

  const handleDelete = () => {
    setFiles((prevFiles) =>
        prevFiles.filter((file) => file.name !== selectedFile.name)
    );
    handleCloseModal();
  };

  return (
      <div>
        <Table
            hoverRow
            size="sm"
            borderAxis="none"
            variant="soft"
            sx={{
              '--TableCell-paddingX': '1rem',
              '--TableCell-paddingY': '1rem',
              '@media (max-width: 600px)': {
                '--TableCell-paddingX': '0.5rem',
                '--TableCell-paddingY': '0.5rem',
                fontSize: '0.8rem',
              },
              '@media (min-width: 601px) and (max-width: 768px)': {
                '--TableCell-paddingX': '0.75rem',
                '--TableCell-paddingY': '0.75rem',
                fontSize: '0.9rem',
              },
            }}
        >
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
              <Typography level="title-sm">Owner</Typography>
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
                            <VideoFileIcon color="secondary" />
                        )
                      }
                      sx={{ alignItems: 'flex-start' }}
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
                  <AvatarGroup size="sm" sx={{ '--AvatarGroup-gap': '-8px', '--Avatar-size': '24px' }}>
                    {file.owner.map((owner, ownerIndex) =>
                        owner.additional ? (
                            <Avatar key={ownerIndex}>+{owner.additional}</Avatar>
                        ) : (
                            <Avatar key={ownerIndex} src={owner.avatar} srcSet={owner.avatar + ' 2x'} />
                        )
                    )}
                  </AvatarGroup>
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
                          event.stopPropagation(); // Impedisce la propagazione del clic
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
                          event.stopPropagation(); // Impedisce la propagazione del clic
                          handleOpenModal('delete', file);
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

        <Modal open={open} onClose={handleCloseModal}>
          <ModalDialog>
            {modalType === 'rename' && (
                <>
                  <DialogTitle>Rename File</DialogTitle>
                  <DialogContent>
                    <form
                        onSubmit={(event) => {
                          event.preventDefault();
                          handleRename();
                        }}
                    >
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
                  <DialogContent>
                    Are you sure you want to delete this file?
                  </DialogContent>
                  <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ p: 2 }}>
                    <Button variant="plain" onClick={handleCloseModal}>
                      Cancel
                    </Button>
                    <Button variant="solid" color="danger" onClick={handleDelete}>
                      Delete
                    </Button>
                  </Stack>
                </>
            )}
          </ModalDialog>
        </Modal>
      </div>
  );
}
