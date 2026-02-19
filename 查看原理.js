const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const compressBtn = document.getElementById('compressBtn');
let currentFile = null;
let originalImageData = null;

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFile(files[0]);
});

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) handleFile(file);
}

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        addLog('请上传图片文件', 'error');
        return;
    }
    
    currentFile = file;
    
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatBytes(file.size);
    document.getElementById('fileInfo').classList.remove('hidden');
    
    compressBtn.disabled = false;
    compressBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImageData = e.target.result;
        showPreview(e.target.result);
        addLog(`已加载: ${file.name} (${formatBytes(file.size)})`, 'success');
    };
    reader.readAsDataURL(file);
}

function showPreview(src) {
    document.getElementById('emptyState').classList.add('hidden');
    document.getElementById('imagePreview').classList.remove('hidden');
    document.getElementById('comparisonView').classList.add('hidden');
    document.getElementById('previewImg').src = src;
    document.getElementById('previewBadge').classList.add('hidden');
}

function clearFile() {
    currentFile = null;
    originalImageData = null;
    compressedBlob = null;
    
    document.getElementById('fileInput').value = '';
    document.getElementById('fileInfo').classList.add('hidden');
    document.getElementById('emptyState').classList.remove('hidden');
    document.getElementById('imagePreview').classList.add('hidden');
    document.getElementById('comparisonView').classList.add('hidden');
    document.getElementById('statsContainer').classList.add('hidden');
    document.getElementById('downloadContainer').classList.add('hidden');
    
    compressBtn.disabled = true;
    compressBtn.classList.add('opacity-50', 'cursor-not-allowed');
    
    addLog('已清除文件', 'info');
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
