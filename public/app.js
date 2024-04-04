// app.js
const mediaContainer = document.getElementById('media-container');

// Fetch media data from your backend (replace with your actual API endpoint)
fetch('http://localhost:3000') // Replace with your backend API endpoint for fetching media
    .then(response => response.json())
    .then(data => {
        data.forEach(media => {
            createMediaCard(media);
        });
    })
    .catch(error => console.error('Error fetching media:', error));

function createMediaCard(media) {
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container');

    const img = document.createElement('img');
    img.src = `http://localhost:3000/image/${media.filePath}`; // Replace with your actual image path
    img.alt = 'Media Image';

    const likeButton = document.createElement('button');
    likeButton.classList.add('like-button');
    likeButton.textContent = `❤️ ${media.likes}`;
    likeButton.addEventListener('click', () => likeMedia(media._id));

    imgContainer.appendChild(img);
    imgContainer.appendChild(likeButton);
    mediaContainer.appendChild(imgContainer);
}

function likeMedia(mediaId) {
    // Send a PUT request to update likes (replace with your actual API endpoint)
    fetch(`http://localhost:3000/media/${mediaId}/like`, { method: 'PUT' }) // Replace with your backend API endpoint for liking media
        .then(response => response.json())
        .then(updatedMedia => {
            const likeButton = document.querySelector(`[data-media-id="${mediaId}"]`);
            likeButton.textContent = `❤️ ${updatedMedia.likes}`;
        })
        .catch(error => console.error('Error liking media:', error));
}
