import { useEffect } from 'preact/hooks';
import s from './style.css';

const Home = () => {
  useEffect(() => {
    document.title = 'Check Laundry';
  }, []);

  return (
    <div>
      <h1>Check Laundry 🧺</h1>
      <div className={s.stations}>
        <a href="/stations/90_7th_ave">90 7th Ave</a>
      </div>
    </div>
  );
};

export default Home;
