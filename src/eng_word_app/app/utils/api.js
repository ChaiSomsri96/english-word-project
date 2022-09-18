import { BACKEND_URL } from './constants';

let base_url = BACKEND_URL;
let _headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

function createCall(path, data = null, headers = {}, method = 'POST') {
    const merged = {
        ..._headers,
        ...headers,
    };

    let body = {};
    if (data) {
        body = {
            ...body,
            ...data,
        };
    }
    let strData = JSON.stringify(body);

    return fetch(
        `${base_url}${path}`, {
            method,
            headers: merged,
            body: strData,
        },
    ).then((resp) => resp.json());
}

export function getAllData(category_id) {
    return createCall(
        'problem/get-all-data',
        {category_id}
    );    
}

export function getCategoryList(parent_id) {
    return createCall(
        'category/get-category-list',
        {parent_id},
    );
}

export function getVideoList (category_id) {
    return createCall(
        'category/get-video-list',
        {category_id}
    );
}

export function getWordList (category_id) {
    return createCall(
        'problem/get-word-list',
        {category_id}
    );
}

export function getSentenceList (category_id) {
    return createCall(
        'problem/get-sentence-list',
        {category_id}
    );
}

export function getSentenceViewList (category_id) {
    return createCall(
        'problem/get-sentence-view-list',
        {category_id}
    );
}