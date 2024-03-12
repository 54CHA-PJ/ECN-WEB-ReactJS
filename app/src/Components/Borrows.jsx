import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../Context/TokenContext';
import { postServiceData, formatDate, stringToDate } from '../server/util';

// Only for this file
const formatDateInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const Borrows = () => {
    const navigate = useNavigate();
    const { getToken } = useContext(TokenContext);
    const [borrows, setBorrows] = useState([]);

    const [editingId, setEditingId] = useState(null);
    const [newReturnDate, setNewReturnDate] = useState(null);

    const refreshBorrows = () => fetchBorrows(setBorrows);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            navigate('/');
        }
        refreshBorrows();
    }, [getToken, navigate]);

    const fetchBorrows = async (setBorrowsFunc) => {
        try {
            const data = await postServiceData('borrows');
            if (Array.isArray(data)) {
                setBorrowsFunc(data);
            } else {
                console.error('Unexpected server response:', data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const updateBorrow = async (personId, bookId, borrowDate, returnDate) => {
        var params = {
            person_id: personId,
            book_id: bookId,
            borrow_date: stringToDate(borrowDate),
            return_date: stringToDate(returnDate)
        };
        try {
            const updateResponse = await postServiceData("updateBorrow", params);
            if (updateResponse && updateResponse.ok === 'SUCCESS') {
                return true;
            }
            else {
                throw new Error('Update failed');
            }
        } catch (error) {
            console.error('Error updating borrow:', error);
            throw error;
        }
    };

    const deleteBorrow = async (personId, bookId, borrowDate, returnDate) => {
        var params = {
            person_id: personId,
            book_id: bookId,
            borrow_date: stringToDate(borrowDate),
            return_date: stringToDate(returnDate)
        };
        try {
            const updateResponse = await postServiceData("deleteBorrow", params);
            if (updateResponse && updateResponse.ok === 'SUCCESS') {
                return true;
            }
            else {
                throw new Error('Delete failed');
            }
        } catch (error) {
            console.error('Error deleting borrow:', error);
            throw error;
        }
    };

    const createBorrow = async (personId, bookId, borrowDate) => {
        var params = {
            person_id: personId,
            book_id: bookId,
            borrow_date: stringToDate(borrowDate),
        };
        try {
            const updateResponse = await postServiceData("updateBorrow", params);
            if (updateResponse && updateResponse.ok === 'SUCCESS') {
                return true;
            }
            else {
                throw new Error('Create failed');
            }
        } catch (error) {
            console.error('Error creating borrow:', error);
            throw error;
        }
    };

    const handleSave = async (personId, bookId, borrowDate) => {
        await updateBorrow(personId, bookId, formatDateInput(borrowDate), formatDateInput(newReturnDate));
        refreshBorrows();
        setEditingId(null);
    };

    const handleDelete = async (personId, bookId, borrowDate, returnDate) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this borrow?');
        if (confirmDelete) {
            await deleteBorrow(personId, bookId, borrowDate, returnDate);
            refreshBorrows();
        }
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-5 text-center title_consolas">Borrow Database</h1>
            <div className="card">
                <div className="card-body">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Person ID</th>
                                <th>Book ID</th>
                                <th>Borrow Date</th>
                                <th>Return Date</th>
                                <th className="actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrows.map(borrow => (
                                <tr key={`${borrow.person_id}-${borrow.book_id}`}>
                                    <td>{borrow.person_id}</td>
                                    <td>{borrow.book_id}</td>
                                    <td>{formatDate(borrow.borrow_date)}</td>
                                    <td>
                                        {editingId === `${borrow.person_id}-${borrow.book_id}` ? (
                                            <input
                                                type="date"
                                                defaultValue={formatDateInput(borrow.return_date)}
                                                onChange={e => setNewReturnDate(e.target.value)}
                                            />
                                        ) : (
                                            formatDate(borrow.return_date) || 'N/A'
                                        )}
                                    </td>
                                    <td className="actions">
                                        {editingId === `${borrow.person_id}-${borrow.book_id}` ? (
                                            <button
                                                type="submit"
                                                className="btn btn-light-primary mr-2"
                                                onClick={() => handleSave(
                                                    borrow.person_id,
                                                    borrow.book_id,
                                                    borrow.borrow_date,
                                                    newReturnDate
                                                )}
                                            >
                                                SAVE
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                className="btn btn-light-primary mr-2"
                                                onClick={() => {
                                                    setEditingId(`${borrow.person_id}-${borrow.book_id}`);
                                                    setNewReturnDate(formatDateInput(borrow.return_date));
                                                }}
                                            >
                                                EDIT
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            className="btn btn-light-primary"
                                            onClick={() => handleDelete(
                                                borrow.person_id,
                                                borrow.book_id,
                                                borrow.borrow_date,
                                                borrow.return_date)}
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

export default Borrows;