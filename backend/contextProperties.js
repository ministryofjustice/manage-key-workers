/**
 * Wrapper functions to set commonly used fields on an 'context' object that is managed over the scope of a request.
 * Hopefully reduces the liklihood of mis-typing property names.
 * Note that by convention the controller(s) and Middleware use the res.locals property as the request scoped context.
 * From controllers down to clients, client interceptors etc the context object is called 'context'.
 */
const setTokens = (context, accessToken, refreshToken) => {
  context.accessToken = accessToken;
  context.refreshToken = refreshToken;
};

const hasTokens = (context) => {
  if (!context) return false;
  return !(!context.accessToken || !context.refreshToken);
};

const getAccessToken = (context) => {
  if (!context) return null;
  if (!context.accessToken) return null;
  return context.accessToken;
};

const getRefreshToken = (context) => {
  if (!context) return null;
  if (!context.refreshToken) return null;
  return context.refreshToken;
};

module.exports = {
  setTokens,
  hasTokens,
  getAccessToken,
  getRefreshToken
};
