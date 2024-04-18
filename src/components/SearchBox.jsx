/* eslint-disable react/prop-types */

const SearchBox = ({ searchTerm, setSearchTerm }) => {
  return (
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-box"
      />
  );
};

export default SearchBox;
