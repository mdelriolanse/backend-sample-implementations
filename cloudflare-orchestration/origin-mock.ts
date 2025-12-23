import { Request } from '@cloudflare/workers-types';


export type Version = 'v1' | 'v2';

export default {
    async fetch(request: Request): Promise<Response> {
        const url: URL = new URL(request.url);

        const CURRENT_DEPLOYED_VERSION: Version = 'v1';

        const forceVersion: Version | null = request.headers.get('X-Force-Version') as Version;
        const versionToServe: Version = forceVersion ?? CURRENT_DEPLOYED_VERSION;

        const data = versionToServe === 'v1' ? V1_DATA : V2_DATA;

        const pageData = data[url.pathname as keyof typeof data];

        if (!pageData) {return new Response('Not Found', { status: 404 })};

        return new Response(JSON.stringify(pageData), {
            headers: {
                'Content-Type': 'application/json',
                'X-Version': versionToServe
            }
        });

    }
}

const V1_DATA = {
    "/": {
      "title": "Acme HOLIDAY SALE",
      "theme": "red",
      "hero_text": "EVERYTHING MUST GO!",
      "links": ["/product/1", "/about"]
    },
    "/product/1": {
      "name": "Super Widget",
      "price": "$50.00", 
      "theme": "red",
      "buy_button": "Buy Now (50% OFF)"
    },
    "/about": {
      "text": "We are currently having a massive sale.",
      "theme": "red"
    }
  }

const V2_DATA = {
    "/": {
      "title": "Acme Store",
      "theme": "blue",
      "hero_text": "Welcome to our Standard Collection",
      "links": ["/product/1", "/about"]
    },
    "/product/1": {
      "name": "Super Widget",
      "price": "$100.00",
      "theme": "blue",
      "buy_button": "Add to Cart"
    },
    "/about": {
      "text": "We sell things at normal prices.",
      "theme": "blue"
    }
  }