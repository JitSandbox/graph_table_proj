/* eslint-disable react/prop-types */
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { formatDate } from "../../../utils/helper";
import { SORT_TYPE, DEFAULT_COLUMN, VIEW_MODE } from "../../../utils/constant";
import SearchBox from "../SearchBox";
import Pagination from "../Pagination";
import ModalLaunch from "../Modal";

ChartJS.register(ArcElement, Tooltip, Legend);

const Table = (props) => {
  const { query, itemsPerPage } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(DEFAULT_COLUMN.ID);
  const [sortOrder, setSortOrder] = useState(SORT_TYPE.ASC);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLaunch, setSelectedLaunch] = useState(null);
  const [viewMode, setViewMode] = useState(VIEW_MODE.TABLE);

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

  const handleUserClick = (row) => {
    setSelectedLaunch(row);
  };

  const toggleModal = () => {
    setSelectedLaunch(null);
  };

  const toggleViewMode = () => {
    setViewMode(
      viewMode === VIEW_MODE.TABLE ? VIEW_MODE.GRID : VIEW_MODE.TABLE
    );
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

  const dataSet = {
    labels: paginatedData.map((obj) => obj.Title),
    datasets: [
      {
        label: "Count of Rockets",
        data: [1, 1, 1, 1, 1],
        backgroundColor: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        borderWidth: 1,
        descriptions: paginatedData.map((obj) => obj.EventDate),
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "right",
      },
    },
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="table-header">
        {viewMode === VIEW_MODE.TABLE && (
          <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        )}
        <button onClick={toggleViewMode}>
          {viewMode === VIEW_MODE.TABLE
            ? "Switch to Graph View"
            : "Switch to Table View"}
        </button>
      </div>
      {filteredData.length > 0 ? (
        viewMode === VIEW_MODE.TABLE ? (
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
                <th>Summary</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value) => (
                    <td key={value}>{value}</td>
                  ))}
                  <td>
                    <button onClick={() => handleUserClick(row)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="chart-view">
            <Doughnut data={dataSet} options={options} />
          </div>
        )
      ) : (
        <p className="no-data-wrapper">No Data Available</p>
      )}
      {filteredData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          totalPages={totalPages}
        />
      )}
      {selectedLaunch && (
        <ModalLaunch
          launch={selectedLaunch}
          isOpen={selectedLaunch !== null}
          toggle={toggleModal}
        />
      )}
    </div>
  );
};

export default Table;
