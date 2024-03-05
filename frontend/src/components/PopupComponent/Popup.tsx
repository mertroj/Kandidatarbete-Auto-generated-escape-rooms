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
    children: React.ReactNode;
}
function Popup (popupProps: PopupProps) {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <div>
            <div onClick={() => setIsVisible(true)}>
                {popupProps.trigger} {/* check that the position of the trigger in the component that uses popup isn't affected?*/ }
            </div>

            {isVisible && (
                <div>
                    <div className='overlay-background'>
                    </div>
                    <div className='overlay'>
                        <div className='bg-light'>
                            <Navbar className='p-0 justify-content-end'>
                                <Button style={{borderRadius:'0px'}} className='p-3 btn-close'onClick={() => setIsVisible(false)} type='button' variant='outline-danger'></Button>
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