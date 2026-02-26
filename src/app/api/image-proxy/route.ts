import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return new NextResponse('Missing ID', { status: 400 });
    }

    try {
        // We use a known working Google Drive embed proxy format
        // This format allows iframes and direct image embeds without auth
        const proxyUrl = `https://lh3.google.com/u/0/d/${id}`;

        const response = await fetch(proxyUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,*/*',
                'Referer': 'https://drive.google.com/'
            },
            redirect: 'follow'
        });

        if (!response.ok) {
            return new NextResponse('Failed to fetch from proxy', { status: response.status });
        }

        const contentType = response.headers.get('content-type') || 'image/jpeg';

        // If Google still throws HTML, it means the file is strictly private (not "Anyone with link can view")
        if (contentType.includes('text/html')) {
            console.error('Google Drive returned HTML. The image is private and requires the owner to change sharing settings to "Anyone with the link".');
            return new NextResponse('Image is Private', {
                status: 403,
                headers: {
                    'Content-Type': 'text/plain',
                    'X-Error': 'Image is Private'
                }
            });
        }

        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(Buffer.from(arrayBuffer), {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, s-maxage=86400',
                'Access-Control-Allow-Origin': '*',
            },
        });

    } catch (error) {
        console.error('Proxy error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
