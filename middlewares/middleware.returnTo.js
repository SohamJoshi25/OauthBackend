const returnTo = (request,_,next) => {
    if (request.query.returnTo) {
        request.session.returnTo = request.query.returnTo;
    }
    if (request.query.workspaceId) {
        request.session.workspaceId = request.query.workspaceId;
    }
    next();
}

module.exports = returnTo;