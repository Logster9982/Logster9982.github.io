let flag = 0;

let which = 0;

let drags = [];

// let templateWindow = [name, imageLink, bio, details, top, left]

// object(picture, name, details, bio, )

function openNav() {
	document.getElementById("mySidebar").style.width = "20%";
	document.getElementById("openbtn").classList.add("hide");
  }

  function closeNav() {
	document.getElementById("mySidebar").style.width = "0";
	document.getElementById("openbtn").classList.remove("hide");
  }

  function showShow() {


	let z = document.querySelectorAll('.modal-body > div');
	let y = document.getElementsByClassName("modal");

	for (let i = 0; i < y.length; i++) {
			y[i].classList.add("show");
	}

  document.querySelector("#destroy").classList.add("hide");
  document.querySelector("#edit").classList.add("hide");
  document.querySelector("#drive").classList.add("hide");

  }

  function showDelete() {

    let z = document.querySelectorAll('.modal-body > div');
    let y = document.getElementsByClassName("modal");
  
    for (let i = 0; i < y.length; i++) {
        y[i].classList.add("show");
    }

    document.querySelectorAll(".form-group").forEach((elmn) => {elmn.classList.add("hide");});
    document.querySelector("#destroy").classList.remove("hide");
  }

  function showEdit() {
    let z = document.querySelectorAll('.modal-body > div');
    let y = document.getElementsByClassName("modal");
  
    for (let i = 0; i < y.length; i++) {
        y[i].classList.add("show");
    }

    document.querySelector("#destroy").classList.add("hide");
    document.querySelector("#drive").classList.add("hide");
  }

  function showDrive() {
    let z = document.querySelectorAll('.modal-body > div');
    let y = document.getElementsByClassName("modal");
  
    for (let i = 0; i < y.length; i++) {
        y[i].classList.add("show");
    }

    document.querySelectorAll(".form-group").forEach((elmn) => {elmn.classList.add("hide");});
    document.querySelector("#drive").classList.remove("hide");
  }
  
  


  function saveShow() {
	let y = document.getElementsByClassName("modal");

	for (let i = 0; i < y.length; i++) {
			y[i].classList.remove("show");
	}
  }

  //Make the DIV element draggagle:

/* let dragArray = [document.getElementById("mydiv1"), document.getElementById("mydiv2")];
dragArray.forEach((drag) => {
	dragElement(drag);
}) */

function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;

    let getem = parseInt(elmnt.id.slice(4));

    drags[getem - 1][4] = elmnt.style.top;
    drags[getem - 1][5] = elmnt.style.left;

    localStorage.setItem("items", JSON.stringify(drags));
    // document.querySelector("#addLocal").textContent += localStorage.items;


  }
}

function createDragable(numb, ver) {
  let main = document.querySelector("main");
  let form = document.querySelector("#user-form");


  if (ver == 1) {

  let x = [];


  let parent = document.createElement("div");

  main.appendChild(parent);

  parent.id = "move" + numb;
  parent.classList.add("movable")

  let header = document.createElement("div");
  header.id = "movehead" + numb;
  header.classList.add("movableHeader");
  header.textContent = form["name"].value + " - " + flag;
  x[0] = header.textContent;
  

  parent.appendChild(header);

  let img = document.createElement("img");
  img.src = "https://picsum.photos/70";
  x[1] = img.src;
  img.alt = "User generated image " + numb;

  parent.appendChild(img);

  let bio = document.createElement("p");
  bio.textContent = form["bio"].value;
  x[2] = bio.textContent;

  parent.appendChild(bio);

  let desc = document.createElement("p");
  desc.textContent = form["details"].value;
  x[3] = desc.textContent;

  x[4] = "0px";
  x[5] = "0px";

  parent.appendChild(desc);
  drags.push(x);

  dragElement(parent);

  localStorage.setItem("items", JSON.stringify(drags));
  }

  if (ver == 2) {
    removeMove(form["delete"].value);
    drags[form["delete"].value - 1] = null;
    flag--;
    localStorage.setItem("items", JSON.stringify(drags));
  }

  if (ver == 3) {
    // desc[form["edit"].value - 1];

    let ark = document.getElementById("move" + (form["edit"].value));

    let pos = ark.children;

    let hyphen = pos[0].textContent.slice(-4);

    pos[0].textContent = form["name"].value + hyphen;
    pos[2].textContent = form["bio"].value;
    pos[3].textContent = form["details"].value;



    flag--;

    localStorage.setItem("items", JSON.stringify(drags));
  }

  if (ver == 4) {
    handleAuthClick();
    flag--;
  }
  
  document.querySelectorAll(".hide").forEach((elmn) => {elmn.classList.remove("hide");});
}

function removeMove(numb) {
  document.getElementById("move" + numb).remove();

}

/*
    <div id="mydiv1" class="movable">
      <div id="mydivheader" class="movableHeader">Person</div>
      <p>Picture</p>
      <p>John Paul Jones, Colonial, ??</p>
      <p>Caused numerous incidents of piracy across the coast of Britian</p>
    </div>
*/

function restore(pieces, numb) {
  let main = document.querySelector("main");


  let parent = document.createElement("div");

  main.appendChild(parent);

  parent.id = "move" + numb;
  parent.classList.add("movable")

  let header = document.createElement("div");
  header.id = "movehead" + numb;
  header.classList.add("movableHeader");
  header.textContent = pieces[0];
  

  parent.appendChild(header);

  let img = document.createElement("img");
  img.src = pieces[1];
  img.alt = "User generated image " + numb;

  parent.appendChild(img);

  let bio = document.createElement("p");
  bio.textContent = pieces[2];

  parent.appendChild(bio);

  let desc = document.createElement("p");
  desc.textContent = pieces[3];

  parent.appendChild(desc);

  dragElement(parent);

  console.log()

  parent.style.top = pieces[4];
  parent.style.left = pieces[5];

  drags[numb - 1][4] =  pieces[4];
  drags[numb - 1][5] =  pieces[5];

  localStorage.setItem("items", JSON.stringify(drags));
}

const CLIENT_ID = '208574230386-aqlajmssfbo2h6sqac320o9c9fjcm0i1.apps.googleusercontent.com';
      const API_KEY = 'AIzaSyCVjc60ZnV1qCI2J8YHyvUSH2GSRp-a-Do';

      // Discovery doc URL for APIs used by the quickstart
      const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

      let tokenClient;
      let gapiInited = false;
      let gisInited = false;

      /**
       * Callback after api.js is loaded.
       */
      function gapiLoaded() {
        gapi.load('client', initializeGapiClient);
      }

      /**
       * Callback after the API client is loaded. Loads the
       * discovery doc to initialize the API.
       */
      async function initializeGapiClient() {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
      }

      /**
       * Callback after Google Identity Services are loaded.
       */
      function gisLoaded() {
        tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: '', // defined later
        });
        gisInited = true;
      }


      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick() {
        tokenClient.callback = async (resp) => {
          if (resp.error !== undefined) {
            throw (resp);
          }
          await listMajors();
        };

        if (gapi.client.getToken() === null) {
          // Prompt the user to select a Google Account and ask for consent to share their data
          // when establishing a new session.
          tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
          // Skip display of account chooser and consent dialog for an existing session.
          tokenClient.requestAccessToken({prompt: ''});
        }
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick() {
        const token = gapi.client.getToken();
        if (token !== null) {
          google.accounts.oauth2.revoke(token.access_token);
          gapi.client.setToken('');
          document.getElementById('authorize_button').innerText = 'Authorize';
        }
      }

      /**
       * Print the names and majors of students in a sample spreadsheet:
       * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
       */
      async function listMajors() {
        let form = document.querySelector("#user-form");
        let response;
        try {
          // Fetch first 10 files
          response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: form["drive"].value,
            range: 'A1',
          });
        } catch (err) {
          console.log(err.message);
          return;
        }
        const range = response.result;
        if (!range || !range.values || range.values.length == 0) {
          console.log('No values found.');
          return;
        }
        // Flatten to string to display
        const output = range.values.reduce(
            (str, row) => `${str}${row[0]}, ${row[4]}\n`,
            'Name, Major:\n');
        console.log(range.values[0][0]);
        localStorage.items = range.values[0][0];
        window.location.reload();
      }


(function() {

  let temp = null;


  if (localStorage.items != null) {
    temp = JSON.parse(localStorage.items);
    flag = temp.length;
    drags = temp;
    for (let i = 0; i < temp.length; i++) {
      if (temp[i] != null) {
        restore(temp[i], i + 1);
      }
    }
  }

	document.getElementById("unf").addEventListener("click", () => {
    which = 3;
    showEdit();
  });

  document.getElementById("reset").addEventListener("click", () => {
    which = 4;
    showDrive();
  });


  document.getElementById("clear").addEventListener("click", () => {
    localStorage.clear();
    window.location.reload();
  });

	document.getElementById("unfinished").addEventListener("click", () => {
    which = 2;
    showDelete();
  });

  document.getElementById("export").addEventListener("click", () => {
    console.log("pushed");
    let blob = new Blob([localStorage.items],
    { type: 'text/plain' });
  // Create a URL object with the blob
  let url = window.URL.createObjectURL(blob);
  let link = document.createElement('a');
  link.href = url;
  link.download = 'data.json';
  link.click();
  console.log("bug");
  });

	document.getElementById("add").addEventListener("click", () => {
    which = 1;
    showShow();}
  );

	document.getElementById("close").addEventListener("click", () => {saveShow();
    createDragable(++flag, which);
  });

/*   for (let i = 0; i < drags.length; i++) {
    let temp = document.querySelector("#move" + i);
    drags[i][4] = temp.style.top;
    drags[i][5] = temp.style.left;
  } */


})();



