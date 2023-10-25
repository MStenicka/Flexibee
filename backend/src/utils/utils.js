export function modifyFakturaReference(orders) {
  orders.forEach((order) => {
    if (order.vazby) {
      order.vazby.forEach((vazba) => {
        if (vazba['b@ref'] && vazba['b@ref'].endsWith('.json')) {
          vazba['b@ref'] = vazba['b@ref'].slice(0, -5);
        }
      });
    }
  });
}
