import cv2
from imutils.video import VideoStream

import math
from typing import List, Tuple, Union
import dataclasses
import numpy as np

from mediapipe.framework.formats import landmark_pb2

import mediapipe as mp

from imutils.video import FileVideoStream
import imutils

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    min_detection_confidence=0.5, min_tracking_confidence=0.5)
import time
from datetime import datetime
import time
from flask import Flask
from flask import Response
import threading
from collections import deque
#from api import *
import json

#config = json.load(open('config.json'))

NOSE = 0
RIGHT_EYE_INNER = 1
RIGHT_EYE = 2
RIGHT_EYE_OUTER = 3
LEFT_EYE_INNER = 4
LEFT_EYE = 5
LEFT_EYE_OUTER = 6
RIGHT_EAR = 7
LEFT_EAR = 8
MOUTH_RIGHT = 9
MOUTH_LEFT = 10
RIGHT_SHOULDER = 11
LEFT_SHOULDER = 12
RIGHT_ELBOW = 13
LEFT_ELBOW = 14
RIGHT_WRIST = 15
LEFT_WRIST = 16
RIGHT_PINKY = 17
LEFT_PINKY = 18
RIGHT_INDEX = 19
LEFT_INDEX = 20
RIGHT_THUMB = 21
LEFT_THUMB = 22
RIGHT_HIP = 23
LEFT_HIP = 24
RIGHT_KNEE = 25
LEFT_KNEE = 26

from flask import Flask
app = Flask(__name__)

def analyze_frames(image):
    # To improve performance, optionally mark the image as not writeable to
    # pass by reference.
    image.flags.writeable = False
    results = pose.process(image)
    if results.pose_landmarks is None:
        return None
    # Draw the pose annotation on the image.
    image.flags.writeable = True
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

@app.route('/')
def hello_world():
   return 'Hello World'

if __name__ == '__main__':
   app.run(debug = True)