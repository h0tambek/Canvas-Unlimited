const uploadButton = document.getElementById("upload-button");
let currentImage = null;

function handleUpload() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = handleFileSelect;
  input.click();
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = handleFileLoad;
  reader.readAsDataURL(file);
}

function handleFileLoad(event) {
  const img = new Image();
  img.src = event.target.result;
  img.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext("2d");
    context.drawImage(img, 0, 0);
    const dataUrl = canvas.toDataURL();
    const newImage = document.createElement("img");
    newImage.src = dataUrl;
    newImage.style.position = "absolute";
    newImage.draggable = false; // disable text selection
    newImage.style.userSelect = "none"; // disable text selection
    newImage.style.display = "none";
    newImage.onload = function () {
      document.body.appendChild(newImage);
      currentImage = newImage;
      document.addEventListener("click", handleImageClick, { once: true });
    };
  };
}
const removeImagesButton = document.getElementById("remove-images-button");

function removeImages() {
  const images = document.querySelectorAll("img");
  images.forEach((image) => {
    image.parentNode.removeChild(image);
  });
}

removeImagesButton.addEventListener("click", removeImages);
function handleImageClick(event) {
  const newImage = currentImage;
  const maxWidth = document.documentElement.clientWidth;
  const maxHeight = document.documentElement.clientHeight;
  const width = newImage.width;
  const height = newImage.height;
  const x = event.clientX;
  const y = event.clientY;
  let scaleX = 1;
  let scaleY = 1;
  if (width > maxWidth) {
    scaleX = maxWidth / width;
  }
  if (height > maxHeight) {
    scaleY = maxHeight / height;
  }
  const scale = Math.min(scaleX, scaleY);
  newImage.style.display = "block";
  newImage.style.transform = `translate(-50%, -50%) scale(${scale})`;
  newImage.style.left = x + "px";
  newImage.style.top = y + "px";
}

uploadButton.addEventListener("click", handleUpload);
