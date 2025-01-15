const workspaceTokenModel = require("../models/token.model.js")
const { MEDIUM_REDIRECT_URL } = require("../data/constants.data.js")

//This Function is triggered AFTER code exchange and access token is available after passport.js for database updation
const passportCallBack = async (request, accessToken, refreshToken, profile, done, expiryDuration = 1800) => {
    console.log(request.session);
    try {
        const provider = {
            provider: profile.provider,
            providerId: profile.id,
            displayName: profile.displayName,
            emails: profile.emails ? profile.emails.map(e => e.value || e) : [],
            photo: profile.photos,
            otherData: "",
            appName: request.session.appName || profile.provider,
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

        const workspace = await workspaceTokenModel.findOne({ workspaceId });

        if (!workspace) {
            const newWorkspace = new workspaceTokenModel({
                workspaceId,
                providers: [provider],
            });

            await newWorkspace.save();

        } else {

            const existingProviderIndex = workspace.providers.findIndex(provider => provider.provider === profile.provider && provider.appName === request.session.appName);

            if (existingProviderIndex != -1) {
                workspace.providers[existingProviderIndex] = provider;
            } else {
                workspace.providers.push(provider);
            }

            await workspace.save();
        }

        return done(null, { accessToken });

    } catch (error) {
        console.error(error);
        return done(error, { message:"Error Occured"});
    }
}


//These Functions are triggered BEFORE code exchange and manual code exchange for access token is Required

const mediumCallBack = async (request, response, next) => {
    const { code } = request.query;

    try {
        //Code Exchange for token
        const mediumResponse = await axios.post('https://api.medium.com/v1/tokens', {
            code,
            client_id: process.env.MediumClientId,
            client_secret: process.env.MediumClientSecret,
            redirect_uri: MEDIUM_REDIRECT_URL,
            grant_type: 'authorization_code',
        });

        //Database Update
        const accessToken = mediumResponse.data.access_token;
        const refreshToken = mediumResponse.data.refresh_token;

        const provider = {
            provider: "medium",
            providerId: "mediumId",
            displayName: "",
            emails: "",
            photo: "",
            otherData: "",
            appName: request.session.appName || "medium",
            accessToken: accessToken,
            refreshToken: refreshToken || "temp-ref-token",
            expiresIn: mediumResponse.data.expires_at - Date.now(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        const workspaceId = request.session.workspaceId;
        if (!workspaceId) {
            return response.status(404).json({message:"Workspace Not Found in Database"})
        }

        const workspace = await workspaceTokenModel.findOne({ workspaceId });

        if (!workspace) {
            
            const newWorkspace = new workspaceTokenModel({
                workspaceId,
                providers: [provider],
            });

            await newWorkspace.save();

        } else {

            const existingProviderIndex = workspace.providers.findIndex(provider => provider.provider === profile.provider && provider.appName === request.session.appName);

            if (existingProviderIndex != -1) {
                workspace.providers[existingProviderIndex] = provider;
            } else {
                workspace.providers.push(provider);
            }

            await workspace.save();
        }

        return next();

    } catch (error) {
        console.error('Error exchanging code for token:', error.message);
        res.status(500).json({ message: 'Authentication failed from PassportJS' });
    }
}

module.exports = { passportCallBack, mediumCallBack }
