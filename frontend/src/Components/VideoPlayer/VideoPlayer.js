import React, { useRef, useState, useEffect } from 'react';
import videojs from 'video.js';
import CSSModules from 'react-css-modules';
import styles from './styles.module.css';
import Loading from '../Loading/Loading';
import Hls from "hls.js";
import axios from "axios";

const VideoPlayer = (props) => {
  const videoNode = useRef(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initPlayer = () => {
      console.log(props);

      var video = videoNode.current;
      var videoSrc = props.sources[0].src;

      axios.head(videoSrc).catch(() => {
        setError(true);
        setTimeout(() => {
          window.location.reload(false); 
        }, 30 * 1000);
      });

      console.log(videoSrc);
      var hls = new Hls();

      const unmute = e => {
        video.muted = false;
        e.preventDefault();

        video.removeEventListener("click", unmute, false);
      }

      video.addEventListener("click", unmute);

      //
      // First check for native browser Hls support
      //
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', function() {
          video.play();
        });
      //
      // If no native Hls support, check if hls.js is supported
      //
      } else if (Hls.isSupported()) {
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
          video.play();
        });
      }

      let cancelTimeout;

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.log("THERE WAS AN ERROR")
        cancelTimeout = setTimeout(() => {
          setError(true);
        }, 30 * 1000);
      });

      video.addEventListener('canplay', function() {
        clearTimeout(cancelTimeout);
      });
    };

    initPlayer();
  }, []);

  if (error) {
    return (
      <div>
        This stream is not live, please check back again later.
      </div>
    );
  }
  return (
    <div> 
      <video autoplay muted controls ref={ videoNode }></video>
    </div>
  )
}

// export default CSSModules(VideoPlayer, styles);
export default CSSModules(VideoPlayer, styles);