//========================//
// CONSENT & INSTRUCTIONS
//=======================// 
var consent_text = `
    <div style="max-width: 800px; margin: auto; font-family: sans-serif; line-height: 1.6; font-size: 16px; color: #000; text-align: justify;">

    <div style="text-align: center; margin-bottom: 20px;">
      <img src="UoE_Logo.png" alt="UoE_Logo" style="max-width: 300px;">
    </div>
                    <h1 style="text-align: center;"><b>Information Sheet for Participants</b></h1>
                    <h2 style="text-align: center;"><b>Study Title: Judgements of Sharing Behaviour</b></h2>

                    <h3><b>Principal Investigators:</b> Dr. Tadeg Quillien</h3>
                    <h3><b>Researcher collecting data:</b> Madeleine Horner</h3>

                    <h3><b>What is this document?</b></h3>
                    <p>This document explains what kind of study we are doing, what your rights are, 
                    and what will be done with your data. You should print this page for your records.</p> 

                    <h3><b>Nature of the study:</b></h3> 
                     <p>You are invited to participate in a study which involves seeing a series of sharing behaviours and answering questions about how the person sharing is feeling. 
                     Your responses will be recorded. Your session should last for up to 10 minutes. You will be given full instructions shortly.</p>

                     <h3><b>Risks and benefits:</b></h3>
                     <p>There are no known risks to participation in this study. 
                     Other than the payment mentioned, there are no tangible benefits to you, however you will be contributing to our knowledge about psychology.</p>

                    <h3><b>Confidentiality and use of data:</b></h3> 
                    <p>All the information we collect during the course of the research will be processed in accordance with Data Protection Law.
                     Your data will be referred to by a unique participant number rather than by name. 
                     Please note that we will never share this information with anyone outside the research team. 
                     All data collected will be stored on password-locked computers in locked offices in the University of Edinburgh's facilities. 
                     The anonymised data collected during this study will be used for research purposes.</p>

                    <h3><b>What are my data protection rights?</b></h3> 
                    <p>The University of Edinburgh is a Data Controller for the information you provide. 
                    You have the right to access information held about you. 
                    Your right of access can be exercised in accordance with Data Protection Law. 
                    You also have other rights including rights of correction, erasure, and objection. 
                    For more details, including the right to lodge a complaint with the Information Commissioner's Office, please visit <a href="https://www.ico.org.uk" target="_blank">www.ico.org.uk</a>. 
                    Questions, comments, and requests about your personal data can also be sent to the University Data Protection Officer at <a href="mailto:dpo@ed.ac.uk">dpo@ed.ac.uk</a>.</p>

                    <h3><b>Voluntary participation and right to withdraw:</b></h3>
                    <p>Your participation is voluntary, and you may withdraw from the study at any time and for any reason. 
                    If you withdraw from the study during or after data gathering, we will delete your data and there is no penalty or loss of benefits to which you are otherwise entitled.
                     You may request any collected data to be destroyed if you email us within two weeks of final data collection.</p> 

                    <p>If you have any questions about what you have just read, please feel free to ask, or contact us later. 
                    You can contact us by email at <a href="mailto:Tadeg.Quillien@ed.ac.uk">Tadeg.Quillien@ed.ac.uk</a> or <a href="mailto:M.Horner-1@sms.ed.ac.uk">M.Horner-1@sms.ed.ac.uk</a>. 
                    This project has been approved by PPLS Ethics committee. If you have questions or comments regarding your rights as a participant, please contact the School Research Ethics Convenor at or <a href="mailto:ppls.rec@ed.ac.uk">ppls.rec@ed.ac.uk</a>.</p><br>

                    <p>By clicking <b>NEXT</b>, you consent to the following:</p> 
                    <ul> 
                    <li><b>I agree to participate in this study.</b></li> 
                    <li>I confirm that I have read and understood <b>how my data will be stored and used.</b></li> 
                    <li>I understand that I have the <b>right to terminate this session at any point</b>. If I choose to <b>withdraw after completing the study, my data will be deleted at that time.</b></li> 
                    </ul><br>
                    </div>`

var instructions_text = `
                    <div style="max-width: 800px; margin: auto; font-family: sans-serif; line-height: 1.6; font-size: 12px; color: #000; text-align: justify;">
                    <h1 style="text-align: center; font-weight: bold;">Instructions for Participants</h1>
                    <h2 style="text-align: center; font-weight: normal;">In this study, you will be asked to observe a series of situations where someone shares money with you. You will be presented with a short description of a person and will observe how much money they shared with you. After reading the description, you will be asked to answer a series of questions about how that person is feeling.</h2>
                    <h2 style="text-align: center; font-weight: normal;">The amount of money being shared with you in this experiment are hypothetical sums of money. You will be compensated separately for your participation.</h2>
                   <h2 style="text-align: center; font-weight: bold;">Please treat all situations as separate from each other.</h2>
                    <h2 style="text-align: center; font-weight: normal;">You will now be shown an example of a situation where someone shares money with you and subsequent questions.</h2>
                    </div>
                   `;
var cover_story_text = `
                   <div style="max-width: 800px; margin: auto; font-family: sans-serif; line-height: 1.6; font-size: 16px; color: #000; text-align: center;">
                     <h1 style="text-align: center; font-weight: bold;">Welcome to the Community Raffle</h1>
                     <p style="margin: 20px 0; font-size: 18px;">An acquaintance will be randomly selected to win a cash prize and will decide how much to share with you.</p>
                   
                     
                     <div style="background: #f5f5f5; padding: 15px; border-radius: 10px; margin: 20px 0;">
                       <h3 style="margin: 10px 0;">You will:</h3>
                       <ol style="text-align: left; display: inline-block; margin: 0; font-size: 16px;">
                         <li>Watch your acquaintance randomly draw from the raffle machine</li>
                         <li>See how much your acquaintance shares with you</li>
                         <li>Share your thoughts about their decision</li>
                       </ol>
                     </div>
                     
                     <p style="font-size: 16px;">Let's walk through an example together...</p>
                   </div>
                   `;

//==================//
// COMPREHENSION CHECK
//==================//
var comprehension_check_1 = {
  type: jsPsychSurveyMultiChoice,
  preamble: "<p style='text-align: center;'>The following is a comprehension question to verify your participation.</p>", 
  questions: [{
    prompt: "Is the ball received by your acquaintance randomly drawn?",
    options: ['Yes', 'No'],
    required: true,
    name: 'comprehension_check_1'
  }]
};

var comprehension_check_2 = {
  type: jsPsychSurveyMultiChoice,
  preamble: "<p style='text-align: center;'>The following is a comprehension question to verify your participation.</p>", 
  questions: [{
    prompt: "Which of the following were the colors of the balls shown?",
    options: ['Red and Green', 'Yellow and Black', 'Pink and Light Blue', 'Purple and Brown', 'Orange and Blue'],
    required: true,
    name: 'comprehension_check_2'
  }]
};

//==================//
// DEMOGRAPHICS
//==================//
// Age Question
const demographics_age = {
  type: jsPsychSurveyHtmlForm,
  preamble: '<h2 style="text-align: center;">Please answer the following:</h2>',
  html: `
    <div style="max-width: 600px; margin: 0 auto;">
      <div style="margin-bottom: 20px;">
        <label for="age" style="display: block; margin-bottom: 10px; font-weight: bold;">What is your age? *</label>
        <input type="number" id="age" name="age" min="18" max="105" value="18" required style="padding: 8px; width: 100px;">
      </div>
    </div>
  `,
  button_label: 'Continue'
};

// Gender question
const demographics_gender = {
  type: jsPsychSurveyMultiChoice,
  preamble: '<h2 style="text-align: center;">Please answer the following:</h2>',
  questions: [
    {
      prompt: "What is your gender?",
      options: [
        'Man',
        'Woman',
        'Non-Binary',
        'Transgender',
        'Other',
        'Prefer not to say'
      ],
      required: true,
      horizontal: false,
      name: 'gender'
    }
  ],
  button_label: 'Continue'
};
//==========//
// DEBRIEF
//=========//
var debrief_text = `
<div style="max-width: 800px; margin: auto; font-family: sans-serif; line-height: 1.6; font-size: 16px; color: #000; text-align: justify;">
<h2 style="text-align: center;"><b>Thank you for participating in our study!</b></h2>
         <p>This study was aimed at using a mathematical model to assess how individuals make inferences about the level that someone cares and wants to be perceived as a good person when observing their behaviour.</p> 
         <p>If you have any questions about this study, please feel free to contact the principle investigator Tadeg Quillien at <b>Tadeg.Quillien@ed.ac.uk</b> or the researcher Madeleine Horner at <b>M.Horner-1@ed.ac.uk</b>.
          If you have questions or comments regarding your rights as a participants, please contact the School Research Ethics Convenor at <b>ppls.rec@ed.ac.uk</b>.</p>
          <p>Thank you for your time and cooperation.</p>`
          +  'Thank you for participating! Click finish to go back to prolific or enter the code C1PAHPLI manually.'