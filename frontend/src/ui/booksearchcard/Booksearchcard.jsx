import React, { useEffect, useState } from 'react';
import Searchinput from '../../ui/searchinput/Searchinput';
import CachedIcon from '@mui/icons-material/Cached';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './booksearchcard.css';
import axios from 'axios';

export default function Booksearchcard() {
  const [searchQuery, setsearchQuery] = useState(null);
  const [booksData, setBooksData] = useState([]);
  const [records, setRecords] = useState(5); 
  const [currentPage, setCurrentPage] = useState(1); 

  useEffect(() => {
    const fetchBooks = async () => {
      const { data } = await axios.get('http://localhost:5000/api/books/');
      setBooksData(data);
      if(searchQuery !==null){
        console.log(searchQuery);
        const { data } = await axios.get(`http://localhost:5000/api/books/search?searchValue=${searchQuery}`);
        setBooksData(data);
      }
    };
    fetchBooks();
  }, []);
  useEffect(()=>{
    const fetchSearchedBooks = async () => {
      if (searchQuery !== null && searchQuery.trim() !== '') {
        try {
          console.log('Searching for:', searchQuery);
          const { data } = await axios.get(`http://localhost:5000/api/books/search?searchValue=${encodeURIComponent(searchQuery)}`);
          setBooksData(data);
        } catch (error) {
          console.error('Error fetching searched books:', error);
        }
      }
    }
      fetchSearchedBooks();
  },[searchQuery])

  const indexOfLastRecord = currentPage * records;
  const indexOfFirstRecord = indexOfLastRecord - records;
  const currentRecords = booksData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(booksData.length / records);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <div className='Booksearchcard'>
      <div className="cardHeading">
        <span className="cardHeadingTitle">Book Information</span>
      </div>
      <div className="cardHeader">
        <div className="formSearch">
          <Searchinput setsearchQuery={setsearchQuery} />
        </div>
        <div className="leftSec">
          <button className="refreshBtn">
            <CachedIcon className='refreshIcon' />
          </button>
          <select>
            <option value="1">1-3</option>
          </select>
        </div>
      </div>
      <div className="cardBody">
        <table>
          <thead>
            <tr>
              <th>Index</th>
              <th>Book Name</th>
              <th>Category</th>
              <th>Rent <span className="time">/day</span></th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? currentRecords.map((value, index) => (
              <tr key={index}>
                <td>{indexOfFirstRecord + index + 1}</td>
                <td>{value.book_name}</td>
                <td>{value.category}</td>
                <td>{value.rent_per_day}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4">
                  <h1>No Data to Show</h1>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="cardfooter">
            <div className="recordsManagement">
                <label className="recordsLabel">No. of pages:</label>
                <input type="number" className='recordsNumber' defaultValue={5} min={5} onChange={(e)=> setRecords(e.target.value)} />
            </div>
            <div className="pagination">
                <button onClick={handlePreviousPage} className='paginationBTN' disabled={currentPage === 1}>
                    <ArrowBackIosIcon className='paginationIcon'/>
                </button>
                <span>{currentPage} - {totalPages}</span>
                <button onClick={handleNextPage} className='paginationBTN' disabled={currentPage === totalPages}>
                    <ArrowForwardIosIcon className='paginationIcon'/>
                </button>
            </div>
        </div>
        
      </div>
    </div>
  );
}
