import React, { useState, useEffect } from 'react';
import './App.css';

const LionPulse = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // URL for fetching event data in JSON format
    const eventsURL = 'https://events.columbia.edu/feeder/main/eventsFeed.do?f=y&sort=dtstart.utc:asc&fexpr=(categories.href!=%22/public/.bedework/categories/sys/Ongoing%22)%20and%20(categories.href=%22/public/.bedework/categories/org/UniversityEvents%22)%20and%20(entity_type=%22event%22%7Centity_type=%22todo%22)&skinName=list-json&count=200';

    // Fetch the event data
    fetch(eventsURL)
      .then((response) => response.json()) // Parse the response as JSON
      .then((data) => {
        setEvents(data.bwEventList.events); // Accessing events array within bwEventList
        setLoading(false); // Stop loading when data is fetched
      })
      .catch((error) => {
        console.error('Error fetching event data:', error);
        setLoading(false); // Stop loading in case of an error
      });
  }, []);

  return (
    <div className="lionpulse-container">
      <header className="header">
        <h1>LionPulse</h1>
        <p>Stay up to date with what's happening around Columbia Campus</p>
      </header>

      {loading ? (
        <div className="loading-message">Loading events...</div>
      ) : (
        <div className="events-list">
          {events.map((event, index) => (
            <div key={index} className="event-card">
              <h2>{event.summary}</h2> {/* Using the summary as event title */}
              <p><strong>Date:</strong> {event.start.longdate}</p> {/* Displaying the start date */}
              <p><strong>Time:</strong> {event.start.time}</p> {/* Displaying event time */}
              <p><strong>Location:</strong> {event.location.address}</p> {/* Location address */}
              <p><a href={event.location.link} target="_blank" rel="noopener noreferrer">View on map</a></p> {/* Link to location on map */}
              <p>{event.link ? <a href={event.link} target="_blank" rel="noopener noreferrer">More Info</a> : "No additional info"}</p> {/* Link to event details */}
            </div>
          ))}
        </div>
      )}

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Columbia University</p>
      </footer>
    </div>
  );
};

export default App;