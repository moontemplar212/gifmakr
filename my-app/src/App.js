import React, { useState, useEffect } from 'react';
import './App.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

const setMode = 2;

function App() {

  const [ ready, setReady ] = useState(false);
  const [ video, setVideo ] = useState();
  const [ gif, setGif ] = useState();
  const [ images, setImages ] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, []);

  const convertToGif = async () => {
    ffmpeg.FS('writeFile', 'name.mp4', await fetchFile(video));
    
    await ffmpeg.run('-i', 'name.mp4', '-t', '2.0', '-ss', '2.0', '-f', 'gif', 'out.gif');

    const data = ffmpeg.FS('readFile', 'out.gif');

    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    setGif(url);
  }

  const convertToImages = async () => {
    ffmpeg.FS('writeFile', `image.gif`, await fetchFile(gif));

    // console.defaultLog = console.log.bind(console);
    // console.logs = [];
    // console.log = function () {
    //   console.defaultLog.apply(console, arguments);
    //   console.logs.push(Array.from(arguments));
    // }

    await ffmpeg.run('-i', 'image.gif','-vsync', '0', '-progress', '-', 'frame%d.png');

    const maxFrames = console.logs.filter(e => e.includes('frame='));
    console.defaultLog(`mf`, maxFrames);

    const data = ffmpeg.FS('readFile', 'frame1.png');

    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    setImages(url);
  }

  const onChangeHandler = {
    gifLoad: (e) => setGif(URL.createObjectURL(e.target.files?.item(0))),
    videoLoad: (e) => setVideo(URL.createObjectURL(e.target.files?.item(0))),
  }

  const mode = {
    1: {
      load: [video, 'videoLoad'],
      set: [gif, setGif],
      convert: convertToGif
    },
    2: {
      load: [gif, 'gifLoad'],
      set: [images, setImages],
      convert: convertToImages
    }
  }

  const loadElement = setMode === 1 ? <video controls width="250" src={video}/> : <img src={gif} width="250" alt="gif"/>;
  
  return ready ? (
    <div className="App">

      { mode[setMode]['load'][0] && loadElement  }
      
      <input type="file" onChange={onChangeHandler[mode[setMode]['load'][1]]}/>

      <h3>Result</h3>
      
      <button onClick={mode[setMode]['convert']}>Convert</button>
      
      { mode[setMode]['set'][0] && <img src={mode[setMode]['set'][0]} width="250" alt={setMode === 1 ? "gif" : "pngs"}/> }
    </div> 
  ) : <p>Loading...</p>;
}

export default App;
