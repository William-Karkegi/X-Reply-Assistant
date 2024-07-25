// Importing environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Handles click events on the Twitter page
 * @param {Event} event - The click event
 */
export function handleClick(event) {
  const clickTarget = event.target;

  if (
    clickTarget.className === "public-DraftStyleDefault-block public-DraftStyleDefault-ltr" ||
    clickTarget.className === "css-175oi2r r-xoduu5 r-xyw6el r-13qz1uu r-1e084wi"
  ) {
    const emotions = [
      "One-Liner",
      "Happy",
      "Agree",
      "Disagree",
      "Funny",
      "Sad",
      "Confused",
      "Surprised",
      "Curious",
      "Excited",
      "Question",
      "Answer",
      "Congrats",
      "Thanks",
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
    question = `Here is the text I want to tweet: ${text}. Please create a small tweet (15/30 words max) with the emotion ${emotion}.`;
  } else if (questionInput && questionInput.value && questionInput.value.length > 0) {
    question = `Here is the question I want to ask: ${questionInput.value}. And here is the tweet I want to answer: ${text}. Please create a small answer (10/15 words max) with the emotion ${emotion}.`;
  } else {
    text = getTextFromChildren(tweetBox);
    question = `Here is the text of the tweet: ${text}. Please create a small answer (10/15 words max) with the emotion ${emotion}.`;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
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
