import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import { useNavigate  } from 'react-router-dom';
import axios from 'axios';
import './logout.css';


axios.defaults.withCredentials = true


const Logout = ()=>{

        const history = useNavigate ();

        const out = ()=>{
            localStorage.removeItem("id");
            localStorage.removeItem("Email");
            localStorage.removeItem("name");
            axios.defaults.headers.common["id"]=null;
            axios.post('http://localhost:3001/logout').then(res=>{
                console.log(res.data);})
            history("/login");
        }

        return (
            <React.Fragment>
                <button onClick={out} className="btn btn-primary">logout</button>
            </React.Fragment>
        );
}
 
export default Logout;