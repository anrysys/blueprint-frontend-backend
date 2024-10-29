// app/api/user/profile/route.ts
'use server';

export async function GET(req: Request) {
    const url = process.env.NEXT_PUBLIC_API_USER_PROFILE_URL; 

    if (!url) {
        throw new Error('NEXT_PUBLIC_API_USER_PROFILE_URL is not defined');
    }

    // Получить заголовки с запроса от клиента
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            Authorization: req.headers.get('Authorization') || '',
        }),
      });

    const data = await response.json();

    // Если ответ не успешен, выбросить ошибку
    if (!response.ok) {
        throw new Error(data.message);
    }
    // Вернуть ответ 
    return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
    });
    

}        