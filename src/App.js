import './App.css';
import Registration from './Component/Registration';
import Login from './Component/Login';
import Dashboard from './Component/Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Createroom from './Component/Createroom';
import ForgotPassword from './Component/ForgotPassword';
import ChatRoom from './Component/ChatRoom';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route exact path='/' element={<Dashboard />} />
          {/* <Route path='/registration' element={<Registration />} /> */}
          {/* <Route path='/login' element={<Login />} /> */}
          <Route path='/createroom' element={<Createroom />} />
          {/* <Route path='/forgot' element={<ForgotPassword />} /> */}
          <Route path='/chatroom/:roomId' element={<ChatRoom roomName="General Chat" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
