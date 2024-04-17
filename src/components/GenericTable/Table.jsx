/* eslint-disable react/prop-types */
import { useState } from "react";
import { useQuery } from "@apollo/client";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { formatDate } from "../../../utils/helper";
import { SORT_TYPE, DEFAULT_COLUMN } from "../../../utils/constant";
import SearchBox from "../SearchBox";
import Pagination from "../Pagination";

const Table = (props) => {
  const { query, itemsPerPage } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(DEFAULT_COLUMN.ID);
  const [sortOrder, setSortOrder] = useState(SORT_TYPE.ASC);
  const [currentPage, setCurrentPage] = useState(1);

  const { loading, error, data } = useQuery(query);
  SORT_TYPE;
  const tableData = data?.histories.map((history, index) => {
    return {
      ID: index + 1,
      Title: history.title,
      Details: history.details,
      EventDate: formatDate(history.event_date_utc),
    };
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(
        sortOrder === SORT_TYPE.ASC ? SORT_TYPE.DESC : SORT_TYPE.ASC
      );
    } else {
      setSortBy(column);
      setSortOrder(SORT_TYPE.ASC);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const sortedData = data
    ? [...tableData].sort((a, b) => {
        if (sortOrder === SORT_TYPE.ASC) {
          return a[sortBy] > b[sortBy] ? 1 : -1;
        } else {
          return a[sortBy] < b[sortBy] ? 1 : -1;
        }
      })
    : [];

  const filteredData = sortedData?.filter((item) => {
    return Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = filteredData
    ? Math.ceil(filteredData.length / itemsPerPage)
    : 1;

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {filteredData.length > 0 ? (
        <table className="custom-table">
          <thead>
            <tr>
              {Object.keys(paginatedData[0]).map((column) => (
                <th key={column}>
                  {column}{" "}
                  <span
                    className="sort-icon"
                    onClick={() => handleSort(column)}
                  >
                    <SwapVertIcon
                      style={
                        sortBy === column
                          ? { color: "blue" }
                          : { color: "black" }
                      }
                    />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value) => (
                  <td key={value}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ width: "95vw", fontWeight: "bold" }}>No Data Available</p>
      )}
      <Pagination
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        totalPages={totalPages}
      />
    </div>
  );
};

export default Table;
