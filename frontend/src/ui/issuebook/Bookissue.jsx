import React, { useEffect, useState } from 'react'
import './bookissue.css'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios'


export default function Bookissue({setActions}) {
  const [userData, setUserData] = useState();
  const [bookData, setBookData] = useState();

  const [isExist, setIsExist] = useState();
  const [isUserExist, setIsUserExist] = useState();
  useEffect(()=>{
    
    const fetchData = async()=>{
      try {
        const user = await axios.get('http://localhost:5000/api/user/');
        setUserData(user.data)
        const book = await axios.get('http://localhost:5000/api/books/');
        setBookData(book.data)
      } catch (error) {
        console.log(error);
      }
      
    }
    fetchData();
  },[]);

  const checkExistance = async(e, field)=>{
    if(field === 'book'){
        console.log(e.target.value);
        const bookExist = bookData && bookData.some(value => value.book_name.toLowerCase() === e.target.value.toLowerCase ());

        console.log(bookExist);
        setIsExist(bookExist);
    }
    if(field === 'user'){
      console.log(e.target.value);
      let userExist = userData && userData.some(value => value.user_name.toLowerCase() === e.target.value.toLowerCase ());
      if(!userExist){
        userExist = userData && userData.some(value => value.userId === e.target.value)
      }
      console.log(userExist);
      setIsUserExist(userExist);
    }
  }
  const handleSubmit = async(e)=>{
    e.preventDefault();

    try {
      if(isExist && isUserExist && e.target.issueDate.value !== ''){
        const bookDetails = bookData && bookData.find(value => 
          value.book_name.toLowerCase() === e.target.book.value.toLowerCase()
        );
        const userDetails = userData && userData.find(value => 
          value.user_name.toLowerCase() === e.target.user.value.toLowerCase() || value.userId.toLowerCase() === e.target.user.value.toLowerCase()
        );
        const book_id = bookDetails._id;
        const user_id = userDetails.userId;
  
        console.log(book_id);
        console.log(user_id);

        const saveTransaction = await axios.post('http://localhost:5000/api/transaction/',{
          book_id: book_id,
          userId: user_id,
          issuedate: e.target.issueDate.value,
          returndate: null,
          totalRent: 0
        });

        alert('Book Issued');
      }
      
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="bookIssueCard">
    <div className='bookIssue'>
    <button className='closeBtn' onClick={()=>setActions(null)}><CloseIcon className='Icon'/></button>
      <form className="bookIssueForm" onSubmit={(e)=>handleSubmit(e)}>
        <div className="inputContainer">
          <label htmlFor="">Book Name:</label>
          <input type="text" placeholder='Book Name' name='book' className={isExist? 'exists' : 'notExist'} onBlur={(e)=>checkExistance(e, 'book')} />
          {!isExist && <p className='ErrorMsg'>Book Not Available</p>}
        </div>
        <div className="inputContainer">
          <label htmlFor="">User Name/Id:</label>
          <input type="text" placeholder='User Name' name='user' className={isUserExist? 'exists' : 'notExist'} onBlur={(e)=>checkExistance(e, 'user')}/>
          {!isUserExist && <p className='ErrorMsg'>User Not Available</p>}
        </div>
        <div className="inputContainer">
          <label htmlFor="">Issue Date:</label>
          <input type="date" name="issueDate" id="" />
        </div>
        
        <button className="submitBtn">Issue Book</button>
      </form>
      
    </div>
    </div>
  )
}
