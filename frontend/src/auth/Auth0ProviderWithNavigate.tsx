import { AppState, Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

// Component to configure Auth0 authentication provider
const Auth0ProviderWithNavigate = ({ children }: Props) => {
  const navigate = useNavigate();

  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const redirectUrl = import.meta.env.VITE_AUTH0_CALLBACK_URL;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE; // Auth0 audience for API calls

  // Ensure all necessary variables are provided; throw an error if any are missing
  if (!domain || !clientId || !redirectUrl || !audience) {
    throw new Error("unable to initialize auth");
  }

  // Function to handle redirects after authentication
  const onRedirectCallback = (appState?: AppState) => {
    // appState is an optional parameter that may contain information about where the user was trying to go before they were redirected to log in.
    navigate(appState?.returnTo || "/auth-callback");
  };

  return (
    // Wrap children components with the Auth0Provider to enable authentication
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: redirectUrl, audience }}
      onRedirectCallback={onRedirectCallback} // Handle navigation on successful login
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithNavigate;