import React, { Component } from 'react';
import { useState,useEffect } from "react";
import axios from 'axios';
import {Link} from 'react-router-dom';
import './styles/password.css';
import {useNavigate } from "react-router-dom"

const Password = () => {

    const [password,setpassword] = useState("");
    const [newpassword,setnewpassword] = useState("");
    const [cnewpassword,setcnewpassword] = useState("");

    const history = useNavigate ();
        const check = async ()=>{
            try{
                await axios.get('http://localhost:3001/users').then(res=>{
                    if(!res.status===200){
                        const error = new Error(res.error);
                        throw error;
                    }
                })
            }catch(err){
                //console.log(err);
                history("/login");
            }
        }
        useEffect(()=>{
             check();
        },[]);

    const change = async ()=>{
        if(newpassword===cnewpassword){
            try{
                await axios.post('http://localhost:3001/changePassword',{_id:localStorage.getItem("id"),password,newpassword,cnewpassword}).then(res=>{
                    console.log("calling");
                    if(res.data==="Password Changed"){
                        alert("Password Changed");
                    }
                    if(res.data==="Password Not Changed"){
                        alert("Password Not Changed Enter Correct Old Password");
                    }
                })
            }catch(err){
                console.log(err);
            }
        }
        else{
            alert("Enter Same Password");
        }
        
    }

    return (
        <div className="password">
            <center><h3>Change Password</h3></center>
            <div className="form">
                <label>Old Password</label>
                <input className="form-control" type="password" name="oldpassword" placeholder="Old Password" onChange={(e)=>{setpassword(e.target.value)}} required/><br/>
                <label>New Password</label>
                <input className="form-control" type="password" name="newpassword" placeholder="New Password" onChange={(e)=>{setnewpassword(e.target.value)}} required/><br/>
                <label>Confirm Password</label>
                <input className="form-control" type="password" name="confirmpassword" placeholder="Confirm Password" onChange={(e)=>{setcnewpassword(e.target.value)}} required/><br/>
                <button className='btn btn-primary' onClick={change}>Change Password</button>
            </div>
        </div>
    )
}

export default Password;