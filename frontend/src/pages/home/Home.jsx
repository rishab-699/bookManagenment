import React, { useEffect, useState } from 'react'
import './home.css'
import axios from 'axios';
import Navbar from '../../ui/navbar/Navbar'
import Booksearchcard from '../../ui/booksearchcard/Booksearchcard';
import Registeruser from '../../ui/registeruser/Registeruser';
import Bookreturn from '../../ui/returnbook/Bookreturn';
import Bookissue from '../../ui/issuebook/Bookissue';
import Transactions from '../../ui/transactions/Transactions';


export default function Home() {
  const [actions, setActions] = useState(null);
  console.log(actions);
  return (
    <div className='Home'>
      <Navbar/>
      <div className="bookTransactions">
        <button className="ActionBtns" onClick={()=>setActions('register')}>Register User</button>
        <button className="ActionBtns" onClick={()=>setActions('issue')}>Issue Books</button>
        <button className="ActionBtns" onClick={()=>setActions('return')}>Return Books</button>
      </div>
      <Booksearchcard/>
      <Transactions/>
      {actions === 'register' && <Registeruser setActions={setActions}/>}
      {actions === 'issue' && <Bookissue setActions={setActions} />}
      {actions === 'return' && <Bookreturn setActions={setActions}/>}
    </div>
  )
}
