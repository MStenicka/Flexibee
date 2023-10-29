import axios from 'axios';
import { modifyFakturaReference } from '../utils/utils.js';
import Fuse from 'fuse.js';

let allOrders = null;

export default async function loadData() {
  try {
    const response = await axios.get(
      'https://demo.flexibee.eu/c/demo/objednavka-prijata.json?relations=vazby,polozkyDokladu&limit=0&detail=full',
    );
    allOrders = response.data.winstrom['objednavka-prijata'];
    // Upravení reference na fakturu, aby se dala stáhnout v PDF
    modifyFakturaReference(allOrders);
  } catch (error) {
    console.error('Chyba při načítání dat z Flexibee');
  }
}

loadData();

export async function getPrijateObjednavky(req, res) {
  if (allOrders === null) {
    console.log('Načítání dat');
    await loadData();
  }

  const page = parseInt(req.query.page || 1);
  const itemsPerPage = parseInt(req.query.perPage || 5);
  const searchTerm = req.query.search || '';
  console.log(`Searchterm: ${searchTerm}`);

  let filteredOrders = [];

  try {
    if (searchTerm !== '') {
      const options = {
        keys: [
          'uzivatel',
          'kod',
          'kontaktJmeno',
          'mesto',
          'stat',
          'ulice',
          'psc',
          'ic',
          'dic',
          'formaDopravy',
          'formaUhradyCis',
          'polozkyDokladu.kod',
          'polozkyDokladu.nazev',
          'vazby.b@ref',
        ],
        threshold: 0.2,
        location: 0,
        distance: 100,
        includeMatches: true,
        includeScore: true,
        useExtendedSearch: true,
      };
      const fuse = new Fuse(allOrders, options);

      filteredOrders = fuse.search(searchTerm).map((order) => order.item);
    } else {
      filteredOrders = allOrders;
    }

    // Stránkování
    const totalItems = filteredOrders.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    console.log(`Total Item: ${totalItems}, Total Pages: ${totalPages}`);
    console.log(
      `StartIndex: ${startIndex}, itemsPerPage: ${itemsPerPage}, endIndex: ${endIndex}, length: ${paginatedOrders.length}`,
    );

    res.json({ paginatedOrders, totalItems, totalPages });
  } catch (error) {
    res.status(500).json({ error: 'Nepodařilo se načíst přijaté objednávky.' });
  }
}
