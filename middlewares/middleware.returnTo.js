const returnTo = (request,_,next) => {

    const DecodedURI =  decodeURI(request.query.returnTo)
    const searchParams = new URLSearchParams(DecodedURI)
    const appNameMatch = DecodedURI.match(/[?&]activeAppStore=([^&]+)/);

    if (request.query.returnTo) {
        request.session.returnTo = DecodedURI;
    }

    if(searchParams.has('activeAppStore')){
        request.session.appName=searchParams.get('activeAppStore');
    }else if(appNameMatch){
        request.session.appName=appNameMatch[1]
    }else{
        request.session.appName="NA"
    }
    
    
    if (request.query.workspaceId) {
        request.session.workspaceId = request.query.workspaceId;
    }
    next();
}

module.exports = returnTo;