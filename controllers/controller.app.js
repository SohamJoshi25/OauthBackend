const refresh = require("passport-oauth2-refresh");
const workspaceTokenModel = require("../models/model.token.js")

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

        const existingProviderIndex = workspaceProviders.findIndex(p => p.provider == provider);

        if(existingProviderIndex==-1){
            return response.status(404).send(`Provider not registered in workspaceID ${workspaceId}`);
        }

        const RequiredToken = workspaceProviders[existingProviderIndex];

        const ExpiryTime = RequiredToken.updatedAt + (RequiredToken.expiresIn * 1000);

        console.log(workspace.providers[existingProviderIndex])
        if(Date.now() < ExpiryTime){
            console.log(RequiredToken)
            return response.status(200).json({ accessToken:RequiredToken.accessToken })
        }

        if(!RequiredToken.refreshToken){
            return response.status(403).send(`RefreshToken Not found`);
        }
    
        refresh.requestNewAccessToken(RequiredToken.provider, RequiredToken.refreshToken, async (err, accessToken, refreshToken) => {
            if(err){
                return response.status(400).json({err});
            }

            try {
                
                
                workspace.providers[existingProviderIndex].accessToken = accessToken;
                workspace.providers[existingProviderIndex].updatedAt = Date.now();
                console.log("Refreshed : ",workspace)
                await workspace.save();

            } catch (dbError) {
                console.error('Database update error:', dbError);
                return response.status(500).json({ error: "Failed to update token in the database" });
            }

            return response.json({accessToken})

            },
        );

    }catch(error){
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
            { $pull: { providers: { provider: provider } } }
          );

          console.log(provider,result)

        
        if(result.nModified == 0){
            return response.status(202).json({message:"User Not Found or Provider Not Present"});
        }

        return response.status(200).json({message:"Provider Removed"});

    }catch(error){
        console.error(error);
        response.status(400).json({error:"Some Error Occured"})
    }
}


const commonCallBack = (req, res) => {
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(returnTo);
};

module.exports = {accessToken,commonCallBack,logout}