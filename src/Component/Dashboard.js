import React, { useState, useEffect } from 'react';
import Header from './Header';
import { Box, Typography, Button } from '@mui/material';
import RetrospectService from '../Service/RetrospectService';
import Createroom from './Createroom';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import CreateIcon from '@mui/icons-material/Create';

const Dashboard = () => {
    const [rooms, setRooms] = useState([]);
    const userId = localStorage.getItem('userId');
    const [reloadDashboard, setReloadDashboard] = useState(false);
    const [roomToUpdate, setRoomToUpdate] = useState(null);
    const userEmail = localStorage.getItem('userEmail')

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                console.log('Fetching rooms...');
                const response = await RetrospectService.getAllRooms();
                console.log('Rooms fetched:', response.data);
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };
        fetchRooms();
    }, [reloadDashboard]);

    const openRoom = async (rId, access, uId) => {
        const res = await RetrospectService.userJoinRoom({
            roomId: rId,
            userId: uId,
        });
        console.log(res);
        if (access === 'restricted') {
            try {
                if (userEmail) {
                    console.log('Checking room access for email:', userEmail, 'and roomId:', rId);
                    const requestData = { email: userEmail, roomId: rId };
                    console.log('Request data:', requestData);
                    const response = await RetrospectService.checkRoomAccessByEmail(requestData);
                    console.log('Room access result:', response.data);
                    if (response.data === 'access approved') {
                        window.open(`/chatroom/${rId}`, '_blank');
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
            window.open(`/chatroom/${rId}`, '_blank');
        }
    };

    const handleCreateRoomSuccess = async () => {
        setRoomToUpdate(null);
        try {
            setReloadDashboard(prevState => !prevState);
        } catch (error) {
            console.error('Error handling room creation success:', error);
        }
    };

    const handleUpdateRoom = (room) => {
        if (room.roomId) {
            console.log('Updating room with id:', room.roomId);
            setRoomToUpdate(room);
        } else {
            console.error('Room id is undefined:', room);
        }
    };

    return (
        <div>
            <Header  />
            <div style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', marginTop: '20px', marginLeft: '7%', marginBottom: '3%' }}>
                {rooms.map((room, index) => (
                    <Box key={room.id || index} sx={{ position: 'relative', width: '25%', height: '160px', marginLeft: '20px', marginTop: '30px', padding: '20px', boxShadow: '2px 2px grey', borderRadius: '2px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.3s', ':hover': { transform: 'scale(1.02)' }, background: "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)" }}>
                        <Typography variant="h7" gutterBottom style={{ position: 'absolute', top: '7%', left: '50%', transform: 'translateX(-50%)', color: 'black', borderRadius: '5px', fontWeight: 'bold' }}>
                            {room.roomName}
                        </Typography>
                        <Typography variant="body2" style={{ position: 'absolute', textAlign: 'left', top: '27%', left: '10%', color: 'grey', maxWidth: '85%' }}>
                            {room.roomDescription}
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom style={{ position: 'absolute', top: '68%', left: '9%', color: 'black', fontSize: '12px', fontFamily: 'revert', fontWeight: 'bolder' }}>
                            Created By: {room.roomCreatedBy}
                        </Typography>
                        {room.access === 'restricted' && (
                            <LockPersonIcon sx={{ marginTop: '-10px', marginLeft: '100%' }} />
                        )}
                        <div style={{ position: 'absolute', bottom: '10px', right: '6%', display: 'flex' }}>
                            <Button variant="outlined" onClick={() => handleUpdateRoom(room)} style={{ marginRight: '10px', fontWeight: 'bold', color: 'black', width: '30px', fontSize: '10px', borderColor: 'black', background: 'white' }}>Update</Button>
                            {room.roomStatus === 'active' ? (
                                <Button variant="contained" onClick={() => openRoom(room.roomId, room.access, userId)} style={{ backgroundColor: '#0092ca', color: 'white', fontSize: '10px' }}>Enter Room</Button>
                            ) : (
                                <Button disabled style={{ fontWeight: 'bolder', color: '#5f6769', fontSize: '10px' }}>Room closed</Button>
                            )}
                        </div>
                    </Box>
                ))}
            </div>
            <Createroom open={!!roomToUpdate} onClose={() => setRoomToUpdate(null)} onCreateSuccess={handleCreateRoomSuccess} roomToUpdate={roomToUpdate} />
        </div>
    );
}

export default Dashboard;
