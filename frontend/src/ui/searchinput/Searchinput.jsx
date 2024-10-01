import React, { useRef } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import './searchinput.css'

export default function Searchinput({
  setsearchQuery
}) {
  const searchQuery = useRef();
  const Handlesubmit = (e)=>{
    e.preventDefault();
    const formData= searchQuery.current.value;
    console.log(formData);
    setsearchQuery(formData);
  }
  return (
    <div className='SearchInput'>
      <form onSubmit={(e)=>Handlesubmit(e)}>
        <input type="text" placeholder='Search book, category' className="searchInput" ref={searchQuery} />
        <button className="searchBtn"><SearchIcon/></button>
      </form>
    </div>
  )
}
