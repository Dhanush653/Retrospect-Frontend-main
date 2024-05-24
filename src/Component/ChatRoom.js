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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const MessageSection = memo(({ title, messages, inputValue, onInputChange, onSendMessage, onDeleteMessage }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [showInput, setShowInput] = useState(false);

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

  return (
    <div className="message-section">
      <button className={`title-button ${getClassName(title)}`} onClick={toggleInputArea}>
        {title}
      </button>
      {showInput && (
        <div className="input-area">
          <textarea
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Type here.."
            className="textarea"
            rows="3"
          />
          <button className="send-button" onClick={onSendMessage}>+</button>
        </div>
      )}
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message-container ${getClassName(msg.contentType)}`}>
            <p className="message-text">
              {msg.username}: {msg.content}
            </p>
            <img
              src="../Asserts/options.png"
              alt="options"
              height="20vh"
              className="options-image"
              onClick={(event) => handleOptionsClick(event, msg.id)}
              style={{ cursor: 'pointer', marginTop: '0%' }}
            />
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
  const [dynamicMessages, setDynamicMessages] = useState({}); // For storing messages of dynamic sections
  const [addTopicDialogOpen, setAddTopicDialogOpen] = useState(false); 

  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      const socketUrl = `http://192.168.0.22:8085?room=${roomId}&username=${username}`;
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
      setAdditionalSections(response.data.map(topic => topic.topicName));
      console.log(response);
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
          />
          <MessageSection
            title="WHAT WENT WRONG"
            messages={badMessages}
            inputValue={messageInputs.Bad}
            onInputChange={(value) => handleInputChange(value, 'Bad')}
            onSendMessage={() => handleSendMessage('Bad')}
            onDeleteMessage={handleDeleteMessage}
          />
          <MessageSection
            title="POSITIVES"
            messages={posMessages}
            inputValue={messageInputs.Pos}
            onInputChange={(value) => handleInputChange(value, 'Pos')}
            onSendMessage={() => handleSendMessage('Pos')}
            onDeleteMessage={handleDeleteMessage}
          />
          <MessageSection
            title="BLUNDERS"
            messages={blunderMessages}
            inputValue={messageInputs.Blunder}
            onInputChange={(value) => handleInputChange(value, 'Blunder')}
            onSendMessage={() => handleSendMessage('Blunder')}
            onDeleteMessage={handleDeleteMessage}
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
