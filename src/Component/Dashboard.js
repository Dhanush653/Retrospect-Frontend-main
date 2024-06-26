import React, { useState, useEffect } from 'react';
import Header from './Header';
import { Box, Typography, IconButton, Menu, MenuItem, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import retrospectService from '../Service/RetrospectService';
import Createroom from './Createroom';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import OptionsImage from '../Asserts/options.png';

const Dashboard = () => {
    const [rooms, setRooms] = useState([]);
    const userEmail = localStorage.getItem('userEmail'); 
    const userId = localStorage.getItem('userId');
    const [reloadDashboard, setReloadDashboard] = useState(false);
    const [roomToUpdate, setRoomToUpdate] = useState(null);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [currentRoomId, setCurrentRoomId] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await retrospectService.getAllRooms();
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };
        fetchRooms();
    }, [reloadDashboard]);

    const openRoom = async (roomId, access) => {
        const res = await retrospectService.userJoinRoom({
            roomId: roomId,
            userId: userId,
        });
        console.log(res);
        if (access === 'restricted') {
            setCurrentRoomId(roomId);
            setPasswordDialogOpen(true);
        } else {
            window.location.href = `/chatroom/${roomId}`;
        }
    };

    const handlePasswordSubmit = async () => {
        try {
            const response = await retrospectService.checkRoomAccessByPassword({ roomId: currentRoomId, password });
            if (response.data === 'Access approved') {
                window.location.href = `/chatroom/${currentRoomId}`;
            } else {
                alert('Wrong password!');
            }
        } catch (error) {
            console.error('Error checking access:', error);
        }
        setPasswordDialogOpen(false);
        setPassword('');
    };

    const handlePasswordDialogClose = () => {
        setPasswordDialogOpen(false);
        setPassword('');
    };

    const handleCreateRoomSuccess = async () => {
        setRoomToUpdate(null);
        setReloadDashboard(prevState => !prevState);
    };

    const handleUpdateRoom = (room) => {
        setRoomToUpdate(room);
    };

    const handleDeleteRoom = (room) => {
        setSelectedRoom(room);
        setDeleteConfirmationOpen(true);
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        if (selectedRoom.roomId) {
            try {
                await retrospectService.deleteRoom(selectedRoom.roomId);
                setReloadDashboard(prevState => !prevState);
            } catch (error) {
                console.error('Error deleting room:', error);
            }
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleMenuOpen = (event, room) => {
        setSelectedRoom(room);
        setIsMenuOpen(true);
        setAnchorEl(event.currentTarget);
    };

    return (
        <div>
            <Header />
            {rooms.map((room, index) => (
                <Box key={room.id || index} style={{ position: 'absolute', top: '20px', left: '20px' }}>
                    <Menu
                        anchorEl={anchorEl}
                        open={isMenuOpen && selectedRoom === room}
                        onClose={() => setIsMenuOpen(false)}
                    >
                        <MenuItem onClick={() => handleUpdateRoom(room)}>Update</MenuItem>
                        <MenuItem onClick={() => handleDeleteRoom(room)}>Delete</MenuItem>
                    </Menu>
                </Box>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', marginTop: '20px', marginLeft: '7%', marginBottom: '3%' }}>
                {rooms.map((room, index) => (
                    <Box key={room.id || index} sx={{ position: 'relative', width: '25%', height: '160px', marginLeft: '20px', marginTop: '30px', padding: '20px', boxShadow: '2px 2px grey', borderRadius: '2px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.3s', ':hover': { transform: 'scale(1.02)' }, background: "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)" }}>
                        <Typography variant="h7" gutterBottom style={{ position: 'absolute', top: '7%', left: '50%', transform: 'translateX(-50%)', color: 'black', borderRadius: '5px', fontWeight: 'bold' }}>
                            {room.roomName}
                        </Typography>
                        <Typography variant="body2" style={{ position: 'absolute', textAlign: 'left', top: '27%', left: '10%', color: 'grey', maxWidth: '85%' }}>
                            {room.roomDescription}
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom style={{ position: 'absolute', top: '65%', left: '9%', color: 'black', fontSize: '70%', fontFamily: 'revert', fontWeight: 'bolder' }}>
                            Created By: {room.roomCreatedBy}
                        </Typography>

                        {room.access === 'restricted' && (
                            <LockPersonIcon style={{ position: 'absolute', top: 17, left: 'calc(100% - 27px)', marginTop: '-10px' }} />
                        )}
                        {userEmail === room.roomCreatedBy && ( 
                            <IconButton style={{ position: 'absolute', top: 0, left: 0 }} onClick={(event) => handleMenuOpen(event, room)}>
                                <img src={OptionsImage} alt="Options" style={{ width: '24px', height: '24px' }} />
                            </IconButton>
                        )}

                        <div style={{ position: 'absolute', bottom: '10px', right: '6%', display: 'flex' }}>
                            <Button variant="contained" onClick={() => openRoom(room.roomId, room.access, userId)} style={{ backgroundColor: '#0092ca', color: 'white', fontSize: '10px' }}>Enter Room</Button>
                        </div>
                    </Box>
                ))}
            </div>
            <Createroom open={!!roomToUpdate} onClose={() => setRoomToUpdate(null)} onCreateSuccess={handleCreateRoomSuccess} roomToUpdate={roomToUpdate} />

            <Dialog open={deleteConfirmationOpen} onClose={handleCancelDelete}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this room?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} autoFocus>Delete</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={passwordDialogOpen} onClose={handlePasswordDialogClose}>
                <DialogTitle>Enter Room Password</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Password"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handlePasswordDialogClose}>Cancel</Button>
                    <Button onClick={handlePasswordSubmit} color="primary">Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Dashboard;
