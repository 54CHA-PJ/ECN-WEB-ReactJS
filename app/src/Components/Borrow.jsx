import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../Context/TokenContext';
import { postServiceData, stringToDate } from '../server/util';

const Borrow = () => {
    const navigate = useNavigate();
    const { getToken } = useContext(TokenContext);
    const [books, setBooks] = useState([]); 

    useEffect(() => {
        const token = getToken();
        if (!token) {
            navigate('/');
        }
    
        const refreshBooks = () => fetchBooks(setBooks);
    
        refreshBooks();
    }, [getToken, navigate, setBooks]);

    const refreshBooks = () => fetchBooks(setBooks);

    const fetchBooks = async (setBooksFunc) => {
        try {
            const data = await postServiceData('availableBooks');
            if (Array.isArray(data)) {
                setBooksFunc(data);
            } else {
                console.error('Unexpected server response:', data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const borrowBook = async (bookId) => {
        const borrowDate = new Date().toISOString().slice(0, 10);
        const params = {
            book_id: bookId,
            person_id: JSON.parse(getToken()).id,
            borrow_date: stringToDate(borrowDate)
        };
        console.log('BORROW PARAMS:', params);
        try {
            const data = await postServiceData('borrowBook', params);
            if (data && data.ok === 'SUCCESS') {
                alert('Book borrowed successfully');
            }
            else {
                alert("Borrow Failed\n\nBy the way, you can't borrow a book the same day you returned it. Think about the others ! \n\nPlease come back again later.");
                throw new Error('Borrow failed');
            }
        } catch (error) {
            console.error(error);
        }
        refreshBooks();
    };

    const handleBorrow = (bookId) => {
        borrowBook(bookId);
        refreshBooks();
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center title_consolas mb-5">Available Books</h1>
            <div className="card">
                <div className="card-body">
                    <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Author(s)</th>
                            <th className="actions">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => (
                            <tr key={book.book_id}>
                                <td>{book.book_id}</td>
                                <td>{book.book_title}</td>
                                <td>{book.book_authors} </td>
                                <td className="actions">
                                <button 
                                    type="submit" 
                                    className="btn btn-light-primary mr-2"
                                    onClick={() => handleBorrow(book.book_id)}
                                >
                                    BORROW
                                </button>
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

export default Borrow;