import './Feedback.css'; // Import the CSS file

function FeedbackComponent({message, backgroundColor, delay}: {message: string, backgroundColor: string, delay: number}) {
    const slideInDuration = 0.5;
    const fadeOutDelay = delay + slideInDuration;

    return (
        <div className="feedback-element text-center" style={{backgroundColor: backgroundColor, animation: `slideInFromRight ${slideInDuration}s ${delay}s backwards, fadeOut 3s ${fadeOutDelay}s forwards`}}>
            <span>
                {message}
            </span>
        </div>
    );
}

export default FeedbackComponent;