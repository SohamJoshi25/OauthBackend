const refresh = require("passport-oauth2-refresh");
const workspaceTokenModel = require("../models/token.model.js")

const { mediumRefreshStrategy }  = require('../middlewares/refreshStrategy.middleware.js')

//Common Controllers for auth

const accessToken = async (request,response) => {

    try {
        const userId = request.session.userId ;
        const provider = request.query.provider;
        const workspaceId = request.query.workspaceId;

        if(!userId || !workspaceId){
            return response.status(402).json({error:"UserID or WorkspaceID not found or Invalid : Express Controller"});
        }
    
        const workspace = await workspaceTokenModel.findOne({workspaceId});
        
        if(!workspace){
            return response.status(403).send(`WorkspaceId ID not registered ${workspaceId}`);
        }

        const workspaceProviders = workspace.providers; 
        const existingProviderIndex = workspaceProviders.findIndex(p => p.appName == provider);

        if(existingProviderIndex==-1){
            return response.status(404).send(`Provider not registered in workspaceID ${workspaceId}`);
        }

        const RequiredToken = workspaceProviders[existingProviderIndex];
        const ExpiryTime = RequiredToken.updatedAt + (RequiredToken.expiresIn * 1000);

        if(Date.now() < ExpiryTime){
            return response.status(200).json({ accessToken:RequiredToken.accessToken })
        }

        const refreshCallback = async (err, accessToken, refreshToken) => {
            //Do NOT MOdify Function parameters as the format is required by refresh of passport js
            if(err){
                const result = await workspaceTokenModel.updateOne(
                    {workspaceId}, 
                    { $pull: { providers: { appName: provider } } }
                );
                if(result.nModified != 0){
                    const updatedDocument = await workspaceTokenModel.findOne({ workspaceId });
        
                    if (updatedDocument && updatedDocument.providers.length === 0) {
                        await workspaceTokenModel.deleteOne({ workspaceId });
                    }
                }
                return response.status(503).json({error:"Error While refreshing using refresh Token",err});
            }
    
            try {
    
                workspace.providers[existingProviderIndex].accessToken = accessToken;
                workspace.providers[existingProviderIndex].updatedAt = Date.now();
                await workspace.save();
    
            } catch (e) {
                console.error('Database update error:', e);
                return response.status(500).json({ error: "Failed to update token in the database" });
            }
    
                response.setHeader('Access-Control-Allow-Credentials', 'true');
                response.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV=="DEVELOPMENT"?'*':'https://www.app.creatosaurus.io'); 
        
    
                return response.json({accessToken})
    
            }

        if(!RequiredToken.refreshToken){
            return response.status(403).send(`RefreshToken Not found`);
        }else if(RequiredToken.appName == "medium"){
            mediumRefreshStrategy(RequiredToken.refreshToken,refreshCallback)
        }else{
            refresh.requestNewAccessToken(RequiredToken.appName, RequiredToken.refreshToken,refreshCallback);
        }


    }catch(error){

        response.setHeader('Access-Control-Allow-Credentials', 'true');
        response.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV=="DEVELOPMENT"?'*':'https://www.app.creatosaurus.io');  


        console.error(error);
        response.status(400).json({error:"Some Error Occured"})
    }
}

const logout = async (request,response) => {

    try {
        const userId = request.session.userId ;
        const provider = request.query.provider;
        const workspaceId = request.query.workspaceId;
        
        if(!userId || !workspaceId){
            return response.status(404).json({error:"UserID or WorkspaceID not found or Invalid : Express Controller"});
        }
        
        const result = await workspaceTokenModel.updateOne(
            {workspaceId}, 
            { $pull: { providers: { appName: provider } } }
          );

          //console.log(provider,result)

        
        if(result.nModified == 0){
            return response.status(202).json({message:"User Not Found or Provider Not Present"});
        }else{
            const updatedDocument = await workspaceTokenModel.findOne({ workspaceId });

            if (updatedDocument && updatedDocument.providers.length === 0) {
                await workspaceTokenModel.deleteOne({ workspaceId });
            }
        }

        response.setHeader('Access-Control-Allow-Credentials', 'true');
        response.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV=="DEVELOPMENT"?'*':'https://www.app.creatosaurus.io'); 

        return response.status(200).json({message:"Provider Removed"});

    }catch(error){
        console.error(error);
        response.setHeader('Access-Control-Allow-Credentials', 'true');
        response.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV=="DEVELOPMENT"?'*':'https://www.app.creatosaurus.io');  

        response.status(400).json({error:"Some Error Occured"})
    }
}

const returnAccessToken = (req, res) => {
    const returnTo = req.session.returnTo || 'https://www.app.creatosaurus.io/';
    delete req.session.returnTo;  
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV=="DEVELOPMENT"?'*':'https://www.app.creatosaurus.io'); 
    res.redirect(returnTo);
};


//Specific Controllers for auth

const mediumAuthenticate = async (request,response) => {
    const clientId = process.env.MediumClientId;
    const redirectUri =  process.env.NODE_ENV=="DEVELOPMENT"? process.env.APP_DOMAIN_LOCAL : process.env.APP_DOMAIN_PRODUCTION +"/auth/medium/callback";
    const scope = 'basicProfile,publishPost';
    const state = process.env.SessionSecret;
  
    const authUrl = `https://medium.com/v1/oauth/authorize?client_id=${clientId}&scope=${scope}&state=${state}&response_type=code&redirect_uri=${redirectUri}`;
    
    res.redirect(authUrl);
}

module.exports = {accessToken,returnAccessToken,logout,mediumAuthenticate}