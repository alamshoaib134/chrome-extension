document.getElementById('downloadBtn').addEventListener('click', downloadAllImages);
document.getElementById('sizeFilter').addEventListener('input', updateSizeFilter);

let images = [];

function showImageList() {
  const imageList = document.getElementById('imageList');
  imageList.innerHTML = '';
  const minSize = document.getElementById('sizeFilter').value;
  let count = 0;
  images.forEach((image, index) => {
    const size = image.naturalWidth * image.naturalHeight / 1024; // approximate size in KB
    if (size < minSize) {
      return;
    }
    count++;
    const imageItem = document.createElement('div');
    imageItem.className = 'imageItem';

    const img = document.createElement('img');
    img.src = image.src;
    img.width = 64;
    img.height = 64;
    imageItem.appendChild(img);

    const downloadButton = document.createElement('button');
    downloadButton.textContent = "\u2B07"; // Unicode down arrow
    downloadButton.addEventListener('click', () => downloadImage(image.src));
    imageItem.appendChild(downloadButton);

    const imageSize = document.createElement('div');
    imageSize.className = 'imageSize';
    imageSize.textContent = `${Math.round(size)} KB`;
    imageItem.appendChild(imageSize);

    imageList.appendChild(imageItem);
  });
  document.getElementById('totalCount').textContent = ` (${count} images)`;
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.executeScript(
    tabs[0].id,
    {code: 'Array.from(document.images).map(img => ({src: img.src, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight}));'},
    function(results) {
      images = results[0];
      showImageList();
    }
  );
});

function updateSizeFilter() {
  document.getElementById('sizeLabel').textContent = this.value;
  showImageList();
}

function showImageList() {
  const imageList = document.getElementById('imageList');
  imageList.innerHTML = '';
  const minSize = document.getElementById('sizeFilter').value;
  let count = 0;
  images.forEach((image, index) => {
    const size = image.naturalWidth * image.naturalHeight / 1024; // approximate size in KB
    if (size < minSize) {
      return;
    }
    count++;
    const imageItem = document.createElement('div');
    imageItem.className = 'imageItem';

    const img = document.createElement('img');
    img.src = image.src;
    img.width = 64;
    img.height = 64;
    imageItem.appendChild(img);

    const downloadButton = document.createElement('button');
    downloadButton.textContent = "\u2B07"; // Unicode down arrow
    downloadButton.addEventListener('click', () => downloadImage(image.src));
    imageItem.appendChild(downloadButton);

    const imageSize = document.createElement('div');
    imageSize.className = 'imageSize';
    imageSize.textContent = `${Math.round(size)} KB`;
    imageItem.appendChild(imageSize);

    imageList.appendChild(imageItem);
  });
  document.getElementById('totalCount').textContent = ` (${count} images)`;
}

function downloadImage(src) {
  chrome.downloads.download({url: src});
}

function downloadAllImages() {
  images.forEach(image => downloadImage(image.src));
}