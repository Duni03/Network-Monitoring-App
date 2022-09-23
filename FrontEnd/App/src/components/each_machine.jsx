import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Badge from "react-bootstrap/Badge";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./styles/eachmachine.css";
import Chart from "./chart";
import { useNavigate } from "react-router-dom";

import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";

const EachMachine = () => {
  const history = useNavigate();

/////////////////////////  check if user is logged in or not  //////////////////////////

  const check = async () => {
    try {
      await axios.get("http://localhost:3001/users").then((res) => {
        if (!res.status === 200) {
          const error = new Error(res.error);
          throw error;
        }
      });
    } catch (err) {
      console.log(err);
      history("/login");
    }
  };
  useEffect(() => {
    check();
  }, []);

/////////////////////////  SATES   //////////////////////////

  const { id } = useParams();
  const [machine, setMachine] = useState([]);
  const [edit, setedit] = useState(false);
  const [graphdata, setgraphdata] = useState([]);
  const [warnn, setwarnn] = useState(false);
  const [time, settime] = useState("Day");
  const [msg, setmsg] = useState("Hello User,\n\nThis message is to warn for accessing domains which is not a part of business process");
  const [mailstate, setmailstate] = useState(false);
  const [ajax, setajax] = useState(false);

/////////////////////////  METHODS  //////////////////////////

  const check1 = async () => {
    try {
      await axios
        .post("http://localhost:3001/getmachine", { id })
        .then((res) => {
          if (!res.status === 200) {
            const error = new Error(res.error);
            throw error;
          }
          setMachine(res.data);
          seteip(res.data.Machineip);
          setemac(res.data.Machinemac);
          setename(res.data.MachineName);
          seteemail(res.data.MachineEmail);
          var arr = [
            {
              name: "Sent Packets",
              p: res.data.daily.packetssent,
            },
            {
              name: "Received Packets",
              p: res.data.daily.packetrecived,
            },
            {
              name: "Total Packets",
              p: res.data.daily.packetssent+res.data.daily.packetrecived,
            }
          ];
          setgraphdata(arr);
          console.log(res.data);
        });
    } catch (err) {
      console.log(err);
      history("/machine");
    }
  };
  useEffect(() => {
    check1();
  }, [ajax]);

  const [eip, seteip] = useState(machine.Machineip);
  const [ename, setename] = useState(machine.MachineName);
  const [eemail, seteemail] = useState(machine.MachineEmail);
  const [emac, setemac] = useState(machine.Machinemac);

  const add = async () => {
    try {
      await axios
        .patch("http://localhost:3001/updatemachine", {
          id: id,
          Machineip: eip,
          Machinemac: emac,
          MachineName: ename,
          MachineEmail: eemail,
        })
        .then((res) => {
          //console.log(res.data);
          setedit(!edit);
          setajax(!ajax);
        });
    } catch (err) {
      console.log(err);
    }
  }

  const sendemail = async () => {
    try {
      await axios
        .post("http://localhost:3001/sendemail", {
          email: eemail,
          msg: msg,
        })
        .then((res) => {
          console.log(res.data);
          setwarnn(false);
        });
    } catch (err) {
      console.log(err);
    }
  }

  // const reportdown = () => {
  //   const input = document.getElementById("each-domain");
  //   html2canvas(input)
  //     .then((canvas) => {
  //       const imgData = canvas.toDataURL('image/png');
  //       const pdf = new jsPDF();
  //       pdf.addImage(imgData, 'JPEG', 0, 0);
  //       // pdf.output('dataurlnewwindow');
  //       pdf.save("download.pdf");
  //     })
  // }

  const reportdown = async (machine) => {
    const element = document.getElementById("each-domain");
    const canvas = await html2canvas(element).catch((err) => {console.log(err);});
    const data = canvas.toDataURL('image/png');

    const element1 = document.getElementById("graph");
    const canvas1 = await html2canvas(element1).catch((err) => {console.log(err);});
    const data1 = canvas1.toDataURL('image/png');

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight =
      (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.setFontSize(20);
    pdf.setFont("times","bold");
    pdf.setTextColor(255, 0, 0);
    pdf.text(85, 10, machine.MachineName+" Report");
    pdf.setFontSize(13)
    pdf.text(15, 20, "Ip Address :"+machine.Machineip+", Mac Address :"+machine.Machinemac+", Email :"+machine.MachineEmail);
    pdf.setFontSize(20);
    pdf.text(85, 30, "Traffic");
    pdf.addImage(data1, 'PNG', 5, 40, 150, 100);
    pdf.addPage();
    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('print.pdf');
  };

  /////////////////////////  RENDERS  //////////////////////////

  const editForm = (machine) => {
    return(
      <div>
        <form>
        <Container>
          <Row>
            <Col><label>Machine Name</label><input className="form-control" type="text" value={ename} onChange={(e)=>{setename(e.target.value)}} required></input></Col>
          </Row>
          <Row>
            <Col><label>Machine Ip Address</label><input className="form-control" type="text" value={eip} onChange={(e)=>{seteip(e.target.value)}} required></input></Col>
            <Col><label>Machine Mac Address</label><input className="form-control" type="text" onChange={(e)=>{setemac(e.target.value)}} value={emac} required></input></Col>
            <Col><label>Machine Email</label><input className="form-control" type="text" onChange={(e)=>{seteemail(e.target.value)}} value={eemail} required></input></Col>
          </Row>
        </Container>
        </form>
      </div>
    );
  }

  const mail = (
    <div className="mailing">
      <h3>Machine Email</h3>
      <Form>
      <Form.Group >
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" value={eemail} disabled/>
      </Form.Group>
      <Form.Group>
        <Form.Label>Message</Form.Label>
        <Form.Control as="textarea" rows={6} value={msg} onChange={(e)=>{setmsg(e.target.value)}}/>
      </Form.Group>
    </Form><br/>
    <Button variant="primary" type="submit" onClick={()=>{sendemail();setmailstate(true)}}>Send Mail</Button>
    </div>
  );

  /////////////////////////  RETURN  //////////////////////////

  return (
    <div className="each-machine">
      <div className="main">
        <div className="machine-head1">
        <Container>
          <Row>
            <Col><h1>{machine.MachineName}</h1></Col>
            <Col><h5>{machine.Status === "Online" ? (<Badge className="status" bg="success">online</Badge>) : (<Badge className="status" bg="danger">offline</Badge>)}</h5></Col>
          </Row>
          <Row>
            <Col><h5>Mac : {machine.Machinemac}</h5></Col>
            <Col><h5>ip : {machine.Machineip}</h5></Col>
            <Col><h5>Email : {machine.MachineEmail}</h5></Col>
          </Row>
        </Container>
        {edit?<><Button className="btn btn-primary" onClick={()=>{setedit(false);add();}}>Save</Button>{' '}<Button className="btn btn-primary" onClick={()=>setedit(false)}>Cancel</Button></>:<button className="btn btn-primary details" onClick={()=>setedit(true)}>Edit</button>}{" "}<Button onClick={()=>{reportdown(machine)}}>Generate Report</Button>
        {edit?editForm(machine):null}
        </div>
      </div>
      <div>
          {machine.domain ? (machine.count>8?<div className="warning"><><h3>{machine.MachineName} has accessed {machine.count} restricted domains</h3>{' '}<Button className="btn btn-primary" onClick={()=>{setwarnn(!warnn)}}>Warn</Button></></div>:null) : null}<br/>
          {warnn?mail:null}
      </div><br/>

      <center>
      <h3>Traffic</h3>
      <div>
        <Container>
          <Row className="justify-content-md-center">
            <div className="graphing">
            <DropdownButton id="dropdown-basic-button" title={time}>
              <Dropdown.Item href="#/action-1" onClick={()=>{settime("Day")}}>Day</Dropdown.Item>
              <Dropdown.Item href="#/action-2" onClick={()=>{settime("Week")}}>Week</Dropdown.Item>
              <Dropdown.Item href="#/action-3" onClick={()=>{settime("Month")}}>Month</Dropdown.Item>
            </DropdownButton>
              <h3>{time}</h3>
              <Col  id="graph">
                <Chart dat={graphdata} />
              </Col>
            </div>
            {/* <div className="graphing"><h3>Week</h3><Col><Chart dat={graphdata}/></Col></div>
            <div className="graphing"><h3>Month</h3><Col><Chart dat={graphdata}/></Col></div> */}
          </Row>
        </Container>
      </div>
      </center><br/>
      <div className="each-domain" id="each-domain">
        {machine.domain ? <h3>Visited Domains</h3> : null}
        <table><tbody>
        {machine.t?machine.t.map((e, inx) => {return (<tr key={inx}><th className="each1">{Object.keys(e)}</th><th className="each2">{e[Object.keys(e)]}</th></tr>)}): null}
        </tbody>
        </table>
      </div>
      <br/>
      <br/>
    </div>
  );
};

export default EachMachine;
