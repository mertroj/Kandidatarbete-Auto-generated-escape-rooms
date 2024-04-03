import React, { useState } from 'react';
import './popup.css';
import {Navbar,Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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
function Popup (popupProps: PopupProps) {

    return (
        <div>
            <div onClick={popupProps.onOpen}>
                {popupProps.trigger} {/* check that the position of the trigger in the component that uses popup isn't affected?*/ }
            </div>

            {popupProps.isOpen && (
                <div>
                    <div className='overlay-background' onClick={popupProps.onClose}>
                    </div>
                    <div className='overlay'>
                        <div className='bg-light sticky-top'>
                            <Navbar className='p-0 justify-content-end'>
                                <Button style={{borderRadius:'0px'}} className='p-3 btn-close'onClick={popupProps.onClose} type='button' variant='outline-danger'></Button>
                            </Navbar>
                        </div>
                        <div className='m-5'>
                            {popupProps.children}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Popup;