import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshAccessToken(token: any) {
    try {
        // Get a new set of tokens with a refreshToken
        const tokenResponse = await axios.post('auth/refreshToken', {
            token: token.refreshToken
        });

        return {
            ...token,
            accessToken: tokenResponse.data.accessToken,
            accessTokenExpiry: tokenResponse.data.accessTokenExpiry,
            refreshToken: tokenResponse.data.refreshToken
        }
    } catch (error) {
        return {
            ...token,
            error: "RefreshAccessTokenError",
        }
    }
}

const providers = [
    CredentialsProvider({
        name: 'Credentials',
        authorize: async (credentials) => {
            try {
                // Authenticate user with credentials
                const user = await axios.post('http://localhost:8000/auth/login', {
                    type: credentials.type,
                    username: credentials.username,
                    password: credentials.password,
                });

                if (user.data.accessToken) {
                    return user.data;
                }

                return null;
            } catch (e) {
                console.log(e);
                throw new Error(e);
            }
        },
    })
]

const callbacks = {
    jwt: async ({ token, user }: { token: any, user: any }) => {
        if (user) {
            // This will only be executed at login. Each next invocation will skip this part.
            token.accessToken = user.accessToken;
            token.accessTokenExpiry = user.accessTokenExpiry;
            token.refreshToken = user.refreshToken;
        }

        // If accessTokenExpiry is 24 hours, we have to refresh token before 24 hours pass.
        const shouldRefreshTime = Math.round((token.accessTokenExpiry - 60 * 60 * 1000) - Date.now());

        // If the token is still valid, just return it.
        if (shouldRefreshTime > 0) {
            return Promise.resolve(token);
        }

        // If the call arrives after 23 hours have passed, we allow to refresh the token.
        token = refreshAccessToken(token);
        return Promise.resolve(token);
    },
    session: async ({ session, token }: { session: any, token: any }) => {
        // Here we pass accessToken to the client to be used in authentication with your API
        session.accessToken = token.accessToken;
        session.accessTokenExpiry = token.accessTokenExpiry;
        session.error = token.error;

        return Promise.resolve(session);
    },
    pages: {
        signIn: '/signin',
        signOut: '/signin',
        error: '/signin'
    },
}

export const options = {
    providers,
    callbacks,
    pages: {},
    secret: '123456789'
}

const Auth = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options)

export default Auth;