// terrainWorker.js

const getHeightFromRgb = (r, g, b) => {
    if (r === 0 && g === 0 && b === 0) return 0;
    return (r * 256 + g + b / 256) - 32768;
};

self.onmessage = function (e) {
    const {
        imageData,
        imageWidth,
        imageHeight,
        positions,
        planeSize,
        heightScale,
        kernelSize
    } = e.data;

    const smoothedHeights = new Float32Array(positions.length / 3);
    
    for (let i = 0; i < smoothedHeights.length; i++) {
        const u = (positions[i * 3] / planeSize) + 0.5;
        const v = (positions[i * 3 + 1] / planeSize) + 0.5;
        const tx = Math.floor(u * imageWidth);
        const ty = Math.floor(v * imageHeight);

        let totalHeight = 0;
        let sampleCount = 0;

        for (let ky = -kernelSize; ky <= kernelSize; ky++) {
            for (let kx = -kernelSize; kx <= kernelSize; kx++) {
                const sampleX = tx + kx;
                const sampleY = ty + ky;
                if (sampleX >= 0 && sampleX < imageWidth && sampleY >= 0 && sampleY < imageHeight) {
                    const index = (sampleY * imageWidth + sampleX) * 4;
                    totalHeight += getHeightFromRgb(imageData[index], imageData[index + 1], imageData[index + 2]);
                    sampleCount++;
                }
            }
        }
        smoothedHeights[i] = (sampleCount > 0) ? totalHeight / sampleCount : 0;
    }

    for (let i = 0; i < smoothedHeights.length; i++) {
        positions[i * 3 + 2] = smoothedHeights[i] * heightScale;
    }

    self.postMessage({ positions });
};