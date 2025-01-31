import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashpart.css";

function Dashpart() {
  const [totalClicks, setTotalClicks] = useState(0);
  const [deviceClicks, setDeviceClicks] = useState({
    desktop: 0,
    mobile: 0,
    tablet: 0,
  });
  const [dateWiseClicks, setDateWiseClicks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClickStats = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return;
      }

      try {
        const response = await axios.get("https://shortly-backend-syh2.onrender.com/api/dash-clicks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { totalClicks, deviceClicks, dateWiseClicks } = response.data;

        setTotalClicks(totalClicks || 0);
        setDeviceClicks(deviceClicks || { desktop: 0, mobile: 0, tablet: 0 });

        const groupedClicks = dateWiseClicks.reduce((acc, entry) => {
          const date = new Date(entry.date).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += entry.clickCount;
          return acc;
        }, {});

        const groupedClicksArray = Object.entries(groupedClicks).map(([date, clickCount]) => ({
          date,
          clickCount,
        }));

        setDateWiseClicks(groupedClicksArray || []);
      } catch (error) {
        console.error("Error fetching click stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClickStats();
  }, []);

  return (
    <div className="dashpart-container">
      <div>
        <h2>Total Clicks <span className="total"> {totalClicks}</span></h2>
      </div>

      <div className="dashpart-stats">
        <div className="stats-card">
          <h3>Date-wise Clicks</h3>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="date-clicks-list">
              {dateWiseClicks.length > 0 ? (
                dateWiseClicks.map((entry, index) => (
                  <div key={index} className="date-clicks-item">
                    <span>{entry.date}</span>
                    <div
                      className="click-bar"
                      style={{
                        width: `${(entry.clickCount / totalClicks) * 10}%`,
                      }}
                    />
                    <span className="bar-label">{entry.clickCount}</span>
                  </div>
                ))
              ) : (
                <p>No data available.</p>
              )}
            </div>
          )}
        </div>

        <div className="stats-card">
          <h3>Click Devices</h3>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="device-clicks-list">
              {Object.entries(deviceClicks).map(([device, clicks]) => (
                clicks > 0 && (
                  <div key={device} className="device-clicks-item">
                    <span>{device.charAt(0).toUpperCase() + device.slice(1)}</span>
                    <div
                      className="click-bar-device"
                      style={{
                        width: `${(clicks / totalClicks) * 10}%`,
                      }}
                    />
                    <span className="bar-label">{clicks}</span>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashpart;
