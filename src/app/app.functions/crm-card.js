// For external API calls
const axios = require('axios');

exports.main = async (context = {}, sendResponse) => {

  // Store contact firstname, configured as propertiesToSend in crm-card.json
  const { firstname } = context.propertiesToSend;

  const introMessage = {
    type: "text",
    format: "markdown",
    text: "_An example of a CRM card extension that displays data from Hubspot, uses ZenQuotes public API to display daily quote, and demonstrates custom actions using serverless functions._",
  };

  var config = {
    method: 'get',
    url: 'https://app.asana.com/api/1.0/users/me?opt_pretty=true&opt_fields=followers,assignee',
    headers: { 
      'Accept': 'application/json', 
      'Authorization': `Bearer 1/`+ process.env.asana_pat
    }
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
  
  try {
    const { data } = await axios.get("https://app.asana.com/api/1.0/users/me?opt_pretty=true&opt_fields=followers,assignee'");

    const quoteSections = [
      {
        type: "tile",
        body: [
          {
            type: "text",
            format: "markdown",
            text: `**Hello ${firstname}, here's your quote for the day**!`
          },
          {
            type: "text",
            format: "markdown",
            text: `**Quote**: ${data}`
          },
          {
            type: "text",
            format: "markdown",
            text: `**Author**: ${data[0].a}`
          }
        ]
      },
      {
        type: "button",
        text: "Get new quote",
        onClick: {
          type: "SERVERLESS_ACTION_HOOK",
          serverlessFunction: "crm-card"
        }
      }
    ];

    sendResponse({ sections: [introMessage, ...quoteSections] });
  } catch (error) {
    // "message" will create an error feedback banner when it catches an error
    sendResponse({
      message: {
        type: 'ERROR',
        body: `Error: ${error.message}`
      },
      sections: [introMessage]
    });
  }
};
