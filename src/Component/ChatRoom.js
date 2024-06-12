import React, { useState, useEffect, useRef, memo } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import './ChatRoom.css';
import './LoginHeader';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LoginHeader from './LoginHeader';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import RetrospectService from '../Service/RetrospectService';
import Typography from '@mui/material/Typography';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import OptionsMenu from './OptionsMenu';
import UsernamesDialog from './UsernamesDialog';
import AddIcon from '@mui/icons-material/Add';
import AddTopicDialog from './AddTopicDialog';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const MessageSection = memo(({ title, messages, inputValue, onInputChange, onSendMessage, onDeleteMessage, color }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const userEmail = localStorage.getItem('userEmail');
  const handleOptionsClick = (event, messageId) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessageId(messageId);
  };

  const handleOptionsClose = () => {
    setAnchorEl(null);
    setSelectedMessageId(null);
  };

  const handleDelete = async () => {
    try {
      if (selectedMessageId) {
        await RetrospectService.deleteMessageById(selectedMessageId);
        console.log('Message deleted successfully');
        onDeleteMessage(selectedMessageId);
        handleOptionsClose();
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const toggleInputArea = () => {
    setShowInput(prev => !prev);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };


  return (
    <div className="message-section">
      <button className="title-button" onClick={toggleInputArea}>
        {title}
      </button>
      {showInput && (
        <div className="input-area">
          <textarea
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter here.."
            className="textarea"
            rows="3"
          />
          <button className="send-button" onClick={onSendMessage}>Send</button>
        </div>
      )}
      <div className="messages">
  {messages.map((msg, index) => (
    <div key={index} className="message-container" style={{ backgroundColor: color }}>
      <p className="message-text">{msg.content}</p>
      <div style={{ display: 'flex', alignItems: 'center' }}>
      <PersonOutlineOutlinedIcon style={{ marginRight: '1%', width:'7%', marginTop:'2%', color:'white', marginLeft:'54%' }} />
      <p className="message-username">{msg.username.split('.')[0]}</p>
    </div>

      {userEmail === msg.username && (
        <img
          src="../Asserts/options.png"
          alt="options"
          height="20vh"
          className="options-image"
          onClick={(event) => handleOptionsClick(event, msg.id)}
          style={{ cursor: 'pointer', marginTop: '0%' }}
        />
      )}
      <OptionsMenu anchorEl={anchorEl} onClose={handleOptionsClose} onDelete={handleDelete} />
    </div>
  ))}
</div>

    </div>
  );
});


function getClassName(contentType) {
  switch (contentType) {
    case 'Good':
      return 'good-message';
    case 'Bad':
      return 'bad-message';
    case 'Pos':
      return 'pos-message';
    case 'Blunder':
      return 'blunder-message';
    default:
      return '';
  }
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function ChatRoom() {
  const { roomId } = useParams();
  const username = localStorage.getItem('userEmail');
  const [room, setRoom] = useState({});
  const [goodMessages, setGoodMessages] = useState([]);
  const [badMessages, setBadMessages] = useState([]);
  const [posMessages, setPosMessages] = useState([]);
  const [blunderMessages, setBlunderMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [messageInputs, setMessageInputs] = useState({
    Good: '',
    Bad: '',
    Pos: '',
    Blunder: ''
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [additionalSections, setAdditionalSections] = useState([]);
  const [dynamicMessages, setDynamicMessages] = useState({});
  const [sectionColors, setSectionColors] = useState({});
  const [addTopicDialogOpen, setAddTopicDialogOpen] = useState(false);
  const [reloadChat, setReloadChat] = useState(false);

  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      const socketUrl = `http://10.10.10.116:8085?room=${roomId}&username=${username}`;
      socketRef.current = io(socketUrl, { transports: ['websocket'], upgrade: false });

      socketRef.current.on('connect', () => {
        console.log('Socket connected');
      });
      socketRef.current.on('receive_message', (data) => {
        console.log('Received message from server:', data);
        switch (data.contentType) {
          case 'Good':
            setGoodMessages(prev => [...prev, data]);
            break;
          case 'Bad':
            setBadMessages(prev => [...prev, data]);
            break;
          case 'Pos':
            setPosMessages(prev => [...prev, data]);
            break;
          case 'Blunder':
            setBlunderMessages(prev => [...prev, data]);
            break;
          default:
            setDynamicMessages(prev => ({
              ...prev,
              [data.contentType]: [...(prev[data.contentType] || []), data]
            }));
            break;
        }
        setReloadChat(prev => !prev);
      });
      

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log('Socket disconnected on cleanup');
        socketRef.current = null;
      }
    };
  }, [roomId, username]);
  useEffect(() => {
    fetchMessages();
    fetchTopics();
  }, [roomId, reloadChat]); 
  

  const fetchRoom = async () => {
    try {
      const response = await RetrospectService.getRoomById(roomId);
      setRoom(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, [roomId]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:8080/message/${roomId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const messages = await response.json();

      const messageMap = {
        'Good': [],
        'Bad': [],
        'Pos': [],
        'Blunder': []
      };

      messages.forEach(msg => {
        if (msg.contentType in messageMap) {
          messageMap[msg.contentType].push(msg);
        } else {
          if (!messageMap[msg.contentType]) {
            messageMap[msg.contentType] = [];
          }
          messageMap[msg.contentType].push(msg);
        }
      });

      setGoodMessages(messageMap['Good']);
      setBadMessages(messageMap['Bad']);
      setPosMessages(messageMap['Pos']);
      setBlunderMessages(messageMap['Blunder']);
      delete messageMap['Good'];
      delete messageMap['Bad'];
      delete messageMap['Pos'];
      delete messageMap['Blunder'];
      setDynamicMessages(messageMap);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await RetrospectService.getTopicsByRoomId(roomId);
      const newTopics = response.data.map(topic => topic.topicName);
      setAdditionalSections(newTopics);

      const existingColors = JSON.parse(localStorage.getItem('sectionColors') || '{}');
      const newColors = {};
      newTopics.forEach(topic => {
        if (!existingColors[topic]) {
          existingColors[topic] = getRandomColor();
        }
        newColors[topic] = existingColors[topic];
      });

      setSectionColors(newColors);
      localStorage.setItem('sectionColors', JSON.stringify(newColors));
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchTopics();
  }, [roomId]);

  const handleInputChange = (value, category) => {
    setMessageInputs(prev => ({ ...prev, [category]: value }));
  };

  const handleSendMessage = async (category) => {
    if (socketRef.current && messageInputs[category].trim()) {
      const messageContent = messageInputs[category];
      socketRef.current.emit('message', { content: messageContent, contentType: category, room: roomId, username });
      handleInputChange('', category);
    }
  };

  const handleDeleteMessage = (messageId) => {
    setGoodMessages(prev => prev.filter(msg => msg.id !== messageId));
    setBadMessages(prev => prev.filter(msg => msg.id !== messageId));
    setPosMessages(prev => prev.filter(msg => msg.id !== messageId));
    setBlunderMessages(prev => prev.filter(msg => msg.id !== messageId));
    setDynamicMessages(prev => {
      const newDynamicMessages = { ...prev };
      Object.keys(newDynamicMessages).forEach(key => {
        newDynamicMessages[key] = newDynamicMessages[key].filter(msg => msg.id !== messageId);
      });
      return newDynamicMessages;
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleAddTopicDialogOpen = () => {
    setAddTopicDialogOpen(true);
  };

  const handleAddTopicDialogClose = () => {
    setAddTopicDialogOpen(false);
  };

  const handleAddSection = async (newTopic) => {
    if (newTopic) {
      try {
        const topicDetails = {
          topicName: newTopic,
          roomId: roomId,
        };
        const response = await RetrospectService.addNewTopic(topicDetails);
        if (response.data) {
          setAdditionalSections(prev => [...prev, newTopic]);
          const newColor = getRandomColor();
          setSectionColors(prev => ({ ...prev, [newTopic]: newColor }));
          localStorage.setItem('sectionColors', JSON.stringify({ ...sectionColors, [newTopic]: newColor }));
          setDynamicMessages(prev => ({
            ...prev,
            [newTopic]: []
          }));
          setMessageInputs(prev => ({ ...prev, [newTopic]: '' }));
        } else {
          console.error('Error: Topic was not added correctly');
        }
        handleAddTopicDialogClose();
      } catch (error) {
        console.error('Error adding new topic:', error);
      }
    }
  };

  return (
    <>
      <div>
        <LoginHeader />
      </div>

      <div className='belowheader'>
        <p className='roomname'>{room.roomName}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginRight: '2%' }}>
        <Button
        sx={{ backgroundColor: '#bc2525', color: 'white',fontWeight:'bold',fontSize:'12px', '&:hover': { backgroundColor: '#bc2525' } }}
        onClick={() => window.location.href = 'http://localhost:3000'}
        >
          Exit Room <LogoutIcon sx={{width:'18%', marginLeft:'2%'}}/>
        </Button>

          <IconButton onClick={handleAddTopicDialogOpen}>
            <AddIcon sx={{ color: 'black' }} />
          </IconButton>
          <IconButton onClick={handleDialogOpen}>
            <PeopleOutlineIcon sx={{ color: 'black' }} />
          </IconButton>
          <InfoOutlinedIcon style={{ cursor: 'pointer' }} onClick={handleClickOpen} />
        </div>

        <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Room Details
          </DialogTitle>
          <IconButton aria-label="close" onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <Typography gutterBottom>
              Room Id: {room.roomId}
            </Typography>
            <Typography gutterBottom>
              Room Name: {room.roomName}
            </Typography>
            <Typography gutterBottom>
              Room Description: {room.roomDescription}
            </Typography>
          </DialogContent>
        </BootstrapDialog>
      </div>
      <div className="container">
        <div className="chat-area">
          <MessageSection
            title="WHAT WENT GOOD"
            messages={goodMessages}
            inputValue={messageInputs.Good}
            onInputChange={(value) => handleInputChange(value, 'Good')}
            onSendMessage={() => handleSendMessage('Good')}
            onDeleteMessage={handleDeleteMessage}
            color="#68d391"
          />
          <MessageSection
            title="WHAT WENT WRONG"
            messages={badMessages}
            inputValue={messageInputs.Bad}
            onInputChange={(value) => handleInputChange(value, 'Bad')}
            onSendMessage={() => handleSendMessage('Bad')}
            onDeleteMessage={handleDeleteMessage}
            color="#fc8181"
          />
          <MessageSection
            title="POSITIVES"
            messages={posMessages}
            inputValue={messageInputs.Pos}
            onInputChange={(value) => handleInputChange(value, 'Pos')}
            onSendMessage={() => handleSendMessage('Pos')}
            onDeleteMessage={handleDeleteMessage}
            color="#f6e05e"
          />
          <MessageSection
            title="BLUNDERS"
            messages={blunderMessages}
            inputValue={messageInputs.Blunder}
            onInputChange={(value) => handleInputChange(value, 'Blunder')}
            onSendMessage={() => handleSendMessage('Blunder')}
            onDeleteMessage={handleDeleteMessage}
            color="#f6ad55"
          />
          {additionalSections.map((section, index) => (
            <MessageSection
              key={index}
              title={section}
              messages={dynamicMessages[section] || []}
              inputValue={messageInputs[section] || ''}
              onInputChange={(value) => handleInputChange(value, section)}
              onSendMessage={() => handleSendMessage(section)}
              onDeleteMessage={handleDeleteMessage}
              color={sectionColors[section]}
            />
          ))}
        </div>
      </div>
      <UsernamesDialog roomId={roomId} open={dialogOpen} onClose={handleDialogClose} />
      <AddTopicDialog open={addTopicDialogOpen} onClose={handleAddTopicDialogClose} onAdd={handleAddSection} />
    </>
  );
}

export default ChatRoom;