// app/api/user/profile/route.ts
'use server';

export async function GET(req: Request) {
    const url = process.env.NEXT_PUBLIC_API_USER_PROFILE_URL; 

    if (!url) {
        throw new Error('NEXT_PUBLIC_API_USER_PROFILE_URL is not defined');
    }

    // Получить заголовки с запроса от клиента
    const headers = req.headers;
    // Получить токен из заголовков
    const token = headers.get('Authorization');
    // Если токен не найден, выбросить ошибку
    if (!token) {
        throw new Error('Token is missing');
    }


    console.log('GET /user/profile - Headers:', JSON.stringify(headers)); // Логирование заголовков запроса
    console.log('Token from headers:', token); // Логирование токена
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
        },
      });

    const data = await response.json();
    console.log('Tokens generated (user/profile):', JSON.stringify(data)); // Логирование токенов

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