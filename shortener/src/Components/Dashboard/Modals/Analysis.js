import React, { useEffect, useState } from 'react';
import './Analysis.css';
import axios from 'axios';

function Analysis() {
  const [links, setLinks] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');

  const truncateUrl = (url) => {
    if (url.length > 20) {
      return url.substring(0, 20) + "...";
    }
    return url;
  };

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axios.get('https://shortly-backend-syh2.onrender.com/analysis/get-links', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        setLinks(response.data.links);
      } catch (error) {
        console.error('Error fetching links data:', error);
      }
    };

    fetchLinks();
  }, []);

  const sortByDate = () => {
    const sortedLinks = [...links].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setLinks(sortedLinks);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="analysis-container">
      <div className="analysis-table-wrapper">
        <div className="analysis-table-header">
          <ul className="analysis-table">
            <li>
              Timestamp
              <button className="date-sort" onClick={sortByDate}>
                <img src="sort.png" alt="Sort" />
              </button>
            </li>
            <li>Original Link</li>
            <li>Short Link</li>
            <li>IP Address</li>
            <li>User Device</li>
          </ul>
        </div>

        <div className="analysis-table-body">
          {links.map((link, index) => (
            <ul className="analysis-row" key={index}>
              <li>{new Date(link.createdAt).toLocaleString()}</li>
              <li>
                <a className='linky' href={link.destinationUrl} target="_blank" rel="noopener noreferrer">
                  {truncateUrl(link.destinationUrl)}
                </a>
              </li>
              <li>
                <a className='linky' href={link.shortUrl} target="_blank" rel="noopener noreferrer">
                 {truncateUrl(link.shortUrl)}
                </a>
              </li>
              <li>{link.ipAddress}</li>
              <li className="analysis-device">{link.device}</li>
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analysis;