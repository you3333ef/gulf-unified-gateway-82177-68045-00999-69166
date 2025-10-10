// Service logos and branding - All GCC shipping carriers
export const serviceLogos: Record<string, { logo: string; colors: { primary: string; secondary: string }; ogImage?: string }> = {
  // UAE - الإمارات
  aramex: {
    logo: "https://www.aramex.com/sites/default/files/aramex-logo.svg",
    colors: {
      primary: "#ED1C24",
      secondary: "#000000"
    },
    ogImage: "https://www.aramex.com/sites/default/files/aramex-truck.jpg"
  },
  dhl: {
    logo: "https://www.dhl.com/content/dam/dhl/global/core/images/logos/dhl-logo.svg",
    colors: {
      primary: "#FFCC00",
      secondary: "#D40511"
    },
    ogImage: "https://www.dhl.com/content/dam/dhl/global/core/images/generic/dhl-plane.jpg"
  },
  fedex: {
    logo: "https://www.fedex.com/content/dam/fedex-com/logos/logo.png",
    colors: {
      primary: "#4D148C",
      secondary: "#FF6600"
    },
    ogImage: "https://www.fedex.com/content/dam/fedex/images/aircraft.jpg"
  },
  ups: {
    logo: "https://www.ups.com/assets/resources/webcontent/images/ups-logo.svg",
    colors: {
      primary: "#351C15",
      secondary: "#FFB500"
    },
    ogImage: "https://www.ups.com/assets/resources/images/truck.jpg"
  },
  empost: {
    logo: "https://www.emiratespost.ae/images/logo.png",
    colors: {
      primary: "#C8102E",
      secondary: "#003087"
    },
    ogImage: "https://www.emiratespost.ae/images/service.jpg"
  },
  
  // Saudi Arabia - السعودية
  smsa: {
    logo: "https://www.smsaexpress.com/images/logo.png",
    colors: {
      primary: "#0066CC",
      secondary: "#FF6600"
    },
    ogImage: "https://www.smsaexpress.com/images/delivery.jpg"
  },
  zajil: {
    logo: "https://zajil.com/assets/images/logo.png",
    colors: {
      primary: "#1C4587",
      secondary: "#FF9900"
    },
    ogImage: "https://zajil.com/assets/images/service.jpg"
  },
  naqel: {
    logo: "https://www.naqelexpress.com/images/logo.png",
    colors: {
      primary: "#0052A3",
      secondary: "#FF6B00"
    },
    ogImage: "https://www.naqelexpress.com/images/truck.jpg"
  },
  saudipost: {
    logo: "https://sp.com.sa/assets/images/logo.png",
    colors: {
      primary: "#006C35",
      secondary: "#FFB81C"
    },
    ogImage: "https://sp.com.sa/assets/images/post-office.jpg"
  },
  
  // Kuwait - الكويت
  kwpost: {
    logo: "https://www.kwpost.com.kw/images/logo.png",
    colors: {
      primary: "#007A33",
      secondary: "#DA291C"
    },
    ogImage: "https://www.kwpost.com.kw/images/service.jpg"
  },
  dhlkw: {
    logo: "https://www.dhl.com/content/dam/dhl/global/core/images/logos/dhl-logo.svg",
    colors: {
      primary: "#FFCC00",
      secondary: "#D40511"
    },
    ogImage: "https://www.dhl.com/content/dam/dhl/global/core/images/generic/dhl-plane.jpg"
  },
  
  // Qatar - قطر
  qpost: {
    logo: "https://www.qpost.qa/assets/images/logo.png",
    colors: {
      primary: "#8E1838",
      secondary: "#FFFFFF"
    },
    ogImage: "https://www.qpost.qa/assets/images/building.jpg"
  },
  dhlqa: {
    logo: "https://www.dhl.com/content/dam/dhl/global/core/images/logos/dhl-logo.svg",
    colors: {
      primary: "#FFCC00",
      secondary: "#D40511"
    },
    ogImage: "https://www.dhl.com/content/dam/dhl/global/core/images/generic/dhl-plane.jpg"
  },
  
  // Oman - عمان
  omanpost: {
    logo: "https://www.omanpost.om/images/logo.png",
    colors: {
      primary: "#ED1C24",
      secondary: "#009639"
    },
    ogImage: "https://www.omanpost.om/images/service.jpg"
  },
  dhlom: {
    logo: "https://www.dhl.com/content/dam/dhl/global/core/images/logos/dhl-logo.svg",
    colors: {
      primary: "#FFCC00",
      secondary: "#D40511"
    },
    ogImage: "https://www.dhl.com/content/dam/dhl/global/core/images/generic/dhl-plane.jpg"
  },
  
  // Bahrain - البحرين
  bahpost: {
    logo: "https://www.bahrainpost.gov.bh/images/logo.png",
    colors: {
      primary: "#CE1126",
      secondary: "#FFFFFF"
    },
    ogImage: "https://www.bahrainpost.gov.bh/images/service.jpg"
  },
  dhlbh: {
    logo: "https://www.dhl.com/content/dam/dhl/global/core/images/logos/dhl-logo.svg",
    colors: {
      primary: "#FFCC00",
      secondary: "#D40511"
    },
    ogImage: "https://www.dhl.com/content/dam/dhl/global/core/images/generic/dhl-plane.jpg"
  }
};

export const getServiceBranding = (serviceName: string) => {
  const key = serviceName.toLowerCase();
  return serviceLogos[key] || {
    logo: "",
    colors: {
      primary: "#0EA5E9",
      secondary: "#06B6D4"
    }
  };
};
