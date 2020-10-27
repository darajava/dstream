import React, { useRef, useState, useEffect } from 'react';
import videojs from 'video.js';
import CSSModules from 'react-css-modules';
import styles from './styles.module.css';
import Loading from '../Loading/Loading';
import Hls from "hls.js";
import axios from "axios";
import VideoSubscription from '../VideoSubscription/VideoSubscription';

import { decodeAccessToken } from '../../util';

const VideoPlayer = (props) => {
  const videoNode = useRef(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(true);

  const [user, setUser] = useState(decodeAccessToken());

  useEffect(() => {
    setLoading(true);
    const initPlayer = () => {
      console.log(props);

      var video = videoNode.current;
      var videoSrc = props.sources[0].src;

      // axios.head(videoSrc).catch(() => {
      //   setError(true);
      //   setTimeout(() => {
      //     window.location.reload(false); 
      //   }, 60 * 1000);
      // });

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
        console.log("THERE WAS AN ERROR", event, data)
        cancelTimeout = setTimeout(() => {
          setError(true);
        }, 30 * 1000);
      });

      video.addEventListener('canplay', function() {
        clearTimeout(cancelTimeout);
      });
    };

    console.log("user", user);
    if (user) {
      axios.get('/users/can-watch', {
        params: {
          email: user.email,
          streamKey: props.streamKey,
        }
      }).then(res => {
        setPaid(res.data.authenticated);
        setLoading(false);
        if (res.data.authenticated) {
          initPlayer();
        }
      }).catch(e => {
        setPaid(false);
        setLoading(false);
      })
    } else {
      setPaid(false);
      setLoading(false);
      // do request to see if anyone's allowed access
    }
  }, [paid]);

  if (loading) {
    return <Loading />
  }

  if (!paid) {
    return <VideoSubscription streamKey={props.streamKey} name={props.name} onSuccess={() => setPaid(true)}/>;
  }

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