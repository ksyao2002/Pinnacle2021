import React, {useState,useEffect} from 'react';

//import { getFirestore } from 'firebase/firestore/lite';
import {db} from "../init-firebase";
//import { collection, doc, setDoc } from "firebase/firestore"; 
  
const View = () => {
  const [loading, setLoading] = useState(false);
  const [userlist,setUserlist] = useState([]);

  const ref = db.collection("Users");

  function getUsers(){
    setLoading(true);
    ref.onSnapshot((querySnapshot)=>{
      const items= [];
      querySnapshot.forEach((doc)=>{
        items.push(doc.data());
      })
      setUserlist(items);
    })
    setLoading(false);
  }

  useEffect(()=>{
    getUsers();
  },[]);
  if(loading){
    return <h1>Loading...</h1>;
  }
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'Right',
        alignItems: 'Right',
        height: '100vh'
      }}
    >
      <h1>Welcome to GeeksforGeeks Blogs</h1>
    </div>
  );
};
  
export default View;