import React from 'react';
import {Contact} from "../types/Contact";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import styles from "./call-history.module.scss";


interface Props {
    contact: Contact;
}

const CallHistory: React.FC<Props> = ({contact}) => {

    return (
        <div className={styles.component}>
            No History
        </div>
    );
};

export default CallHistory;
