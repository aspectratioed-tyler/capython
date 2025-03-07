<template >
<div class="entire">
  <!-- First section(header)-->

  <div id="section1" class="section1">

    <h1>Welcome to</h1>
    <div id="shynecontainer">
    <h2 id="shyneheader">Shyne</h2>
    <img id="shynelogo" src="./assets/logorefined.webp" alt="">
    <a href="#section2"><img id="arrowdown" src="./assets/arrow_icon.svg" alt=""></a>
    </div>


  </div>

<!-- Second section-->
  <div id="section2" class="section2" >
    <div id="app">
    <div class="app-box">
    <h1>"Message of the Day"</h1>
    <p id="randomtext" v-if="randomComment">{{ randomComment }}</p>
    <p v-else>No comment yet.</p>

    </div>


    </div>

    <button id="writenow"><a href="#section3">Click to write your own message!</a></button>

    <img id="girlsmile" src="./assets/girlsmillling.svg" alt="">
</div>

<!-- Third section-->
  <div id="section3" class="section3">

  <div id="app">
    <div class="message-box">
    <h1>Write a message!</h1>
    <!-- Math question input -->
    <div v-if="mathQuestion">
      <label for="mathQuestion">What is {{ mathQuestion.num1 }} + {{ mathQuestion.num2 }}?</label>
      <input v-model="userAnswer" type="number" id="mathQuestion" />
    </div>
    <br />
    <!-- Comment input form -->
    <textarea id="userComment" v-model="userComment" placeholder="Right here..." rows="4" cols="50"></textarea>
    <br />

    <div class="popup" onclick="myFunction()"> <button id="submitnow" @click="submitComment" :disabled="!isHuman || !userComment.trim()">Submit</button>
  <span class="popuptext" id="myPopup">You’ve helped a soul today</span>
</div>


</div>

  </div>

  <img id="sunnymail" src="./assets/sunnymail.png" alt="">


  </div>




<!-- Fourth section-->
  <div id="section4" class="section4">
    <div class="split left">
      <div class="centered">   <p>Mental health awareness is vital to reducing stigma and supporting those in need. Mental health issues affect everyone, and recognizing them as medical conditions helps break down barriers. Open conversations and self-care practices, like exercise and stress management, are key in maintaining well-being. By raising awareness, we create a more supportive and understanding environment for all.</p>
    <button id="mentalbutton"><a href="https://www.quebec.ca/en/health/mental-health/finding-help-and-support-for-mental-health/finding-mental-health-help-and-support-resources/mental-health-help-and-support-resources">Learn more...</a></button>
    </div>

    </div>

  <div class=" split right">
    <div class="centered"><img id="sunnywalk" src="./assets/Sun_Color_Animation_ .gif" alt=""></div>

  </div>
  </div>


  <!-- Footer section-->

  <div id="footerbottom" class="footerbottom">
    <footer>
    <p id="copywrite-text">© 2025 Shyne All Rights Reserved.</p>
    <div class="socialmedias">

      <a href="https://www.figma.com/design/LFdXUE7c0TK57vQjZ5Xz0d/Capython?node-id=0-1&t=wWriA2baQSqVGdP8-1"><img id="tiktokimg" src="./assets/tiktok.svg" alt=""></a>

      <a href="https://www.figma.com/design/LFdXUE7c0TK57vQjZ5Xz0d/Capython?node-id=0-1&t=wWriA2baQSqVGdP8-1"><img id="igimg" src="./assets/shyneinstagram.svg" alt=""></a>


    </div>
  </footer>


  </div>




</div>

</template>

<script>
import { RouterLink, RouterView } from 'vue-router';
import axios from 'axios';

export default {
  data() {
    return {
      userComment: '',
      userAnswer: '',
      randomComment: null,
      isHuman: false,
      mathQuestion: null // Initially null, will be populated by server
    };
  },
  methods: {
  checkMathQuestion() {
    if (this.mathQuestion) {
      const correctAnswer = this.mathQuestion.num1 + this.mathQuestion.num2;
      this.isHuman = parseInt(this.userAnswer) === correctAnswer;

      // Debugging: Log the correct answer and user's answer
      console.log('Correct answer:', correctAnswer, 'User answer:', this.userAnswer);
    }
  },
  // Rest of the methods...
  async submitComment() {
  if (this.isHuman && this.userComment.trim()) {
    try {
      // Debugging: Log the values being sent
      console.log('Submitting comment with:', {
        comment: this.userComment,
        mathAnswer: this.userAnswer,
        mathQuestion: this.mathQuestion,
      });

      // Send the comment, answer, and math question to the backend
      const res = await axios.post('http://localhost:3000/add-comment', {
        comment: this.userComment,
        mathAnswer: this.userAnswer,
        mathQuestion: this.mathQuestion, // Include the math question
      });

      this.userComment = ''; // Clear input after submission
      this.userAnswer = ''; // Clear the answer input
      this.fetchRandomComment(); // Fetch a new random comment
      this.fetchMathQuestion(); // Fetch a new math question
    } catch (error) {
      console.error('Error submitting the comment:', error);
    }
  }
},
    async fetchRandomComment() {
      try {
        const response = await axios.get('http://localhost:3000/random-comment');
        this.randomComment = response.data.comment;
      } catch (error) {
        console.error('Error fetching random comment:', error);
      }
    },
    async fetchMathQuestion() {
      try {
        const response = await axios.get('http://localhost:3000/math-question');
        this.mathQuestion = response.data; // Set the math question from server
      } catch (error) {
        console.error('Error fetching math question:', error);
      }
    }
  },
  watch: {
    // Check the math question when the user input changes
    userAnswer(newAnswer) {
      this.checkMathQuestion();
    }
  },
  mounted() {
    this.fetchRandomComment(); // Fetch random comment on page load
    this.fetchMathQuestion(); // Fetch math question from backend
  }
};


// When the user clicks on div, open the popup
function myFunction() {
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}

document.addEventListener("scroll", function () {
    let section = document.querySelector("#section2");
    let position = section.getBoundingClientRect().top;

    if (position < window.innerHeight * 0.75) {
        section.classList.add("visible");
    }
});

</script>

<style>
/* fonts */
@font-face {
  font-family: 'Dillan';
  src: url('./assets/MADE Dillan PERSONAL USE.otf');
}

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400&display=swap');

/* colours */
:root {
    --white:#ffffff;
    --green:#CFDD2E;
    --pink:#FF98C7;
    --cream:#F7F4ED;
    --orange:#F98444;
    --blue:#6CCCEF;
}

/* section 1 */

.section1 {
  background-color: var(--green);
  background-size: 100%;
  height: 100vh;

}
.section1 h1 {
  font-family: 'Poppins', sans-serif;
  font-size: 50px;
  color: var(--white);
  text-align: center;
  padding-top: 100px;
}

#shynecontainer {
  display: flex;
  align-items: center; /* Align logo and text vertically */
  justify-content: center; /* Center horizontally */
  text-align: center;
  width: 100%; /* Ensure full width */
}

#shyneheader {
  font-family: 'Dillan';
  font-size: 300px;
  color: var(--cream);
  margin: 0;
}

#shynelogo {
  width: 150px;
  height: auto;
}

#arrowdown {
  width: 50px;
  height: auto;
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
}
#arrowdown:hover {
  transform: translateX(-50%) scale(1.2);
  transition: transform 0.3s ease-in-out;
  border-radius: 50%;
  background-color: var(--orange);
}



/* section 2 */


/* Section Styling with Grid */
/* Section Styling with Grid */
.section2 {
  display: grid;
  grid-template-columns: 1fr; /* Single column layout */
  grid-template-rows: auto auto auto; /* Rows for image, content, and button */
  align-items: center; /* Center items vertically */
  justify-items: center; /* Center items horizontally */
  text-align: center; /* Center text content */
  background-image: url("./assets/backgroundsect2.webp");
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  padding: 50px;
}

/* Smooth Scroll + Fade In Animation */
#section2 {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 1s ease-out, transform 1s ease-out;
}

#section2.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Heading Styling */
.section2 h1 {
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  font-size: 50px;
  color: var(--blue);
  padding-bottom: 20px;
}

/* Random Text */
#randomtext {
  font-family: 'Poppins', sans-serif;
  font-style: italic;
  font-size: 20px;
  color: var(--orange);
  padding: 20px;
}

/* Image Styling */
#girlsmile {
  width: 200px;
  height: auto;
}

/* Box Styling */
.app-box {
  background-color: #ffffff;
  padding: 20px;
  width: 800px;
  font-size: 1.2rem;
  border-radius: 50px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* Button Styling */
#writenow {
  background-color: var(--blue);
  height: 50px;
  width: 400px;
  border-radius: 50px;
  color: var(--white);
  font-size: 20px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Button Link */
#writenow a {
  text-decoration: none;
  color: var(--white);
  display: block;
  width: 100%;
  text-align: center;
  line-height: 50px;
}

/* Button Hover Effect */
#writenow:hover {
  background-color: var(--green);
}


/* section 3 */

/* Section Styling with Grid */
.section3 {
  display: grid;
  grid-template-columns: 1fr; /* Single column layout */
  grid-template-rows: auto auto auto auto; /* Rows for heading, content, form, and button */
  align-items: center; /* Center items vertically */
  justify-items: center; /* Center items horizontally */
  text-align: center; /* Center text content */
  background-color: var(--cream);
  height: 100vh;
  padding: 50px;
}

/* Heading Styling */
.section3 h1 {
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  font-size: 50px;
  color: var(--pink);
}

/* Input Styling */
#mathQuestion, #userComment {
  border-radius: 15px;
  padding: 10px;
  width: 60%;
  font-size: 1rem;
  text-align: center;
}

/* Message Box Styling */
.message-box {
  background-color: #ffffff;
  padding: 20px;
  width: 800px;
  font-size: 1.2rem;
  border-radius: 50px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* Popup Styling */
.popup {
  position: relative;
  display: inline-block;
  cursor: pointer;
  user-select: none;
}

.popup .popuptext {
  visibility: hidden;
  width: 160px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
}

.popup .popuptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.popup .show {
  visibility: visible;
  animation: fadeIn 1s;
}

@keyframes fadeIn {
  from {opacity: 0;}
  to {opacity: 1;}
}

/* Ensure label and input are stacked */
#mathQuestion {
  display: block; /* Makes the input field appear below the label */
  margin-top: 10px; /* Adds spacing between the equation and input box */
  width: 100%; /* Ensures consistent width */
  text-align: center; /* Centers text inside input */
}
p{
  font-family: 'Poppins', sans-serif;

}

/* Button Styling */
#submitnow {
  background-color: var(--pink);
  height: 50px;
  width: 200px;
  border-radius: 50px;
  color: var(--white);
  font-size: 20px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

#submitnow:hover {
  background-color: var(--green);
}

/* Image Styling */
#sunnymail {
  width: 300px;
  height: auto;
}


/* section 4 */
/* Split the screen in half */
.section4 {
  position: relative;
  height: 100vh; /* Set height to 100vh to ensure it takes up the full viewport height */

}

.section4 p {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  color: var(--white);
  padding: 20px;
}

.section4 .split {
  height: 100%;
  width: 50%;
  position: absolute;
  z-index: 1;
  top: 0;
  overflow-x: hidden;
}

#mentalbutton {
  background-color: var(--orange);
  height: 50px;
  width: 200px;
  border-radius: 50px;
  color: var(--white);
  font-size: 20px;
  border: none; /* Remove the border */
}

#mentalbutton a {
  text-decoration: none;
  color: var(--white);
}

#mentalbutton:hover {
  background-color: var(--green);
}

/* Control the left side */
.left {
  left: 0;
  background-color: var(--blue);
}

/* Control the right side */
.right {
  right: 0;
  background-color: var(--white);
}

/* If you want the content centered horizontally and vertically */
.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

/* Style the image inside the centered container, if needed */
.centered img {
  width: 150px;
  border-radius: 50%;
}

/* gif */
#sunnywalk{
height: auto;
width: 600px;
}



/* Footer */

.footerbottom {
  background-color: var(--pink);
  display: flex;
  justify-content: center; /* Centers the copyright text */
  align-items: center;
  padding: 10px 20px;
  width: 100%;
  position: relative; /* Helps with centering */
}
.socialmedias {
  display: flex;
  margin-left: auto; /* Pushes it to the right */
  padding-left: 30rem; /* Adjust padding to fit within the layout */
}

#copywrite-text {
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  color: var(--white);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  padding-top: 10px;

}


#tiktokimg {
  width: 40px;
  height: 40px;
  padding: 5px;
}

#igimg {
  width: 40px;
  height: 40px;
  padding: 5px;
}


</style>
