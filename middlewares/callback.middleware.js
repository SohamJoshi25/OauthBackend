const workspaceTokenModel = require("../models/token.model.js")

const passportCallBack = async (request,accessToken,refreshToken,profile,done,expiryDuration = 1800) => {
    //console.log('Access Token:', accessToken);
    //console.log('Refresh Token:', refreshToken);
    //console.log('Profile:', profile);
    //console.log('Req from passport:', request);
    //console.log('done:', done);
    //console.log('expiryDuration:', expiryDuration);
   try {

        const provider = {
            provider: profile.provider,
            providerId: profile.id,
            displayName: profile.displayName,
            emails: profile.emails ? profile.emails.map(e => e.value || e) : [],
            photo: profile.photos,
            otherData:"",
            appName:request.session.appName || profile.provider,
            accessToken: accessToken,
            refreshToken: refreshToken || "temp-ref-token",
            expiresIn: expiryDuration,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        const workspaceId = request.session.workspaceId;
        if (!workspaceId) {
            return done(null, false, { message: 'WorkspaceId ID not found in session' });
        }

        const workspace = await workspaceTokenModel.findOne({workspaceId});

        if(!workspace){
            const newWorkspace = new workspaceTokenModel({
                workspaceId,
                providers: [provider],
            });
          
            await newWorkspace.save();

        }else{

            const existingProviderIndex = workspace.providers.findIndex(provider => provider.provider === profile.provider && provider.appName === request.session.appName );

            if(existingProviderIndex!=-1){
                workspace.providers[existingProviderIndex] = provider;
            }else{
                workspace.providers.push(provider);
            }
            
            await workspace.save();
        }

        return done(null,{accessToken});

   } catch (error) {
        console.error(error);
        return done(error,"Error Occured");
   }

}

const mediumCallBack = async (request,response,next) => {
    const { code } = req.query;

    try {
      const response = await axios.post('https://api.medium.com/v1/tokens', {
        code,
        client_id: process.env.MediumClientId,
        client_secret: process.env.MediumClientSecret,
        redirect_uri: process.env.NODE_ENV=="DEVELOPMENT"? process.env.APP_DOMAIN_LOCAL : process.env.APP_DOMAIN_PRODUCTION +"/auth/medium/callback",
        grant_type: 'authorization_code',
      });
  
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;

      const provider = {
        provider: "medium",
        providerId: "mediumId",
        displayName: "",
        emails: "",
        photo: "",
        otherData:"",
        appName:request.session.appName || "medium",
        accessToken: accessToken,
        refreshToken: refreshToken || "temp-ref-token",
        expiresIn: response.data.expires_at-Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
  
      return done(null,{accessToken});

    } catch (error) {
      console.error('Error exchanging code for token:', error.message);
      res.status(500).send('Authentication failed');
    }
}

module.exports = {passportCallBack,mediumCallBack}
