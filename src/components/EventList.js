import React,{useState} from "react";

const EventList = ({ events }) =>{
    const [event_items, setEvent_items] = useState([]);

    return(
        <section>
            <div className="event-list">
                <h2>Upcoming Events</h2>
                {events.length > 0 ? (
                    <ul>
                        {events.map((event, index) => (
                            <li key={index}>{event.name} - {event.date}</li>
                            ))}
                    </ul>
                ) : (
                    <p>No upcoming events.</p>
                    )}
            </div>
        </section>
    );
    };
    
    export default EventList;