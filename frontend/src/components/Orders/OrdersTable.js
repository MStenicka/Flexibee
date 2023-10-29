import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { stripCodePrefix, formatPrice } from '../../helpers/helpers';
import ReactPaginate from 'react-paginate';
import RecordsPerPageSelect from '../Records/RecordsPerPageSelect';

const OrdersTable = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState('');
  const [totalItems, setTotalItems] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermTemp, setSearchTermTemp] = useState('');

  const handleRecordsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setPage(1);
  };

  const fetchData = async (page, itemsPerPage, searchTerm) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/objednavky/prijate?page=${page}&perPage=${itemsPerPage}&search=${searchTerm}`,
      );
      console.log(response.data);
      setOrders(response.data.paginatedOrders);
      setTotalItems(response.data.totalItems);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Chyba při získávání dat z backendu', error);
    }
  };

  useEffect(() => {
    fetchData(page, itemsPerPage, searchTerm);
  }, [page, itemsPerPage, searchTerm]);

  const handlePageClick = (selectedPage) => {
    setPage(selectedPage.selected + 1);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1);
  };

  return (
    <div>
      <h3>Seznam přijatých objednávek</h3>
      <div className="search">
        <input
          className="searchInput"
          type="text"
          placeholder="Zadejte hledaný dotaz"
          value={searchTermTemp}
          onChange={(e) => setSearchTermTemp(e.target.value)}
        />
        <button
          className="searchButton"
          onClick={() => handleSearch(searchTermTemp)}
        >
          Hledat
        </button>
      </div>
      <RecordsPerPageSelect
        recordsPerPage={itemsPerPage}
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
                {orders.map((order) => (
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
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            pageClassName="pagination-item"
            forcePage={page - 1}
            activeClassName={'pagination-item-active'}
          />
        </div>
      )}
    </div>
  );
};
export default OrdersTable;
