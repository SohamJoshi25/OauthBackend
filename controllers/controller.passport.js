// Upload to DB and pass to user
const workspaceTokenModel = require("../models/model.token")

const passportCallBack = async (request,accessToken,refreshToken,profile,done,expiryDuration = 3600) => {
    // console.log('Access Token:', accessToken);
    // console.log('Refresh Token:', refreshToken);
    // console.log('Profile:', profile);
    // console.log('Req:', request);
    // console.log('done:', done);
    // console.log('expiryDuration:', expiryDuration);
   try {

        const provider = {
            provider: profile.provider,
            providerId: profile.id,
            displayName: profile.displayName,
            emails: profile.emails ? profile.emails.map(e => e.value || e) : [],
            photo: profile.photos,
            otherData:"",
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
            //console.log('Workspace created successfully:', newWorkspace);

        }else{

            const existingProviderIndex = workspace.providers.findIndex(provider => provider.provider === profile.provider);

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

module.exports = passportCallBack
