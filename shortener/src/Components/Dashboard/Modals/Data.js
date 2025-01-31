import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Data.css';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Data({ searchQuery, setSearchQuery }) {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLink, setSelectedLink] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLink, setDeleteLink] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const linksPerPage = 8;

  const filteredLinks = links.filter((link) =>
    link.remarks.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchLinks = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('User is not authenticated');
        return;
      }

      try {
        const response = await axios.get('https://shortly-backend-syh2.onrender.com/api/get-links', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLinks(response.data.links);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching links:', error);
      }
    };

    fetchLinks();
  }, []);

  const sortByDate = () => {
    const sortedLinks = [...filteredLinks].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setLinks(sortedLinks);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortByStatus = () => {
    const sortedLinks = [...filteredLinks].sort((a, b) => {
      const statusA = getLinkStatus(a.expiryDate);
      const statusB = getLinkStatus(b.expiryDate);

      if (statusA === statusB) return 0;
      if (statusA === 'Active') return -1;
      if (statusB === 'Active') return 1;
      if (statusA === 'ExpiringSoon') return -1;
      if (statusB === 'ExpiringSoon') return 1;
      return 0;
    });

    setLinks(sortedLinks);
  };

  const getShortenedLink = (url) => url.slice(0, 10) + '...';

  const copyToClipboard = (shortUrl, index) => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      toast.success('Short link copied to clipboard!');
      handleLinkClick(shortUrl, index);
    }).catch((error) => {
      console.error('Error copying to clipboard', error);
      toast.error('Failed to copy the link.');
    });
  };

  const handleLinkClick = async (shortUrl, index) => {
    try {
      const encodedShortUrl = encodeURIComponent(shortUrl);
      const response = await axios.get(`https://shortly-backend-syh2.onrender.com/api/increment-clicks/${encodedShortUrl}`);

      const updatedLinks = [...links];
      updatedLinks[index].clicks.total = response.data.totalClicks;
      setLinks(updatedLinks);
    } catch (error) {
      console.error('Error incrementing click count:', error);
    }
  };

  const handleLinkUpdate = (updatedLink) => {
    const updatedLinks = links.map((link) =>
      link._id === updatedLink._id ? updatedLink : link
    );
    setLinks(updatedLinks);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteLink) return;
    try {
      const response = await axios.delete(
        `https://shortly-backend-syh2.onrender.com/api/delete-link/${deleteLink._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        }
      );

      if (response.status === 200) {
        setLinks(links.filter((link) => link._id !== deleteLink._id));
        setDeleteLink(null);
        toast.success('Link deleted successfully!' );
      }
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete the link.');
    }
  };

  const getLinkStatus = (expiryDate) => {
    if (!expiryDate) {
      return 'Active';
    }
  
    const currentDate = new Date();
    const expiry = new Date(expiryDate);
  
    if (expiry < currentDate) return 'Inactive';
  
    return 'Active';
  };
  

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = filteredLinks.slice(indexOfFirstLink, indexOfLastLink);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredLinks.length / linksPerPage); i++) pageNumbers.push(i);

  return (
    <div className="data-container">
      <div className="table-header">
        <ul className="data-table">
          <li>
            Date
            <button className="date-sort" onClick={sortByDate}>
              <img src="sort.png" alt="Sort" />
            </button>
          </li>
          <li>Original Link</li>
          <li>Short Link</li>
          <li>Remarks</li>
          <li>Clicks</li>
          <li>Status<button className="status-sort" onClick={sortByStatus}><img src="sort.png" alt="Sort" /></button></li>
          <li>Action</li>
        </ul>
      </div>

      <div className="table-body">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          currentLinks.map((link, index) => (
            <ul className="data-row" key={index}>
              <li>{new Date(link.createdAt).toLocaleString()}</li>
              <li>
                <a className='linky' href={link.destinationUrl} target="_blank" rel="noopener noreferrer">
                  {getShortenedLink(link.destinationUrl)}
                </a>
              </li>
              <li>
                <a className='linky' href={link.shortUrl} target="_blank" rel="noopener noreferrer" onClick={() => handleLinkClick(link.shortUrl, index)}>
                  {getShortenedLink(link.shortUrl)}
                </a>
                <button className="copy" onClick={() => copyToClipboard(link.shortUrl, index)}>
                  <img src="copy.png" alt="Copy" />
                </button>
              </li>
              <li>{link.remarks}</li>
              <li className="count">{link.clicks.total}</li>
              <li className={`status ${getLinkStatus(link.expirationDate)}`}>
                {getLinkStatus(link.expirationDate)}
              </li>

              <li className="action-icons">
                <button className="edit" onClick={() => setSelectedLink(link)}>
                  <img src="edit.png" alt="Edit" />
                </button>
                <button className="delete" onClick={() => setDeleteLink(link)}>
                  <img src="delete.png" alt="Delete" />
                </button>
              </li>
            </ul>
          ))
        )}
      </div>

      <div className='pages'>
        <div className="pagination">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            <img src='left.png' alt="Previous" />
          </button>

          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={currentPage === number ? 'active' : ''}
            >
              {number}
            </button>
          ))}

          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageNumbers.length))} disabled={currentPage === pageNumbers.length}>
            <img src='right.png' alt="Next" />
          </button>
        </div>
      </div>

      <EditModal
        isOpen={selectedLink !== null}
        onClose={() => setSelectedLink(null)}
        link={selectedLink}
        onUpdate={handleLinkUpdate}
      />

      {deleteLink && (
        <DeleteModal
          onClose={() => setDeleteLink(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      <ToastContainer />
    </div>
  );
}

export default Data;
