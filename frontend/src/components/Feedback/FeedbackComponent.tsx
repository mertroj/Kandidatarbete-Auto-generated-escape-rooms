import './Feedback.css'; // Import the CSS file

function FeedbackComponent({message, backgroundColor, children}: {message: string, backgroundColor: string, children?: React.ReactNode}) {
    return (
        <div className="notification text-center" style={{backgroundColor: backgroundColor}}>
            <span>
                {message}
                {children}
            </span>
        </div>
    );
}

export default FeedbackComponent;