import {useNavigate} from 'react-router-dom';

export default function SearchBar(){
  const navigate=useNavigate();
  
  return (
    <form className="search-bar" onSubmit={e=>{e.preventDefault();navigate('/properties?'+new URLSearchParams(new FormData(e.currentTarget)));}}>
      <div>
        <label htmlFor="search-location">Where are you looking?</label>
        <input id="search-location" name="q" placeholder="Enter a location or keyword"/>
      </div>
      <div>
        <label htmlFor="search-type">Property type</label>
        <select id="search-type" name="type">
          <option value="">All property types</option>
          <option>Residential</option>
          <option>Commercial</option>
          <option>Land</option>
        </select>
      </div>
      <div>
        <label htmlFor="search-purpose">Your goal</label>
        <select id="search-purpose" name="purpose">
          <option value="">Buy or rent</option>
          <option>Buy</option>
          <option>Rent</option>
        </select>
      </div>
      <button className="button">Find your space ↗</button>
    </form>
  );
}
