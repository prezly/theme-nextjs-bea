export function GET() {
    return new Response('404 Not Found', {
        status: 404,
        statusText: 'Not Found',
    });
}
