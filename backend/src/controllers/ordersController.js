import axios from 'axios';
import { modifyFakturaReference } from '../utils/utils.js';

export async function getPrijateObjednavky(req, res) {
  const { limit, startIndex } = req.query;

  try {
    const response = await axios.get(
      'https://demo.flexibee.eu/c/demo/objednavka-prijata.json',
      {
        params: {
          relations: 'vazby,polozkyDokladu',
          detail: 'full',
          'add-row-count': true,
          limit: limit || 20,
          start: startIndex || 0,
        },
      },
    );

    const orders = response.data.winstrom['objednavka-prijata'];
    const totalOrdersCount = response.data.winstrom['@rowCount'];

    // Upravení reference na fakturu, aby se dala stáhnout v PDF
    modifyFakturaReference(orders);

    res.json({ orders, totalOrdersCount });
  } catch (error) {
    res.status(500).json({ error: 'Nepodařilo se načíst přijaté objednávky.' });
  }
}
