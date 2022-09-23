import React, { useEffect, useState } from "react";
import "./styles/machine.css";
import axios from "axios";
import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import {
  useNavigate,
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
} from "react-router-dom";

const Machine = () => {
  const history = useNavigate();

  const check = async ()=>{
    try{
        await axios.get('http://localhost:3001/users').then(res=>{
            if(!res.status===200){
                const error = new Error(res.error);
                throw error;
            }
        })
    }catch(err){
        console.log(err);
        history("/login");
    }
}
useEffect(()=>{
     check();
},[]);

/////////////////////////////////// STATES /////////////////////////////////////////////////

  const [machine, setMachine] = useState([]);
  const [onlinemachine, setonlinemachine] = useState([]);
  const [reg, setreg] = useState(false);
  const [name, setname] = useState("");
  const [num, setnum] = useState("");
  const [email, setemail] = useState("");
  const [id, setid] = useState("");
  const [ajax, setajax] = useState(false);

/////////////////////////////////// METHODS /////////////////////////////////////////////////

  const add = async () => {
    try {
      await axios.post("http://localhost:3001/register-machine",{"Machineip":id,"Machinemac":num,"MachineName":name,"MachineEmail":email}).then((res) => {
        console.log(res.data);
        setajax(!ajax);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const deleteMachine = async (id) => {
    try { 
      await axios.delete(`http://localhost:3001/delete-machine/${id}`).then((res) => {
        console.log(res.data);
        setajax(!ajax);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const gettin = async () => {
    try {
      await axios.get("http://localhost:3001/machines").then((res) => {
        if (res.data) {
          setMachine(res.data);
          console.log(res.data);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    gettin();
  }, [ajax]);

  const allonlines = async () => {
    try {
      await axios.get("http://localhost:3001/localdevices").then((res) => {
        if (res.data) {
          console.log(res.data);
          setonlinemachine(res.data);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    allonlines();
  }, [ajax]);

  /////////////////////////////////// RENDER /////////////////////////////////////////////////

  const addMachine = (
    <div className="MachineForm">
      <form>
      <label>Machine Ip</label>
      <input type="text" className="form-control" onChange={(e)=>{setid(e.target.value)}}></input>
      <label>Model Mac</label>
      <input type="text" className="form-control" onChange={(e)=>{setnum(e.target.value)}}></input>
      <label>Manager's Name</label>
      <input type="text" className="form-control" onChange={(e)=>{setname(e.target.value)}}></input>
      <label>Manager's Email</label>
      <input type="email" className="form-control" onChange={(e)=>{setemail(e.target.value)}}></input>
      </form>
    </div>
  );

  const showMachine = (
    <>
      {machine.map((n,inx) => {
        return (
          <div key={inx}>
          <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>{n.MachineName}{n.Status==="Online"?<Badge className="status1" bg="success">online</Badge>:<Badge className="status1" bg="danger">offline</Badge>}</Accordion.Header>  
                <Accordion.Body>
                  Aditional info 
                  {"  "}<a href={"/machine/"+n._id} className="btn btn-primary details" style={{ textAlign: 'right' }}>
                    Details
                  </a><br/>
                  <button className="btn btn-danger" size="sm" onClick={()=>{alert("Are you sure to delete");deleteMachine(n._id)}}>Delete</button>
                </Accordion.Body>
            </Accordion.Item>
          </Accordion><br/>
          {/* <div key={inx} className="card">
            <div className="card-body">
              <h5 className="card-title">{n.MachineName}</h5>
              <p className="card-text-right">{n.Status}</p>
              <a href={"/machine/"+n._id} className="btn btn-primary">
                Go somewhere
              </a>
            </div>
          </div> */}
          </div>
        );
      })}
    </>
  );

/////////////////////////////////// RETURN /////////////////////////////////////////////////

  return (
    <div className='mt-5'>
    <div className="Machine">
      <h1>Machine</h1>
      {reg ? ( <button className="btn btn-primary" onClick={() => {setreg(!reg);add();}}>Save</button>) : (<button className="btn btn-primary" onClick={() => {setreg(!reg);}}>+ Add Machine</button>)}
      <br/>
      {reg ? addMachine : null}<br/>
      <button className="btn btn-primary" onClick={()=>{setajax(!ajax)}}>Refresh</button><br/><br/>
      <h1>Machines Connected</h1>
      <Container>
      {onlinemachine.length>0?(onlinemachine.map((n,inx)=>{
          return(
            
              <Row key={inx}>
                <Col><h5>Ip : {n.ip}</h5></Col>
                <Col><p>Mac : {n.mac}</p></Col>
              </Row>

          )
        })):(<h4>No Machines Connected</h4>)}
      </Container>
      
      <h1>Monitoring Machines</h1>
      {showMachine}<br/>
    </div>
    </div>
  );
};

export default Machine;
