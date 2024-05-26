import React, { useState, useEffect } from 'react';
import Header from './Header';
import { Box, Typography, IconButton, Menu, MenuItem, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import retrospectService from '../Service/RetrospectService';
import Createroom from './Createroom';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import OptionsImage from '../Asserts/options.png';

const Dashboard = () => {
    const [rooms, setRooms] = useState([]);
    const userId = localStorage.getItem('userId');
    const [reloadDashboard, setReloadDashboard] = useState(false);
    const [roomToUpdate, setRoomToUpdate] = useState(null);
    const userEmail = localStorage.getItem('userEmail');

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

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

    const openRoom = async (rId, access, uId) => {
        const res = await retrospectService.userJoinRoom({
            roomId: rId,
            userId: uId,
        });
        if (access === 'restricted') {
            try {
                if (userEmail) {
                    const requestData = { email: userEmail, roomId: rId };
                    const response = await retrospectService.checkRoomAccessByEmail(requestData);
                    if (response.data === 'access approved') {
                        window.location.href = `/chatroom/${rId}`;
                        return;
                    }
                } else {
                    alert('User email not available.');
                }
            } catch (error) {
                console.error('Error checking access:', error);
            }
            alert("You don't have access to this room");
        } else {
            window.location.href = `/chatroom/${rId}`;
        }
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
                        <Typography variant="subtitle2" gutterBottom style={{ position: 'absolute', top: '65%', left: '9%', color: 'black', fontSize: '12px', fontFamily: 'revert', fontWeight: 'bolder' }}>
                            Created By: {room.roomCreatedBy}
                        </Typography>

                        {room.access === 'restricted' && (
                            <LockPersonIcon style={{ position: 'absolute', top: 17, left: 'calc(100% - 27px)', marginTop: '-10px' }} />
                        )}
                        <IconButton style={{ position: 'absolute', top: 0, left: 0 }} onClick={(event) => handleMenuOpen(event, room)}>
                            <img src={OptionsImage} alt="Options" style={{ width: '24px', height: '24px' }} />
                        </IconButton>

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
        </div>
    );
}

export default Dashboard;
