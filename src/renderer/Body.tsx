import React from 'react';
import {Contact} from "../types/Contact";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import styles from "./body.module.scss";

interface Props {
    contact: Contact;
    isEditing: boolean;
}

const Body: React.FC<Props> = ({contact, isEditing}) => {

    return (
        <>
        <div className={styles.component}>
            <div className={styles.notes}>
                {contact.phone&&<div className={styles.notes_title}>{contact.phone ? "Notes" : "No data to display"}</div>}
                {<textarea className={styles.notes_content} disabled={!isEditing}>{contact.phone?contact.notes:"No Phone Events"}</textarea>}
            </div>
        </div>
    </>
)
    ;
};

export default Body;
