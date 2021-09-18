import React, {useState,useEffect} from 'react';
import Plot from 'react-plotly.js';

//import { getFirestore } from 'firebase/firestore/lite';
import {db} from "../init-firebase";
//import { collection, doc, setDoc } from "firebase/firestore"; 


const View = () => {
  const currDay = '2021-09-18'
const timeVals = [
  "00:00:00", "00:01:00", "00:02:00", "00:03:00", "00:04:00", "00:05:00", "00:06:00", "00:07:00", "00:08:00", "00:09:00", "00:10:00", "00:11:00",
  "00:12:00", "00:13:00", "00:14:00", "00:15:00", "00:16:00", "00:17:00", "00:18:00", "00:19:00", "00:20:00", "00:21:00", "00:22:00", "00:23:00",
]

  const [goal,setGoal] = useState(500);
  const [xDat,setXDat] = useState([]);
  const [y1,setY1] = useState([]);
  const [y2,setY2] = useState([]);
  const [y3,setY3] = useState([]);
  const [y4,setY4] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userlist,setUserlist] = useState([]);

  const ref = db.collection("Users");

  for(let i = 0;i<24;i++){
    timeVals[i] = currDay + ' '+timeVals[i];
  }

  function getUsers(){
    setLoading(true);
    ref.onSnapshot((querySnapshot)=>{
      const items= [];
      const xtmp = [];
      const yLArm = [];
      const yRArm = [];
      const yLLeg = [];
      const yRLeg = [];
      querySnapshot.forEach((doc)=>{
        items.push(doc.data());
        var today = new Date(doc.data().Time.seconds*1000);
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

var dateTime = date+' '+time;
        xtmp.push(dateTime);
        yLArm.push(doc.data().LArm);
        yRArm.push(doc.data().RArm);
        yLLeg.push(doc.data().LLeg);
        yRLeg.push(doc.data().RLeg);
        
      })
      setUserlist(items);
      setXDat(xtmp);
      setY1(yLArm);
      setY2(yRArm);
      setY3(yLLeg);
      setY4(yRLeg);
      console.log(items);
      
    })
    setLoading(false);
  }

  useEffect(()=>{
    getUsers();
  },[]);
  if(loading){
    return <h1>Loading...</h1>;
  }
  console.log(new Date().getTime()-3600000);
  return (
    <div>
      <Plot data={[
                    {
                        x: xDat,
                        y: y1,
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: {color: 'rgb(99, 102, 241)', size: 4},
                    }]}
                layout={{
                    autosize: true,
                    xaxis: {
                        title: 'Date',
                        tickmode: "array",
                        //tickVals: timeVals,
                        //tick0: 30*365*24*3600*1000,
                        range: [new Date().getTime()-12*3600*1000,new Date().getTime()+12*3600*1000],
                        titlefont: {
                            family: 'Inter, sans-serif',
                            size: 18,
                            color: 'black',
                    }},
                    yaxis: {
                        title: 'Number of Hours',
                        range: [0,Math.max(goal, ...y1)*1.1],
                        titlefont: {
                        family: 'Inter, sans-serif',
                        size: 18,
                        color: 'black'
                    }},
                    shapes: [
                        {
                            type: 'rect',
                            x0: 0,
                            y0: goal,
                            x1: xDat.length,
                            y1: Math.max(goal, ...y1)*1.1,
                            fillcolor: 'green',
                            opacity: 0.1,
                            line: {width: 0}
                        },
                        {
                            type: 'line',
                            x0: 0,
                            y0: goal,
                            x1: xDat.length,
                            y1: goal,
                            line: {
                                color: 'green',
                                width: 0.5
                            }
                        }
                    ]

                }}
                useResizeHandler
                style={{ width: '100%', height: '100%' }}

            />


            <Plot data={[
                    {
                        x: xDat,
                        y: y1,
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: {color: 'rgb(99, 102, 241)', size: 4},
                    }]}
                layout={{
                    autosize: true,
                    xaxis: {
                        title: 'Date',
                        tickmode: "array",
                        //tickVals: timeVals,
                        //tick0: 30*365*24*3600*1000,
                        range: [new Date().getTime()-12*3600*1000,new Date().getTime()+12*3600*1000],
                        titlefont: {
                            family: 'Inter, sans-serif',
                            size: 18,
                            color: 'black',
                    }},
                    yaxis: {
                        title: 'Number of Hours',
                        range: [0,Math.max(goal, ...y1)*1.1],
                        titlefont: {
                        family: 'Inter, sans-serif',
                        size: 18,
                        color: 'black'
                    }},
                    shapes: [
                        {
                            type: 'rect',
                            x0: 0,
                            y0: goal,
                            x1: xDat.length,
                            y1: Math.max(goal, ...y1)*1.1,
                            fillcolor: 'green',
                            opacity: 0.1,
                            line: {width: 0}
                        },
                        {
                            type: 'line',
                            x0: 0,
                            y0: goal,
                            x1: xDat.length,
                            y1: goal,
                            line: {
                                color: 'green',
                                width: 0.5
                            }
                        }
                    ]

                }}
                useResizeHandler
                style={{ width: '100%', height: '100%' }}

            />
    </div>
  );
};
  
export default View;