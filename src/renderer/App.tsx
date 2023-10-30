import React, {useEffect, useState} from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import styles from "./app.module.scss";
import Header from "./Header";
import {Contact} from "../types/Contact";
import Buttons_Pane from "./Buttons_Pane";
import Body from "./Body";
import {PhoneEvent} from "../types/PhoneEvent";
import StatusIndicator from "./StatusIndicator";
import {Status} from "../types/Status";
import CallHistory from "./CallHistory";


const App: React.FC = () => {

  const defaultContact: Contact = {
    name: 'Marc Bou Maroun',
    phone: '71123123',
    notes: 'Adma Zone Vert Rue 5',
  };
  const defaultPhoneEvent = {
    action: "ringing",
    prompt: "Ringing..."
  }
  const defaultStatus = {
    isOnline: true
  }

  const [contact, setContact] = useState<Contact>(defaultContact);
  const [phoneEvent, setPhoneEvent] = useState<PhoneEvent>(defaultPhoneEvent);
  const [status, setStatus] = useState<Status>(defaultStatus);

  useEffect(() => {

    window.electron.ipcRenderer.on('events', (data: string) => {
      switch (JSON.parse(data)) {
        case 'ring':
          setPhoneEvent({
            action: 'ringing',
            prompt: 'Ringing...',
          });
          break;
        case 'hungup':
          setPhoneEvent({
            action: 'hungup',
            prompt: 'Hung Up',
          });
          break;
        case 'active':
          setPhoneEvent({
            action: 'active',
            prompt: 'Line Active',
          });
          break;
        default:
          setPhoneEvent(defaultPhoneEvent);
          break;
      }
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.electron.ipcRenderer.on('calls', (data: string) => {
      setContact(JSON.parse(data));
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.electron.ipcRenderer.on('status', (data: string) => {
      setStatus(JSON.parse(data));
    });
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const [historyView, setHistoryView] = useState<boolean>(false);
  const handleHistoryClick = () => {
    setHistoryView(!historyView);
  };

  return (
    <div className={styles.component}>
      {!historyView && <Header contact={contact} isEditing={isEditing} phoneEvent={phoneEvent} />}
      {historyView && <CallHistory contact={contact}/>}
      {!historyView && <Body contact={contact} isEditing={isEditing}/>}
      <Buttons_Pane contact={contact} isEditing={isEditing} onEditClick={handleEditClick} onHistoryClick={handleHistoryClick}/>
      <div className={styles.status}><StatusIndicator isOnline={status.isOnline}/></div>
    </div>
  );
};

export default App;
