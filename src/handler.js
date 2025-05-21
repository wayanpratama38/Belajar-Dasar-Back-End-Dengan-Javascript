import { nanoid } from 'nanoid';
import books  from './books.js';

export const addBookHandler = (request, h) => {

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (pageCount === readPage) ? true : false;

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  };

  if (!name) {
    const response = h.response({
      status    : 'fail',
      message   : 'Gagal menambahkan buku. Mohon isi nama buku'
    });

    response.code(400);
    return response;
  }


  if (readPage>pageCount) {
    const response = h.response({
      status  : 'fail',
      message : 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((book)=> book.id===id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status : 'success',
      message : 'Buku berhasil ditambahkan',
      data : {
        bookId : id,
      }
    });
    response.code(201);
    return response;
  }
};

export const getBooksHandler = (request, h) => {
  const { reading, finished, name } = request.query;

  let filteredBooks = books;

  if (name !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.reading === (reading === '1'));
  }

  if (finished !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.finished === (finished === '1'));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  response.code(200);
  return response;
};

export const getBookByIdHanlder = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b)=>b.id===bookId)[0];

  if (book === undefined) {
    const response = h.response({
      status : 'fail',
      message : 'Buku tidak ditemukan'
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status : 'success',
    data : {
      book : book
    }
  });

  response.code(200);
  return response;
};

export const updateBookById = (request, h) => {

  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book)=>book.id === bookId);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });
    response.code(404);
    return response;
  }

  if (name === undefined || name.trim() === '') {
    const response = h.response({
      status : 'fail',
      message : 'Gagal memperbarui buku. Mohon isi nama buku'
    });

    response.code(400);
    return response;
  }

  if (readPage>pageCount) {
    const response = h.response({
      status  : 'fail',
      message : 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt
  };

  const response = h.response({
    status : 'success',
    message : 'Buku berhasil diperbarui'
  });
  response.code(200);
  return response;
};


export const deleteBookById = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book)=>book.id===bookId);


  if (index===-1){
    const response = h.response({
      status : 'fail',
      message : 'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
  }

  if (bookId === undefined) {
    const response = h.response({
      status : 'fail',
      message : 'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
  }

  books.splice(index, 1);
  const response = h.response({
    status : 'success',
    message : 'Buku berhasil dihapus'
  });
  response.code(200);
  return response;
};

