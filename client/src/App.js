import 'antd/dist/reset.css'
import './App.css';
import Title from './components/layout/Title';
import AddPerson from './components/forms/AddPerson';
import People from './components/lists/People';

import AddCar from './components/forms/AddCar';
import { Divider } from 'antd';

const App = () => {
  return (
      <div className="App">
        <Title />
        <Divider />
        <AddPerson />
        <AddCar />
        <People />
      </div>
  );
}

export default App;
