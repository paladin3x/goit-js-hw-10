
import './css/styles.css';

// Import Debounce
import debounce from 'lodash.debounce';
// Import Notiflix
import Notiflix from 'notiflix';

// Noriflix settings
Notiflix.Notify.init({
	width: '500px',
	position: 'left-top',
	fontSize: '20px',
})

import { fetchCountries } from './js/fetchCountries.js';


// find field with input#search-box

const inputFieldEl = document.querySelector("#search-box");
const countryListEl = document.querySelector(".country-list")
const countryDivEl = document.querySelector(".country-info")
const bodyEl = document.querySelector("body");


const DEBOUNCE_DELAY = 300;

// part with styles

inputFieldEl.style.width = "400px";

bodyEl.style.display = "flex";
bodyEl.style.alignItems = "center";
bodyEl.style.flexWrap = "wrap";
bodyEl.style.flexDirection = "column";

// add event listener with debounce

inputFieldEl.addEventListener("input", debounce(addHtmlCode, DEBOUNCE_DELAY));

// if user cleanes field return err and clean HTML

function addHtmlCode() {
	// use trim()
	const inputValue = inputFieldEl.value.trim()

	if (inputValue === "") {
		cleanMarkup();

		return Notiflix.Notify.success('Empry field');;
	}
	workWithResultFromApi(inputValue);
}

function cleanMarkup() {
	countryListEl.innerHTML = "";
	countryDivEl.innerHTML = "";
}

function workWithResultFromApi(countryName) {
	cleanMarkup();

	checkResult(countryName);
}

const checkResult = (countryName) => {
	const classApi = new fetchCountries;
	classApi.fetchCountries(countryName)
		.then((data) => {
			workWithUserInterface(data);
			return data;
		})
		.catch((error) => {
			return console.log("Error: " + error);
		})
}

function workWithUserInterface(data) {
	const countryArrayLength = data.length;


	// Catch 404 error
	if (data === 404) {
		return Notiflix.Notify.failure('Oops, there is no country with that name');
	}

	if (countryArrayLength > 10) {
		return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
	}

	if (2 <= countryArrayLength && countryArrayLength <= 10) {
		const markup = data.map(({flags , name}) => `<li style="display:flex;align-items:center;gap:10px;">
        <img src=${flags.svg} alt="" width="50px" />
        <p><b>${name.official}</b></p>
      </li>`).join("");
		return countryListEl.insertAdjacentHTML("beforeend", markup);
	}

	if (countryArrayLength === 1) {
		const markup = data.map(({ name, flags, capital, population, languages }) => 
				`<div style="display: flex; align-items: center; gap: 10px; height:60px">
       	 <img src=${flags.svg} alt="" width="50px" />
      	  <p style="font-size: 40px"><b>${name.official}</b></p>
    	 	 </div>
     		 <ul style="padding: 0;list-style: none;">
        		<li><b>Capital:</b> ${capital}</li>
       		 <li><b>Population:</b> ${population}</li>
       		 <li><b>Languages:</b> ${Object.values(languages).join(", ")}</li>
      	</ul>`
		
		).join("");
		return countryDivEl.insertAdjacentHTML("beforeend", markup);
	}
}