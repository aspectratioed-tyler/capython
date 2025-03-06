<template>
  <!-- First section(header)-->

  <div class="section1">

    <h1>Welcome to</h1>
    <h2 id="shyneheader">shyne</h2>
    <img src="./assets/shynelogo.png" alt="">
    <a href="#section2"><img id="arrowdown" src="./assets/arrow_icon.svg" alt=""></a>

  </div>

  <div class="section2" >


  <div id="app">
    <h1>Random Comment Generator</h1>
    <!-- Math question input -->
    <div v-if="mathQuestion">
      <label for="mathQuestion">What is {{ mathQuestion.num1 }} + {{ mathQuestion.num2 }}?</label>
      <input v-model="userAnswer" type="number" id="mathQuestion" />
    </div>
    <br />

    <button @click="submitComment" :disabled="!isHuman || !userComment.trim()">Submit Comment hahaha</button>

    <h2>Random Comment:</h2>
    <p v-if="randomComment">{{ randomComment }}</p>
    <p v-else>No comment yet.</p>
  </div>
    <!-- Comment input form -->
    <textarea v-model="userComment" placeholder="Write a comment..." rows="4" cols="50"></textarea>
    <br />




  </div>

  <div class="section3">



  </div>

  <div class="section4">
    <div class="left">
      <div class="centered">   <p>Mental health awareness is vital to reducing stigma and supporting those in need. Mental health issues affect everyone, and recognizing them as medical conditions helps break down barriers. Open conversations and self-care practices, like exercise and stress management, are key in maintaining well-being. By raising awareness, we create a more supportive and understanding environment for all.</p>
    <button id="mentalbutton"><a href="https://www.quebec.ca/en/health/mental-health/finding-help-and-support-for-mental-health/finding-mental-health-help-and-support-resources/mental-health-help-and-support-resources"></a>Learn more...</button>
    </div>

    </div>

  <div class="right">
    <div class="centered"><img src="" alt="sungif"></div>


  </div>


  </div>

  <div class="footerbottom">
    <footer>
      <p id="copywrite-text">© 2025 Shyne All Rights Reserved.</p>
    <div class="socialmedias">
    <img src="./assets/tiktok.svg" alt="https://www.figma.com/design/LFdXUE7c0TK57vQjZ5Xz0d/Capython?node-id=231-3&t=wWriA2baQSqVGdP8-1">
    <img src="./assets/shyneinstagram.svg" alt="https://www.figma.com/design/LFdXUE7c0TK57vQjZ5Xz0d/Capython?node-id=231-4&t=wWriA2baQSqVGdP8-1">
    </div>
  </footer>


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
</script>

<style>
:root {
    --white:#F0F0F0;
    --green:#CFDD2E;
    --pink:#FF98C7;
    --cream:#F7F4ED;
    --orange:#F98444;
    --blue:#6CCCEF;
}

.section1 {
  background-color: var(--green);
}

.section3 {
  background-color: var(--cream);

}



</style>
