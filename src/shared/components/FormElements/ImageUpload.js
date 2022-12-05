import React, { useRef, useState, useEffect } from 'react';

import Button from './Button';

import './ImageUpload.css';

const ImageUpload = props => {
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

    const filePickRef = useRef();

    useEffect(() => {
        if (!file) {
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        }
        fileReader.readAsDataURL(file);
    }, [file]);

    const pickedHandler = event => {
        let pickedFile;
        let fileIsValid = isValid;
        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            fileIsValid = true;
            setFile(pickedFile);
            setIsValid(fileIsValid);
        } else {
            fileIsValid = false;
            setIsValid(fileIsValid);
        }

        props.onInput(props.id, pickedFile, fileIsValid);
    };

    const pickImageHandler = () => {
        filePickRef.current.click();
    };

    return (
        <div className='form-control'>
            <input id={props.id} style={{display: 'none'}} type='file' accept='.jpg,.png,.jpeg' ref={filePickRef} onChange={pickedHandler} />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className='image-upload__preview'>
                    {previewUrl && <img src={previewUrl} alt='Preview' />}
                    {!previewUrl && <p>Please pick an image.</p>}
                </div>

                <Button type='button' onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
            {!isValid && props.errorText}
        </div>
    );
};

export default ImageUpload;