import {
  addBookHandler,
  deleteBookById,
  getBookByIdHanlder,
  getBooksHandler,
  updateBookById
} from './handler.js';

const routes = [
  {
    method : 'POST',
    path : '/books',
    handler : addBookHandler,
    options: {
      payload: {
        parse: true,
        allow: 'application/json'
      }
    }
  },
  {
    method : 'GET',
    path : '/books',
    handler : getBooksHandler
  },
  {
    method : 'GET',
    path : '/books/{bookId}',
    handler : getBookByIdHanlder
  },
  {
    method : 'PUT',
    path : '/books/{bookId}',
    handler : updateBookById
  },
  {
    method : 'DELETE',
    path : '/books/{bookId}',
    handler : deleteBookById,
  }
];


export default routes;