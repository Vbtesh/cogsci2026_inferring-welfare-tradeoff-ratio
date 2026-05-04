//  var jsPsych = initJsPsych({
//   on_finish: function () {jsPsych.data.displayData()}
//  });

//  timeline = []

////////////////////////////////////////////////////////////////////////
//   THIS IS FOR WHEN WE UPLOAD TO SERVER NOT FOR RUNNING LOCALLY      //
///////////////////////////////////////////////////////////////////////
 var jsPsych = initJsPsych({
  on_finish: async function() {

  } 
});

timeline = [] // empty list for experiment trials

// Helps save_data to try again if data saving fails
async function fetch_with_retry(...args) {
  let count = 0;
  while(count < 3) {
    try {
      console.log('Trying to call php file to save data');
      let response = await fetch(...args);
      if (response.status !== 200) {
          throw new Error("Didn't get 200 Success");
      }
      return response;
      } catch(error) {
      console.log(error);
      }
      count++;
      await new Promise(x => setTimeout(x, 250));
  }
  throw new Error("Too many retries");
}
//----Save Data----//
async function save_data(name, data_in){
  var url = 'save_data.php';
  var data_to_send = {filename: name, filedata: data_in};
  await fetch_with_retry(url, {
      method: 'POST',
      body: JSON.stringify(data_to_send),
      headers: new Headers({
              'Content-Type': 'application/json'
      })
  });
}

// Add custom CSS for larger Likert scale buttons
var custom_css = document.createElement('style');
custom_css.innerHTML = `
  .jspsych-survey-likert-opts {
    font-size: 14px !important;
  }
  
  .jspsych-survey-likert-opts input[type="radio"] {
    transform: scale(1.2);
    margin: 10px;
  }
  
  .jspsych-survey-likert-opts label {
    padding: 10px;
    margin: 5px;
    display: inline-block;
    text-align: center;
  }
  
  .jspsych-survey-likert-opt {
    text-align: center;
  }
`;
document.head.appendChild(custom_css);

//---------Enter Prolific ID ----------//
var prolific_id = {
  type: jsPsychSurveyHtmlForm,
  html: `
    <h3 style='text-align: center;'>Please enter your Prolific ID in the box below:</h3>
    <p style='text-align: center;'>
      <input name='prolific_id' type='text' required />
    </p>`, 
  button_label: "Continue", 
  required: true,
  name: 'prolific_id'
}

// //------Consent and Information and Cover Story------//
var info_page_html = {
    type: jsPsychHtmlButtonResponse,
    stimulus: consent_text,
    choices: ['Next']
  };
  
var instructions_page_html = {
    type: jsPsychHtmlButtonResponse,
    stimulus: instructions_text,
    choices: ['Next']
}

var cover_story_text_page = {
  type: jsPsychHtmlButtonResponse,
  stimulus: cover_story_text,
  choices: ['Next']
}

//////////////////////////////////////////////////////////////////////////////////////
///////                   URN PARAMETERS                        //////////////////////
//////////////////////////////////////////////////////////////////////////////////////
var background_ball_color = '#CBCDCD';
var urn_background_color = "white";

// Define soft colors for balls
var soft_orange = '#FFB74D';
var soft_blue = '#64B5F6';

// Randomly assign ball colors to values (between-subjects)
var color_assignment = jsPsych.randomization.sampleWithoutReplacement([
  { low_value_color: soft_orange, high_value_color: soft_blue },
  { low_value_color: soft_blue, high_value_color: soft_orange }
], 1)[0];

var low_value_color = color_assignment.low_value_color;
var high_value_color = color_assignment.high_value_color;

// Add to data
jsPsych.data.addProperties({
  low_value_color: low_value_color,
  high_value_color: high_value_color
});

// Randomly assign participant to poor or rich condition
var condition = jsPsych.randomization.sampleWithoutReplacement(['poor', 'rich'], 1)[0];

// Poor condition: 8 low-value balls ($20) and 2 high-value balls ($100)
var poor_urn = {
  ball_color: low_value_color,
  is_result_color: false,
  n_colored_balls: 8,
  n_balls: 10,
  background_ball_color: high_value_color,
  background_color: urn_background_color,
  width: 15,
  coords: [40, 20],
  id: 'poor_urn',
  value_colored: 20,
  value_background: 100
};

// Rich condition: 8 high-value balls ($100) and 2 low-value balls ($20)
var rich_urn = {
  ball_color: high_value_color,
  is_result_color: false,
  n_colored_balls: 8,
  n_balls: 10,
  background_ball_color: low_value_color,
  background_color: urn_background_color,
  width: 15,
  coords: [40, 20],
  id: 'rich_urn',
  value_colored: 100,
  value_background: 20
};

var participant_urn = (condition === 'poor') ? poor_urn : rich_urn;

// Add condition to data
jsPsych.data.addProperties({
  wealth_condition: condition
});

//////////////////////////////////////////////////////////////////////////////////////
///////           BALL SELECTION CONDITIONS                     //////////////////////
//////////////////////////////////////////////////////////////////////////////////////
var poor_urn_selects_low = {
  ...poor_urn,
  selected_ball: low_value_color,
  selected_value: 20,
  id: 'poor_selects_low'
};

var poor_urn_selects_high = {
  ...poor_urn,
  selected_ball: high_value_color,
  selected_value: 100,
  id: 'poor_selects_high'
};

var rich_urn_selects_high = {
  ...rich_urn,
  selected_ball: high_value_color,
  selected_value: 100,
  id: 'rich_selects_high'
};

var rich_urn_selects_low = {
  ...rich_urn,
  selected_ball: low_value_color,
  selected_value: 20,
  id: 'rich_selects_low'
};


//////////////////////////////////////////////////////////////////////////////////////
///////           DONATION PERCENTAGE CONDITIONS                //////////////////////
//////////////////////////////////////////////////////////////////////////////////////

var donation_percentages = [0, 15, 25, 50, 75, 100];

function calculateDonation(selected_value, percentage) {
  return (selected_value * percentage) / 100;
}

function getDonationText(selected_value, percentage) {
  var donation_amount = calculateDonation(selected_value, percentage);
  return `Alice donates ${percentage}% of her money ($${donation_amount} out of $${selected_value}).`;
}

//////////////////////////////////////////////////////////////////////////////////////
///////           URN VISUALIZATION FUNCTION                    //////////////////////
//////////////////////////////////////////////////////////////////////////////////////

function createUrnVisualization(urn, shuffled_balls) {
  let balls = shuffled_balls || [];
  
  // Only generate and shuffle if balls weren't provided
  if (balls.length === 0) {
    // Add colored balls
    for (let i = 0; i < urn.n_colored_balls; i++) {
      balls.push(urn.ball_color);
    }
    
    // Add background balls
    for (let i = 0; i < (urn.n_balls - urn.n_colored_balls); i++) {
      balls.push(urn.background_ball_color);
    }
    
    // Shuffle balls
    balls = jsPsych.randomization.shuffle(balls);
  }
  
  let ballsHTML = balls.map(color => 
    `<div class="urn-ball" style="background-color: ${color};"></div>`
  ).join('');
  
  return {
    html: `
      <div class="urn-container" style="background-image: url('gumball_machine.png');">
        <div class="urn-balls">
          ${ballsHTML}
        </div>
      </div>
    `,
    balls: balls  // Return the ball arrangement for reuse
  };
}

//////////////////////////////////////////////////////////////////////////////////////
///////           AGENT NAME SELECTION                          //////////////////////
//////////////////////////////////////////////////////////////////////////////////////
const names = [
  "Alice", "Sophia", "Emma",
  "Olivia", "Ava", "Isabella",
  "Mia", "Charlotte", "Amelia",
  "Julia", "Mary", "Patricia",
  "Jennifer", "Linda", "Elizabeth",
  "Barbara", "Susan", "Jessica",
  "Sarah", "Lisa" ,"Nancy",
   "Betty", "Margaret", "Stephanie",
  // "Laura", "Kimberly", "Deborah",
  // "Rachel", "Amy", "Nicole",
  // "Katherine", "Samantha", "Christine",
  // "Michelle", "Dorothy", "Diana",
  // "Emily", "Hannah", "Megan", "Rebecca"
];
// Shuffle names and assign one to each trial sequence
var shuffled_names = jsPsych.randomization.shuffle(names);

////////////////////////////////////////////////////////////////////////////////////
///////           HELPER FUNCTION TO GET COLOR LABEL         //////////////////////
//////////////////////////////////////////////////////////////////////////////////////
function getColorLabel(color) {
  return color === soft_orange ? 'Orange' : 'Blue';
}

//////////////////////////////////////////////////////////////////////////////////////
///////           RANDOMIZE QUESTION ORDER (BETWEEN SUBJECTS)   //////////////////////
//////////////////////////////////////////////////////////////////////////////////////

// Define the three questions
const question_empathy = {
  prompt: (agent_name) => `<p style='font-size: 18px; margin-top: 30px;'>How much empathy do you think ${agent_name} feels towards you?</p>`,
  name: 'empathy_rating',
  labels: [
    "1<br>Not at all",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7<br>Extremely"
  ],
  required: true
};

// const question_presentational = {
//   prompt: (agent_name) => `<p style='font-size: 18px; margin-top: 30px;'>How much do you think ${agent_name} cares about being <b>seen</b> as a good person?</p>`,
//   name: 'presentational_goals_rating',
//   labels: [
//     "1<br>Not at all",
//     "2",
//     "3",
//     "4",
//     "5",
//     "6",
//     "7<br>Very much"
//   ],
//   required: true
// };

const question_welfare = {
  prompt: (agent_name) => `<p style='font-size: 18px; margin-top: 30px;'>How much do you think ${agent_name} cares about you?</p>`,
  name: 'welfare_tradeoff_rating',
  labels: [
    "1<br>Not at all",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7<br>Very much"
  ],
  required: true
};

// Randomize question order ONCE per participant
const question_order = jsPsych.randomization.shuffle([
  question_empathy,
  //question_presentational,
  question_welfare
]);

// Store the order in the data
jsPsych.data.addProperties({
  question_order: question_order.map(q => q.name).join(',')
});

//////////////////////////////////////////////////////////////////////////////////////
///////           EXAMPLE TRIAL SEQUENCE                        //////////////////////
//////////////////////////////////////////////////////////////////////////////////////
// Create a single example trial to show participants how it works
function createExampleTrial() {
  // Use example values
  var example_name = "Sarah";
  var example_knows_endowment = true;
  var example_donation_pct = 50;
  var example_selected_value = 20;
  var example_ball_color = low_value_color; 
  
  // Generate urn visualization for example
  var example_urn_viz = createUrnVisualization(participant_urn);
  var example_urn_html = example_urn_viz.html;
  
  // Example Trial 1: Show the urn with cover story context
  var example_show_urn = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
      return `
        <div style="text-align: center;">
          <h2 style="color: #d9534f; margin-bottom: 15px;">EXAMPLE TRIAL</h2>
          <div style="background: #f0f8ff; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="margin: 0; color: #2c3e50;">Step 1: The Raffle Draw</h3>
            <p style="margin: 10px 0 0 0;">Watch as ${example_name} <b>randomly</b> draws one ball from the raffle machine below</p>
            <p style="margin: 5px 0; font-size: 14px; color: #666;">The ball color determines the total prize amount she can split with you</p>
          </div>
          
          <div style="margin: 30px auto; max-width: 400px;">
            ${example_urn_html}
          </div>
          <div style="margin-top: 20px; font-size: 18px;">
            <p><span class="ball-legend" style="background-color: ${low_value_color};"></span> ${getColorLabel(low_value_color)} ball = $20</p>
            <p><span class="ball-legend" style="background-color: ${high_value_color};"></span> ${getColorLabel(high_value_color)} ball = $100</p>
          </div>
        </div>
      `;
    },
    choices: [' '],
    prompt: '<p>Press SPACE to see which ball Sarah draws</p>',
    data: {
      phase: 'example_trial',
      trial_type: 'show_urn'
    }
  };
  
  
  // Example Trial 2: Show ball selection with cover story context
  var example_show_selection = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
      var ball_display = `<div style="display: inline-block; width: 60px; height: 60px; background-color: ${example_ball_color}; border-radius: 50%; border: 2px solid #333;"></div>`;
      return `
        <div style="text-align: center;">
          <h2 style="color: #d9534f; margin-bottom: 15px;">EXAMPLE TRIAL</h2>
          <div style="background: #f0f8ff; padding: 15px; border-radius: 10px; margin-bottom: 10px;">
            <h3 style="margin: 0; color: #2c3e50;">Step 1: The Raffle Draw - Result</h3>
            <p style="margin: 10px 0 0 0;">${example_name} <b> randomly </b>drew a ball from the raffle machine</p>
          </div>
          
          <div style="background: #fffacd; padding: 10px; border-radius: 8px; margin: 15px auto; max-width: 600px;">
            <p style="margin: 0; font-weight: bold;">You will either see which ball is drawn or not</p>
          </div>
          
          <div style="border: 2px solid #333; border-radius: 10px; padding: 20px; margin: 15px auto; max-width: 800px; background-color: #f9f9f9;">
            <div style="display: flex; justify-content: center; align-items: flex-start; gap: 50px;">
              <div style="text-align: center;">
                ${example_urn_html}
                <div style="margin-top: 5px; font-size: 16px;">
            <p><span class="ball-legend" style="background-color: ${low_value_color};"></span> ${getColorLabel(low_value_color)} ball = $20</p>
            <p><span class="ball-legend" style="background-color: ${high_value_color};"></span> ${getColorLabel(high_value_color)} ball = $100</p>
                </div>
              </div>
              <div style="text-align: center; padding-top: 50px;">  
                <h3 style="margin-top: 0; margin-bottom: 20px;">${example_name} received this ball:</h3>
                ${ball_display}
                <p style="margin-top: 20px; font-size: 20px;">She received <strong>$${example_selected_value}</strong></p>
              </div>
            </div>
          </div>
        </div>`;
    },
    choices: [' '],
    prompt: '<p>Press SPACE to see how Sarah splits the prize</p>',
    data: {
      phase: 'example_trial',
      trial_type: 'ball_selection'
    }
  };

  // Example Trial 3: Show donation info with cover story context
  var example_show_donation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
      var donation_amount = calculateDonation(example_selected_value, example_donation_pct);
      var ball_display = `<div style="display: inline-block; width: 60px; height: 60px; background-color: ${example_ball_color}; border-radius: 50%; border: 2px solid #333;"></div>`;
      
      return `
        <div style="text-align: center;">
          <h2 style="color: #d9534f; margin-bottom: 15px;">EXAMPLE TRIAL</h2>
          <div style="background: #f0f8ff; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="margin: 0; color: #2c3e50;">Step 2: The Sharing Decision</h3>
            <p style="margin: 10px 0 0 0;">${example_name} decides how to split the prize with you</p>
          </div>
          
          <div style="background: #fffacd; padding: 15px; border-radius: 8px; margin: 15px auto; max-width: 700px;">
            <div style="text-align: center;">
              <p style="margin: 8px 0; font-size: 15px; line-height: 1.4;">You will be told how much money she shared with you</p>
            </div>
          </div>
          
          <div style="border: 2px solid #333; border-radius: 10px; padding: 20px; margin: 20px auto; max-width: 800px; background-color: #f9f9f9;">
            <div style="display: flex; justify-content: center; align-items: flex-start; gap: 50px;">
              <div style="text-align: center;">
                ${example_urn_html}
                <div style="margin-top: 5px; font-size: 16px;">
            <p><span class="ball-legend" style="background-color: ${low_value_color};"></span> ${getColorLabel(low_value_color)} ball = $20</p>
            <p><span class="ball-legend" style="background-color: ${high_value_color};"></span> ${getColorLabel(high_value_color)} ball = $100</p>
                </div>
              </div>
              <div style="text-align: center; padding-top: 50px;">  
                <h3 style="margin-top: 0; margin-bottom: 20px;">${example_name} received this ball:</h3>
                ${ball_display}
                <p style="margin-top: 20px; font-size: 20px; margin-bottom: 25px;">She received <strong>$${example_selected_value}</strong></p>
                <p style="font-size: 20px; margin: 15px 0; font-weight: bold; color: #2e7d32;">
                  ${example_name} shares <strong>$${donation_amount}</strong> with you
                </p>
              </div>
            </div>
          </div>
        </div>`;
    },
    choices: [' '],
    prompt: '<p>Press SPACE to share your thoughts about this decision</p>',
    data: {
      phase: 'example_trial',
      trial_type: 'donation_info'
    }
  };

  // Example Trial 4: Show ratings with cover story context
  var example_ratings = {
    type: jsPsychSurveyLikert,
    preamble: function() {
      var donation_amount = calculateDonation(example_selected_value, example_donation_pct);
      var ball_display = `<div style="display: inline-block; width: 60px; height: 60px; background-color: ${example_ball_color}; border-radius: 50%; border: 2px solid #333;"></div>`;
      
      return `
        <div style="text-align: center;">
          <h2 style="color: #d9534f; margin-bottom: 15px;">EXAMPLE TRIAL</h2>
          <div style="background: #f0f8ff; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="margin: 0; color: #2c3e50;">Step 3: Your Response</h3>
            <p style="margin: 10px 0 0 0;">Share your thoughts about ${example_name}'s decision</p>
          </div>
          
          <div style="border: 3px solid #333; border-radius: 10px; padding: 20px; margin: 20px auto; max-width: 800px; background-color: #f9f9f9;">
            <div style="display: flex; justify-content: center; align-items: flex-start; gap: 50px;">
              <div style="text-align: center;">
                ${example_urn_html}
                <div style="margin-top: 5px; font-size: 16px;">
            <p><span class="ball-legend" style="background-color: ${low_value_color};"></span> ${getColorLabel(low_value_color)} ball = $20</p>
            <p><span class="ball-legend" style="background-color: ${high_value_color};"></span> ${getColorLabel(high_value_color)} ball = $100</p>
                </div>
              </div>
              <div style="text-align: center; padding-top: 50px;">  
                <h3 style="margin-top: 0; margin-bottom: 20px;">${example_name} received this ball:</h3>
                ${ball_display}
                <p style="margin-top: 20px; font-size: 20px; margin-bottom: 25px;">She received <strong>$${example_selected_value}</strong></p>
                <p style="font-size: 20px; margin: 15px 0; font-weight: bold; color: #2e7d32;">
                  ${example_name} shares $${donation_amount} with you
                </p>
              </div>
            </div>
          </div>
          
          <div style="background: #fffacd; padding: 10px; border-radius: 8px; margin: 30px auto 20px auto; max-width: 600px;">
            <p style="margin: 0; font-size: 15px;">You will be asked the following questions</p>
          </div>
        </div>`;
    },
    questions: question_order.map(q => ({
      prompt: q.prompt(example_name),
      name: q.name,
      labels: q.labels,
      required: true
    })),
    data: {
      phase: 'example_trial',
      trial_type: 'ratings'
    }
  };
  
  return [example_show_urn, example_show_selection, example_show_donation, example_ratings];
}

// Create transition screen after example
var start_experiment_transition = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div style="text-align: center; margin-top: 100px;">
      <h2>You have completed the example trial!</h2>
      <p style="font-size: 18px; margin: 40px auto; max-width: 600px;">
        You will now begin the actual experiment. You will see 24 different scenarios,
        each with a <b>different</b> person and raffle machine.
      </p>
      <p style="font-size: 18px; margin: 40px auto; max-width: 600px;">
        Please answer each question based on the information shown in that specific scenario.
      </p>
    </div>
  `,
  choices: ['Start Experiment'],
  data: {
    phase: 'start_experiment_transition'
  }
};

//////////////////////////////////////////////////////////////////////////////////////
///////           TRIAL TIMELINE STRUCTURE                      //////////////////////
//////////////////////////////////////////////////////////////////////////////////////
// Modified trial sequence function - REMOVED observation_aware parameter
function createTrialSequenceWithParams(knows_endowment, donation_pct, selected_value, ball_color, congruence, agent_name) {
  
  // Generate the urn visualization ONCE for this trial sequence
  var urn_viz = createUrnVisualization(participant_urn);
  var urn_html = urn_viz.html;
  var shuffled_balls = urn_viz.balls;

   // Determine ball type based on selected value
   var ball_type = (selected_value === 20) ? 'low_value' : 'high_value';
  
   // Determine if this is expected or unexpected based on urn type
   var is_expected = (condition === 'poor' && ball_type === 'low_value') || 
                     (condition === 'rich' && ball_type === 'high_value');

  // Trial 1: Show the urn
  var show_urn = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
      return `
        <div style="text-align: center;">
          <h3>${agent_name} will randomly receive one ball from the raffle machine below</h3>
          <div style="margin: 30px auto; max-width: 400px;">
            ${urn_html}
          </div>
          <div style="margin-top: 20px; font-size: 18px;">
            <p><span class="ball-legend" style="background-color: ${low_value_color};"></span> ${getColorLabel(low_value_color)} ball = $20</p>
            <p><span class="ball-legend" style="background-color: ${high_value_color};"></span> ${getColorLabel(high_value_color)} ball = $100</p>
          </div>
        </div>
      `;
    },
    choices: [' '],
    prompt: '<p>Press SPACE to continue</p>',
    data: {
      phase: 'show_urn',
      agent_name: agent_name,
      urn_type: condition, // 'poor' or 'rich'
      ball_selected: ball_type, // 'low_value' or 'high_value'
      ball_value: selected_value, // 20 or 100
      is_expected_draw: is_expected, // true if matches urn probability
      congruence: congruence, // keeping this for your reference
      knows_endowment: knows_endowment,
      donation_percentage: donation_pct
    }
  };
  
  // Trial 2: Show/don't show ball selection
  var show_selection = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
      if (knows_endowment) {
        var ball_display = `<div style="display: inline-block; width: 60px; height: 60px; background-color: ${ball_color}; border-radius: 50%; border: 2px solid #333;"></div>`;
        return `<div style="text-align: center;">
          <div style="display: flex; justify-content: center; align-items: flex-start; gap: 50px; margin-top: 30px;">
            <div style="text-align: center;">
              ${urn_html}
              <div style="margin-top: 5px; font-size: 16px;">
              <p><span class="ball-legend" style="background-color: ${low_value_color};"></span> ${getColorLabel(low_value_color)} ball = $20</p>
              <p><span class="ball-legend" style="background-color: ${high_value_color};"></span> ${getColorLabel(high_value_color)} ball = $100</p>
              </div>
            </div>
            <div style="text-align: center; margin-top: 120px;">
              <h3 style="margin-top: 0; margin-bottom: 20px;">${agent_name} received this ball:</h3>
              ${ball_display}
              <p style="margin-top: 20px;">${agent_name} received <strong>$${selected_value}</strong>.</p>
            </div>
          </div>
        </div>`;
      } else {
        return `<div style="text-align: center;">
          <div style="display: flex; justify-content: center; align-items: flex-start; gap: 50px; margin-top: 30px;">
            <div style="text-align: center;">
              ${urn_html}
              <div style="margin-top: 5px; font-size: 16px;">
              <p><span class="ball-legend" style="background-color: ${low_value_color};"></span> ${getColorLabel(low_value_color)} ball = $20</p>
              <p><span class="ball-legend" style="background-color: ${high_value_color};"></span> ${getColorLabel(high_value_color)} ball = $100</p>
              </div>
            </div>
            <div style="text-align: center; margin-top: 120px;">
              <h3 style="margin-top: 0; margin-bottom: 20px;">${agent_name} received a ball</h3>
              <div style="display: inline-block; width: 60px; height: 60px; background-color: #ddd; border-radius: 50%; border: 2px solid #333; line-height: 60px; font-size: 30px;">?</div>
              <p style="margin-top: 18px;">You do not see which ball she received</p>
            </div>
          </div>
        </div>`;
      }
    },
    choices: [' '],
    prompt: '<p>Press SPACE to continue</p>',
    data: {
      phase: 'ball_selection',
      agent_name: agent_name,
      urn_type: condition,
      ball_selected: ball_type,
      ball_value: selected_value,
      is_expected_draw: is_expected,
      congruence: congruence,
      knows_endowment: knows_endowment,
      selected_ball_color: ball_color
    }
  };
    
  // Trial 3: Show donation info (REMOVED observation awareness text)
  var show_donation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
      var donation_amount = calculateDonation(selected_value, donation_pct);
      
      var ball_display;
      if (knows_endowment) {
        ball_display = `<div style="display: inline-block; width: 60px; height: 60px; background-color: ${ball_color}; border-radius: 50%; border: 2px solid #333;"></div>`;
      } else {
        ball_display = `<div style="display: inline-block; width: 60px; height: 60px; background-color: #ddd; border-radius: 50%; border: 2px solid #333; line-height: 60px; font-size: 30px;">?</div>`;
      }
      
      return `<div style="text-align: center;">
        <div style="display: flex; justify-content: center; align-items: flex-start; gap: 50px; margin-top: 30px;">
          <div style="text-align: center;">
            ${urn_html}
            <div style="margin-top: 5px; font-size: 16px;">
              <p><span class="ball-legend" style="background-color: ${low_value_color};"></span> ${getColorLabel(low_value_color)} ball = $20</p>
              <p><span class="ball-legend" style="background-color: ${high_value_color};"></span> ${getColorLabel(high_value_color)} ball = $100</p>
            </div>
          </div>
          <div style="text-align: center; padding-top: 50px;">  
            <h3 style="margin-top: 0; margin-bottom: 20px;">${agent_name} received this ball:</h3>
            ${ball_display}
            ${knows_endowment ? `<p style="margin-top: 20px; font-size: 18px; margin-bottom: 25px;">${agent_name} received <strong>$${selected_value}</strong></p>` : `<p style="margin-top: 20px; font-size: 16px; margin-bottom: 25px;">You do not see which ball she received</p>`}
            <div style="border: 2px solid #333; border-radius: 8px; padding: 15px; margin: 20px 0; background-color: #f9f9f9; display: inline-block;">
              <p style="font-size: 20px; margin: 10px 0; font-weight: bold; color: #2e7d32;">${agent_name} shares $${donation_amount} with you</p>
            </div>
          </div>
        </div>
      </div>`;
    },
    choices: [' '],
    prompt: '<p>Press SPACE to continue</p>',
    data: {
      phase: 'donation_info',
      agent_name: agent_name,
      urn_type: condition,
      ball_selected: ball_type,
      ball_value: selected_value,
      is_expected_draw: is_expected,
      congruence: congruence,
      donation_percentage: donation_pct,
      donation_amount: calculateDonation(selected_value, donation_pct),
      knows_endowment: knows_endowment
    }
  };
    
  // Trial 4: Combined ratings (REMOVED observation awareness text)
  var combined_ratings = {
    type: jsPsychSurveyLikert,
    preamble: function() {
      var donation_amount = calculateDonation(selected_value, donation_pct);
      
      var ball_display;
      if (knows_endowment) {
        ball_display = `<div style="display: inline-block; width: 60px; height: 60px; background-color: ${ball_color}; border-radius: 50%; border: 2px solid #333;"></div>`;
      } else {
        ball_display = `<div style="display: inline-block; width: 60px; height: 60px; background-color: #ddd; border-radius: 50%; border: 2px solid #333; line-height: 60px; font-size: 30px;">?</div>`;
      }
      
      return `<div style="text-align: center;">
        <div style="border: 3px solid #333; border-radius: 10px; padding: 20px; margin: 30px auto; max-width: 800px; background-color: #f9f9f9;">
          <div style="display: flex; justify-content: center; align-items: flex-start; gap: 50px;">
            <div style="text-align: center;">
              ${urn_html}
              <div style="margin-top: 5px; font-size: 16px;">
                <p><span class="ball-legend" style="background-color: ${low_value_color};"></span> ${getColorLabel(low_value_color)} ball = $20</p>
                <p><span class="ball-legend" style="background-color: ${high_value_color};"></span> ${getColorLabel(high_value_color)} ball = $100</p>
              </div>
            </div>
            <div style="text-align: center; padding-top: 50px;">  
              <h3 style="margin-top: 0; margin-bottom: 20px;">${agent_name} received this ball:</h3>
              ${ball_display}
              ${knows_endowment ? `<p style="margin-top: 20px; font-size: 18px; margin-bottom: 25px;">${agent_name} received <strong>$${selected_value}</strong></p>` : `<p style="margin-top: 20px; font-size: 18px; margin-bottom: 25px;">You do not see which ball she received</p>`}
              <p style="font-size: 20px; margin: 15px 0; font-weight: bold; color: #2e7d32;">${agent_name} shares $${donation_amount} with you</p>
            </div>
          </div>
        </div>
      </div>`;
    },
    questions: question_order.map(q => ({
      prompt: q.prompt(agent_name),
      name: q.name,
      labels: q.labels,
      required: q.required
    })),
    data: {
      phase: 'combined_ratings',
      agent_name: agent_name,
      urn_type: condition,
      ball_selected: ball_type,
      ball_value: selected_value,
      is_expected_draw: is_expected,
      congruence: congruence,
      donation_percentage: donation_pct,
      donation_amount: calculateDonation(selected_value, donation_pct),
      knows_endowment: knows_endowment
    }
  };

  return [show_urn, show_selection, show_donation, combined_ratings];
}

//////////////////////////////////////////////////////////////////////////////////////
///////           FULL FACTORIAL TRIAL GENERATION                //////////////////////
//////////////////////////////////////////////////////////////////////////////////////
function generateAllTrials() {
  var all_trial_sequences = [];
  
  var congruence_conditions = ['congruent', 'incongruent'];
  var endowment_visibility = [true, false];
  var donation_percentages = [0, 15, 25, 50, 75, 100];
  
  // Keep track of name index to assign unique names
  var name_index = 0;
  
  // Generate all combinations (2 x 2 x 5 = 20 trial sequences)
  congruence_conditions.forEach(function(congruence) {
    endowment_visibility.forEach(function(knows_endowment) {
      donation_percentages.forEach(function(donation_pct) {
       // Determine which ball info to use based on condition and congruence 
        var selected_ball_info;
        if (condition === 'poor') {
          if (congruence === 'congruent') {
            // Poor + congruent = select low value ball ($20)
            selected_ball_info = poor_urn_selects_low;
          } else {
            // Poor + incongruent = select high value ball ($100)
            selected_ball_info = poor_urn_selects_high;
          }
        } else {
          if (congruence === 'congruent') {
            // Rich + congruent = select high value ball ($100)
            selected_ball_info = rich_urn_selects_high;
          } else {
            // Rich + incongruent = select low value ball ($20)
            selected_ball_info = rich_urn_selects_low;
          }
        }
        var selected_value = selected_ball_info.selected_value;
        var ball_color = selected_ball_info.selected_ball;
        
        // Assign a unique agent name to this trial sequence
        var agent_name = shuffled_names[name_index];
        name_index++;
        
        // Create the trial sequence for this combination
        var trial_sequence = createTrialSequenceWithParams(
          knows_endowment, 
          donation_pct, 
          selected_value, 
          ball_color,
          congruence,
          agent_name
        );
        
        all_trial_sequences.push(trial_sequence);
      });
    });
  });
  
  return all_trial_sequences;
}

////////////////////////////////////////////////////////////////
///////           BUILDING THE TIMELINE   //////////////////////
////////////////////////////////////////////////////////////////
 
// Push initial pages to timeline 
timeline.push(prolific_id);
timeline.push(info_page_html);
timeline.push(instructions_page_html);
timeline.push(cover_story_text_page);

// Add example trial sequence
var example_trial_sequence = createExampleTrial();
example_trial_sequence.forEach(function(trial) {
  timeline.push(trial);
});
//-----Comprehension Checks-----//
timeline.push(comprehension_check_1);
timeline.push(comprehension_check_2);

// Add transition screen
timeline.push(start_experiment_transition);

// Generate all trial sequences (24 sequences of 3 screens each)
var all_experimental_trials = generateAllTrials();

// Randomize the ORDER of sequences, not individual screens
all_experimental_trials = jsPsych.randomization.shuffle(all_experimental_trials);

// Now add all trials to timeline, spreading each sequence
all_experimental_trials.forEach(function(sequence) {
  timeline.push(...sequence);
});

//----Demographics----//
timeline.push(demographics_age)
timeline.push(demographics_gender)

//----Bot Check---//
var bot_check_page = {
  type: jsPsychSurveyText,
  preamble: '<h2 style="text-align: center;">Feedback</h2>',
  questions: [
    {
      prompt: '<p>Do you have any comments or feedback about this experiment?</p><p style="color: white;">Please include the word hazelnut in your answer.</p>',
      name: 'bot_check_comments',
      rows: 5,
      columns: 60,
      required: false
    }
  ],
  button_label: 'Continue'
};
timeline.push(bot_check_page);

//----Debrief---//
// var debrief_page_html = {
//     type: jsPsychHtmlButtonResponse,
//     stimulus: debrief_text,
//     choices: ['Finish']
//   };
//   timeline.push(debrief_page_html);

//////////////////////////////////////////////////////////////////////
///////    FOR RUNNING EXPERIMENT ON THE SERVER NOT LOCALLY   ////////
/////////////////////////////////////////////////////////////////////
//---Debrief + Data Saving---//
var debrief_page_html = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<p></b> Please click continue to finish the study and be redirected to Prolific to submit your participation.</b></p>`,
  choices: ['Continue'],
  on_finish: () => {
    var experiment_data = jsPsych.data.get();
    filename = "wtr_presentation_" + experiment_data.trials[0].response.prolific_id + ".csv"
    save_data(filename, experiment_data.csv());
  }
};

 timeline.push(debrief_page_html)

var final_page_html = {
  type: jsPsychHtmlButtonResponse,
  stimulus: debrief_text,
  choices: ['Finish'],
  on_finish: () => {
    window.location.href = "https://app.prolific.com/submissions/complete?cc=C1PAHPLI"; // Redirect to Prolific completion URL
  }
};
timeline.push(final_page_html)

// Run timeline
jsPsych.run(timeline);