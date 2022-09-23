import React,{useEffect,useState} from "react";
import './styles/domain.css';
import axios from 'axios';
import { useNavigate ,BrowserRouter as Router, Route, Switch,Link } from 'react-router-dom';


const Domain = () => {

/////////////////////////////////// STATES /////////////////////////////////////////////////

    const [reg,setreg] = useState(false);
    const [domain, setdomain] = useState([]);
    const [name, setname] = useState("");
    const [ajax, setajax] = useState(false);

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
            console.log(err);
            history("/login");
        }
    }
    useEffect(()=>{
         check();
    },[]);

/////////////////////////////////// METHODS /////////////////////////////////////////////////

    const deleteDomain = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/delete-domain/${id}`).then((res) => {
                console.log(res.data);
                setajax(!ajax);
            });
        } catch (err) {
            console.log(err);
        }
    }

    const add = async ()=>{
        try {
            await axios.post("http://localhost:3001/register-domain",{"Domain":name}).then((res) => {
              console.log(res.data);
              setajax(!ajax);
            });
          } catch (err) {
            console.log(err);
          }
    }

const gettin = async () => {
    try {
      await axios.get("http://localhost:3001/domain").then((res) => {
        if (res.data) {
          setdomain(res.data);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    gettin();
  }, [ajax]);



/////////////////////////////////// RENDER /////////////////////////////////////////////////

    const addDomain = (
        <div className="addDomain">
            <h1>Add Domain</h1>
            <form>
                <label>Domain Name</label>
                <input type="text" className="form-control" onChange={(e)=>{setname(e.target.value)}}></input>
            </form>
        </div>
    );

    const showDomain = (
        <>
        <h1>Domains</h1>
      {domain.map((n,inx) => {
        return (
          <div key={inx} className="card">
            <div className="card-body">
              <h5 className="card-title">{n.Domain}</h5>
              <div className="domain-delete">
              <button className="btn btn-danger" size="sm" onClick={()=>{deleteDomain(n._id)}}>Delete</button>
              </div>
            </div>
          </div>
        );
      })}
    </>
    );

    
    /////////////////////////////////// RETURN /////////////////////////////////////////////////

    return (
        <div className="Domain">
            <div className="Domain-in">
            <h1>Domain</h1>
            {reg?<button className="btn btn-primary" onClick={()=>{setreg(!reg);add();}}>Save</button>:<button className="btn btn-primary" onClick={()=>{setreg(!reg);}}>+ Add Domain</button>}
            {reg?addDomain:null}
            {showDomain}
            </div>
        </div>
    );
}

export default Domain;