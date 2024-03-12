import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../Context/TokenContext';
import { postServiceData } from '../server/util';

const fetchBooks = async (setBooksFunc) => {
    try {
        const data = await postServiceData('books');
        if (Array.isArray(data)) {
            setBooksFunc(data);
        } else {
            console.error('Unexpected server response:', data);
        }
    } catch (error) {
        console.error(error);
    }
};

const deleteBook = async (bookId) => {
    try {
        const deleteResponse = await postServiceData("deleteBook", { book_id: bookId });
        if (deleteResponse && deleteResponse.ok === 'SUCCESS') {
            return true;
        }
        else {
            throw new Error('Delete failed');
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        throw error;
    }
}

const Books = () => {
    const navigate = useNavigate();
    const { getToken } = useContext(TokenContext);
    const [books, setBooks] = useState([]); 

    useEffect(() => {
        const token = getToken();
        if (!token) {
            navigate('/');
        }
    }, [getToken, navigate]);

    useEffect(() => {
        fetchBooks(setBooks);
    }, []);

    const refreshBooks = () => fetchBooks(setBooks);

    const handleDelete = async (bookId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this book?');
        if (confirmDelete) {
            await deleteBook(bookId);
            refreshBooks();
        }
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-5 text-center title_consolas">Book Database</h1>
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
                                        onClick={() => navigate(`/book/${book.book_id}`)}
                                    >
                                        <img 
                                            className="icon"
                                            src="../assets/edit.png" 
                                            alt="Edit" 
                                        />
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-light-primary"
                                        onClick={() => handleDelete(book.book_id)}
                                    >
                                        <img 
                                            className="icon"
                                            src="../assets/delete.png" 
                                            alt="Delete" 
                                        />
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

export default Books;