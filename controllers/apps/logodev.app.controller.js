const axios = require('axios')

const downloadImage = async (request,response) => {
    const imageUrl = request.query.url; // Replace with your logo.dev image URL

    try {
        const imageResponse = await axios.get(imageUrl,{
            responseType: 'stream', // Fetch the image as a stream
        });

        // Set headers for download
        response.setHeader('Content-Disposition', `attachment; filename=${imageUrl.split("?")[0]}`);
        response.setHeader('Content-Type', imageResponse.headers['content-type']);

        // Pipe the image data to the client
        imageResponse.data.pipe(response);
    } catch (error) {
        console.error('Error fetching the image:', error);
        response.status(500).send('Failed to download the image.');
    }
}


module.exports = {downloadImage}