import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import styles from "./status_indicator.module.scss";

interface StatusIndicatorProps {
    isOnline: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ isOnline }) => {

    return (
        <div className={styles.statusIndicator}>
            <div className={styles.ledLight} style={{backgroundColor: isOnline ? 'green' : 'red'}}></div>
            <span className={styles.statusLabel}>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
    );
};

export default StatusIndicator;
