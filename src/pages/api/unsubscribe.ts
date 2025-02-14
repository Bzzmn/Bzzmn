import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, url }) => {
    try {
        const email = url.searchParams.get('email');
        const data = await request.json();
        const { token } = data;

        if (!email || !token) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'Email y token son requeridos'
                }),
                { status: 400 }
            );
        }

        // Aquí iría tu lógica para verificar el token y actualizar la base de datos
        // Por ejemplo:
        // await validateTokenAndUnsubscribe(email, token);

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Desuscripción exitosa'
            }),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Error al procesar la solicitud'
            }),
            { status: 500 }
        );
    }
}; 