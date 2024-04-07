import React from 'react';
import clickSound from '../assets/click.wav';
const audio = new Audio(clickSound);

//we create a higher order component here (HOC)
function withClickAudio(WrappedComponent: React.ElementType) {
    return (props: any) => {
        const { onClick, ...rest } = props;

        const handleClick = (event: React.MouseEvent) => {
            audio.play();

            if (onClick) {
                onClick(event);
            }
        };

        return <WrappedComponent {...rest} onClick={handleClick} />;
    };
}

export default withClickAudio;