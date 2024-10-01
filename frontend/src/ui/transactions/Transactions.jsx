import React, { useEffect, useState } from 'react'
import Searchinput from '../searchinput/Searchinput'
import CachedIcon from '@mui/icons-material/Cached';
import './transactions.css'
import axios from 'axios';

export default function Transactions() {
    const [searchQuery,setsearchQuery]= useState();
    const [booksData, setBooksData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [DateRange, setDateRange] = useState([]);
    const [bookDetail, setBookDetail] = useState();
    const [userDetail, setUserDetail] = useState();
    const [booksSearch, setBooksSearch] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
          const { data } = await axios.get('http://localhost:5000/api/books/');
          setBooksData(data);
          const users = await axios.get('http://localhost:5000/api/user/');
          setUserData(users.data);
        }
        fetchBooks()
    },[]);
    useEffect(()=>{
        const fetch = async()=>{
        if(searchQuery !==null){
            console.log(searchQuery);
            const bookDetails = booksData && booksData.find(value => 
                value.book_name && searchQuery && value.book_name.toLowerCase() === searchQuery.toLowerCase()
            );
            
            console.log(bookDetails);
            if(bookDetails){
                const { data } = await axios.get(`http://localhost:5000/api/transaction/bookSearchTransactions/${bookDetails._id}`);
                setBookDetail(data);
                console.log(data);
                setBooksSearch(true);
                setsearchQuery(null)
            }
            const userDetails = userData && userData.find(value => 
                value.user_name && searchQuery && value.user_name.toLowerCase() === searchQuery.toLowerCase() || value.userId.toLowerCase() === searchQuery.toLowerCase()
              );
            if(userDetails){
                console.log(userDetails);
                const { data } = await axios.get(`http://localhost:5000/api/transaction/userDatas/${userDetails.userId}`);
                setUserDetail(data);
                console.log(data);
                setBooksSearch(false);
                setsearchQuery(null)

            }
          }
        }
        fetch()
    },[searchQuery])

    const refresh = ()=>{
        setsearchQuery();
        setBooksData([]);
        setUserData([]);
        setDateRange([]);
        setBookDetail();
        setUserDetail();
        setBooksSearch(false);
    }

    const handleDateRange = async(e)=>{
        e.preventDefault();
        try {
            const fetchData = await axios.get(`http://localhost:5000/api/transaction/bookSearchDateTransactions/?from=${e.target.fromDate.value}&to=${e.target.toDate.value}`);
                console.log(fetchData.data);
                setDateRange(fetchData.data);
                alert('form Successfully Submitted!');
        } catch (error) {
            console.log(error);
            alert('Something Went Wrong!')
        }
        

    }
  return (
    <div className='transactions'>
      <div className="header">
        <div className="heading">
            <span>Transactions</span>
        </div>
        <div className="sec">
            <div className="formSearch">
            <Searchinput setsearchQuery={setsearchQuery} />
            </div>
            <div className="leftSec">
            <button className="refreshBtn">
                <CachedIcon onClick={()=>refresh} className='refreshIcon' />
            </button>
            <form onSubmit={(e)=>handleDateRange(e)}>
                <div className="inputContainer">
                    <label htmlFor="">From Date:</label>
                    <input type="date" name="fromDate" id="" />
                </div>
                <div className="inputContainer">
                    <label htmlFor="">To Date:</label>
                    <input type="date" name="toDate" id="" />
                </div>
                <button className='submitBtn'> Find </button>
            </form>
        </div>
        </div>
      </div>
      <div className="cardbody">
        {booksSearch && 
            <div className="topSection">
            
            <div className="countCard">
                <div className="title">
                    <span>Total Past Issues</span>
                </div>
                <div className="value">
                    <span>{bookDetail[0].totalPastIssues || 0}</span>
                </div>
            </div>
            <div className="countCard">
                <div className="title">
                    <span>currently Issued</span>
                </div>
                <div className="value">
                    <span>{bookDetail[0].totalPresentIssues || 0}</span>
                </div>
            </div>
            <div className="countCard">
                <div className="title">
                    <span>Total Rent</span>
                </div>
                <div className="value">
                    <span>{bookDetail[0].totalRentGenerated || 0}</span>
                </div>
            </div>
        </div>
        }
        
        <table>
            <thead>
                
                    {DateRange?<tr>
                         <th>Index</th>
                        <th>Book Name</th>
                        <th>Issue Date</th>
                        <th>Return Date</th>
                        <th>user Name</th>
                    </tr>: <tr>
                        <th>Index</th>
                        <th>Book Name</th>
                        <th>Issue Date</th>
                        <th>Return Date</th>
                    </tr>
                    }
            </thead>
            <tbody>
                {userDetail && userDetail ? userDetail.map((value, key)=>{
                    return <tr key={key}>
                    <td>{key+1}</td>
                    <td>{value.bookName}</td>
                    <td>{new Date(value.issuedate).toISOString().split('T')[0]}</td>
                    <td>{new Date(value.returndate).toISOString().split('T')[0]}</td>
                </tr>
                }): <tr><td colSpan={4}>No Data</td></tr>}
                {DateRange && DateRange ? DateRange.map((value, key)=>{
                    return <tr key={key}>
                    <td>{key+1}</td>
                    <td>{value.bookName}</td>
                    <td>{new Date(value.issuedate).toISOString().split('T')[0]}</td>
                    <td>{new Date(value.returndate).toISOString().split('T')[0]}</td>
                    <td>{value.userName}</td>
                </tr>
                }): <tr><td colSpan={4}>No Data</td></tr>}
                
            </tbody>
        </table>
      </div>
    </div>
  )
}
