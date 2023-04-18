'use strict';

//  find and return dates from API
export class fetchCountries {
	fetchCountries(countryName) { 
	  const BASE_URL = `https://restcountries.com/v3.1/name/${countryName}?fields=name,capital,population,flags,languages`;

		return fetch(`${BASE_URL}`)
			.then(
				res => {
					if (res.status === 404) {
						return res.status;
					}

					if (!res.ok) {
						throw new Error(res.status);
					}

					return res.json();
				});
	};
};