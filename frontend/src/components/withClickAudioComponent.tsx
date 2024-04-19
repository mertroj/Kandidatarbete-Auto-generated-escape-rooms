import React, { useContext } from 'react';
import { VolumeContext } from '../utils/volumeContext';
import defaultClick from '../assets/sounds/navigation-click.wav';

//we create a higher order component here (HOC)
function withClickAudio(WrappedComponent: React.ElementType, clickSound: string = defaultClick) {
    const audio = new Audio(clickSound);

    return (props: any) => {
        const { onClick, ...rest } = props;
        const { volume } = useContext(VolumeContext);

        const handleClick = (event: React.MouseEvent) => {
            audio.currentTime = 0;
            audio.volume = volume;
            audio.play();
            if (onClick) {
                onClick(event);
            }
            console.log('click', clickSound);
        };

        return <WrappedComponent {...rest} onClick={handleClick} />;
    };
}

export default withClickAudio;