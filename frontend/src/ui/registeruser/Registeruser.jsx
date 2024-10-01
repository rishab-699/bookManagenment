import React, { useState } from 'react'
import './registeruser.css'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';


export default function Registeruser({setActions}) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = async(e)=>{
    e.preventDefault();
    setIsLoading(true)
    if(
      e.target.UserName.value !== '' &&
      e.target.email.value !== '' &&
      e.target.userid.value !== '' &&
      e.target.phoneNumber.value !== ''
    ){
      setError(null);
      const userData = {
        user_name: e.target.UserName.value,
        email: e.target.email.value,
        userId: e.target.userid.value,
        phno: e.target.phoneNumber.value
      }
      //console.log(userData);
      try {
        const register = await axios.post('http://localhost:5000/api/user/', userData);
        //console.log(register);
        alert('User Registered');
        setActions(null);
        setError(null);
        setIsLoading(false);
      } catch (error) {
        //console.log(error);
        alert('Something went wrong!');
        setIsLoading(false);
      }
    }else{
      setError('Fields should not be empty');
      setIsLoading(false);
    }
  }
  return (
    <div className="registerUserCard">
    <div className='registerUser'>
        <span className="formHeading">Register User</span>
        {error !== null && <p className='ErrorMsg'>{error}</p>}
        <button className='closeBtn' onClick={()=>setActions(null)}><CloseIcon className='Icon'/></button>

      <form className="registerUserForm" onSubmit={(e)=> handleSubmit(e)}>
        <div className="inputContainer">
            <label htmlFor="">userId:</label>
            <input type="text" name='userid' placeholder='userId' />
        </div>
        <div className="inputContainer">
            <label htmlFor="">user Name:</label>
            <input type="text" name="UserName" id="" />
        </div>
        <div className="inputContainer">
            <label htmlFor="">email:</label>
            <input type="email" name="email" id="" />
        </div>
        <div className="inputContainer">
            <label htmlFor="">Phone Number:</label>
            <input type="text" name="phoneNumber" id="" />
        </div>
        <button className="submitBtn" disabled={isLoading}>Register</button>
      </form>
      
    </div>
    </div>
  )
}
