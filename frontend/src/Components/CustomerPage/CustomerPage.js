import React, { useState, useEffect } from "react";
import CSSModules from "react-css-modules";
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import Loading from '../Loading/Loading';
import Modal from '../Modal/Modal';
import Contact from '../Contact/Contact';
import Footer from '../Footer/Footer';
import styles from "./customer-page.module.scss";
import { useParams } from "react-router-dom";
import axios from "axios";

const CustomerPage = () => {

  let { stream_key } = useParams();
  if (!stream_key) {
    stream_key = "default";
  }

  const [customerDetails, setCustomerDetails] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const oldTitle = "DStream";

  const videoJsOptions = {
    autoplay: "autoplay",
    controls: true,
    sources: [{
      src: `https://domestream.xyz/hls/${stream_key}.m3u8`,
      type: 'application/x-mpegURL'
    }]
  };

  useEffect(() => {
    axios.get(
      "/customer-details",
      {
        params: {
          stream_key,
        }
      }
    ).then(res => {
      setCustomerDetails(res.data);
      setLoading(false);

      if (!res.data) {
        setError("Could not find customer.");
      }
    });
  }, []);

  useEffect(() => {
    if (customerDetails) {
      console.log(customerDetails);
      document.title = customerDetails.name + " - live stream";
    }

    return () => {
      document.title = "DStream";
    }
  }, [customerDetails]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return error;
  }

  return (
    <div styleName={customerDetails.theme || "light"}>
      <div styleName="customer-page">
        <div styleName="header">
          <img styleName="logo" src={`/logos/${stream_key}.png`} />
          
          <div styleName="name">
            {customerDetails.name} - live stream
          </div>
        </div>

        <div styleName="video-container">
          <div styleName="video-player">
            <div styleName="content">
              <VideoPlayer { ...videoJsOptions } />
            </div>
          </div>
        </div>

        <Footer onClick={() => setModalOpen(true)} theme={customerDetails.theme}/>
      </div>

      {
        modalOpen &&
        <Modal title="Contact" onClose={() => setModalOpen(false)}>
          <Contact />
        </Modal>
      }
    </div>
  );
}

export default CSSModules(CustomerPage, styles);