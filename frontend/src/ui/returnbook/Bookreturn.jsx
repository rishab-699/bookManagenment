import React, { useEffect, useState, useRef } from 'react'
import './bookreturn.css'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios'

export default function Bookreturn({setActions}) {
    const [userData, setUserData] = useState();
  const [bookData, setBookData] = useState();
  const username = useRef(null);
  const bookname = useRef(null);
    const [issueDate, setIssueDate] = useState();
    const [TransactionDetails, setTransactionDetails] = useState();
    const [totalRent,setTotalRent] = useState();
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
  const findTransaction = async()=>{
    console.log('transaction finding')
    if(isExist && isUserExist){
        try {
            const bookDetails = bookData && bookData.find(value => 
                value.book_name.toLowerCase() === bookname.current.value.toLowerCase()
              );
              const userDetails = userData && userData.find(value => 
                value.user_name.toLowerCase() === username.current.value.toLowerCase() || value.userId.toLowerCase() === username.current.value.toLowerCase()
              );
              const book_id = bookDetails._id;
              const user_id = userDetails.userId;
    
            const findData = await axios.get(`http://localhost:5000/api/transaction/find?book_id=${book_id}&user_id=${user_id}`);
            console.log(findData.data);
            setTransactionDetails(findData.data);
            setIssueDate(findData.data[0].issuedate.split("T")[0]);
        } catch (error) {
            console.log(error);
        }
        
    }
  }
  console.log(issueDate);


  const handleSubmit = async(e)=>{
    e.preventDefault()
    const bookDetails = bookData && bookData.find(value => 
        value.book_name.toLowerCase() === e.target.book.value.toLowerCase()
    );
    const firstDate = new Date(issueDate);
    const secondDate = new Date(e.target.returnDate.value);
    const differenceInTime = secondDate.getTime() - firstDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    setTotalRent(bookDetails.rent_per_day * differenceInDays);
    //console.log(bookDetails);
    //console.log('total Rent:',totalRent);
    try {
        console.log(TransactionDetails);
        const update = await axios.put(`http://localhost:5000/api/transaction/${TransactionDetails[0]._id}`,{
            returndate: e.target.returnDate.value,
            totalRent: totalRent
        })
        console.log(update);
        alert('Book Returned successfully!');
    } catch (error) {
        console.log(error);
        alert('Something went wrong!')
    }
    
  }
  return (
    <div className="bookReturnCard">
    <div className='bookReturn'>
    <span className="formHeading">Return Book</span>
    <button className='closeBtn' onClick={()=>setActions(null)}><CloseIcon className='Icon'/></button>
      <form className="bookReturnForm" onSubmit={(e)=>handleSubmit(e)}>
        
      <div className="inputContainer">
          <label htmlFor="">Book Name:</label>
          <input type="text" placeholder='Book Name' ref={bookname} name='book' className={isExist? 'exists' : 'notExist'} onBlur={(e)=>checkExistance(e, 'book')} />
          {!isExist && <p className='ErrorMsg'>Book Not Available</p>}
        </div>
        <div className="inputContainer">
          <label htmlFor="">User Name/Id:</label>
          <input type="text" placeholder='User Name' ref={username} name='user' className={isUserExist? 'exists' : 'notExist'} onBlur={(e)=>checkExistance(e, 'user')}/>
          {!isUserExist && <p className='ErrorMsg'>User Not Available</p>}
        </div>
        
          <div className="findBtn" onClick={findTransaction}>Find</div>
        <div className="inputContainer">
          <label htmlFor="">Issue Date:</label>
          <input type="text" value={issueDate} name="issueDate" id="" disabled={true} />
        </div>
        <div className="inputContainer">
          <label htmlFor="">Return Date:</label>
          <input type="date" name="returnDate" id="" />
        </div>
        <div className="inputContainer">
          {totalRent>0 && <h1>Total Rent: {totalRent}</h1>}
        </div>
        <button className="submitBtn">Return Book</button>
    </form>
    </div>
    </div>
  )
}
