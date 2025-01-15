const axios = require('axios')

const getData = async (request, response) => {
    try {
        const authHeader = request.headers.authorization;
        const accessToken = authHeader?.split(" ")[1];

        const userResponse = await axios.get("https://public-api.wordpress.com/rest/v1.1/me",{
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
        })
        const siteResponse = await axios.get(`https://public-api.wordpress.com/rest/v1.1/sites/${userResponse.data.token_site_id}`,{
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
        })
        const postResponse = await axios.get(`https://public-api.wordpress.com/rest/v1.1/sites/${siteResponse.data.ID}/posts`,{
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
        })

        response.status(200).json({user:userResponse.data,site:siteResponse.data,posts:postResponse.data});
    } catch (error) {
        console.log(error)
        response.status(error.response?.status || 500).json(error.response?.data || { error: 'Server error' });
    }
}


const postWordpress = async (request, response) => {
    try {
        const authHeader = request.headers.authorization;
        const accessToken = authHeader?.split(" ")[1];
        const siteId = request.body.siteId;

        console.log(accessToken)

        const postResponse = await axios.post(`https://public-api.wordpress.com/rest/v1.1/sites/${siteId}/posts/new`,request.body.content,{
            headers:{
                Authorization:`Bearer ${accessToken}`
            },
        })

        response.status(200).json(postResponse.data);
    } catch (error) {
        console.log(error)
        response.status(error.response?.status || 500).json(error.response?.data || { error: 'Server error' });
    }
}


const fetchPosts = async (request,response) => {
    try {

        const authHeader = request.headers.authorization;
        const accessToken = authHeader?.split(" ")[1];
        const siteId = request.params.siteId;

        if (!accessToken || !siteId) {
            return response.status(400).json({ message: "Access Token Not Found Or SiteID Not Found" });
        }

        const postResponse = await axios.get(`https://public-api.wordpress.com/rest/v1.1/sites/${siteId}/posts`,{
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
        })
        
        return response.status(200).json({posts:postResponse.data});

        
    } catch (error) {
        console.error(error);
        response.status(error.status).json(error.code);
    }
}


module.exports = { getData, postWordpress,fetchPosts}