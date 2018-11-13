// const API_URL = '/example.json?domain=';
const API_URL = 'https://apis.is/isnic?domain=';


/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  let domains;

  function dtElement(dtText) {
    const element = document.createElement('dt');
    element.appendChild(document.createTextNode(dtText));
    return element;
  }

  function ddElement(ddText) {
    const valueElement = document.createElement('dd');
    valueElement.appendChild(document.createTextNode(ddText));
    return valueElement;
  }

  function makeDate(text) {
    const date = new Date(text);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = `0${dt}`;
    }
    if (month < 10) {
      month = `0${month}`;
    }

    return `${year}-${month}-${dt}`;
  }

  function displayError(error) {
    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(document.createTextNode(error));
  }


  function displayDomain(domainsList) {
    if (domainsList.length === 0) {
      displayError('Fann ekki lén');
      return;
    }
    const [{
      domain,
      registered,
      expires,
      lastChange,
      registrantname,
      email,
      address,
      country,
    }] = domainsList;
    const container = domains.querySelector('.results');
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    const dl = document.createElement('dl');
    container.appendChild(dl);

    dl.appendChild(dtElement('Lén'));
    dl.appendChild(ddElement(domain));
    dl.appendChild(dtElement('Skráð'));
    dl.appendChild(ddElement(makeDate(registered)));
    dl.appendChild(dtElement('Rennur út'));
    dl.appendChild(ddElement(makeDate(expires)));
    dl.appendChild(dtElement('Síðasta breyting'));
    dl.appendChild(ddElement(makeDate(lastChange)));
    if (registrantname.length > 0) {
      dl.appendChild(dtElement('Nafn'));
      dl.appendChild(ddElement(registrantname));
    }
    if (email.length > 0) {
      dl.appendChild(dtElement('Netfang'));
      dl.appendChild(ddElement(email));
    }
    if (address.length > 0) {
      dl.appendChild(dtElement('Heimilisfang'));
      dl.appendChild(ddElement(address));
    }
    if (country.length > 0) {
      dl.appendChild(dtElement('Land'));
      dl.appendChild(ddElement(country));
    }
  }


  function loading() {
    const container = domains.querySelector('.results');
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    const element = document.createElement('div');
    const results = domains.querySelector('.results');
    const img = document.createElement('img');
    img.setAttribute('src', 'loading.gif');
    element.classList.add('loading');
    element.appendChild(img);

    const p = document.createElement('p');
    p.appendChild(document.createTextNode('Leita að léni....'));
    element.appendChild(p);
    results.appendChild(element);
  }

  function fetchData(string) {
    fetch(`${API_URL}${string}`) /* eslint-disable-line */
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error('Villa kom upp');
      })
      .then((data) => {
        displayDomain(data.results);
      })
      .catch((error) => { /* eslint-disable-line */
        displayError('Villa við að sækja gögn!');
      });
  }

  function onSubmit(e) {
    e.preventDefault();
    loading();
    const input = e.target.querySelector('input');
    if (input.value.length > 0 && !input.value.replace(/\s/g, '').length !== 0) {
      fetchData(input.value);
    } else {
      displayError('Vinsamlegast skrifið lén.');
    }
  }

  function init(_domains) {
    domains = _domains;

    const form = domains.querySelector('form');
    form.addEventListener('submit', onSubmit);
  }


  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');
  program.init(domains);
});
