import React, { useContext } from 'react';
import { VolumeContext } from '../../utils/volumeContext';

function VolumeSlider() {
    const { volume, setVolume } = useContext(VolumeContext);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(Number(event.target.value));
    };

    return (
        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleChange} />
    );
}

export default VolumeSlider;