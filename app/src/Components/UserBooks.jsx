import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../Context/TokenContext';
import { postServiceData, formatDate, stringToDate } from '../server/util';

const UserBooks = () => {
    const navigate = useNavigate();
    const { getToken } = useContext(TokenContext);
    const [books, setBooks] = useState([]); 

    const user_id = JSON.parse(getToken()).id;

    useEffect(() => {
        const token = getToken();
        if (!token) {
            navigate('/');
        }
    }, [getToken, navigate]);

    const fetchBooks = useCallback(async () => {
        try {
          const data = await postServiceData('userBooks/' + user_id);
          if (Array.isArray(data)) {
            setBooks(data);
          } else {
            console.error('Unexpected server response:', data);
          }
        } catch (error) {
          console.error(error);
        }
      }, [user_id]);
    
      useEffect(() => {
        fetchBooks();
      }, [fetchBooks]);

    const handleReturn = async (book_id, borrowDate) => {
        try {
            // add 1 to the borrow day : fix javascript error
            // TODO : understand why this error occurs
            let dateObj = new Date(borrowDate);
            dateObj.setDate(dateObj.getDate() + 1);
            console.log('DATE OBJ:', dateObj);
            const borrowDateFixed = dateObj.toISOString().slice(0, 10);
            const returnDate = new Date().toISOString().slice(0, 10);
            // params
            const params = {
                return_date: stringToDate(returnDate),
                person_id: user_id,
                book_id: book_id,
                borrow_date: stringToDate(borrowDateFixed)
            };
            console.log('RETURN PARAMS:', params);
            const returnResponse = await postServiceData("returnBook", params);
            if (returnResponse && returnResponse.ok === 'SUCCESS') {
                alert('Book returned successfully');
                fetchBooks(setBooks);
                return true;
            }
            else {
                throw new Error('Return failed');
            }
        } catch (error) {
            console.error('Error returning book:', error);
            throw error;
        }
    }

    return (
        <div className="container mt-5">
        <div className="d-flex flex-column align-items-center justify-content-center mb-5">
            <h1 className="text-center title_consolas mb-5">My Books</h1>
        </div>
        <div className="card">
            <div className="card-body">
                <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Borrow Date</th>
                        <th>Return Date</th>
                        <th>Return ?</th>
                    </tr>
                </thead>
                <tbody>
                {books.map(book => (
                    <tr key={`${book.person_id}-${book.book_id}-${book.borrow_date}`}>
                        <td>{book.book_id}</td>
                        <td>{book.book_title}</td>
                        <td>{book.book_authors}</td>
                        <td>{formatDate(book.borrow_date) || 'N/A'}</td>
                        <td>{formatDate(book.return_date) || 'N/A'}</td>
                        <td>
                        {book.return_date === null?
                            (
                                <button
                                    type="button"
                                    className="btn btn-light-primary mr-2"
                                    onClick={() => {
                                        handleReturn(book.book_id, book.borrow_date.slice(0, 10));
                                    }}
                                >
                                    RETURN
                                </button>
                            ) : 'RETURNED'
                        }
                        </td>
                    </tr>
                ))}
                </tbody>
                </table>
            </div>
        </div>
    </div>
    );    
}

export default UserBooks;