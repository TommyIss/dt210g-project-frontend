import './Notification.css';

interface NotifationsProps {
    message: string;
    type?: 'success' | 'error';
}

function Notification({ message, type = 'success'}: NotifationsProps) {
    return(
        <div className={`notification ${type}`}>
            {message}
        </div>
    )
}

export default Notification;
