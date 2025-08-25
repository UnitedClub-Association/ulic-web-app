import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    // This route no longer needs the 'imagekit' package.
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

    if (!privateKey) {
        console.error("ImageKit private key is not configured.");
        return NextResponse.json(
            { message: "Server configuration error." },
            { status: 500 }
        );
    }

    try {
        const token = uuidv4();
        // The token will be valid for 1 hour (3600 seconds)
        const expire = Math.floor(Date.now() / 1000) + 3600; 

        const signature = crypto
            .createHmac('sha1', privateKey)
            .update(token + expire)
            .digest('hex');

        const authenticationParameters = {
            token,
            expire,
            signature
        };
        
        return NextResponse.json(authenticationParameters);

    } catch (error) {
        console.error("ImageKit Auth Manual Generation Error:", error);
        return NextResponse.json(
            { message: "Failed to generate ImageKit authentication parameters." },
            { status: 500 }
        );
    }
}