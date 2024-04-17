/* eslint-disable react/prop-types */
import { useState } from "react";
import { useQuery } from "@apollo/client";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { formatDate } from "../../../utils/helper";
import { sortType, defaultColumn } from "../../../utils/constant";
import SearchBox from "../SearchBox";
import Pagination from "../Pagination";
import "./Table.css";

const Table = ({ query, itemsPerPage }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(defaultColumn.ID);
  const [sortOrder, setSortOrder] = useState(sortType.ASC);
  const [currentPage, setCurrentPage] = useState(1);

  const { loading, error, data } = useQuery(query);
  sortType;
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
      setSortOrder(sortOrder === sortType.ASC ? sortType.DESC : sortType.ASC);
    } else {
      setSortBy(column);
      setSortOrder(sortType.ASC);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const sortedData = data
    ? [...tableData].sort((a, b) => {
        if (sortOrder === sortType.ASC) {
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

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <table className="custom-table">
        <thead>
          <tr>
            {Object.keys(paginatedData[0]).map((column) => (
              <th key={column} onClick={() => handleSort(column)}>
                {column}{" "}
                {sortBy === column && (
                  <span>
                    <SwapVertIcon style={{ color: "blue" }} />
                  </span>
                )}
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
      <Pagination
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        totalPages={totalPages}
      />
    </div>
  );
};

export default Table;
