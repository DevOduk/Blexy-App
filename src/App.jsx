import { useState, useEffect } from 'react'
import './App.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Avatar, useRadioGroup } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import popup from './PopupManager';
import { REACT_APP_GOOGLE_CLIENT_ID } from './assets/_index';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 470,
  bgcolor: 'var(--background-color)',
  border: '2px solid black',
  boxShadow: 24,
  borderRadius: 4,
  p: 4,
};




function App() {
  const [history, setHistory] = useState([]);
  const [predictions, setPredictions] = useState(JSON.parse(localStorage.getItem('predictionHistory')) || null);
  const [open, setOpen] = useState(false);

const [today, setToday] = useState([
  {
    date_to_play: '2025-07-19T19:30:00.000Z',
    home_team: 'Espanola',
    away_team: 'Union La Calera',
    home_odds: 2.39,
    draw_odds: 3.20,
    away_odds: 2.80,
  },
  {
    date_to_play: '2025-07-19T20:30:00.000Z',
    home_team: 'Ca San Lorenzo Almagro',
    away_team: 'Gimnasia Y Esgrima La Plata',
    home_odds: 2.16,
    draw_odds: 2.80,
    away_odds: 3.85,
  },
  {
    date_to_play: '2025-07-19T22:30:00.000Z',
    home_team: 'Atletico Lanus',
    away_team: 'Ca Rosario Central',
    home_odds: 2.33,
    draw_odds: 2.80,
    away_odds: 3.40,
  },
  {
    date_to_play: '2025-07-20T00:45:00.000Z',
    home_team: 'Ca Platense',
    away_team: 'Velez Sarsfield',
    home_odds: 2.60,
    draw_odds: 2.70,
    away_odds: 3.10,
  },
  {
    date_to_play: '2025-07-20T00:45:00.000Z',
    home_team: 'Cd Godoy Cruz',
    away_team: 'Ca Sarmiento Junin',
    home_odds: 1.89,
    draw_odds: 3.10,
    away_odds: 4.40,
  },
  {
    date_to_play: '2025-07-20T03:00:00.000Z',
    home_team: 'Instituto Ac Cordoba',
    away_team: 'Ca River Plate (Arg)',
    home_odds: 3.70,
    draw_odds: 3.10,
    away_odds: 2.06,
  },
  {
    date_to_play: '2025-07-20T15:00:00.000Z',
    home_team: 'Vejle Bk',
    away_team: 'Randers Fc',
    home_odds: 3.45,
    draw_odds: 3.45,
    away_odds: 2.09,
  },
  {
    date_to_play: '2025-07-20T17:00:00.000Z',
    home_team: 'Sonderjyske',
    away_team: 'Agf Aarhus',
    home_odds: 3.45,
    draw_odds: 3.55,
    away_odds: 2.06,
  },
  {
    date_to_play: '2025-07-20T19:30:00.000Z',
    home_team: 'Union Saint-gilloise',
    away_team: 'Club Brugge',
    home_odds: 2.60,
    draw_odds: 3.15,
    away_odds: 2.70,
  },
  {
    date_to_play: '2025-07-20T19:30:00.000Z',
    home_team: 'Audax Italiano',
    away_team: 'U. Catolica',
    home_odds: 2.65,
    draw_odds: 3.05,
    away_odds: 2.60,
  },
  {
    date_to_play: '2025-07-20T20:30:00.000Z',
    home_team: 'Barracas Central',
    away_team: 'Independiente Rivadavia',
    home_odds: 2.47,
    draw_odds: 2.95,
    away_odds: 3.00,
  },
  {
    date_to_play: '2025-07-20T21:00:00.000Z',
    home_team: 'Pumas Unam',
    away_team: 'Cf Pachuca',
    home_odds: 2.80,
    draw_odds: 3.35,
    away_odds: 2.42,
  },
  {
    date_to_play: '2025-07-20T21:15:00.000Z',
    home_team: 'Rks Radomiak Radom',
    away_team: 'Pogon Szczecin',
    home_odds: 3.05,
    draw_odds: 3.30,
    away_odds: 2.22,
  },
  {
    date_to_play: '2025-07-13T00:00:00.000Z',
    home_team: 'Wisla Plock',
    away_team: 'Korona Kielce',
    home_odds: 2.50,
    draw_odds: 3.20,
    away_odds: 2.70,
  },
  {
    date_to_play: '2025-07-20T20:30:00.000Z',
    home_team: 'Barracas Central',
    away_team: 'Independiente Rivadavia',
    home_odds: 2.47,
    draw_odds: 2.95,
    away_odds: 3.00,
  },
]);

  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('History');
  const [processing, setProcessing] = useState(false);
  const [showAddHistory, setShowAddHistory] = useState(false);
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [credits, setCredits] = useState( localStorage.getItem('googleUser') ? JSON.parse(localStorage.getItem('googleUser')).credits : 0);
  const [ newHistory, setNewHistory ] = useState({
      date_played: '2025-01-01',
      home_team: '',
      away_team: '',
      home_odds: Number(''),
      draw_odds: Number(''),
      away_odds: Number(''),
      outcome: '',
  });
  const [ newMatch, setNewMatch ] = useState({
      date_to_play: '',
      home_team: '',
      away_team: '',
      home_odds: Number(''),
      draw_odds: Number(''),
      away_odds: Number(''),
  });

    const handleNewHistory = () => {
      if (newHistory.date_played && newHistory.home_team && newHistory.away_team && newHistory.home_odds && newHistory.draw_odds && newHistory.away_odds) {
        setHistory([...history, newHistory]);
        setNewHistory({
          date_played: '',
          home_team: '',
          away_team: '',
          home_odds: '',
          draw_odds: '',
          away_odds: '',
        });
        setShowAddHistory(false);
      } else {
        popup.error('Please fill in all historical fields!');
      }
    };

    const handleNewMatch = () => {
      if (newMatch.date_to_play && newMatch.home_team && newMatch.away_team && newMatch.home_odds && newMatch.draw_odds && newMatch.away_odds) {
        setToday([...today, newMatch]);
        setNewMatch({
          date_to_play: '',
          home_team: '',
          away_team: '',
          home_odds: Number(''),
          draw_odds: Number(''),
          away_odds: Number('')
        });
        setShowAddMatch(false);
        popup.success('Match added successfully!');
      } else {
        popup.error('Please fill in all match fields!');
      }
    };


useEffect(() => {
  const storedUser = localStorage.getItem('googleUser');
  if (storedUser) {
    setUser(JSON.parse(storedUser));  // Restore user from localStorage
  }
}, []);



const handlePredictBatch = () => {
  if(credits < 1){
    setOpen(true)
    return;
  }

  setProcessing(true);
  // post matches to backend API https://carshare-mpesa.vercel.app/api/predict_batch
  fetch('https://carshare-mpesa.vercel.app/api/predict_batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // make a fixtures   
    body: JSON.stringify({ fixtures: today })  // fixtures key as expected by backend
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success' && Array.isArray(data.predictions)) {
      setPredictions(data.predictions);
      localStorage.setItem('predictionHistory', JSON.stringify(data.predictions))
      popup.success('Batch prediction completed successfully!');
      setProcessing(false);
      setCredits(prev => {
        const newCredits = prev - 1;
        updateCredits(user, newCredits);
        return newCredits;
      });

    } else {
      setProcessing(false);
      popup.error('Unexpected response format from prediction API.');
    }
  })
  .catch(error => {
    popup.error('Error predicting batch. Please try again later.');
    setProcessing(false);
  });
};

const handleUploadHistory = async () => {
if(confirm('Are you sure you want to upload and finish?')) {
  try {
    const response = await fetch('https://carshare-mpesa.vercel.app/api/add_history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ matches: history })  // matches key as expected by backend
    });

    const data = await response.json();

    if (response.ok) {
      popup.success('History uploaded successfully.');
      setProcessing(false);
      setHistory([]);  // Clear history after successful upload
      setTimeout(() => {
        window.location.reload();  // Reload the page after 2 seconds
      }, 2000);
    } else {
      popup.error(`Error uploading history: ${data.message}`);
      setProcessing(false);
    }
  } catch (error) {
    popup.error('Network error while uploading history.');
    setProcessing(false);
  }
}
};

useEffect(() => {
  fetch('https://carshare-mpesa.vercel.app/api/get_history')
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        console.error('Unexpected response format:', data);
      }
    })
    .catch(error => {
      // console.error('Error fetching history:', error);
      popup.error('Error fetching history. Please try again later.');
    });
}, []);

const itemsPerPage = 15;
const [currentPage, setCurrentPage] = useState(1);
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);
const totalPages = Math.ceil(history.length / itemsPerPage);


  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    popup.info(`Theme preference updated.`);
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     popup.info('Welcome to Blexy! Click on the lightbulb icon to toggle dark mode.');      
  //   }, 10000);
  // }, []);

  const createUser = async (user) => {
    try {
      const response = await fetch('https://carshare-mpesa.vercel.app/api/add_blexy_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
        })
      });

      const data = await response.json();
      console.log('data received login signin:', data);

      if (data.status === 'Welcome back!') {
        popup.info('Welcome back ' + user.given_name + '!');
        setCredits(data.user.credits);
        localStorage.setItem('googleUser', JSON.stringify({...user, credits: data.user.credits}));

      } else if (data.status === 'Welcome to Blexy!') {
        popup.info('Welcome to Blexy!');
        setCredits(data.user.credits);
        localStorage.setItem('googleUser', JSON.stringify({...user, credits: data.user.credits}));
      } else {
        // popup.error(`Error creating user: ${data.message}`);
        console.error('Error creating user:', data.message);
      }
    } catch (error) {
      console.error('Network error while creating user:', error);
    }
  }


  const updateCredits = async (user, credits) => {
    try {
      const response = await fetch('https://carshare-mpesa.vercel.app/api/add_blexy_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          credits: credits,
        })
      });

      const data = await response.json();

      if (data.status === 'Welcome back!') {
        setCredits(data.user.credits);
        localStorage.setItem('googleUser', JSON.stringify({...user, credits: data.user.credits}));
      } else {
        // popup.error(`Error creating user: ${data.message}`);
        // console.error('Error updating credits:', data.message);
      }
    } catch (error) {
      // console.error('Network error while updating user credits:', error);
    }
  }

  const [phone, setPhone] = useState('')
  const [buy, setBuy] = useState(20)

  return (
    <GoogleOAuthProvider clientId={REACT_APP_GOOGLE_CLIENT_ID}>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={processing}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open} className='payment'>
          <Box sx={style}>
            <h4 className='fw-bold mb-3'>Purchase Credits</h4>
            <p className='small'>Please purchase credit tokens to proceed with predictions!</p>
            <form className=''>
              <div className='small' style={{color: ''}}>Enter you phone number</div>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9.]/g, '') )} className='form-control mb-2 mt-2' />
              <div className='small mt-3' style={{color: ''}}>Credits</div>
              <input type="text" value={buy} onChange={(e) => setBuy(e.target.value.replace(/[^0-9.]/g, '').replace(/^0+(?!\.)/, '') )} className='form-control mb-2 mt-2' />
              <input type='submit' value={'Pay '+ (buy*3) +' ksh.'} className='form-control mt-4 small' style={{backgroundColor: 'var(--primary-color)'}}/>
            </form>
          </Box>
        </Fade>
      </Modal>
    <nav className='Navigation'>
      <div className='navBar'>
        <a href="#" className='logo fs-4'>
          <i className="bi bi-lightbulb"></i>
          <span>Blexy</span>
        </a>
        <div className='d-flex justify-content-center align-items-center gap-2 fs-5 position-relative'>
          <div role='button' className='userProfile d-flex align-items-center gap-3' onClick={() => setShowProfile(!showProfile)}>
            { user ? <Avatar src={user?.picture} alt={user.given_name} /> : <i className="bi bi-person"></i> }
            <small className='small'>{user ? user.given_name : 'Login'}</small>
            { showProfile && <div className='border small rounded-4 p-3 w-100 profile' style={{ position: 'absolute', right: '0', top: '50px', minWidth: '300px', width: '100%',  zIndex: '1000', fontSize: '0.875rem' }}>
              { user ? <>
              <div className='mb-3 mt-2'>
                <div className='mb-1'>Hello {user.given_name},</div>
                <small className='' style={{color: 'blueviolet'}}>{user.email}</small>
              </div>
                <div className='d-flex flex-column gap-2'>
                  <div>Full Name</div>
                  <div className='d-flex align-items-center gap-2 text-decoration-none' style={{color: 'blueviolet'}}>
                    <i className="bi bi-person fs-5"></i>
                    {user.given_name} {user.family_name}
                  </div>
                  <div>Credits</div>
                  <div className='d-flex align-items-center gap-2 text-decoration-none' style={{color: 'blueviolet'}}>
                    <i className="bi bi-cash fs-5"></i>
                    {credits} Credits
                  </div>
                  <button className='btn p-1 bg-danger small mt-2 rounded-pill border-0 outline-0 text-light d-flex justify-content-center align-items-center gap-2' onClick={()=> {
                    googleLogout();
                    setUser(null);
                    localStorage.removeItem('googleUser');
                    popup.success('You have been logged out successfully!');
                  }}>
                    <i className="bi bi-box-arrow-in-right fs-5"></i>
                    <span className='ms-2'>Logout</span></button>
                </div>
              </>
              : <>
              <div className='mb-4 mt-2'>
                <div className='mb-1'>Hello,</div>
                <small className='' style={{color: 'blueviolet'}}>You are not logged in!</small>
              </div>

              <div>
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    const user = jwtDecode(credentialResponse.credential);
                    setUser(user);
                    setShowProfile(false);
                    createUser(user);
                  }}
                  onError={(error) => {
                    popup.error('Login failed. Please try again.');
                  }}
                  auto_select={false}
                  style={{ width: '100%' }}
                  className='w-100'
                />
              </div>

            </>
              }
            </div>
            }
          </div>
          <div className='divider'></div>
          {
            theme === 'light' ? <i className="bi bi-moon-fill text-black" onClick={toggleTheme}></i> : <i className="bi bi-sun-fill text-white" onClick={toggleTheme}></i>
          }
        </div>
      </div>
    </nav>
    <div className='heroSection my-5 d-flex flex-column justify-content-center align-items-center text-center gap-2'>
      <button className='btn btnLight small px-4 rounded-pill border-0 outline-0'>Simplify Your Betting Experience</button>
      <h1>Enhance your prediction <br /> control with Blexy</h1>
      <p className='text-light small'>
        Streamline your betting experience with our intuitive platform that empowers you to make informed decisions.
      </p>
      <button className='btn small p-2 px-5 rounded-pill border-0 outline-0 bg-black text-light'>Get started &nbsp;&nbsp;&nbsp; <i className="bi bi-arrow-right"></i></button>
    </div>
    <div className='w-50' style={{ margin: 'auto', textAlign: 'center' }}>
{/* 
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        const user = jwtDecode(credentialResponse.credential);
        setUser(user);
        localStorage.setItem('googleUser', JSON.stringify(user));
      }}
      onError={(error) => {
        console.error(error);
      }}
      auto_select={true}
    /> */}
    </div>

    <div className='d-flex justify-content-center align-items-center gap-3 mt-4 mb-5'>
      <button className={`btn small ${mode === 'History' ? 'btnLight' : ''} small px-4 rounded-pill border-0 outline-0`} onClick={() => setMode('History')}>History ({history.length} items)</button>
      <button className={`btn small ${mode === 'Today' ? 'btnLight' : ''} small px-4 rounded-pill border-0 outline-0`} onClick={() => setMode('Today')}>Today’s Predictions</button>
    </div>

    <div className='container bg-black text-light p-5 betsContainer'>
      {mode === 'History' ? (
        <div className='history position-relative overflow-x-auto'>
          <table className='w-100 bg-transparent text-light'>
            <thead className='fw-normal'>
              <tr>
                <th>No.</th>
                <th>Date Played</th>
                <th>Home Team</th>
                <th>Away Team</th>
                <th>1 (Home)</th>
                <th>X (Draw)</th>
                <th>2 (Away)</th>
                <th>Outcome</th>
              </tr>
            </thead>
            <tbody>
              {
              history.length > 0 ? currentItems.map((item, index) => (
                <tr key={index} className='text-light'>
                  <td className='py-3 small'>{item.id}.</td>
                  <td className='py-3 small'>{item.date_played}</td>
                  <td className='py-3 small'>{item.home_team}</td>
                  <td className='py-3 small'>{item.away_team}</td>
                  <td className='py-3 small'>{item.home_odds}</td>
                  <td className='py-3 small'>{item.draw_odds}</td>
                  <td className='py-3 small'>{item.away_odds}</td>
                  <td className='py-3 small fw-bold'>{item.outcome}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="text-center p-3 py-5">No data</td>
                </tr>
              )
              }
              
                <tr>
                  <td colSpan="8" className="text-center py-3 pageNext">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={currentPage === i + 1 ? 'active' : ''}
                    >
                      {i + 1}
                    </button>
                  ))}
                  </td>
                </tr>

              {
                showAddHistory &&
              <tr className='text-light newMatch'>
                <td className='py-3 small'>{history.length + 1}.</td>
                  <td className='py-3 small'><input type="date" autoFocus value={newHistory.date_played} onChange={(e) => setNewHistory({ ...newHistory, date_played: e.target.value })} className='form-control' placeholder='Date Played' /></td>
                  <td className='py-3 small'><input type="text" value={newHistory.home_team} onChange={(e) => setNewHistory({ ...newHistory, home_team: e.target.value })} className='form-control' placeholder='Home Team' /></td>
                  <td className='py-3 small'><input type="text" value={newHistory.away_team} onChange={(e) => setNewHistory({ ...newHistory, away_team: e.target.value })} className='form-control' placeholder='Away Team' /></td>
                  <td className='py-3 small'><input type="text" value={newHistory.home_odds} onChange={(e) => setNewHistory({ ...newHistory, home_odds: e.target.value.replace(/[^0-9.]/g, '').replace(/^0+(?!\.)/, '') })} className='form-control' placeholder='Home Odds' /></td>
                  <td className='py-3 small'><input type="text" value={newHistory.draw_odds} onChange={(e) => setNewHistory({ ...newHistory, draw_odds: e.target.value.replace(/[^0-9.]/g, '').replace(/^0+(?!\.)/, '') })} className='form-control' placeholder='Draw Odds' /></td>
                  <td className='py-3 small'><input type="text" value={newHistory.away_odds} onChange={(e) => setNewHistory({ ...newHistory, away_odds: e.target.value.replace(/[^0-9.]/g, '').replace(/^0+(?!\.)/, '') })} className='form-control' placeholder='Away Odds' /></td>
                  <td className='py-3 small'>
                    <select className='form-select' value={newHistory.outcome} onChange={(e) => setNewHistory({ ...newHistory, outcome: e.target.value })}>
                      <option className='text-dark' value="">Select Outcome</option>
                      <option className='text-dark' value="1">Home Win</option>
                      <option className='text-dark' value="X">Draw</option>
                      <option className='text-dark' value="2">Away Win</option>
                    </select>
                  </td>
                </tr>
              }
              
                {/* <tr>
                  <td colSpan="8" className="text-center py-3">
                    {
                      !showAddHistory ? <> <button style={{ minWidth: '30%' }} className='btn small p-2 rounded-pill border-0 outline-0 bg-black text-primary btnLight' onClick={() => setShowAddHistory(true)}><i className="bi bi-plus-lg"></i> &nbsp; Add</button> { history.length > 0 && <button style={{ minWidth: '30%' }} className='btn small p-2 rounded-pill border-0 outline-0 bg-black text-success' onClick={handleUploadHistory}><i className="bi bi-check-circle"></i> &nbsp; Upload and Finish</button>} </> : <><button style={{ minWidth: '25%' }} className='btn small p-2 rounded-pill border-0 outline-0 bg-black text-success' onClick={() => handleNewHistory()}><i className="bi bi-check2"></i> &nbsp; Save</button> <button style={{ minWidth: '25%' }} className='btn small p-2 rounded-pill border-0 outline-0 bg-black text-danger' onClick={() => setShowAddHistory(false)}><i className="bi bi-x"></i> &nbsp; Cancel</button></>
                    }
                  </td>
                </tr> */}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='today  position-relative overflow-x-auto'>
          <table className='w-100 bg-transparent text-light'>
            <thead className='fw-normal'>
              <tr>
                <th>No.</th>
                <th>Date To Play</th>
                <th>Home Team</th>
                <th>Away Team</th>
                <th>1 (Home)</th>
                <th>X (Draw)</th>
                <th>2 (Away)</th>
              </tr>
            </thead>
            <tbody>
              {
              today.length > 0 ? today.map((item, index) => (
                <tr key={index} className='text-light'>
                  <td className='py-3 small'>{index+1}.</td>
                  <td className='py-3 small'>{item.date_to_play}</td>
                  <td className='py-3 small'>{item.home_team}</td>
                  <td className='py-3 small'>{item.away_team}</td>
                  <td className='py-3 small'>{item.home_odds}</td>
                  <td className='py-3 small'>{item.draw_odds}</td>
                  <td className='py-3 small'>{item.away_odds}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="text-center p-3 py-4">No data</td>
                </tr>
              )
              }
              {
                showAddMatch &&
              <tr className='text-light newMatch'>
                <td className='py-3 small'>{today.length + 1}.</td>
                  <td className='py-3 small'><input autoFocus type="date" value={newMatch.date_to_play} onChange={(e) => setNewMatch({ ...newMatch, date_to_play: e.target.value })} className='form-control' placeholder='Date To Play' /></td>
                  <td className='py-3 small'><input type="text" value={newMatch.home_team} onChange={(e) => setNewMatch({ ...newMatch, home_team: e.target.value })} className='form-control' placeholder='Home Team' /></td>
                  <td className='py-3 small'><input type="text" value={newMatch.away_team} onChange={(e) => setNewMatch({ ...newMatch, away_team: e.target.value })} className='form-control' placeholder='Away Team' /></td>
                  <td className='py-3 small'><input type="text" value={newMatch.home_odds} onChange={(e) => setNewMatch({ ...newMatch, home_odds: e.target.value.replace(/[^0-9.]/g, '').replace(/^0+(?!\.)/, '') })} className='form-control' placeholder='Home Odds' /></td>
                  <td className='py-3 small'><input type="text" value={newMatch.draw_odds} onChange={(e) => setNewMatch({ ...newMatch, draw_odds: e.target.value.replace(/[^0-9.]/g, '').replace(/^0+(?!\.)/, '') })} className='form-control' placeholder='Draw Odds' /></td>
                  <td className='py-3 small'><input type="text" value={newMatch.away_odds} onChange={(e) => setNewMatch({ ...newMatch, away_odds: e.target.value.replace(/[^0-9.]/g, '').replace(/^0+(?!\.)/, '') })} className='form-control' placeholder='Away Odds' /></td>
                </tr>
              }
              
                <tr>
                  <td colSpan="7" className="text-center py-3 mb-2">
                    {
                      user ? 
                      !showAddMatch ? <> 
                      {/* <button style={{ minWidth: '30%' }} className='btn small p-2 rounded-pill border-0 outline-0 bg-black text-primary btnLight' onClick={() => setShowAddMatch(true)}><i className="bi bi-plus-lg"></i> &nbsp; Add</button> */}
                      { today.length > 0 && <button style={{ minWidth: '30%' }} className='btn small p-2 rounded-pill border-0 outline-0 bg-black text-success' onClick={handlePredictBatch}><i className="bi bi-check-circle"></i> &nbsp; See Predictions</button>} </> : <><button style={{ minWidth: '25%' }} className='btn small p-2 rounded-pill outline-0 bg-black text-success border border-success' onClick={() => handleNewMatch()}><i className="bi bi-check2"></i> &nbsp; Save</button> <button style={{ minWidth: '25%' }} className='btn small p-2 rounded-pill border-0 outline-0 bg-black text-danger' onClick={() => setShowAddMatch(false)}><i className="bi bi-x"></i> &nbsp; Cancel</button></>
                      : 
                      <span className='text-info'>Login to see prediction!</span>
                    }
                  </td>
                </tr>

            </tbody>
          </table>

      { predictions && 
        <div className='history position-relative overflow-x-auto'>
          <br />
          <br />
          <br />
          <div className='mb-5 text-center fw-bolder text-success'><p>Prediction Results ({(new Date()).toLocaleString()})</p></div>

          <table className='w-100 bg-transparent text-light'>
            <thead className='fw-normal'>
              <tr>
                <th>No.</th>
                <th>Date To Play</th>
                <th>Home Team</th>
                <th>Away Team</th>
                <th>1 (Home)</th>
                <th>X (Draw)</th>
                <th>2 (Away)</th>
                <th>Prediction</th>
              </tr>
            </thead>
            <tbody>
              { predictions.map((item, index) => (
                <tr key={index} className='text-light'>
                  <td className='py-3 small'>{index+1}.</td>
                  <td className='py-3 small'>{item.date_to_play}</td>
                  <td className='py-3 small'>{item.home_team}</td>
                  <td className='py-3 small'>{item.away_team}</td>
                  <td className='py-3 small'>{item.home_odds}</td>
                  <td className='py-3 small'>{item.draw_odds}</td>
                  <td className='py-3 small'>{item.away_odds}</td>
                  <td className='py-3 small fw-bold'>{item.prediction === 0 ? '1 (Home Win)' : item.prediction === 1 ? 'X (Draw)' : '2 (Away Win)'}</td>
                </tr>
              ))
              }
              
            </tbody>
          </table>
        </div>
      }
        </div>
      )}
    </div>
    
    <nav className='Navigation mt-4'>
      <div className='navBar'>
        <a href="#" className='logo fs-4'>
          <i className="bi bi-lightbulb"></i>
          <span>Blexy</span>
        </a>
        <small>
          © 2025 Blexy. All rights reserved.
        </small>
        <div className='d-flex justify-content-center align-items-center gap-3 fs-5'>
          <a href="#" className='text-decoration-none'><i className="bi bi-twitter"></i></a>
          <a href="#" className='text-decoration-none'><i className="bi bi-facebook"></i></a>
        </div>
      </div>
    </nav>
    </GoogleOAuthProvider>
  )
}

export default App
