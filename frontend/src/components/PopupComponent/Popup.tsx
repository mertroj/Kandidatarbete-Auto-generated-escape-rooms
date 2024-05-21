import React, { useState } from 'react';
import './popup.css';
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
    puzzleNumber?: number;
    navbarRemove: boolean;
    trigger?: JSX.Element; 
    isOpen: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    children: React.ReactNode;
}
function Popup (popupProps: PopupProps) {

    return (
        <div>
            {popupProps.trigger && popupProps.onOpen && <div onClick={popupProps.onOpen}>
                {popupProps.trigger} {/* check that the position of the trigger in the component that uses popup isn't affected?*/ }
            </div>}

            {popupProps.isOpen && (
                <div>
                    <div className='overlay-background' onClick={popupProps.onClose}>
                    </div>
                    <div className='overlay mh-100'>
                        {!popupProps.navbarRemove &&
                        <div className='bg-light sticky-top'>
                            <Navbar className={`p-0 ${popupProps.puzzleNumber ? 'justify-content-between ms-3' : 'justify-content-end'}`}>                                
                                {popupProps.puzzleNumber && `#${popupProps.puzzleNumber}`}
                                <AudioClickButton style={{borderRadius:'0px'}} className='p-3 btn-close'onClick={popupProps.onClose} type='button' variant='outline-danger'></AudioClickButton>
                            </Navbar>
                        </div>
                        }
                        <div className='m-5 h-75'>
                            {popupProps.children}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Popup;