import react from 'react';
import reactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter} from 'react-router-dom';
import {Route,Routes} from 'react-router-dom';
import App from './app'

// reactDOM.render(
//     <Router>
//     <App />
//     </Router>, 
//     document.getElementById('root')
// );

const roott = reactDOM.createRoot(document.getElementById("root"));
roott.render(
    <BrowserRouter>
     <App />
    </BrowserRouter>
);