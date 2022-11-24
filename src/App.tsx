import React, {useEffect, useReducer} from 'react';
import initTrumbaAPI from 'dce-trumba';
import TrumbaRegistration from 'dce-trumba/lib/types/TrumbaRegistration';
import TrumbaAttendeeQuery from 'dce-trumba/lib/types/TrumbaAttendeeQuery';
import TrumbaEvent from 'dce-trumba/lib/types/TrumbaEvent';

import axios from 'axios';

/* -------- State Definition -------- */

type State = (
  {
    events: TrumbaEvent[];
    registeredEvents: TrumbaEvent[];
  }
);

/* ------------- Actions ------------ */

// Types of actions
enum ActionType {
  // Add description of action type
  SetEvents = 'set-events',
  SetRegisteredEvents = 'set-registered-events',
}

// Action definitions
type Action = (
  | {
    // Action type
    type: ActionType.SetEvents,
    // Add description of required payload property
    events: TrumbaEvent[],
  }
  | {
    // Action type
    type: ActionType.SetRegisteredEvents,
    // Add description of required payload property
    events: TrumbaEvent[],
  }
);


/**
 * Reducer that executes actions
 * @author Add Your Name
 * @param state current state
 * @param action action to execute
 */
 const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SetEvents: {
      return {
        ...state,
        events: action.events,
      };
    }
    case ActionType.SetRegisteredEvents: {
      return {
        ...state,
        registeredEvents: action.events,
      };
    }
    default: {
      return state;
    }
  }
};


const registration: TrumbaRegistration = {
  eventId: 163114184,
  name: "Yenny",
  email: "lerchow@gmail.com",
};

const webName = 'test-calendar-8';

const query: TrumbaAttendeeQuery = {
  webName,
  email: 'lerchow@gmail.com',
  status: 'registered',
};

let trumbaAPI : any;


function App() {

  /* -------------- State ------------- */

  // Initial state
  const initialState: State = {
    events: [],
    registeredEvents: [],
  };

  // Initialize state
  const [state, dispatch] = useReducer(reducer, initialState);

  // destructure state
  const {events, registeredEvents} = state;


  const listUserEvents = async () => {
    const events = await trumbaAPI.listAttendees(query);
    dispatch({
      type: ActionType.SetRegisteredEvents,
      events,
    });
  };


  const register = async () => {
    const response = await trumbaAPI.registerForEvent(registration);
    if (response){
      listUserEvents();
    }
  }
    


  useEffect(() => {

    const auth = require('./config/auth.json');
    trumbaAPI = initTrumbaAPI(auth); 

    trumbaAPI.listEvents(webName).then((response : TrumbaEvent[]) => {
      dispatch({
        type: ActionType.SetEvents,
        events: response,
      });
    })
  }, []);

  return (
    <div className="App">
      <h1>Events</h1>
      {
        events.map(event => (
          <div key={event.eventID}>
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <p>{`${event.startDateTime} - ${event.endDateTime}`}</p>
          </div>
        ))
      }
      <button onClick={() => register()}>Register for event</button>
      <h2>Events you're registered for</h2>
      {
        registeredEvents.map(event => (
          <div key={event.eventID}>
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <p>{`${event.startDateTime} - ${event.endDateTime}`}</p>
          </div>
        ))
      }
    </div>
  );
}

export default App;
