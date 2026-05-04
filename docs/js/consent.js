// TODO: FILL OUT APPROX. EXPERIMENT LENGTH
var time = '10-15 minutes';

const consent = {
    type: jsPsychHtmlButtonResponse,
    stimulus: '<p><b>Consent Form</b></p> <div style="text-align:left;' +
        'background-color:lightblue; padding:20px; max-width:900px;">' +
        '<p><b>Description:</b> Welcome! You are invited to participate' +
        ' in a research study in cognitive psychology. You will be asked' +
        ' to perform various tasks on a computer which may include:' +
        ' looking at images or videos, listening to sounds, reading' +
        ' scenarios, or playing games. You may be asked a number of' +
        // careful about single quotes
        " different questions about making judgments and intepreting" +
        " people's actions. All information collected will remain" +
        ' confidential. </p>' +
        `<strong>Risks, Benefits and Data Confidentiality</strong>
        <br>
        There are no known risks in participating in this study, and no health or cognitive benefits. Whilst your data will be provided anonymously, at the point of data collection, your responses in the survey could, theoretically, be linked back to you via your Prolific ID, or your IP address. 
        <br>
        The former is collected to enable your payment, the latter to ensure that there are no duplicate responses in the database. After we have used the data for this purpose, this information will be deleted from the data file. The data will subsequently be stored anonymously, such that your individual responses will not be traceable back to you. 
        All personal information will remain confidential and the data gathered will be stored anonymously and securely. It will not be possible to identify you in any publications. Any anonymised research data may be shared with, and used by, others for future research.
        <br><br>
        <strong>Participation or Withdrawal</strong>
        <br>
        Your participation in the study is voluntary. You may decline to answer any question and have the right to withdraw from participation at any time. Withdrawal will not affect your relationship with University College London in any way. 
        Simply close your browser if you wish to withdraw.
        <br><br>
        <strong>**The study has been processed by the Research Ethics Committee at University College London and the study number is EP/2017/005.**</strong></div>` +
        
        '<p> Do you agree with the terms of the experiment as explained' +
        ' above? </p>',
    choices: ['I agree']
};
