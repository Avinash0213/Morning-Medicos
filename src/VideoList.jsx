import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = 'AIzaSyARv-5r9V0Twt_sFhV7UlDY_fxJuWMxTrA'; // Replace with your API key
const CHANNEL_ID = 'UCT37z9xiMyJ9qCV-hXHIFxw'; // Replace with your Channel ID

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [toggleVideosAndShorts, setToggleVideosAndShorts] = useState(true);

  const fetchVideos = async (pageToken = '') => {
    try {
      const channelResponse = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
        params: {
          part: 'contentDetails',
          id: CHANNEL_ID,
          key: API_KEY,
        },
      });

      const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

      const playlistResponse = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
        params: {
          part: 'snippet',
          playlistId: uploadsPlaylistId,
          maxResults: 50,
          pageToken: pageToken,
          key: API_KEY,
        },
      });

      // Separate shorts and regular videos
      const fetchedVideos = playlistResponse.data.items;
      const regularVideos = fetchedVideos.filter(video => !video.snippet.thumbnails.hasOwnProperty('maxres'));
      const shortsVideos = fetchedVideos.filter(video => video.snippet.thumbnails.hasOwnProperty('maxres'));

      setVideos((prevVideos) => [...prevVideos, ...regularVideos]);
      console.log(shortsVideos)
      setShorts((prevShorts) => [...prevShorts, ...shortsVideos]);
      setNextPageToken(playlistResponse.data.nextPageToken || '');
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };
  const removeTextAfterHash = (text) => {
  const hashIndex = text.indexOf('#');
  return hashIndex !== -1 ? text.substring(0, hashIndex) : text;
};

  

  useEffect(() => {
    if (CHANNEL_ID) {
      fetchVideos();
    }
  }, [CHANNEL_ID]);

  const loadMoreVideos = () => {
    if (nextPageToken) {
      fetchVideos(nextPageToken);
    }
  };

  return (
    <div className="video-list-container">
      <h3>Welcome to Morning Medicos</h3>
      {/* <button onClick={() => setToggleVideosAndShorts(!toggleVideosAndShorts)}>
        {toggleVideosAndShorts ? 'Show Shorts' : 'Show Regular Videos'}
      </button> */}
      <label className="toggle-button">
        <input 
          type="checkbox" 
          checked={toggleVideosAndShorts} 
          onChange={() => setToggleVideosAndShorts(!toggleVideosAndShorts)} 
        />
        <span className="slider"></span>
      </label>
      <span className="slider-label">
        {toggleVideosAndShorts ? 'Show Shorts' : 'Show Regular Videos'}
      </span>

      <div className="video-list-wrapper">
        {toggleVideosAndShorts ? (
          <>
            <h2>Regular Videos</h2>
            <ul className="video-list">
              {videos.map((video, index) => (
                <li key={video.snippet.resourceId.videoId + index} className="video-item">
                  <a
                    href={`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={video.snippet.thumbnails.high.url}
                      alt={video.snippet.title}
                      className="video-thumbnail"
                    />
                    <span className="video-title styled-link">{removeTextAfterHash(video.snippet.title)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <h2>Shorts</h2>
            <ul className="video-list">
              {shorts.map((video, index) => (
                <li key={video.snippet.resourceId.videoId + index} className="video-item">
                  <a
                    href={`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={video.snippet.thumbnails.high.url}
                      alt={video.snippet.title}
                      className="video-thumbnail"
                    />
                    <span className="video-title styled-link">{removeTextAfterHash(video.snippet.title)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {nextPageToken && (
        <button onClick={loadMoreVideos} className="load-more-button">
          Load More Videos
        </button>
      )}
    </div>
  );
};

export default VideoList;
