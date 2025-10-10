// All GCC shipping services by country
export const gccShippingServices = {
  AE: [
    { id: 'aramex', name: 'أرامكس - Aramex', key: 'aramex' },
    { id: 'dhl', name: 'دي إتش إل - DHL', key: 'dhl' },
    { id: 'fedex', name: 'فيديكس - FedEx', key: 'fedex' },
    { id: 'ups', name: 'يو بي إس - UPS', key: 'ups' },
    { id: 'empost', name: 'البريد الإماراتي - Emirates Post', key: 'empost' },
  ],
  SA: [
    { id: 'smsa', name: 'سمسا - SMSA', key: 'smsa' },
    { id: 'aramex', name: 'أرامكس - Aramex', key: 'aramex' },
    { id: 'dhl', name: 'دي إتش إل - DHL', key: 'dhl' },
    { id: 'zajil', name: 'زاجل - Zajil', key: 'zajil' },
    { id: 'naqel', name: 'ناقل - Naqel', key: 'naqel' },
    { id: 'saudipost', name: 'البريد السعودي - Saudi Post', key: 'saudipost' },
    { id: 'fedex', name: 'فيديكس - FedEx', key: 'fedex' },
    { id: 'ups', name: 'يو بي إس - UPS', key: 'ups' },
  ],
  KW: [
    { id: 'kwpost', name: 'البريد الكويتي - Kuwait Post', key: 'kwpost' },
    { id: 'dhlkw', name: 'دي إتش إل - DHL', key: 'dhlkw' },
    { id: 'aramex', name: 'أرامكس - Aramex', key: 'aramex' },
    { id: 'fedex', name: 'فيديكس - FedEx', key: 'fedex' },
    { id: 'ups', name: 'يو بي إس - UPS', key: 'ups' },
  ],
  QA: [
    { id: 'qpost', name: 'البريد القطري - Qatar Post', key: 'qpost' },
    { id: 'dhlqa', name: 'دي إتش إل - DHL', key: 'dhlqa' },
    { id: 'aramex', name: 'أرامكس - Aramex', key: 'aramex' },
    { id: 'fedex', name: 'فيديكس - FedEx', key: 'fedex' },
    { id: 'ups', name: 'يو بي إس - UPS', key: 'ups' },
  ],
  OM: [
    { id: 'omanpost', name: 'البريد العُماني - Oman Post', key: 'omanpost' },
    { id: 'dhlom', name: 'دي إتش إل - DHL', key: 'dhlom' },
    { id: 'aramex', name: 'أرامكس - Aramex', key: 'aramex' },
    { id: 'fedex', name: 'فيديكس - FedEx', key: 'fedex' },
    { id: 'ups', name: 'يو بي إس - UPS', key: 'ups' },
  ],
  BH: [
    { id: 'bahpost', name: 'البريد البحريني - Bahrain Post', key: 'bahpost' },
    { id: 'dhlbh', name: 'دي إتش إل - DHL', key: 'dhlbh' },
    { id: 'aramex', name: 'أرامكس - Aramex', key: 'aramex' },
    { id: 'fedex', name: 'فيديكس - FedEx', key: 'fedex' },
    { id: 'ups', name: 'يو بي إس - UPS', key: 'ups' },
  ],
};

export const getServicesByCountry = (countryCode: string) => {
  return gccShippingServices[countryCode as keyof typeof gccShippingServices] || [];
};
