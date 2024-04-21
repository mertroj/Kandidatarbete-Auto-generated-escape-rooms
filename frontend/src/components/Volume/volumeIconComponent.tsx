import { useContext } from "react";
import { FaVolumeXmark } from "react-icons/fa6";
import { FaVolumeLow } from "react-icons/fa6";
import { FaVolumeHigh } from "react-icons/fa6";
import { VolumeContext } from "../../utils/volumeContext";

function VolumeIconComponent() {
    const { volume } = useContext(VolumeContext);

    return (
        <>
        {volume === 0 ? (
            <FaVolumeXmark />
        ) : volume < 0.5 ? (
            <FaVolumeLow />
        ) : (
            <FaVolumeHigh />
        )}
        </>
    );
}

export default VolumeIconComponent;