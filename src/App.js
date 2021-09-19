import Navbar from './components/Navbar';
import Home from './pages/home';
import Record from './pages/record';
import View from './pages/view';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/record' component={Record} />
        <Route path='/view' component={View} />
      </Switch>
    </Router>
  );
}

export default App;


//source: https://github.com/mozmorris/react-webcam