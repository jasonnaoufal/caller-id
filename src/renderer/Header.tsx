import React from 'react';
import {Contact} from "../types/Contact";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import styles from "./header.module.scss";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ringing_icon from '../../assets/phone.png';
import {PhoneEvent} from "../types/PhoneEvent";

interface Props {
    contact: Contact;
    phoneEvent: PhoneEvent;
    isEditing: boolean;
}

const Header: React.FC<Props> = ({contact, phoneEvent, isEditing}) => {

    return (
        <div className={styles.component}>
            <div className={styles.line1}>
                {contact.phone ?
                    <textarea className={styles.name} disabled={!isEditing}>{contact.name}</textarea>
                    :
                    <div className={styles.name}>No Calls</div>
                }
            </div>
            <div className={styles.line2}>
                <div className={styles.phone_num}> {contact.phone} </div>
            </div>
            <div className={styles.line3}>
                {contact.phone &&
                    <>
                        <img className={styles.icon} src={ringing_icon} alt="phone"/>
                        <div className={styles.activity}>{phoneEvent.prompt}</div>
                    </>
                }
            </div>
        </div>
    );
};

export default Header;
