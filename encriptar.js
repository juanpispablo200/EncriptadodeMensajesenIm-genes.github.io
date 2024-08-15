document.getElementById('imageInput').addEventListener('change', loadImage);
document.getElementById('encryptButton').addEventListener('click', encryptMessage);

let imageCanvas = document.getElementById('imageCanvas');
let ctx = imageCanvas.getContext('2d');
let img = new Image();

function loadImage(event) {
    let reader = new FileReader();
    reader.onload = function(event) {
        img.src = event.target.result;
    }
    reader.readAsDataURL(event.target.files[0]);
}

img.onload = function() {
    imageCanvas.width = img.width;
    imageCanvas.height = img.height;
    ctx.drawImage(img, 0, 0);
}

function encryptMessage() {
    let message = document.getElementById('messageInput').value;
    if (message && img.src) {
        let imageData = ctx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
        let data = imageData.data;

        let binaryMessage = "";
        for (let i = 0; i < message.length; i++) {
            binaryMessage += message.charCodeAt(i).toString(2).padStart(8, '0');
        }
        binaryMessage += '00000000';  // Terminador del mensaje

        for (let i = 0; i < binaryMessage.length; i++) {
            data[i * 4] = (data[i * 4] & 0xFE) | parseInt(binaryMessage[i], 2);
        }

        ctx.putImageData(imageData, 0, 0);

        // Crear enlace de descarga
        let downloadLink = document.getElementById('downloadLink');
        downloadLink.href = imageCanvas.toDataURL();  // Convertir canvas a URL de datos
        downloadLink.download = 'imagen_encriptada.png';  // Nombre del archivo de descarga
        downloadLink.style.display = 'block';  // Mostrar el enlace de descarga
        downloadLink.textContent = 'Descargar Imagen Encriptada';
        
        alert('Mensaje encriptado correctamente');
    } else {
        alert('Asegúrate de haber cargado una imagen y haber introducido un mensaje.');
    }
}

