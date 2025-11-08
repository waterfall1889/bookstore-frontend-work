const GATEWAY_BASE = 'http://localhost:8085/api/author-lookup/v1/authors';

export async function queryAuthorsByBookName(bookName) {
    if (!bookName || !bookName.trim()) {
        throw new Error('书名不能为空');
    }

    const url = new URL(GATEWAY_BASE);
    url.searchParams.set('bookName', bookName.trim());

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '作者查询失败');
    }

    return response.json();
}

