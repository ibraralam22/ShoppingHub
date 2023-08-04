const jwt = require('jsonwebtoken');
const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;

module.exports = {
  Auth_LOGIN: (req, res, next) => {
    verify(req, res, next, 'login');
  },
  Auth_ACCESS: (req, res, next) => {
    verify(req, res, next, 'access');
  },
};

/**
 * The `verify` function is a middleware function in JavaScript that checks for the presence and
 * validity of an authorization token in the request header.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as headers, query parameters, and request body. It is an object that is passed to
 * the middleware function by the Express framework.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * setting the status code, sending JSON data, or redirecting the client to another URL.
 * @param next - The `next` parameter is a callback function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically used to move to the next
 * middleware function or to the final route handler.
 * @param type - The `type` parameter is used to determine whether the token being verified is an
 * access token or a refresh token. It is used to select the appropriate secret key for decoding the
 * token. If the `type` is `'access'`, the token is verified using the `JWT_AUTH_TOKEN` secret key
 * @returns The function `verify` returns nothing. It either sends a response with a status code and
 * message or calls the `next` function to proceed to the next middleware.
 */
const verify = (req, res, next, type) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.status(401).send({ message: 'Access Denied' });
  }

  //Validate auth header is exists
  const token = authHeader.split(' ')[1];

  if (!token || token === '') {
    console.log('TOKEN not exists');
    return res.status(401).send({ message: 'Access Denied' });
  }

  let decodedToken;

  try {
    if (type == 'access') {
      decodedToken = jwt.verify(token, JWT_AUTH_TOKEN);
    } else {
      decodedToken = jwt.verify(token, JWT_REFRESH_TOKEN);
    }
  } catch (error) {
    return res.status(401).send({ message: 'Access Denied, Invalid Token' });
  }

  if (!decodedToken) {
    return res.sendStatus(403);
  }

  req.isAuth = true;
  req.loggedData = decodedToken;

  if (typeof req.loggedData.id === 'undefined' || req.loggedData.id === '') {
    return res.status(401).json({
      message: 'Access Denied',
    });
  }
  next();
};
