/* eslint-disable react/prop-types */
import "./GenericTable/Table.css";

const SearchBox = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-box-wrapper">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-box"
      />
    </div>
  );
};

export default SearchBox;