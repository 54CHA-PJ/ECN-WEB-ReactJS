import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();

    return (
      <div>
        <h2 className="mt-5 text-center title_consolas">This page doesn't exist !</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <button onClick={() => navigate('/')} className="btn btn-primary">Go to Home</button>
        </div>
      </div>

    );
}

export default NotFound;