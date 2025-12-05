// Register service worker for offline support
if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js', { scope: './' });
}

const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const promptInput = document.getElementById('prompt');
const resolutionSelect = document.getElementById('resolution');
const loading = document.getElementById('loading');
const result = document.getElementById('result');
const generatedImage = document.getElementById('generatedImage');

generateBtn.addEventListener('click', generateWallpaper);
downloadBtn.addEventListener('click', downloadWallpaper);

async function generateWallpaper() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        alert('Please enter a description for your wallpaper');
        return;
    }
    
    const [width, height] = resolutionSelect.value.split('x');
    
    loading.style.display = 'block';
    result.style.display = 'none';
    
    // Pollinations AI URL - completely free, no API key needed!
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&model=flux&nologo=true`;
    
    generatedImage.src = imageUrl;
    generatedImage.onload = () => {
        loading.style.display = 'none';
        result.style.display = 'block';
    };
}

async function downloadWallpaper() {
    try {
        // Fetch the image as a blob to bypass CORS restrictions
        const response = await fetch(generatedImage.src);
        const blob = await response.blob();
        
        // Create a temporary URL for the blob
        const blobUrl = URL.createObjectURL(blob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `wallpaper-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Download failed:', error);
        alert('Download failed. Please try right-click and "Save image as..."');
    }
}
