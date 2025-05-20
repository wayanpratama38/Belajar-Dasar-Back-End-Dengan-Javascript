/**
    "name": string,
    "year": number,
    "author": string,
    "summary": string,
    "publisher": string,
    "pageCount": number,
    "readPage": number,
    "reading": boolean
 */

import { nanoid } from 'nanoid';
import books  from './books.js';

/**
    "id": "Qbax5Oy7L8WKf74l",
    "name": "Buku A",
    "year": 2010,
    "author": "John Doe",
    "summary": "Lorem ipsum dolor sit amet",
    "publisher": "Dicoding Indonesia",
    "pageCount": 100,
    "readPage": 25,
    "finished": false,
    "reading": false,
    "insertedAt": "2021-03-04T09:11:44.598Z",
    "updatedAt": "2021-03-04T09:11:44.598Z"
 */

export const addBookHandler = (request, h) => {

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (pageCount === readPage) ? true : false;


  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  };

  books.push(newBook);

  const isSuccess = books.filter((book)=> book.id===id).length > 0;

  if (!name) {
    const reseponse = h.response({
      status    : 'fail',
      message   : 'Gagal menambahkan buku. Mohon isi nama buku'
    });

    reseponse.code(400);
    return reseponse;
  }

  if (readPage>pageCount) {
    const response = h.response({
      status  : 'fail',
      message : 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }

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
  if (books.length>0){
    console.log(`panjang : ${books.length}`);
    console.log(`buku : ${books}`);
    const response = h.response({
      status : 'success',
      data  : {
        books : books
      }
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status : 'success',
    data : {
      books : [{}]
    }
  });
  response.code(200);
  return response;
};

export const getBookByIdHanlder = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b)=>b.id===bookId)[0];

  if (book !== undefined) {
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
  if (books[index].name==='') {
    const response = h.response({
      status : 'fail',
      message : 'Gagal memperbarui buku. Mohon isi nama buku'
    });

    response.code(400);
    return response;
  }

  if (books[index].readPage>books[index].pageCount) {
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
    status : 'succcess',
    message : 'Buku berhasil diperbarui'
  });
  response.code(200);
  return response;
};


export const deleteBookById = (request, h) => {
  const { bookId } = request.params;

  const index = books.filter((book)=>book.id===bookId);
  if (index===-1){
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

