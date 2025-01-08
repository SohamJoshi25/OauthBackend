const returnTo = (request, response, next) => {
    try {
        if (!request.query.returnTo) {
            // If returnTo is missing, handle it gracefully
            throw new Error("Missing 'returnTo' parameter in the request query.");
        }

        const DecodedURI = decodeURI(request.query.returnTo);
        
        // Ensure DecodedURI is a full URL; if not, prepend a protocol for URL parsing
        const isFullURL = DecodedURI.startsWith('http://') || DecodedURI.startsWith('https://');
        const returnToURL = new URL(isFullURL ? DecodedURI : `https://${DecodedURI}`);
        const searchParams = returnToURL.searchParams;

        const appNameMatch = DecodedURI.match(/\/apps\/([^/?#]+)$/);

        // Store returnTo URL in session if it exists
        request.session.returnTo = DecodedURI;

        // Determine the app name
        if (searchParams.has('activeAppStore')) {
            request.session.appName = searchParams.get('activeAppStore');
        } else if (appNameMatch) {
            request.session.appName = appNameMatch[1];
        } else {
            request.session.appName = "";
        }

        // Store workspaceId in session if it exists
        if (request.query.workspaceId) {
            request.session.workspaceId = request.query.workspaceId;
        }

        next();
    } catch (error) {
        console.error("Error in returnTo middleware:", error);
        response.status(500).json({ error: "Internal Server Error: Invalid returnTo URL format." });
    }
};

module.exports = returnTo;
