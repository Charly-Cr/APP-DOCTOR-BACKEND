const cloudinary = require("cloudinary").v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Aquí le podemos cambiar el nombre a la carpeta de "node_app", y ponerle
// un nombre diferente a la carpeta donde queramos subir nuestros archivos
// a cloudinary
const folder = "doctor_app";

const uploadToCloudinary = async(file) => {
	const { path: filePath, filename } = file
    
    try {
        const filePathOnCloudinary = folder + "/" + path.parse(filename).name;
        const result = await cloudinary.uploader.upload( 
            filePath, 
            { "public_id": filePathOnCloudinary }
        )
        return result;
    } catch (error) {
        console.log(error);
        return { message: "Upload to cloudinary failed" };
    } finally {
        fs.unlinkSync(filePath);
    }
}


const deleteFromCloudinary = async (url) => {
    try {
        if (!url || url.includes('no-image.jpg')) return;

        // 1. Extraer la parte después de /upload/
        // La URL suele ser: .../upload/v12345/carpeta/imagen.jpg
        const urlSections = url.split('/');
        const uploadIndex = urlSections.findIndex(section => section === 'upload');
        
        // 2. Tomamos todo lo que viene después de la versión (v12345)
        // y le quitamos la extensión (.jpg, .png)
        const publicIdWithExtension = urlSections.slice(uploadIndex + 2).join('/');
        const publicIdRaw = publicIdWithExtension.split('.')[0];

        // 3. ¡ESTA ES LA CLAVE! Decodificamos los %20, %21, etc.
        const publicId = decodeURIComponent(publicIdRaw);

        console.log("---------------------------------");
        console.log("ID Limpio para Cloudinary:", publicId); 
        console.log("---------------------------------");

        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Respuesta de Cloudinary:", result);
        
    } catch (error) {
        console.error("Error al intentar borrar:", error);
    }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };