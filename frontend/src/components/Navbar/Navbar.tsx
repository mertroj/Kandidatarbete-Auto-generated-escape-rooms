import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css'
import { useEffect, useState } from 'react';


function Navbar () {
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    async function fetchImage() {
        const response = await fetch('http://localhost:8080/images/logoImage');
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        const image = new Image();
        image.src = objectURL;
        image.onload = () => {
            setImage(image);
        }
    }

    useEffect(() => {
        fetchImage();
    }, []);

    return (
        <div className='w-100 d-flex justify-content-center navbar'>
            {image ? <a href="/"><img src={image.src} alt='logo' /> </a> : null}
            {/*<a href="/">Home</a>*/}
        </div>
    );
}

export default Navbar;
