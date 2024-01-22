class Scaler {
    constructor() {
        this.canvas = new OffscreenCanvas(1, 1) || document.createElement('canvas');
        this.context = this.canvas.getContext('2d', {willReadFrequently: true, preserveDrawingBuffer: true, powerPreference: "high-performance", alpha: true, desynchronized: true});
        this.targetCanvas = new OffscreenCanvas(1, 1) || document.createElement('canvas');
        this.targetContext = this.targetCanvas.getContext('2d', {willReadFrequently: true, preserveDrawingBuffer: true, powerPreference: "high-performance", alpha: true, desynchronized: true});
        this.fr = Math.fround;
        this.imul = Math.imul;
        this.abs = Math.abs;
        this.width;
    }
    setCanvas(image, width, height){
        if(image instanceof ImageData){
            this.canvas.width = image.width;
            this.canvas.height = image.height;
            this.context.putImageData(image, 0, 0);
        }else {
            this.canvas.width = image.width;
            this.canvas.height = image.height;
            this.context.drawImage(image, 0, 0);
        }

        this.targetCanvas.width = width;
        this.targetCanvas.height = height;
        this.width = width;
    }
    kCenter(image, width, height, colors, accuracy) {
        colors = typeof colors == "undefined" ? (((width+height) / 2) > 512) ? 1: (((width+height) / 2) > 256) ? 2: 4: colors;
        accuracy = typeof accuracy == "undefined" ? (((width+height) / 2) > 512) ? 1: (((width+height) / 2) > 256) ? 3: 6: colors;
        this.setCanvas(image, width, height);

        const wFactor = this.fr(this.canvas.width / width);
        const hFactor = this.fr(this.canvas.height / height);

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const tileImage = this.context.getImageData(x * wFactor|0, y * hFactor|0, wFactor|0, hFactor|0);
                this.targetContext.fillStyle = this.colorToRgba(this.kMeans(tileImage, colors, accuracy));
                this.targetContext.fillRect(x, y, 1, 1);
            }
        }
        return this.targetContext;
    }
    kMeans(imageData, k, accuracy) {
        let centroids = this.initCentroids(imageData, k);
        let clusters;

        for (let iter = 0; iter < accuracy; iter++) {
            clusters = this.assignPixelsToCentroids(imageData, centroids);
            centroids = this.recalculateCentroids(imageData, clusters, centroids);
        }

        return this.findBiggestCentroid(centroids);
    }
    initCentroids(imageData, k) {
        const centroids = [];
        const pixels = imageData.data;
        for (let i = 0; i < k; i++) {
            const id = Math.floor(Math.random() * (pixels.length / 4)), idx = id * 4;
            centroids.push({ i: id, r: pixels[idx], g: pixels[idx + 1], b: pixels[idx + 2], a: pixels[i + 3], count: 0 });
        }
        return centroids;
    }
    assignPixelsToCentroids(imageData, centroids) {
        const enhancedEuclideanDistance = this.enhancedEuclideanDistance.bind(this);
        const clusters = new Array(centroids.length).fill().map(() => []);
        const pixels = imageData.data;

        centroids.forEach(function (centroid){centroid.count = 0;}); // Reset centroid counts

        for (let i = 0; i < pixels.length; i += 4) {
            const pixel = { i: i/4, r: pixels[i], g: pixels[i + 1], b: pixels[i + 2], a: pixels[i + 3] };
            let minDist = Infinity;
            let closestCentroidIndex = -1;

            centroids.forEach(function (centroid, index){
                const dist = enhancedEuclideanDistance(pixel, centroid);
                if (dist < minDist) {
                    minDist = dist;
                    closestCentroidIndex = index;
                }
            });

            if(closestCentroidIndex >= 0) {
                clusters[closestCentroidIndex].push(i/4); // Store the index of the pixel in the cluster
                centroids[closestCentroidIndex].count++;
            }
        }

        return clusters;
    }
    recalculateCentroids(imageData, clusters, centroids) {
        const pixels = imageData.data;
        return centroids.map(function (centroid, index) {
            if (clusters[index].length === 0) return centroid;

            let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
            clusters[index].forEach(function(pixelIndex) {
                sumR += pixels[pixelIndex];
                sumG += pixels[pixelIndex + 1];
                sumB += pixels[pixelIndex + 2];
                sumA += pixels[pixelIndex + 3];
            });

            const len = clusters[index].length;
            return { r: sumR / len | 0, g: sumG / len| 0, b: sumB / len | 0, a: sumA / len | 0, count: len | 0 };
        });
    }
    findBiggestCentroid(centroids) {
        return centroids.reduce(function (max, centroid){ return centroid.count > max.count ? centroid : max}, centroids[0]);
    }
    colorToRgba(color) {
        return "rgba("+color.r+","+color.g+","+color.b+","+color.a+")";
    }
    enhancedEuclideanDistance(color1, color2) {

        //const alpha = 0.5; // Adjust as necessary
        const distances = Uint8Array.of(this.abs(color1.r - color2.r), this.abs(color1.g - color2.g), this.abs(color1.b - color2.b));
        // Calculate spatial distance
        /*const coordinates = Uint16Array.of(
            color1.i % this.width,
                Math.floor(color1.i / this.width),
                color2.i % this.width,
                Math.floor(color2.i / this.width)
        );
        const coordinatesDistances = Uint8Array.of(this.abs(coordinates[0] - coordinates[2]), this.abs(coordinates[1] - coordinates[3]));
        const spatialDistance = Math.sqrt(
            this.imul(coordinatesDistances[0], coordinatesDistances[0]) +
            this.imul(coordinatesDistances[1], coordinatesDistances[1])
        ) * 32;*/
        const colorDistance = Math.sqrt(this.imul(distances[0], distances[0])+this.imul(distances[1], distances[1])+this.imul(distances[2], distances[2]));

        // Weight the color and spatial distances
        return colorDistance; //alpha * colorDistance + (1 - alpha) * spatialDistance | 0;
    }
}

// Usage
const scaler = new Scaler();
module.exports = {
    scaler: scaler
}