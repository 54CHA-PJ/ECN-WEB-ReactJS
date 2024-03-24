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

const borrowBook = async () => {
    if (bookId !== '-1') {
        try {
            const currentDate = new Date();
            const borrowDate = `${currentDate.getUTCFullYear()}-${(currentDate.getUTCMonth()+1)}-${currentDate.getUTCDate()}`;
            const params = {
                person_id: userId,
                book_id: bookId,
                borrow_date: borrowDate
            };
            await postServiceData('borrowBook', params);
            setBookId('-1');
            fetchBorrows(userId);
            fetchBooks();
        } catch (error) {
            console.error('Failed to borrow book:', error);
        }
    }
};

const returnBook = async (borrow) => {
    try {
        const currentDate = new Date();
        const returnDate = `${currentDate.getUTCFullYear()}-${(currentDate.getUTCMonth()+1)}-${currentDate.getUTCDate()}`;
        const params = {
            return_date: returnDate,
            person_id: userId,
            book_id: borrow.book_id,
            borrow_date: borrow.borrow_date
        };
        await postServiceData('returnBook', params);
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
        <div className="table-responsive mt-5">
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
                   let breturn = item.borrow_return != null ? item.borrow_return.split("T")[0] : null ;

                    return(
                        <tr key={i}>
                        <td scope="col" className="text-center">
                       <p> {parseInt(bdate.split("-")[2])+1}/{bdate.split("-")[1]}/{bdate.split("-")[0]}</p>
                        </td>
                        <td>{item.book_title}</td>
                        <td className="text-center">
                                    {item.borrow_return == null ? <button className="btn" name="return" 
                                            onClick={()=>{ 
                                                returnBook(item);
                                            }}>
                                        <img src="img/return.png" alt="return" className="icon" />
                                    </button> : <p>{parseInt(breturn.split("-")[2])+1}/{breturn.split("-")[1]}/{breturn.split("-")[0]}</p>}
                        </td>
                    </tr>
                    )
                })}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2">
                            <select name="bookID" value={bookId} onChange={(e)=>{setBookId(e.target.value)}} className="form-control form-select form-select-lg mb-3">
                                <option value="-1" selected="selected">-</option>
                                {books.map((item,i) => { return(
                                    <option key={i} value={item.book_id}>{item.book_title}</option>
                                )})}
                            </select>
                        </td>
                        <td  className="text-center">
                            <button className="btn"><img src="img/plus.png" alt="add" onClick={()=>{borrowBook()}} className="icon" /></button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
    );
                                            
}