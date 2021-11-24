import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bulmaswatch/superhero/bulmaswatch.min.css';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import CellList from './components/CellList';
import Navbar from './components/Navbar';
import { store } from './state';

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <Navbar />
        <CellList />
      </div>
    </Provider>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
