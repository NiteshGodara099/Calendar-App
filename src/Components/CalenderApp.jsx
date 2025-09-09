import React, { useState } from "react";

const CalendarApp = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 4, 15)); // May 15, 2024
  const [events, setEvents] = useState([
    {
      id: 1,
      date: new Date(2024, 4, 15),
      time: "10:00",
      text: "Meeting with John Doe",
      completed: true
    }
  ]);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [newEvent, setNewEvent] = useState({ time: "10:00", text: "" });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get first day of month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const addEvent = () => {
    if (newEvent.text.trim() === "") return;
    
    const newEventObj = {
      id: events.length + 1,
      date: new Date(currentDate),
      time: newEvent.time,
      text: newEvent.text,
      completed: false
    };
    
    setEvents([...events, newEventObj]);
    setNewEvent({ time: "10:00", text: "" });
    setShowEventPopup(false);
  };

  const removeEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const toggleEventCompletion = (id) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, completed: !event.completed } : event
    ));
  };

  // Generate calendar days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
                     "July", "August", "September", "October", "November", "December"];
  
  const calendarDays = [];
  
  // Add empty days for the first week
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-12 flex items-center justify-center"></div>);
  }
  
  // Add actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = events.filter(event => 
      event.date.getDate() === day && 
      event.date.getMonth() === month && 
      event.date.getFullYear() === year
    );
    
    const isCurrentDay = day === 15 && month === 4 && year === 2024; // May 15, 2024
    
    calendarDays.push(
      <div 
        key={`day-${day}`} 
        className={`h-12 flex items-center justify-center relative ${isCurrentDay ? 'bg-blue-500 text-white rounded-full' : ''}`}
      >
        {day}
        {dayEvents.length > 0 && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
        )}
      </div>
    );
  }

  return (
    <div className="font-comfortaa text-base w-full bg-gray-800 min-h-screen flex items-center justify-center perspective-1000">
      <div className="relative w-full max-w-4xl mx-4 bg-gray-800 p-8 rounded-3xl border-8 border-gray-700 flex shadow-2xl">
        {/* Calendar Section */}
        <div className="flex-1 pr-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Calendar</h1>
            <div className="text-right">
              <h2 className="text-2xl font-semibold text-white">{monthNames[month]},</h2>
              <h2 className="text-xl text-gray-300">{year}</h2>
            </div>
            <div className="flex space-x-2">
              <button 
                className="text-white p-2 rounded-full hover:bg-gray-700"
                onClick={() => navigateMonth(-1)}
              >
                <i className="bx bx-chevron-left text-xl"></i>
              </button>
              <button 
                className="text-white p-2 rounded-full hover:bg-gray-700"
                onClick={() => navigateMonth(1)}
              >
                <i className="bx bx-chevron-right text-xl"></i>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center font-semibold text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {calendarDays}
          </div>
        </div>
        
        {/* Events Section */}
        <div className="w-96 bg-gray-700 rounded-2xl p-5 flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-semibold text-white">Events</h3>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => setShowEventPopup(true)}
            >
              Add Event
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {events.filter(event => 
              event.date.getDate() === currentDate.getDate() && 
              event.date.getMonth() === currentDate.getMonth() && 
              event.date.getFullYear() === currentDate.getFullYear()
            ).map(event => (
              <div key={event.id} className="bg-gray-600 rounded-xl p-4 mb-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-gray-300 text-sm">{event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div className="text-white font-medium">{event.time}</div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="text-yellow-400 hover:text-yellow-300"
                      onClick={() => toggleEventCompletion(event.id)}
                    >
                      {event.completed ? (
                        <i className="bx bx-check-circle text-xl"></i>
                      ) : (
                        <i className="bx bx-circle text-xl"></i>
                      )}
                    </button>
                    <button 
                      className="text-red-500 hover:text-red-400"
                      onClick={() => removeEvent(event.id)}
                    >
                      <i className="bx bx-x text-xl"></i>
                    </button>
                  </div>
                </div>
                <div className={`text-white ${event.completed ? 'line-through text-gray-400' : ''}`}>
                  {event.text}
                </div>
              </div>
            ))}
            
            {events.filter(event => 
              event.date.getDate() === currentDate.getDate() && 
              event.date.getMonth() === currentDate.getMonth() && 
              event.date.getFullYear() === currentDate.getFullYear()
            ).length === 0 && (
              <div className="text-gray-400 text-center py-8">
                No events scheduled for today
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Event Popup */}
      {showEventPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-96 relative">
            <h3 className="text-xl font-semibold text-white mb-4">Add New Event</h3>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Time</label>
              <div className="flex space-x-2">
                <input
                  type="time"
                  className="bg-gray-700 text-white rounded-lg p-2 w-full"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Event Details</label>
              <textarea
                placeholder="Enter event details"
                className="bg-gray-700 text-white rounded-lg p-3 w-full h-32 resize-none"
                value={newEvent.text}
                onChange={(e) => setNewEvent({...newEvent, text: e.target.value})}
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white"
                onClick={() => setShowEventPopup(false)}
              >
                Cancel
              </button>
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                onClick={addEvent}
              >
                Add Event
              </button>
            </div>
            
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setShowEventPopup(false)}
            >
              <i className="bx bx-x text-2xl"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarApp;