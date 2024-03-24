/*
This component is used to display the user information and the books borrowed by the user.
It also allows the user to borrow and return books.
You can't borrow a book the same day you returned it.
*/

import React, { useEffect, useState, useContext } from 'react';
import { TokenContext } from '../Context/TokenContext';
import { postServiceData, formatDate, stringToDate } from '../server/util';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'; 

const User = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState(''); 
    const [borrows, setBorrows] = useState([]);
    const [books, setBooks] = useState([]);
    const [bookId, setBookId] = useState('-1');
    
    const { getToken } = useContext(TokenContext);
    const { id } = useParams(); // Get the id from the URL

    useEffect(() => {
        const tokenString = getToken();
        const token = JSON.parse(tokenString);
        if (!token || token.status !== 'USER_LOGGED') {
            navigate('/');
        }
        else {
            fetchUser(id);
            fetchBorrows(id);
            fetchBooks();
        }
    }, [getToken, navigate, id]);

    const fetchUser = async (id) => {
        try {
            const request = await postServiceData(`user/${id}`);
            const user = request[0];
            setUserId(user.person_id || '');
            setFirstName(user.person_firstname || '');
            setLastName(user.person_lastname || '');
            setBirthDate(formatDate(user.person_birthdate) || '');
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    };

    const fetchBorrows = async (id) => {
        try {
            const request = await postServiceData(`userBorrows/${id}`);
            setBorrows(request);
        } catch (error) {
            console.error('Failed to fetch borrows:', error);
        }
    };

    const fetchBooks = async () => {
        try {
            const request = await postServiceData('availableBooks');
            setBooks(request);
        } catch (error) {
            console.error('Failed to fetch books:', error);
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
    };

    const returnBook = async (bookId, borrowDate) => {
        let dateObj = new Date(borrowDate);
        dateObj.setDate(dateObj.getDate() + 1);
        const borrowDateFixed = dateObj.toISOString().slice(0, 10);
        const returnDate = new Date().toISOString().slice(0, 10);
        const params = {
            return_date: stringToDate(returnDate),
            person_id: JSON.parse(getToken()).id,
            book_id: bookId,
            borrow_date: stringToDate(borrowDateFixed)
        };
        console.log('RETURN PARAMS:', params);
        try {
            const data = await postServiceData('returnBook', params);
            if (data && data.ok === 'SUCCESS') {
                alert('Book returned successfully');
                return true;
            }
            else {
                alert("Return Failed");
                throw new Error('Return failed');
            }
        } catch (error) {
            console.error(error);
        }
    };
    

    const handleBorrow = async (bookId) => {
        try {
            await borrowBook(bookId);
            fetchBorrows(userId);
            fetchBooks();
        } catch (error) {
            console.error('Failed to borrow book:', error);
        }
    };
    
    const handleReturn = async (bookId, borrowDate) => {
        try {
            await returnBook(bookId, borrowDate);
            fetchBorrows(userId);
            fetchBooks();
        } catch (error) {
            console.error('Failed to return book:', error);
        }
    };

    const updateUser = async () => {
        var params = {
            person_id: userId,
            person_lastname: lastName,
            person_firstname: firstName,
            person_birthdate: stringToDate(birthDate) 
        };
        try {
            const updateResponse = await postServiceData("updateUser", params);
            if (updateResponse && updateResponse.ok === 'SUCCESS') {
                console.log('USER: (' + userId + ', ' + firstName + ', ' + lastName + ')' );
                navigate('/users');
                return true;
            }
            else {
                throw new Error('Update failed');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        updateUser().catch((error) => {
            alert('There was an error deleting the user: ' + error.message);
        });
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-5 text-center title_consolas">Edit User Information</h1>
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="userId">User ID:</label>
                            <input type="text" id="userId" className="form-control" value={userId} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstName">First Name:</label>
                            <input type="text" id="firstName" className="form-control" value={firstName} onChange={e => setFirstName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name:</label>
                            <input type="text" id="lastName" className="form-control" value={lastName} onChange={e => setLastName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Birth Date:</label>
                            <input type="text" id="lastName" className="form-control" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
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
                                onClick={() => navigate('/users')}> 
                                Back to Users
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <h1 className="mt-5 mb-5 text-center title_consolas">User Borrowed Books</h1>
            <div className="card mt-5 mb-0">
                <div className="card-body">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Title</th>
                                <th scope="col">Return</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrows && borrows.map((item, i) => {
                                let bdate = item.borrow_date.split("T")[0];
                                return(
                                    <tr key={i}>
                                        <td className="text-center">
                                            <p> {parseInt(bdate.split("-")[2])+1}/{bdate.split("-")[1]}/{bdate.split("-")[0]}</p>
                                        </td>
                                        <td>{item.book_title}</td>
                                        <td className="text-center">
                                            <button 
                                                className="btn" 
                                                name="return" 
                                                onClick={()=>{ 
                                                    console.log('RETURN:', item);
                                                    handleReturn(item.book_id, item.borrow_date.slice(0, 10)); }}>
                                                RETURN
                                            </button> 
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="2">
                                    <select name="bookID" value={bookId} onChange={(e)=>{setBookId(e.target.value)}} className="form-control form-select form-select-lg mb-3">
                                        <option value="-1">-</option>
                                        {books.map((item,i) => { return(
                                            <option key={i} value={item.book_id}>{item.book_title}</option>
                                        )})}
                                    </select>
                                </td>
                                <td  className="text-center">
                                    <button 
                                        className="btn"
                                        onClick={()=>{
                                            console.log('BORROW:', bookId);
                                            handleBorrow(bookId)}} 
                                    >
                                        BORROW
                                    </button>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );                                       
};

export default User;
