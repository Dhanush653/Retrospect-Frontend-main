// import React, { useState } from 'react';
// import Header from './LoginHeader';
// import Box from '@mui/material/Box';
// import { Typography } from '@mui/material';
// import { TextField, Button } from '@mui/material';
// import { Link as RouterLink, useNavigate } from 'react-router-dom';
// import Link from '@mui/material/Link';
// import RetrospectService from '../Service/RetrospectService';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import IconButton from '@mui/material/IconButton';
// import InputAdornment from '@mui/material/InputAdornment';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     showPassword: false, 
//   });

//   const [error, setError] = useState(null);
//   const [userEmail, setUserEmail] = useState(null); 
//   const navigate = useNavigate();

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleShowPassword = () => {
//     setFormData({
//       ...formData,
//       showPassword: !formData.showPassword,
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await RetrospectService.loginUser({
//         userEmail: formData.email,
//         userPassword: formData.password
//       });
  
//       if (response && response.data) {
//         localStorage.setItem('token', response.data);
  
//         const userDetailsResponse = await RetrospectService.getUserByToken(response.data);
//         const userEmail = userDetailsResponse.data.userEmail;
//         const userName = userDetailsResponse.data.userName;
//         sessionStorage.setItem('userName',userEmail);
//         sessionStorage.setItem('userEmail', userEmail); 
  
//         setUserEmail(userEmail);
  
//         const userId = userDetailsResponse.data.userId;
//         const userRole = userDetailsResponse.data.userRole;

//         console.log(userDetailsResponse)
//         navigate(`/dashboard/${userId}`);
//       } else {
//         setError("Invalid credentials");
//       }
//     } catch (error) {
//       setError("Invalid credentials");
//     }
//   };

//   return (
//     <>
//       <Header userEmail={userEmail} />
//       <Box
//         sx={{
//           minHeight: '89vh',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'flex-start',
//         }}
//       >
//         <Box
//           backgroundColor="#f2f2f2"
//           height={330}
//           width={400}
//           marginTop='5%'
//           marginBottom='2%'
//           display="flex"
//           flexDirection="column"
//           alignItems="center"
//           p={2}
//           borderRadius={1}
//           sx={{ 
//             fontFamily: 'Arial, sans-serif',
//             borderRadius:'0%',
//             color: '#E066FF',
//             background:'linear-gradient(109.6deg, rgb(20, 30, 48) 11.2%, rgb(36, 59, 85) 91.1%)'
//            }}
//         >
//           <Typography variant='h6' fontWeight='bolder' color='white'>
//             LOGIN
//           </Typography>
//           <Box display='flex' alignItems='center' marginTop={4} marginBottom={4}>
//             <TextField 
//             name="email" 
//             value={formData.email} 
//             onChange={handleChange} 
//             variant='outlined' 
//             size='small' 
//             placeholder='Enter your Email...' 
//             sx={{ '& input': { paddingTop:'7px', paddingBottom:'7px', paddingLeft:'6px', paddingRight:'67px' }, backgroundColor: 'white', borderRadius:'5px', width:'100%' }} />
//           </Box>
//           <Box display='flex' alignItems='center' marginTop={2} marginBottom={4}>
//             <TextField 
//               name='password' 
//               type={formData.showPassword ? 'text' : 'password'} 
//               value={formData.password} 
//               onChange={handleChange} 
//               variant='outlined' 
//               size='small' 
//               placeholder='Enter your Password...' 
//               sx={{ '& input': { padding: '7px 7px' }, backgroundColor: 'white', borderRadius:'5px', width:'100%' }} 
//               InputProps={{ 
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label="toggle password visibility"
//                       onClick={handleShowPassword}
//                     >
//                       {formData.showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 )
//               }}
//             />
//           </Box>
//           <Box display="flex" justifyContent="center" marginTop={-2} marginLeft={2} marginBottom={2}  color={'grey'}>
//           <Link component={RouterLink} to="/forgot" color="#d62b70" underline="none">
//             Forgot Password?
//           </Link>  
//           </Box>
//           <Button variant="contained" onClick={handleSubmit} sx={{ justifyContent: 'center', borderRadius: '20px', background:'#f95959', color:'white' }}>
//             Login
//           </Button>
//           {error && (
//             <Typography variant="body1" color="error" sx={{ marginTop: '10px' }}>
//               {error}
//             </Typography>
//           )}
//           <Box display="flex" justifyContent="left" marginBottom={4} marginLeft={2} marginTop={2} color={'grey'}>
//             <span style={{ fontStyle: 'italic', color:'white' }}> Don't have an account? </span>
//             <Link component={RouterLink} to="/registration" color="red" underline="none">
//               Click Here
//             </Link>
//           </Box>
//         </Box>
//       </Box>
//     </>
//   );
// }

// export default Login;
