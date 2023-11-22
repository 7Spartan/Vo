// Sidebar.js
import React from 'react';
import './Sidebar.css'; // Make sure to have this CSS file in the same directory

const Sidebar = () => {
  // Dummy data for notes and chats
  const notes = [
    { id: 1, title: 'Questions On Physics', icon: 'note-icon-1.jpg' },
    { id: 2, title: 'Camping Items', icon: 'note-icon-2.jpg' },
    { id: 3, title: 'Movie List', icon: 'note-icon-3.jpg' },
    { id: 4, title: 'Camping Items', icon: 'note-icon-2.jpg' },
    { id: 5, title: 'Movie List', icon: 'note-icon-3.jpg' },
  ];

  const chats = [
    { id: 1, name: 'Maciej Kowalski', message: 'Will do, super, thank you 😊❤️', time: '08:43' },
    { id: 2, name: 'Maciej Kowalski', message: 'Will do, super, thank you 😊❤️', time: '08:43' },
    { id: 3, name: 'Maciej Kowalski', message: 'Will do, super, thank you 😊❤️', time: '08:43' },
    { id: 4, name: 'Maciej Kowalski', message: 'Will do, super, thank you 😊❤️', time: '08:43' },
    { id: 5, name: 'Maciej Kowalski', message: 'Will do, super, thank you 😊❤️', time: '08:43' },

    // ...other chats
  ];

  return (
    <aside className="sidebar">
      <div className="profile">
        <div className="avatar"></div>
        <h1>Martina Wolna</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <button className="search-button">+</button>
        </div>
      </div>
    <h2>Notes</h2>
      <div className="notes-section">
        {notes.map(note => (
          <div key={note.id} className="note">
            <div className="note-icon" style={{ backgroundImage: `url(${note.icon})` }}></div>
            <p>{note.title}</p>
          </div>
        ))}
      </div>
      <div className="chats-section">
        {chats.map(chat => (
          <div key={chat.id} className="chat">
            <div className="chat-avatar"></div>
            <div className="chat-details">
              <h3>{chat.name}</h3>
              <p>{chat.message}</p>
              <span>{chat.time}</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
