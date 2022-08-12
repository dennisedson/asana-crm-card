// For external API calls
const axios = require('axios');
const asana_pat = process.env.asana_pat
exports.main = async (context = {}, sendResponse) => {

  // Store contact firstname, configured as propertiesToSend in crm-card.json
  const { firstname } = context.propertiesToSend;

  const introMessage = {
    type: "text",
    format: "markdown",
    text: "_ASANA._",
  };

  try {
    const { data } = await axios.get("https://app.asana.com/api/1.0/users/me?opt_pretty=true&opt_fields=followers,assignee",{
    headers: { 
      'Accept': 'application/json', 
      'Authorization': 'Bearer 1/1199543330726057:db2c13451884058c814994973a672430'
    }
  });

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
            text: `**Quote**: ${data[0].gid}`
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
