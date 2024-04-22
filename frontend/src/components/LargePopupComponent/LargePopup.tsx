import React, { useState } from 'react';
import './largePopup.css';
import {Navbar,Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import withClickAudio from '../withClickAudioComponent';

const AudioClickButton = withClickAudio(Button);

export type Position =
    'top'
    |   'bottom'
    |   'left'
    |   'right';

export interface PopupProps {
    trigger: JSX.Element;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    children: React.ReactNode;
}
function LargePopup (popupProps: PopupProps) {

    return (
        <div>
            <div onClick={popupProps.onOpen}>
                {popupProps.trigger}
            </div>

            {popupProps.isOpen && (
                <div>
                    <div className='overlay-background' onClick={popupProps.onClose}>
                    </div>
                    <div className='overlay'>
                        <div className='bg-light sticky-top'>
                            <Navbar className='p-0 justify-content-end'>
                                <AudioClickButton style={{borderRadius: '0px'}} className='p-3 btn-close'
                                                  onClick={popupProps.onClose} type='button'
                                                  variant='outline-danger'></AudioClickButton>
                            </Navbar>
                        </div>
                        <div className='m-0'>
                            {popupProps.children}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LargePopup;