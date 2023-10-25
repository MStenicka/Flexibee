import axios from 'axios';
import Fuse from 'fuse.js';
import { modifyFakturaReference } from '../utils/utils.js';

export async function getVyhledaneObjednavky(req, res) {
  const { searchQuery } = req.query;
  try {
    const response = await axios.get(
      'https://demo.flexibee.eu/c/demo/objednavka-prijata.json',
      {
        params: {
          relations: 'vazby,polozkyDokladu',
          detail: 'full',
          'add-row-count': true,
          limit: 0,
        },
      },
    );

    const orders = response.data.winstrom['objednavka-prijata'];
    const totalOrdersCount = response.data.winstrom['@rowCount'];

    // Upravení reference na fakturu, aby se dala stáhnout v PDF
    modifyFakturaReference(orders);

    if (searchQuery) {
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
        threshold: 0.3,
        location: 0,
        distance: 100,
        includeMatches: true,
        includeScore: true,
        useExtendedSearch: true,
      };
      const fuse = new Fuse(orders, options);
      const results = fuse.search(searchQuery);

      // Upravení formátu výsledků, aby odpovídaly "orders" (bez "item")
      const searchResult = results.map((order) => order.item);
      const searchResultCount = searchResult.length;

      res.json({
        searchResult,
        totalOrdersCount,
        searchResultCount,
      });
    } else {
      res.json({ orders, totalOrdersCount });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Nepodařilo se načíst přijaté objednávky.' });
  }
}
