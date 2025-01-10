const axios = require('axios')

const fetchData = async (request, response) => {
    try {

        const authHeader = request.headers.authorization;
        const accessToken = authHeader?.split(" ")[1];

        console.log(accessToken)

        if (!accessToken) {
            return response.status(400).json({ message: "Access Token Not Found" });
        }

        // Make request to Medium API
        const userDataResponse = await axios.get("https://api.medium.com/v1/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const user = userDataResponse.data;

        console.log(user)

        // Return user data
        return response.status(200).json({ message: "Success", user });
    } catch (error) {
        console.error("Error fetching user data from Medium:", error.message);

        // Return sanitized error response
        const status = error.response?.status || 500;
        const message = error.response?.data || { message: "Internal Server Error" };
        return response.status(status).json({ message });
    }
};

const postPublications = async (request, response) => {
    try {
        
    } catch (error) {
        console.error(error);
        response.status(500).json(error);
    }
}

module.exports = {fetchData,postPublications}