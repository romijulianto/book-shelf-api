const { nanoid } = require('nanoid');
const books = require('./books');

// 1. Kriteria 1: API Dapat Menyimpan Buku
const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    let finished = false;

    if (pageCount === readPage) {
        finished = true;
    }

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    if (!name) {
        return h
            .response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku',
            })
            .code(400);
    }

    if (readPage > pageCount) {
        return h
            .response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
            })
            .code(400);
    }

    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
        return h
            .response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id,
                },
            })
            .code(201);
    }

    return h
        .response({
            status: 'error',
            message: 'Buku gagal ditambahkan',
        })
        .code(500);
};

// Kriteria 2: API Dapat Menampilkan Buku
const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    if (name) {
        return h
            .response({
                status: 'success',
                data: {
                    books: books.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
                },
            })
            .code(200);
    }

    if (reading === '1') {
        return h
            .response({
                status: 'success',
                data: {
                    books: books
                        .filter((book) => book.reading === true)
                        .map((book) => ({
                            id: book.id,
                            name: book.name,
                            publisher: book.publisher,
                        })),
                },
            })
            .code(200);
    }

    if (reading === '0') {
        return h
            .response({
                status: 'success',
                data: {
                    books: books
                        .filter((book) => book.reading === false)
                        .map((book) => ({
                            id: book.id,
                            name: book.name,
                            publisher: book.publisher,
                        })),
                },
            })
            .code(200);
    }

    if (finished === '1') {
        return h
            .response({
                status: 'success',
                data: {
                    books: books
                        .filter((book) => book.finished === true)
                        .map((book) => ({
                            id: book.id,
                            name: book.name,
                            publisher: book.publisher,
                        })),
                },
            })
            .code(200);
    }

    if (finished === '0') {
        return h
            .response({
                status: 'success',
                data: {
                    books: books
                        .filter((book) => book.finished === false)
                        .map((book) => ({
                            id: book.id,
                            name: book.name,
                            publisher: book.publisher,
                        })),
                },
            })
            .code(200);
    }

    return h
        .response({
            status: 'success',
            data: {
                books: books.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        })
        .code(200);
};