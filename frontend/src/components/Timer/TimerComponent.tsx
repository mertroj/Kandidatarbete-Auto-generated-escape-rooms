import './TimerComponent.css';

function TimerComponent({timer}: {timer: number}){
    return(
        <div className="text-center timer">
            Timer: {Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}{timer % 60}
        </div>
    )
}

export default TimerComponent;