import { storage } from './fireabse.js';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const generateUniqueFileName = (file) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();
    const uniqueFileName = `${timestamp}_${randomString}.${extension}`;
    return uniqueFileName;
};


const uploadPhoto = (file, fileName, onComplete) => {
    fileName = generateUniqueFileName(file);
    const storageRef = ref(storage, fileName); 
    uploadBytes(storageRef, file).then((snapshot) => {
        console.log('File uploaded successfully.');
        getDownloadURL(snapshot.ref).then((url) => {
            console.log(snapshot)
            onComplete(url); // Yükleme tamamlandığında fotoğrafın URL'sini geri çağır
        });
    }).catch((error) => {
        console.error('Error uploading file:', error);
    });
};
export { uploadPhoto };