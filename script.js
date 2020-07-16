let submitBtn = document.getElementById("submit_btn");

//search for jobs and create a card for each job when submit button is clicked
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  //clear the card display section first before submitting
  document.getElementById("card-display-section").innerHTML = "";

  //extract job description search bar value
  let searchInputJobDescription = document.getElementById(
    "search-input-job-description"
  ).value;

  console.log(searchInputJobDescription);

  //extract radio button value for job types
  let radios = document.getElementsByName("job-type");
  let jobTypeChecked = null;
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      jobTypeChecked = radios[i].value;
    }
  }
  console.log(jobTypeChecked);

  //extract location search bar value
  let searchInputLocation = document.getElementById("search-input-location")
    .value;
  console.log(searchInputLocation);

  //search jobs with description, location, and job type input and create cards
  searchJobsAndCreateCards(
    searchInputJobDescription,
    searchInputLocation,
    jobTypeChecked
  );
});

//search and filter the data according to user input, and create card for each job found and append it to the display section
function searchJobsAndCreateCards(description, location, jobType) {
  let url = "https://jobs.github.com/positions.json?";
  if (description !== "") {
    url += `description=${description}`;
  }
  if (location !== "") {
    url += `&location=${location}`;
  }
  //use description or location or both to search
  if ((description !== "" || location !== "") && jobType !== 0) {
    fetch(`${url}`)
      .then((response) => response.json())
      .then((data) => {
        // if (data.length === 0) {
        //   //alert if no jobs found based on the keywords
        //   alert("Sorry! No jobs found with these keywords");
        // }
        for (let i = 0; i < data.length; i++) {
          if (
            jobType.toLowerCase() === data[i].type.toLowerCase() ||
            data[i].location.toLowerCase().includes(jobType.toLowerCase())
          ) {
            document
              .getElementById("card-display-section")
              .appendChild(createCard(data[i]));

            //clear the search bars
            document.getElementById("search-input-job-description").value = "";
            document.getElementById("search-input-location").value = "";
          }
        }
        if (document.getElementById("card-display-section").innerHTML === "") {
          //alert if jobs were found based on keywords but no jobs were listed in cards bc jobType doesn't match
          alert("Sorry! No jobs found under these conditions");
        }
      });
  } else {
    alert(
      "Please enter either job description or location info or both, and select job type (required)"
    );
  }
}

//create card with the filtered info
function createCard(job) {
  let card = document.createElement("div");
  card.setAttribute("class", "card");
  card.setAttribute("style", "width:18rem");

  let img = document.createElement("img");
  img.setAttribute("src", job.company_logo);
  img.setAttribute("class", "card-img-top");
  img.setAttribute("alt", job.company);
  img.setAttribute("style", "max-height:30%");

  let cardBody = document.createElement("div");
  cardBody.setAttribute("class", "card-body");

  let cardTitle = document.createElement("h5");
  cardTitle.setAttribute("class", "card-title");
  cardTitle.innerHTML = job.title;

  let jobDescriptionPara = document.createElement("div");
  jobDescriptionPara.setAttribute("class", "card-text");
  jobDescriptionPara.innerHTML = job.description.substring(0, 100); //limit the job description to 100 characters at most

  let howToApplyPara = document.createElement("p");
  howToApplyPara.setAttribute("class", "card-text");
  howToApplyPara.innerHTML = "How to apply:" + job.how_to_apply;

  let viewDetailsBtn = document.createElement("a");
  viewDetailsBtn.setAttribute("href", job.url);
  viewDetailsBtn.setAttribute("class", "btn btn-primary");
  viewDetailsBtn.innerHTML = "View job in details";

  cardBody.append(
    cardTitle,
    jobDescriptionPara,
    howToApplyPara,
    viewDetailsBtn
  );
  card.append(img, cardBody);

  return card;
}
