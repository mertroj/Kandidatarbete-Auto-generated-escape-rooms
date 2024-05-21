import React, { useContext } from 'react';
import { FaVolumeXmark } from "react-icons/fa6";
import { FaVolumeLow } from "react-icons/fa6";
import { FaVolumeHigh } from "react-icons/fa6";
import { VolumeContext } from "../../utils/VolumeContext";
import "./VolumeComponent.css"

function VolumeComponent() {
    const { volume, changeVolume, isMuted, toggleMuted } = useContext(VolumeContext);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        changeVolume(Number(event.target.value));
    };

    return (
        <div className='volume-slider-container'>
            <div className='volume-icon'>
                {volume === 0 || isMuted ? (
                    <FaVolumeXmark onClick={() => toggleMuted()} />
                ) : volume < 0.5 ? (
                    <FaVolumeLow onClick={() => toggleMuted()} />
                ) : (
                    <FaVolumeHigh onClick={() => toggleMuted()} />
                )}
            </div>
            <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleChange} />
        </div>
    );
}

export default VolumeComponent;