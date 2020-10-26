import React, {useEffect, useState} from 'react';
import Button from '../Button/Button';
import RecentStreamItem from '../RecentStreamItem/RecentStreamItem';
import CSSModules from 'react-css-modules';
import VideoPlayer from "../VideoPlayer/VideoPlayer";

const EmbedContent = (props) => {
  const videoJsOptions = {
    autoplay: "autoplay",
    controls: true,
    sources: [{
      src: `https://domestream.xyz/hls/${process.env.REACT_APP_STREAM_KEY}.m3u8`,
      type: 'application/x-mpegURL'
    }]
  };

  if (process.env.REACT_APP_STREAM_KEY === "demo") {
    videoJsOptions.sources[0] = {
      src: `https://domestream.xyz/demo.mp4`,
      type: 'video/mp4'
    };
  }

  let content = (
    <div style={{width: "100vw"}}>
      <VideoPlayer { ...videoJsOptions } />
    </div>
  );

  return (
    content
  );
}

export default EmbedContent;
