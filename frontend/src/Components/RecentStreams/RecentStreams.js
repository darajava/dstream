import React, {useEffect, useState} from 'react';
import Button from '../Button/Button';
import RecentStreamItem from '../RecentStreamItem/RecentStreamItem';
import CSSModules from 'react-css-modules';
import styles from './styles.module.css';

const RecentStreams = (props) => {

  function urlExists(url) {
      const http = new XMLHttpRequest();
      http.open('HEAD', url, false);
      http.send();

      return http.status !== 404;
  }

  const [availableArchives, setAvailableArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const archives = [];
    for (let i = 0; i < 4; i++) {
      if (urlExists(`https://domestream.xyz/recordings/${process.env.REACT_APP_STREAM_KEY}/${i}.json`)) {
        archives.push(i);
      }
    }
    setLoading(false);
    setAvailableArchives(archives);
  }, []);

  let content;

  if (loading) {
    content = <div styleName="loading">Loading...</div>
  } else if (availableArchives.length) {
    content = availableArchives.map(item =>
      <RecentStreamItem urlIndex={item} />
    );
    console.log(content);
  } else {
    content = (
      <div styleName="no-stream">
        {process.env.REACT_APP_NAME} has no recorded streams. 
      </div>
    )
  }

  return (
    <React.Fragment>
      {content}

      <Button onClick={props.onClick}>View Live Stream</Button>
    </React.Fragment>
  )
}

export default CSSModules(RecentStreams, styles);
