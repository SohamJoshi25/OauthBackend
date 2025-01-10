const axios = require('axios')

const fetchData = async (request, response) => {
    try {

        const authHeader = request.headers.authorization;
        const accessToken = authHeader?.split(" ")[1];

        if (!accessToken) {
            return response.status(400).json({ message: "Access Token Not Found" });
        }

        const userDataResponse = await axios.get("https://api.medium.com/v1/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const user = userDataResponse.data.data;

        return response.status(userDataResponse.status).json({ message: "Success", user });

        
    } catch (error) {
        console.error(error);
        response.status(error.status).json(error.code);
    }
}

const postPublications = async (request, response) => {
    try {

        const authHeader = request.headers.authorization;
        const accessToken = authHeader?.split(" ")[1];

        if (!accessToken) {
            return response.status(400).json({ message: "Access Token Not Found" });
        }
        
        const userId = request.body.userId;
        const body = request.body.body;

        const userDataResponse = await axios.post(`https://api.medium.com/v1/users/${userId}/posts`,body, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.status(userDataResponse.status).json({ message: "Success"});

    } catch (error) {
        console.error(error);
        response.status(error.status).json(error.code);
    }
}

module.exports = {fetchData,postPublications}