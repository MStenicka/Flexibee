import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { stripCodePrefix, formatPrice } from '../../helpers/helpers';
import ReactPaginate from 'react-paginate';
import RecordsPerPageSelect from '../Records/RecordsPerPageSelect';

function Orders() {
  // Loading a data
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  // Vyhledávání
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  // Stránkování
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const startIndex = currentPage * recordsPerPage;

  const handleRecordsPerPageChange = (newRecordsPerPage) => {
    setRecordsPerPage(newRecordsPerPage);
    setCurrentPage(0);
  };

  // Funkce pro fulltextové vyhledávání
  const handleSearch = async () => {
    try {
      setLoading(true);
      setCurrentPage(0);
      const response = await axios.get(
        `http://localhost:3000/api/objednavky/prijate/vyhledane`,
        {
          params: {
            searchQuery: searchQuery,
          },
        },
      );
      setSearchResult(response.data.searchResult);
      setTotalPages(
        Math.ceil(response.data.searchResultCount / recordsPerPage),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataFromServer = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/objednavky/prijate?limit=${recordsPerPage}&startIndex=${startIndex}`,
      );
      const orders = response.data.orders;
      const totalOrdersCount = response.data.totalOrdersCount;

      return { orders, totalOrdersCount };
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let ordersCount = 0;
        if (searchQuery && searchResult && searchResult.length > 0) {
          const slicedSearchResult = searchResult.slice(
            startIndex,
            startIndex + recordsPerPage,
          );
          setData(slicedSearchResult);
          ordersCount = searchResult.length;
        } else {
          const response = await fetchDataFromServer();
          setData(response.orders);
          ordersCount = response.totalOrdersCount;
        }
        setTotalPages(Math.ceil(ordersCount / recordsPerPage));
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchData();
  }, [startIndex, searchQuery, searchResult, recordsPerPage]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <div>
      <h3>Seznam přijatých objednávek</h3>
      <div className="search">
        <input
          className="searchInput"
          type="text"
          placeholder="Zadejte hledaný dotaz"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="searchButton" onClick={handleSearch}>
          Hledat
        </button>
      </div>
      <RecordsPerPageSelect
        recordsPerPage={recordsPerPage}
        onChange={(e) => handleRecordsPerPageChange(e.target.value)}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover">
              <thead className="thead-light">
                <tr className="table-dark">
                  <th>Uživatel</th>
                  <th>Kód</th>
                  <th>Kontakt (jméno)</th>
                  <th>Město</th>
                  <th>Stát</th>
                  <th>Ulice</th>
                  <th>PSČ</th>
                  <th>IČ</th>
                  <th>DIČ</th>
                  <th>Forma dopravy</th>
                  <th>Způsob platby</th>
                  <th>Stav</th>
                  <th>Položky (kód, název)</th>
                  <th>Celková cena objednávky</th>
                  <th>Faktura</th>
                </tr>
              </thead>
              <tbody>
                {data.map((order) => (
                  <tr key={order.id}>
                    <td>{stripCodePrefix(order.uzivatel) || '-'}</td>
                    <>
                      <td>{order.kod || '-'}</td>
                      <td>{order.kontaktJmeno || '-'}</td>
                      <td>{order.mesto || '-'}</td>
                      <td>{stripCodePrefix(order.stat) || '-'}</td>
                      <td>{order.ulice || '-'}</td>
                      <td>{order.psc || '-'}</td>
                      <td>{order.ic || '-'}</td>
                      <td>{order.dic || '-'}</td>
                      <td>{stripCodePrefix(order.formaDopravy) || '-'}</td>
                      <td>{stripCodePrefix(order.formaUhradyCis) || '-'}</td>
                      <td>{order['stavUzivK@showAs'] || '-'}</td>
                      <td className="polozky">
                        <ul>
                          {order.polozkyDokladu.map((polozka) => (
                            <p key={polozka.id}>
                              Kód: {polozka.kod || '-'} <br />
                              Název: {polozka.nazev || '-'}
                            </p>
                          ))}
                          {order.polozkyDokladu.length === 0 && '-'}
                        </ul>
                      </td>
                      <td>{formatPrice(order.sumCelkem) + ' Kč'}</td>
                      <td>
                        {order.vazby.map((vazba) => {
                          if (vazba['b@ref'].includes('faktura-vydana')) {
                            return (
                              <p key={vazba.b}>
                                {' '}
                                <a
                                  href={`https://demo.flexibee.eu${vazba['b@ref']}.pdf?report-name=fakturaKB$$SUM`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Otevřít fakturu
                                </a>{' '}
                              </p>
                            );
                          }
                          return null;
                        })}
                        {order.vazby.length === 0 && '-'}
                      </td>
                    </>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ReactPaginate
            previousLabel={'Předchozí'}
            previousClassName="previous"
            previousLinkClassName="previous-link"
            nextLabel={'Následující'}
            nextClassName="next"
            nextLinkClassName="next-link"
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={totalPages}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={handlePageChange}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            pageClassName="pagination-item"
            forcePage={currentPage}
            activeClassName={'pagination-item-active'}
          />
        </div>
      )}
    </div>
  );
}

export default Orders;
