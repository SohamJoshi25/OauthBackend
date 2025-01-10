const mediumRefreshStrategy = async (refreshToken, next) => {
    try {
      const response = await axios.post(
        'https://api.medium.com/v1/tokens',
        new URLSearchParams({
          refresh_token: refreshToken,
          client_id: process.env.MediumClientId,
          client_secret: process.env.MediumClientSecret,
          grant_type: 'refresh_token',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
            'Accept-Charset': 'utf-8',
          },
        }
      );
  
      const { access_token: accessToken, refresh_token: newRefreshToken } = response.data;
  
      return next(null, accessToken, newRefreshToken);

    } catch (error) {
      console.error('Error refreshing Medium token:', error.response?.data || error.message);
      
      return next(error);
    }
  };

module.exports = {mediumRefreshStrategy}