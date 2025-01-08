const axios = require('axios')

const fetchData = async (request, response) => {
    try {

        if(!request.headers.authorization.split(" ")[1]){
            return  response.status(400).json({message:"Access Token Not Found"});
        }

        const userDataResponse = await axios.get("https://api.medium.com/v1/me",{
            headers:request.headers
        });

        const user = userDataResponse.data;
        return response.status(200).json({message:"Success",user});

        
    } catch (error) {
        console.error(error);
        response.status(400).json(error);
    }
}

const postPublications = async (request, response) => {
    try {
        
    } catch (error) {
        console.error(error);
        response.status(500).json(error);
    }
}

module.exports = {fetchData,postPublications}