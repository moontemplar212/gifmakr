import React, { useState, useEffect } from 'react';
import './App.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

function App() {

  const [ ready, setReady ] = useState(false);
  const [ video, setVideo ] = useState();
  const [ gif, setGif ] = useState();

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
  
  return ready ? (
    <div className="App">

      { video && <video controls width="250" src={video}/>  }
      
      <input type="file" onChange={e => setVideo(URL.createObjectURL(e.target.files?.item(0)))}/>

      <h3>Result</h3>
      
      <button onClick={convertToGif}>Convert</button>
      
      { gif && <img src={gif} width="250" alt="gif"/> }
    </div> 
  ) : <p>Loading...</p>;
}

export default App;
