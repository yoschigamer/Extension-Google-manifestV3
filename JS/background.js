console.log("background.js loaded.");

var MY_JSON_BDD = "http://myjson.dit.upm.es/api/bins/8uao"

var arr = [];
chrome.webNavigation.onCompleted.addListener(details => { // en francais: quand on charge une page
  chrome.tabs.get(details.tabId, current_tabs_infos => { // en francais: obtenir les infos de la page actuelles

    if (/^https:\/\/www\.google/.test(current_tabs_infos.url) || /^chrome:\/\//.test(current_tabs_infos.url)) { //regex

      console.log('google Page');

    } else {
      arr.push(current_tabs_infos.url); // en francais: ajouter l'url de la page actuelle dans l'array
      i = arr.length - 1;

      if (arr[i] != arr[i - 1]) { // en francais: si l'url de la page actuelle est differente de l'url de la page precedente
        console.log(arr[i], "code injected."); // en francais: afficher l'url de la page actuelle

        chrome.scripting.executeScript({ // en francais: injecter le code
          target: { tabId: details.tabId }, // en francais: injecter le code dans l'onglet actuel
          files: ['./JS/foreground.js'] // en francais: injecter le code dans l'onglet actuel
        }); // en francais: injecter le code

        var title = current_tabs_infos.title
        var url = current_tabs_infos.url

        async function getIndex() {
          try {
            let response = await fetch("http://myjson.dit.upm.es/api/bins/8uao");
            if (response.ok) {
              let data = await response.json();
              return data;
            } else {
              console.log(response.status)
            }
          }
          catch (error) {
            console.log(error);
          }
        }

        getIndex().then(async function sendIndex(data) {

          n = data[0].index.anime.length;
          i = 0;
          let arr = []
          while (i < n) {
            console.log(data[0].index.anime[i], `${1 + i}/${n}`);
            arr.push(data[0].index.anime[i]);
            i++
          }
          console.log(arr);

          const index = {
            "anime": [
              ...arr,
              {
                "type": title,
                "name": url
              }
            ]
          }

          const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([{ index }])
          }

          try {
            const response = await fetch('https://myjson.dit.upm.es/api/bins/8uao', requestOptions);
            if (response.ok) {
              let datasend = await response.json();


              console.log(data, 'GET');
              console.log(datasend, 'PUT');

            } else {
              console.log(response.status)
            }

          }
          catch (error) {
            console.log(error);
          }
        });
        getIndex()


      } else {
        console.log(current_tabs_infos, "code not injected.");
      };
    } // en francais: injecter le code dans l'onglet actuel

  });
}); // en francais: obtenir les infos de la page actuelle
/* --------------------------------------------é------------------------------------------------------------------------- */


