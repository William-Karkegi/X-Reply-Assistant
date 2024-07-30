// Importing environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Handles click events on the X page
 * @param {Event} event - The click event
 */
export function handleClick(event) {
  const clickTarget = event.target;

  if (
    clickTarget.className === "public-DraftStyleDefault-block public-DraftStyleDefault-ltr" ||
    clickTarget.className === "css-175oi2r r-xoduu5 r-xyw6el r-13qz1uu r-1e084wi"
  ) {
    const emotions = [
      "Positive",
      "One-word",
      "Very-short",
      "Positive-and-question",
      "Question",
      "Helpful",
      "Care",
      "Praise",
      "Love",
      "Haha",
      "Sad",
      "Angry",
      "Answer",
      "Answer-with-positive-sarcasm",
      "Thank-you",
      "Negative-No",
      "Disagree",
    ];
    emotions.forEach((emotion) => addButton(emotion));
    addTextInput();
  }
}

/**
 * Sets up the click listener on the document
 */
export function setupClickListener() {
  document.addEventListener("click", handleClick, true);
}

/**
 * Adds a button for a specific emotion
 * @param {string} emotion - The emotion for the button
 */
export function addButton(emotion) {
  const button = document.createElement("button");
  button.className = "mini-tweet-button-" + emotion;
  button.textContent = emotion;
  button.style.cursor = "pointer";
  button.style.background = "rgb(255, 122, 0)";
  button.style.padding = "2px 8px";
  button.style.margin = "5px";
  button.style.borderColor = "rgb(0, 0, 0, 0)";
  button.style.borderRadius = "9999px";

  button.onclick = function () {
    generateReply(emotion);
  };

  const targetDiv = document.querySelector(
    "div[class='css-175oi2r r-kemksi r-jumn1c r-xd6kpl r-gtdqiz r-ipm5af r-184en5c']"
  );
  if (!targetDiv) {
    return;
  }
  const buttonsContainer = targetDiv.querySelector(".mini-tweet-buttons-container");
  if (buttonsContainer && !buttonsContainer.querySelector(".mini-tweet-button-" + emotion)) {
    buttonsContainer.appendChild(button);
  } else if (!buttonsContainer) {
    const newButtonsContainer = document.createElement("div");
    newButtonsContainer.className = "mini-tweet-buttons-container";
    newButtonsContainer.style.display = "flex";
    newButtonsContainer.style.flexWrap = "wrap";
    newButtonsContainer.style.marginBottom = "-3px";
    targetDiv.appendChild(newButtonsContainer);
    newButtonsContainer.appendChild(button);
  }
}

/**
 * Adds text input fields for custom tweet and question
 */
export function addTextInput() {
  const input = document.createElement("input");
  input.className = "mini-tweet-input";
  input.type = "textarea";
  input.placeholder = "Enter your tweet here";
  input.style.width = "100%";
  input.style.padding = "5px";
  input.style.margin = "5px";

  const questionInput = document.createElement("input");
  questionInput.className = "mini-tweet-question-input";
  questionInput.type = "text";
  questionInput.placeholder = "Enter your question here";
  questionInput.style.width = "100%";
  questionInput.style.padding = "5px";
  questionInput.style.margin = "5px";

  const targetDiv = document.querySelector(
    "div[class='css-175oi2r r-kemksi r-jumn1c r-xd6kpl r-gtdqiz r-ipm5af r-184en5c']"
  );
  if (
    targetDiv &&
    !targetDiv.querySelector(".mini-tweet-input") &&
    !targetDiv.querySelector(".mini-tweet-question-input")
  ) {
    targetDiv.appendChild(input);
    targetDiv.appendChild(questionInput);
  }
}

/**
 * Generates a reply using OpenAI's API
 * @param {string} emotion - The emotion for the reply
 */
async function generateReply(emotion) {
  const tweetBox = document.querySelector('div[data-testid="tweetText"]');
  let text = "";
  let question = "";

  const input = document
    .querySelector("div[class='css-175oi2r r-kemksi r-jumn1c r-xd6kpl r-gtdqiz r-ipm5af r-184en5c']")
    .querySelector(".mini-tweet-input");
  const questionInput = document
    .querySelector("div[class='css-175oi2r r-kemksi r-jumn1c r-xd6kpl r-gtdqiz r-ipm5af r-184en5c']")
    .querySelector(".mini-tweet-question-input");

  if (input && input.value && input.value.length > 0) {
    text = input.value;
    question = `You are tasked with generating a tweet based on some initial content while adhering to a specific tone. Your goal is to create an engaging and natural-sounding tweet that captures the essence of the initial content while matching the desired tone.

      Here is the initial tweet content:
      <initial_content>
      ${text}
      </initial_content>

      The desired tone for the tweet is:
      <tone>
      ${emotion}
      </tone>

      To generate the tweet, follow these guidelines:
      1. Carefully read and understand the initial content and the specified tone.
      2. Identify the key message or main points in the initial content.
      3. Consider how a human would naturally express this message in the given tone.
      4. Rewrite the tweet, maintaining the core message while adjusting the language, style, and structure to match the desired tone.
      5. Ensure the tweet sounds conversational and authentic, avoiding overly formal or robotic language.
      6. Keep the tweet concise and impactful, ideally under 280 characters.
      7. If appropriate for the tone and content, consider adding relevant hashtags or mentions to increase engagement, but use them sparingly and naturally.
      8. Read your tweet aloud to yourself to check if it sounds like something a real person would say.

      Remember:
      - Stay true to the original message while adapting the style.
      - Use language and phrasing that aligns with the specified tone and feels natural.
      - Be mindful of Twitter's character limit and best practices for engagement.
      - Avoid using offensive or inappropriate language, regardless of the tone.
      - Don't overuse hashtags or mentions; include them only if they genuinely add value.
      - Avoid clichés, overly promotional language, or anything that sounds like spam.

      Please provide your generated tweet within <tweet> tags. Do not include any explanation or commentary outside of these tags.`;
  } else if (questionInput && questionInput.value && questionInput.value.length > 0) {
    question = `You are a social media expert tasked with creating an engaging, human-like tweet that incorporates a specific question while maintaining a given tone. Your goal is to make the tweet sound natural and conversational, as if written by a real person, not a bot.

      Here's the initial tweet content to work with:
      <initial_tweet>
      ${text}
      </initial_tweet>

      The question that needs to be incorporated into the tweet is:
      <question>
      ${question}
      </question>

      The tone of the tweet should be:
      <tone>
      ${emotion}
      </tone>

      To generate the tweet, follow these steps:
      1. Read the initial tweet content carefully and understand its main message.
      2. Consider how you can naturally weave the provided question into the existing content.
      3. Think about how a real person with the specified tone would express themselves on social media.
      4. Craft a tweet that sounds conversational and authentic, avoiding overly formal or robotic language.
      5. Ensure the question flows seamlessly with the rest of the content.
      6. Adjust the language and style to match the specified tone, but keep it natural.
      7. Make the tweet engaging and encourage interaction from readers in a way that feels genuine.

      Guidelines:
      - Keep the total tweet length under 280 characters.
      - Use hashtags sparingly and only if they truly fit the content and tone.
      - You may modify the initial content slightly to better incorporate the question and maintain the desired tone, but preserve the main message.
      - Avoid using excessive punctuation, all caps, or other patterns that might make the tweet seem bot-like.

      Please provide your generated tweet inside <tweet> tags. After the tweet, include a brief explanation (no more than 2-3 sentences) of how you incorporated the question and maintained the desired tone inside <explanation> tags.

      To help you craft a more human-like tweet, here are some examples of natural-sounding tweets:

      1. "Just finished binge-watching that new show everyone's talking about. Now I'm wondering, what's next on my watchlist? Any recommendations, folks? #TVAddict"

      2. "Whoa, did anyone else feel that earthquake just now? I swear my coffee mug did a little dance on my desk. Stay safe out there, everyone!"

      3. "Trying to decide between pizza or sushi for dinner tonight. Why is adulting so hard sometimes? 😂 What's your go-to when you can't make up your mind?"
      Remember, the key is to sound like a real person having a genuine conversation or sharing a thought. Avoid overly promotional language, robotic structures, or anything that sounds too perfect or polished. Let your tweet have a touch of personality and even slight imperfections that make it feel more human.`;
  } else {
    text = getTextFromChildren(tweetBox);

    question = `You are tasked with generating a human-like response to a tweet while maintaining a specific tone. Here's how to proceed:

      First, here's the content of the tweet you're responding to:
      <tweet_content>
      ${text}
      </tweet_content>

      The tone you should use in your response is:
      <tone>
      ${emotion}
      </tone>

      To generate an appropriate, human-like response:

      1. Analyze the tweet:
        - Identify the main topic or message
        - Note any specific points, questions, or emotions expressed
        - Consider the context and any cultural references

      2. Reflect on the specified tone:
        - Think about how a person would naturally express this tone in conversation
        - Consider subtle ways to convey the tone without being overly explicit

      3. Craft your response:
        - Address the main points of the original tweet in a conversational manner
        - Incorporate the specified tone naturally, as if you were chatting with a friend
        - Keep it concise and relevant, aiming for around 140-280 characters
        - Add a personal touch or relatable comment to make it feel more human
        - If appropriate, include a question or comment to encourage further interaction

      4. Review and refine your response:
        - Read it aloud to ensure it sounds natural and conversational
        - Check that it maintains the specified tone without feeling forced
        - Ensure it's within the character limit
        - Add small imperfections if needed (e.g., a common abbreviation, a casual phrase)

      5. Output your response:
        Provide your final tweet response inside <response> tags. Do not include any explanation or commentary outside of these tags.

      Remember, the goal is to create a response that feels genuine and human, not like a bot or spam. Avoid overly formal language, perfect grammar, or excessively enthusiastic responses unless they fit the specified tone and context..
      `;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: question }],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    insertReplyText(generatedText);
  } catch (error) {
    console.error("Error generating reply:", error);
    alert("An error occurred while generating the reply. Please try again.");
  }
}

/**
 * Inserts the generated reply text into the tweet box
 * @param {string} text - The generated reply text
 */
function insertReplyText(text) {
  const span2 = document.querySelector("span[data-offset-key]");
  if (span2) {
    const newSpan = document.createElement("span");
    newSpan.setAttribute("data-text", "true");
    newSpan.innerHTML = text;
    span2.replaceChild(newSpan, span2.children[0]);
    const e = document.getElementsByClassName("public-DraftStyleDefault-block public-DraftStyleDefault-ltr")[0];
    e.click();
    e.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

/**
 * Recursively gets text content from child nodes
 * @param {Node} node - The parent node
 * @returns {string} The concatenated text content
 */
function getTextFromChildren(node) {
  let text = "";
  node.childNodes.forEach((child) => {
    if (child.nodeName === "SPAN") {
      text += child.textContent;
    } else {
      text += getTextFromChildren(child);
    }
  });
  return text;
}
