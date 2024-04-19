import React from 'react';

export const VolumeContext = React.createContext({
    volume: 1.0,
    setVolume: (volume: number) => {},
});