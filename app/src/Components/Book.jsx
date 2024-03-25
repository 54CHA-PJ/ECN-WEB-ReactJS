import React, { useEffect, useState, useContext } from 'react';
import { TokenContext } from '../Context/TokenContext';
import { postServiceData, formatDate } from '../server/util';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const Book = () => {
    const navigate = useNavigate();
    const [bookId, setBookId] = useState('');
    const [bookTitle, setBookTitle] = useState('');
    const [bookAuthors, setBookAuthors] = useState('');
    const { getToken } = useContext(TokenContext);
    const [borrows, setBorrows] = useState([]);
    const { id } = useParams(); 

    useEffect(() => {
        const tokenString = getToken();
        const token = JSON.parse(tokenString);
        if (!token || token.status !== 'USER_LOGGED') {
            navigate('/'); 
        }
        else {
            fetchBook(id);
            fetchBorrows(id);
        }
    }, [getToken, navigate, id]);

    const fetchBook = async (id) => {
        try {
            const request = await postServiceData(`book/${id}`);
            const book = request[0];
            setBookId(book.book_id || '');
            setBookTitle(book.book_title || '');
            setBookAuthors(book.book_authors || '');
        } catch (error) {
            console.error('Failed to fetch book:', error);
        }
    };

    const fetchBorrows = async (id) => {
        try {
            const request = await postServiceData(`bookRegistry/${id}`);
            setBorrows(request || []);
        } catch (error) {
            console.error('Failed to fetch borrows:', error);
        }
    };

    const updateBook = async () => {
        var params = {
            book_id: bookId,
            book_authors: bookAuthors,
            book_title: bookTitle
        };
        try {
            const updateResponse = await postServiceData("updateBook", params);
            if (updateResponse && updateResponse.ok === 'SUCCESS') {
                console.log('BOOK: (' + bookId + ', ' + bookTitle + ', ' + bookAuthors + ')' );
                navigate('/books');
                return true;
            }
            else {
                throw new Error('Update failed');
            }
        } catch (error) {
            console.error('Error updating book:', error);
            throw error;
        }
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        updateBook().catch((error) => {
            alert('There was an error deleting the book: ' + error.message);
        });
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-5 text-center title_consolas">Edit Book Information</h1>
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="bookId">Book ID:</label>
                            <input type="text" id="bookId" className="form-control" value={bookId} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bookTitle">Title:</label>
                            <input type="text" id="bookTitle" className="form-control" value={bookTitle} onChange={e => setBookTitle(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bookAuthors">Author(s):</label>
                            <input type="text" id="bookAuthors" className="form-control" value={bookAuthors} onChange={e => setBookAuthors(e.target.value)} />
                        </div>
                        <div className="d-flex justify-content-center ">
                            <button 
                                type="submit" 
                                className="btn btn-primary mr-5">
                                Save Changes
                            </button> 
                            <button 
                                type="button" 
                                className="btn btn-warning ml-5" 
                                onClick={() => navigate('/books')}> 
                                Back to Books
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <h1 className="mt-5 mb-5 text-center title_consolas">Book Borrow Registry</h1>
            <div className="card mt-5 mb-0">
                <div className="card-body">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Borrowed By :</th>
                                <th scope="col">Borrow Date</th>
                                <th scope="col">Return Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrows.map((borrow, index) => (
                                <tr key={index}>
                                    <td>{borrow.person_firstname + " " + borrow.person_lastname}</td>
                                    <td>{formatDate(borrow.borrow_date)}</td>
                                    <td>{borrow.return_date ? formatDate(borrow.return_date) : "NOT RETURNED"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Book;