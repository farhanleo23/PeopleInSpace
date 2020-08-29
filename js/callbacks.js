const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

// async functiion
async function getPeopleInSpace(url){
  const peopleResponse = await fetch(url);
  const peopleJSON = await peopleResponse.json();

  const profiles = peopleJSON.people.map( async person => {
    const craft = person.craft;
    const profileResponse = await fetch(wikiUrl + person.name);
    const profileJSON = await profileResponse.json();

    return {...profileJSON, craft};
  });
  return Promise.all(profiles);
}


// function getProfiles(json){
//   const profiles = json.people.map( person => {
//     const craft = person.craft;
//     return fetch(wikiUrl + person.name)
//             .then( response => response.json())
//             .then( profile => {
//               return{...profile, craft}
//             })
//             .catch(err => console.log("Error fetching Wikipedia API", err))
//   });
//   return Promise.all(profiles);
// }

// Generate the markup for each profile
function generateHTML(data) {
  data.map(person => {
    const section = document.createElement('section');
    peopleList.appendChild(section);
    section.innerHTML = `
      <img src=${person.thumbnail.source}>
      <span>${person.craft}</span>
      <h2>${person.title}</h2>
      <p>${person.description}</p>
      <p>${person.extract}</p>
  `;
  });
}

btn.addEventListener('click', async (event) => {
  event.target.textContent = "Loading...";

  const astros = await getPeopleInSpace(astrosUrl);
  generateHTML(astros);
  event.target.remove();

  //USING FETCH API
  // fetch(astrosUrl)
  // .then( response => response.json())
  // .then(getProfiles)
  // .then(generateHTML)
  // .catch(err => {
  //   peopleList.innerHTML = "<h3>Could not load</h3>";
  //   console.log(err);
  // }) 
  // .finally( () => event.target.remove() )
});