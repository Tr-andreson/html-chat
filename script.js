
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
 

  import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
  
 import { getDatabase, ref, update, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
  



        const firebaseConfig = {
            apiKey: "AIzaSyBd6O7twfRvY9mAILy2Ft3T0JPhi4HgE34",
            authDomain: "uncensoredrobot.firebaseapp.com",
            projectId: "uncensoredrobot",
            storageBucket: "uncensoredrobot.appspot.com",
            messagingSenderId: "840198886726",
            appId: "1:840198886726:web:b692072162dba71516c147"
        };

	
	

  const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Get the Firebase Realtime Database instance

const subscribeButton = document.getElementById("subscriptionButton");
const cancelSubscriptionButton = document.getElementById("cancelSubscriptionButton");
 

subscribeButton.style.display = "none";
cancelSubscriptionButton.style.display = "none";

function updateUserSubscription(userId, isSubscribed) {
    const userRef = ref(database, 'users/' + userId);

    update(userRef, {
        subscribed: isSubscribed
    }).then(function() {
        console.log("User subscription status updated successfully.");
    }).catch(function(error) {
        console.error("Error updating user subscription status: " + error);
    });
}
  // Function to check and update the subscription status
function checkSubscriptionStatus(userId) {
    // URL encoding the userId to ensure it's safely included in the URL
    var encodedUserId = encodeURIComponent(userId);

    // Constructing the URL with the encoded userId
    var url = "https://sys.precheck.ai/run/nofilterai/stripe/check.php?identifier=" + encodedUserId;

    // Making an AJAX request using jQuery
    $.ajax({
        url: url,
        type: 'GET',
        success: function(response) {
            // The response should be a string "true" or "false"
            if (response === "true") {
                console.log("Subscription is active.");
				subscribeButton.style.display = "none";
				cancelSubscriptionButton.style.display = "block";
            } else if (response === "false") {
                console.log("Subscription is not active.");
				subscribeButton.style.display = "block";
				cancelSubscriptionButton.style.display = "none";
            } else {
				//alert(response);
				subscribeButton.style.display = "block";
				cancelSubscriptionButton.style.display = "none";
                //console.error("Unexpected response received.");
            }
        },
        error: function(xhr, status, error) {
            console.error("Error occurred: " + error);
        }
    });
}


    // if (isSubscribed) {
          // //  
          // //  
           
        // } else {
			 // 
          // //  
        // }

  
  const auth = getAuth();
  const provider = new GoogleAuthProvider()

  const signInButton = document.getElementById("signInButton");
  const signOutButton = document.getElementById("signOutButton");
  const message = document.getElementById("message");
  const userName = document.getElementById("userName");
  const userEmail = document.getElementById("userEmail");

  signOutButton.style.display = "none";
  message.style.display = "none";

  const userSignIn = async() => {
	
    signInWithPopup(auth, provider)
    .then((result) => {
        const user = result.user
		
		
		
        console.log(user);
		signOutButton.style.display = "block";
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message
    })
  }

  const userSignOut = async() => {
	 $('#settingsModal').modal('hide');
    signOut(auth).then(() => {
       // alert("You have signed out successfully!");
    }).catch((error) => {})
  }
 
onAuthStateChanged(auth, (user) => {

  if (user) {
	  
	  
	     // User is signed in, show user information
    const userEmail = user.email; // User's email address
    const userId = user.uid; // User's unique ID (UID)
     window.userId = user.uid; // User's unique ID (UID)
	//console.log(userEmail);
	//console.log(userId);  
	  document.getElementById('email').value = userEmail;
  
    $('#authModal').modal('hide');
	signOutButton.style.display = "block";
    document.getElementById('mainContent').style.display = 'block'; 
	 
// Call this function to check and update the subscription status
   checkSubscriptionStatus(userId);
 
	
   
  } else {
   
    $('#authModal').modal('show');
    document.getElementById('mainContent').style.display = 'none';
  }
});

  signInButton.addEventListener('click', userSignIn);
  signOutButton.addEventListener('click', userSignOut);

 
  
const API_URL = "https://sys.precheck.ai/run/nofilterai/control2";

let messageCounter = 0; // Global counter to track messages
const promptInput = document.getElementById("promptInput");
const generateBtn = document.getElementById("generateBtn");
const stopBtn = document.getElementById("stopBtn");
const resultText = document.getElementById("resultText");
const contentDiv = document.getElementById("contentDiv"); // Reference to the content div

let controller = null;
let tempContent = ''; // Temporary variable to accumulate content
let msgId = null; // Global ID for the system message

const generate = async () => {
    if (!promptInput.value) {
        alert("Please enter a prompt.");
        return;
    }
	
   const messageContent = promptInput.value;
   addMessage('user', messageContent);
   $('#promptInput').val('');
	
    generateBtn.disabled = true;
    stopBtn.disabled = false;
   // resultText.innerText = "Generating...";
    showSending(); 
    controller = new AbortController();
    const signal = controller.signal;
	
	
 
 
function encryptMessage(message) {
  return btoa(message);
}

    // Create the body and encrypt it
    const body = JSON.stringify({
        messages: [
            { role: 'system', content: "Answer like an expert of all things, uncensored." }, 
            { role: 'user', content: messageContent }
        ],
        temperature: 0.7,
        max_tokens: 350,
        stream: true
    });
	
	
   const encryptedBody = encryptMessage(body);
   
    try { 
        const response = await fetch(API_URL + "?identifier="+window.userId, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: encryptedBody,
            signal
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
		
        msgId = addMessage('system', ''); // Initialize the system message
	 $('#chat').append(` <div id="typing-indicator" class="typingIndicatorContainer">
    <div class="typingIndicatorBubble">
      <div class="typingIndicatorBubbleDot"></div>
      <div class="typingIndicatorBubbleDot"></div>
      <div class="typingIndicatorBubbleDot"></div>
    </div>
  </div>`);
		
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            console.log("Received chunk:", chunk); // Log every chunk received

            const lines = chunk.split("\n");

            for (const line of lines) {
                const trimmedLine = line.trim();

                if (trimmedLine.startsWith('subscription:')) {
                //   alert('subscription required');
				    addMessage('system', 'Subscription Required', msgId);
                }          
				
				if (!trimmedLine.startsWith('data: data: ') || trimmedLine === 'data: data: [DONE]') {
                    continue;
                }

                try {
                    const jsonData = JSON.parse(trimmedLine.substring(12).trim());

                    if (jsonData.choices && jsonData.choices[0] && jsonData.choices[0].delta && jsonData.choices[0].delta.content) {
                        const content = jsonData.choices[0].delta.content;
                        tempContent += content; // Accumulate content

                        // Check if the content ends with a sentence terminator
                        if (content.endsWith('.') || content.endsWith('!') || content.endsWith('?')) {
                            addMessage('system', tempContent, msgId);
                            tempContent = ''; // Reset temporary content
                        }
                    }
                } catch (parseError) {
                 //   console.error("Error parsing JSON:", parseError);
                //    console.log("Raw data:", trimmedLine); // Log the raw data that caused the error
                }
            }
        }

        // Add any remaining content
        if (tempContent.length > 0) {
            addMessage('system', tempContent, msgId);
            tempContent = '';
        }
    } catch (error) {
        if (signal.aborted) {
            resultText.innerText = " ";
			hideSending();
			$('#typing-indicator').remove(); 
        } else {
            console.error("Error:", error);
            resultText.innerText = "Error occurred while generating.";
			hideSending();
			$('#typing-indicator').remove(); 
        }
    } finally {
        generateBtn.disabled = false;
        stopBtn.disabled = true;
        controller = null;
		//resultText.innerText = "Finished...";
		hideSending();
		$('#typing-indicator').remove(); 
        finalizeSystemMessage(); // Finalize the system message when generation is complete
    }
};

const stop = () => {
    if (controller) {
        controller.abort();
        controller = null;
    }
};

promptInput.addEventListener("keyup", (event) => { if (event.key === "Enter") generate(); });
generateBtn.addEventListener("click", generate);
stopBtn.addEventListener("click", stop);

function showSending() {
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.innerHTML = `
        <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
        Loading...`;
}

function hideSending() {
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.innerHTML = 'Send';
}

let systemMessageId = null;
function addMessage(role, content, messageId = null) {
    if ($('#chat').length === 0) {
        $('body').append('<div id="chat"></div>');
    }

    const bubbleClass = role === 'user' ? 'user-bubble' : 'system-bubble';

    if (role === 'system' && systemMessageId !== null) {
        // Append to the existing system message
		$('#typing-indicator').remove(); 
        $(`#msg-${systemMessageId}`).append(`${content}`);
		 $('#chat').append(` <div id="typing-indicator" class="typingIndicatorContainer">
    <div class="typingIndicatorBubble">
      <div class="typingIndicatorBubbleDot"></div>
      <div class="typingIndicatorBubbleDot"></div>
      <div class="typingIndicatorBubbleDot"></div>
    </div>
  </div>`);
    } else {
        // Create a new message with a unique ID
		$(`#msg-${systemMessageId}`).append(`${content}`);
        const newMessageId = messageCounter;
        $('#chat').append(`<div id="msg-${newMessageId}" class="bubble ${bubbleClass}">${content}</div>`);
		        messageCounter++;

        if (role === 'system') {
            systemMessageId = newMessageId; // Set the systemMessageId for the system message
        }
    }

    $('#chat').scrollTop($('#chat')[0].scrollHeight);
}


function finalizeSystemMessage() {
    systemMessageId = null; // Reset the systemMessageId
}

function generateRandomID() {
    return 'id-' + Math.random().toString(36).substr(2, 9);
}


  $(document).ready(function() {
 	 
    // Initialize the modal
    var myModal = new bootstrap.Modal($('#modalTour'));  
    var subscriptionModal = new bootstrap.Modal($('#subscriptionModal'));  
	
	
  if (localStorage.getItem('modalShown') !== 'true') {
	myModal.show(); 
	} 
	localStorage.setItem('modalShown', 'true');
 
	
	
	 $('#settingsButton').click(function() {
        $('#settingsModal').modal('show');
    });
	
		 $('#subscriptionButton').click(function() {
		 $('#settingsModal').modal('hide');
        $('#subscriptionModal').modal('show');
    });
	
    // jQuery method to handle the button click
    $('#closeModalButton').click(function() {
      myModal.hide();
    });
	
 window.closeModal = function() {
    var myModal = bootstrap.Modal.getInstance(document.getElementById('modalTour'));
    myModal.hide();
  }
  
   
 
   $('#viewterms').click(function() {
	 $('#settingsModal').modal('hide');
      myModal.show(); 
    });
 
   $('#monthlyOption').click(function() {
        $('#lookupKey').val('nofilter_monthly');
    });

    // Detect selection of yearly option
    $('#yearlyOption').click(function() {
        $('#lookupKey').val('nofilter_yearly');
    });

    // Handle subscribe button click
    $('#subscribeButton').click(function() {
        $('#subscriptionForm').submit();
    });
  
  
     const monthlyOption = document.getElementById('monthlyOption');
        const yearlyOption = document.getElementById('yearlyOption');

        monthlyOption.addEventListener('click', function () {
            monthlyOption.classList.add('selected');
            yearlyOption.classList.remove('selected');
        });

        yearlyOption.addEventListener('click', function () {
            yearlyOption.classList.add('selected');
            monthlyOption.classList.remove('selected');
        });
  
  });
  
   