import React, {useEffect, useState} from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.module.css';
import axios from 'axios';
import moment from 'moment';
import { FaDownload } from 'react-icons/fa';

const RecentStreamItem = ({urlIndex}) => {
  const baseUrl = `https://domestream.xyz/recordings/${process.env.REACT_APP_STREAM_KEY}/${urlIndex}`;
  const jsonUrl = `${baseUrl}.json?rand=${Math.round(Math.random() * 10000)}`;
  const jpgUrl = `${baseUrl}.jpg?rand=${Math.round(Math.random() * 10000)}`;
  const mp4Url = `${baseUrl}.mp4?rand=${Math.round(Math.random() * 10000)}`;
  const mp3Url = `${baseUrl}.mp3?rand=${Math.round(Math.random() * 10000)}`;

  const [time, setTime] = useState();

  useEffect(() => {
    axios.get(jsonUrl).then(res => {
      setTime(moment.unix(res.data.time).format('MMMM Do \'YY, h:mm a'));
    });
  }, []);

  return (
    <div styleName="recent-stream-item">
      <div styleName="image" onClick={() => document.location = mp4Url}>
        <img src={jpgUrl} />
      </div>
      <div styleName="info-holder">
        <div styleName="title">
          Event on {time}
        </div>
        <div styleName="button-holder">
          <div onClick={() => document.location = mp4Url} styleName="button"><FaDownload /> Video</div>
          <div onClick={() => document.location = mp3Url} styleName="button"><FaDownload /> Audio</div>
        </div>
      </div>
    </div>
  )
}

export default CSSModules(RecentStreamItem, styles);
