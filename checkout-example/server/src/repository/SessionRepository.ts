import { ApiRoot } from '@commercetools/platform-sdk';
import Client from '../client/Client';

type SessionData = {
    cartId: string;
}

interface ISessionRepository {
    apiRoot: ApiRoot
    projectKey: string
    getSession(data: SessionData): any | Error
}

class Session implements ISessionRepository {
    apiRoot: ApiRoot;
    region: string;
    connectorAppKey: string;
    projectKey: string;
    clientId: string;
    clientSecret: string;
    authUrl: string;
    apiUrl: string;
    sessionUrl: string;

    constructor(options) {
        this.region = process.env.REGION;
        this.connectorAppKey = process.env.CONNECTOR_APP_KEY;
        this.clientId = process.env.CTP_CLIENT_ID;
        this.clientSecret = process.env.CTP_CLIENT_SECRET;
        this.authUrl = process.env.CTP_AUTH_URL;
        this.apiUrl = process.env.CTP_API_URL;
        this.sessionUrl = process.env.CTP_SESSION_URL;
        const rootClient = new Client(options)
        this.apiRoot = rootClient.getApiRoot(
            rootClient.getClientFromOption(options)
        )
        this.projectKey = rootClient.getProjectKey()
    }

    private async fetchAdminToken() {
        const myHeaders = new Headers();

        myHeaders.append('Authorization', `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`);
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

        var urlencoded = new URLSearchParams();
        urlencoded.append('grant_type', 'client_credentials');
        //urlencoded.append('scope', __VITE_ADMIN_SCOPE__);

        const response = await fetch(`${this.authUrl}/oauth/token`, {
            body: urlencoded,
            headers: myHeaders,
            method: 'POST',
            redirect: 'follow',
        });

        const token = await response.json();

        if (response.status !== 200) {
            console.error(`‼️ Could not fetch token for creating session: `, response);
            return;
        } else {
        }
        return token.access_token;
    }

    private async getSessionId(cartId) {
        const accessToken = await this.fetchAdminToken();

        const sessionMetadata = {
            applicationKey: this.connectorAppKey,
            // processorUrl: "http://localhost:8080",
            // allowedPaymentMethods: ["card", "invoice", "purchaseorder", "dropin"], // add here your allowed methods for development purposes
        };

        const url = `${this.sessionUrl}/${this.projectKey}/sessions`

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                cart: {
                    cartRef: {
                        id: cartId,
                    }
                },
                metadata: sessionMetadata,
            }),
        });
        const data = await res.json();

        if (!res.ok) {
            throw new Error("Not able to create session")
        }

        return data.id;
    }

    async getSession({ cartId }: SessionData) {
        try {
            const sessionId = await this.getSessionId(cartId);
            console.log(`✅ Created session for cart successfully : `, { cartId, sessionId });
            return {
                sessionId,
                projectKey: this.projectKey,
                region: this.region,
            };
        } catch (error) {
            console.error(`‼️ Could not create session for cart: `, error.body?.errors);
            return error
        }
    }
}

export default Session
