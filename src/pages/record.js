
import { Pose } from "@mediapipe/pose";
import React, { useState,useRef, useEffect } from "react";
import * as Pose1 from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";

import Webcam from "react-webcam";
import * as window from "@mediapipe/drawing_utils"

import { initializeApp } from 'firebase/app';
//import { getFirestore } from 'firebase/firestore/lite';
import {db} from "../init-firebase";
import firebase from 'firebase/app'
//import { collection, doc, setDoc } from "firebase/firestore"; 



function Record() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const connect = window.drawConnectors;
  var camera = null;
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [landmarkPos, setLandmarkPos] = React.useState([]);

  const stateRef = useRef();
  const stateRefLandmarks = useRef([]);
  stateRef.current = capturing;
  stateRefLandmarks.current = landmarkPos;
  //const db = firebaseApp.firestore();
  
  

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
        
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
    console.log(stateRefLandmarks.current);
    const movavg = []
    for(let i = 2;i<stateRefLandmarks.current.length-2;i++){
      const tmp = [];
      for(let j = 0;j<33;j++){
          tmp[j] = {visibility: (stateRefLandmarks.current[i-2][j].visibility+stateRefLandmarks.current[i-1][j].visibility+stateRefLandmarks.current[i][j].visibility+stateRefLandmarks.current[i+1][j].visibility+stateRefLandmarks.current[i+2][j].visibility)/5.0,
            x: (stateRefLandmarks.current[i-2][j].x+stateRefLandmarks.current[i-1][j].x+stateRefLandmarks.current[i][j].x+stateRefLandmarks.current[i+1][j].x+stateRefLandmarks.current[i+2][j].x)/5.0,
            y: (stateRefLandmarks.current[i-2][j].y+stateRefLandmarks.current[i-1][j].y+stateRefLandmarks.current[i][j].y+stateRefLandmarks.current[i+1][j].y+stateRefLandmarks.current[i+2][j].y)/5.0,
            z: (stateRefLandmarks.current[i-2][j].z+stateRefLandmarks.current[i-1][j].z+stateRefLandmarks.current[i][j].z+stateRefLandmarks.current[i+1][j].z+stateRefLandmarks.current[i+2][j].z)/5.0
          };

      }
      movavg[i-2] = tmp;
    }
    console.log(movavg);
    const vel = []
    for(let i = 1;i<movavg.length-1;i++){
      //const tmp = [];
      for(let j = 0;j<33;j++){
        if(i==1){
          vel[j]=0;
        }
        let back = movavg[i-1][j];
        let front = movavg[i+1][j];
        if(back.visibility>0.99&&front.visibility>0.99){
          vel[j] += Math.sqrt(Math.pow(front.x-back.x,2)+ Math.pow(front.y - back.y,2)+ Math.pow(front.z - back.z,2));
        }
      }
      //vel[i-1] = tmp;
    }
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

var dateTime = date+' '+time;
var test = firebase.firestore.Timestamp.fromDate(new Date());
console.log(test);
    const ref = db.collection("Users").add({
      Name: 'Kevin',
      Time: test,
      LArm: vel[14],
      RArm: vel[13],
      LLeg: vel[26],
      RLeg: vel[25]
    }).then(ref1 => {
      console.log('document ID: ', ref1.id);
    });

    //pass landmarks 13, 14, 25, and 26 to server
    //only if visibility is above 0.99 we will analyze. Otherwise, movement is set to zero

  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/mp4"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  function onResults(results) {
    // const video = webcamRef.current.video;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // Set canvas width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
  connect(canvasCtx, results.poseLandmarks, Pose1.POSE_CONNECTIONS,
                 {color: '#00FF00', lineWidth: 4});
  console.log(stateRef.current)
  if(stateRef.current==true){
    stateRefLandmarks.current = [...stateRefLandmarks.current,[...results.poseLandmarks]];
    
  }
  
  window.drawLandmarks(canvasCtx, results.poseLandmarks,
                {color: '#FF0000', lineWidth: 2});
  canvasCtx.restore();
    
  }
  // }

  // setInterval(())
  useEffect(() => {
    const pose = new Pose({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }});
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    
    pose.onResults(onResults);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await pose.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);
  return (
    <div>
    <center>
      <div className="App">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />{" "}
        <canvas
          ref={canvasRef}
          className="output_canvas"
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        ></canvas>
        
      </div>
      
    </center>
    <center>
      {capturing ? (
        <button onClick={handleStopCaptureClick} style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          top:500,

          textAlign: "center",
          zindex: 9,
          width: 300,
          height: 50,
        }}>Stop Capture</button>
      ) : (
        <button onClick={handleStartCaptureClick} style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          top:500,
          
          textAlign: "center",
          zindex: 9,
          width: 300,
          height: 50,
        }}>Start Capture</button>
      )}
      {recordedChunks.length > 0 && (
        <button onClick={handleDownload} style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          top:560,
          
          textAlign: "center",
          zindex: 9,
          width: 300,
          height: 50,
        }}>Download</button>
      )}
    </center>
    </div>
  );
}

export default Record;


//source: https://github.com/mozmorris/react-webcam