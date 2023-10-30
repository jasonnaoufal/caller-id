import React, {useState} from 'react';
import {Contact} from "../types/Contact";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import styles from "./buttons_pane.module.scss";

interface ButtonsPaneProps {
    isEditing: boolean;
    onEditClick: () => void;
    onHistoryClick: () => void;
    contact: Contact;
}

const Buttons_Pane: React.FC<ButtonsPaneProps> = ({isEditing, onEditClick, onHistoryClick, contact}) => {

    const [hidden, setHidden] = useState(false);
    const [history, setHistory] = useState(false);

    return (
        <div className={styles.component}>
            <div className={styles.buttons}>
                <button
                    disabled={hidden || !contact.phone || history}
                    onClick={onEditClick}
                >
                    {isEditing ? 'Save' : 'Edit'}
                </button>
                <button
                    disabled={hidden}
                    onClick={() => {
                        onHistoryClick()
                        window.electron.ipcRenderer.sendMessage("history", "1");
                        setHistory(!history);
                    }
                    }
                >
                    {history ? "Back" : "History"}
                </button>
                <button
                    className={styles.button_last}
                    onClick={() => {
                      window.electron.ipcRenderer.sendMessage("minimize", "1");
                        setHidden(!hidden);
                    }
                    }
                >
                    {hidden ? "Show" : "Hide"}
                </button>
            </div>

        </div>
    );
};

export default Buttons_Pane;
