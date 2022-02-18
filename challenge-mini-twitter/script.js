/*
A reduced version of the [twitter interface](https://twitter.com/home). 
When the 'button' is clicked, the content should be posted on the screen to look like a tweet.
There is a delete icon for each tweet. On click, the corresponding tweet is removed from the timeline.

Please note: the HTML & CSS that I used for this challenge is based upon 
1-todo-list of JavaScript-Core-2-Coursework-Week3-London8;
hence the similarities

*/

// Setup
const TWITTERLIMIT = 280;
const remainingLoc = document.querySelector(".remaining");
let charCount = 0;
let tweetTextArea = document.querySelector('textarea'); // The tweet text area
tweetTextArea.addEventListener("keyup",checkAndIncrementCharCount); 



function checkKeyEvent(event) {
/*
   These checks are not exhaustive.
   They are used to check regarding keystrokes, whether they would make any difference to the actual Character Count
   For more information regarding the keycode constants used see https://css-tricks.com/snippets/javascript/javascript-keycodes/  
*/

    const BACKSPACE = 8, TAB = 9, SPACE = 32, DELETE = 46, LEFTWINDOW = 91, RIGHTWINDOW = 92, SELECT = 93, FUNCTIONKEY_F1 = 112, SCROLL_LOCK = 145;
    const ZERO = 48, ENTER = 13;

    let keyCode = event.which;
    if (keyCode === BACKSPACE || keyCode === DELETE) {
        --charCount; // assume character deleted so decrement count
        return;
    }
    if (keyCode === SPACE || keyCode === ENTER) {
        ++charCount;
        return;
    }

    // ignore the following keystrokes including TAB
    if (keyCode < ZERO || keyCode === LEFTWINDOW || keyCode === RIGHTWINDOW || keyCode === SELECT || 
        (keyCode >= FUNCTIONKEY_F1 && keyCode <= SCROLL_LOCK))
            return;

    // Assume a legitimate character has been entered - increment the count
    ++charCount;
}

function showRemainingChars() {
      let diff =  TWITTERLIMIT - charCount;     
      remainingLoc.innerText = String(diff).padStart(3) + ' Remaining Characters';
      // show in red if less or equal to 20 characters
      remainingLoc.style.color  = diff <= 20 ? "red" : "#657786"; 
}

function checkAndIncrementCharCount(event) {
      // check whether keystroke ought to be ignored
      checkKeyEvent(event);
      if (charCount < 1)
          charCount = 0
      else if (charCount > TWITTERLIMIT)
          charCount = TWITTERLIMIT

      showRemainingChars();    
}

function trashFunction() {
  let getParent = this.parentElement; // this is the SPAN
  // Have to remove the other EventListener
  let getChild = getParent.firstChild;
  getChild.removeEventListener("click", trashFunction);
  
  // Now remove the element
  getParent = getParent.parentElement; // this is the LI
    
  getParent.remove(); // remove entire element
}

function populateTweetList(tweetText) {

  let regex = /(@([_A-Z0-9]+))\b/i; // to determine Twitter handles

  // Add the time and date of tweet e.g. 11:38 AM - Feb 17, 2022
  
  // getHours() returns the hour (from 0 to 23) of a date
  // getMinutes() returns the minutes (0 to 59) of a date
  // getDate() returns the day of the month (from 1 to 31) of a date
  // getMonth() returns the month (from 0 to 11) of a date
  // getFullYear() returns the full year (4 digits) of a date.

  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const dateTime = new Date();

  let dateText = String(dateTime.getHours()).padStart(2,"0") + ":" + String(dateTime.getMinutes()).padStart(2,"0")
  dateText += (dateTime.getHours() < 12 ? " AM" : " PM") + " - "
  dateText += (month[dateTime.getMonth()]).substr(0,3) + ` ${dateTime.getDate()}, ${dateTime.getFullYear()}`
  tweetText += "\n\n" + dateText;

  /*
  A Twitter handle starts with an `@` symbol and can only contain alpha-numeric characters. 
  When posting a new tweet to the timeline, turn handles into links. for example if a tweet contains @dmitrigrabov it should be turned into 
  '<a href="www.twitter.com/dmitrigrabov">@dmitrigrabov</a>'.
  */

  let textChanged = regex.test(tweetText) // flag to indicate whether a Twitter handle had been matched

  let list = document.getElementById("tweet-list");
  // Create a tweet list element with a delete buttons. 
  // All tweets should display inside the "tweet-list" element.
  let tweetClassesToAdd = "list-group-item d-flex justify-content-between align-items-center".split(' ');
  // i.e. ['list-group-item' 'd-flex' ....]
  let spanClassesToAdd = "badge bg-primary rounded-pill".split(' ');

  let listViewItem=document.createElement('li');

  // Apply the necessary classes
  listViewItem.classList.add(...tweetClassesToAdd);

  let divItem=document.createElement('div');  

  // if (!textChanged)
  //       listViewItem.innerText = tweetText; // normal text
  // else // HTML
  // { 
  //       listViewItem.innerText = "";
  //       listViewItem.innerHTML = replacedText;
  // }

  /*
  A Twitter handle starts with an `@` symbol and can only contain alpha-numeric characters. 
  When posting a new tweet to the timeline, turn handles into links. For example if a tweet contains @dmitrigrabov it should be turned into 
  '<a href="www.twitter.com/dmitrigrabov">@dmitrigrabov</a>'.
  */

  if (textChanged )
          processTwitterHandles(tweetText,divItem);
  else        
          divItem.innerText = tweetText;

  listViewItem.classList.add("normalText")

  // Add the <div> to the '<li>'.
  listViewItem.appendChild(divItem);

/*
ADD THE FOLLOWING
                <span class="badge bg-primary rounded-pill">
                    <i class="fa fa-trash" aria-hidden="true"></i>
                </span>
*/

  let myNewSpan = document.createElement("span");
  // Apply the necessary classes
  myNewSpan.classList.add(...spanClassesToAdd); 

  let myNewIcon = document.createElement("i");
  // Apply the necessary classes
  myNewIcon.classList.add("fa","fa-trash");
  myNewIcon.ariaHidden=true;

  // Each 'fa-trash <i>' should have an eventListener that will listen for clicks. 
  myNewIcon.addEventListener("click", trashFunction);
  // Add this to the '<span>'.
  myNewSpan.appendChild(myNewIcon);

  // Add this to the '<li>'.
  listViewItem.appendChild(myNewSpan);

  // Append to the list
  list.appendChild(listViewItem);

  // When new data is added, the div element auto-scrolls to the bottom.
  // This is how to achieve that:
  list.scrollTop = list.scrollHeight;
}

// For example, change any occurrence of  @dmitrigrabov into 
// <a href="www.twitter.com/dmitrigrabov">@dmitrigrabov</a>
// At this stage, there will be at least one Twitter Handles present
// Also change any occurrences of \n to <br>

function processTwitterHandles(tweetText,divItem) {
let regex = /@([_A-Z0-9]+)\b|\n/i 
while (true)
{
      let result = tweetText.match(regex);
      // Either \n or a Twitter handle
      if (!result)
      {
        // No further matches
          break
      }

      if (result.index > 0)
      {
          // handle the prefix text
          let aString = tweetText.substring(0,result.index);
          let paragraph = document.createElement("span");
          paragraph.innerText=aString;
          divItem.appendChild(paragraph); // add to <div>
      }
      
      if (result[0].length === 1) // matched \n
      {   // output <br>
                  let br = document.createElement("br");
                  divItem.appendChild(br); // add to <div>
      }
      else
      {     // a Twitter Handle
            // EG <a href="www.twitter.com/dmitrigrabov">@dmitrigrabov</a>
               let theLink = document.createElement("a");
            // MUST USE "https://" TO GET THE LINK TO PARSE PROPERLY!
               theLink.href = "https://www.twitter.com/" + result[1]; // first capturing group)        
       
               theLink.textContent = result[0]; // (full match)
               divItem.appendChild(theLink); // add to <div>
      }


      // remove BOTH prefix and matched string, and look for further matches
      tweetText = tweetText.substring(result.index + result[0].length)      
}

// Any text left over?
  if (tweetText.length !== 0) {
          let paragraph = document.createElement("span");
          paragraph.innerText=tweetText;
          divItem.appendChild(paragraph); // add to <div>
  }
}


// This function will take the value of the textarea field and add it as a new tweet to the bottom of the tweet list (timeline). 
// Also a delete icon will be added to each new tweet
function addNewTweet(event) {
  // The code below prevents the page from refreshing when we click the 'Add Tweet' button.
  event.preventDefault();
  // Write your code here... and remember to reset the input field to be blank after creating a tweet!
  let newTweetInput = document.getElementById("tweetInput")
  let inputText = newTweetInput.value.trim();
  if (!inputText || inputText.length > TWITTERLIMIT) // either null OR too long so do not add
  // however update display using the length of the trimmed input
  {
           if (newTweetInput.value !== inputText) 
                    newTweetInput.value = inputText;
           charCount = inputText.length;
           if (charCount > TWITTERLIMIT)
                charCount = TWITTERLIMIT;

           showRemainingChars();
           return;
  }

  // Reset input to blank
  newTweetInput.value = "";
  charCount=0;
  remainingLoc.innerText="";

  populateTweetList(inputText);
}


