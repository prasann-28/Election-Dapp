import React, { useState } from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
const ipfsClient = require('ipfs-mini')
const ipfs = new ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values
 
import ImagePreview from './ImagePreview'; // source code : ./src/demo/AppWithImagePreview/ImagePreview
 
function FaceDetection (props) {
  
                                              
  const isFullscreen = false;
  return (
    <div>
      {
        (dataUri)
          ? <ImagePreview dataUri={dataUri}
            isFullscreen={isFullscreen}
          />
          : <Camera onTakePhotoAnimationDone = {props.captureFilez}
            isFullscreen={isFullscreen}
          />
      }
    </div>
  );
}
 
export default FaceDetection;
