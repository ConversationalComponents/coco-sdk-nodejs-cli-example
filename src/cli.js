const sdk = require("@aleximp/coco-sdk-nodejs");

let component_id = "";

let conv;

let isDone = false;

const out = async (input, context) => {
  try {
    console.log(
      "\x1b[43m",
      "\x1b[30m",
      `Your input:`,
      "\x1b[31m",
      input,
      "\x1b[0m"
    );
    if (context) {
      let ctx = context;
      try {
        context = JSON.parse(ctx);
      } catch (e) {
        throw new Error(`${ctx} is not a valid JSON`);
      }
      console.log(
        "\x1b[43m",
        "\x1b[34m",
        `Your context:`,
        "\x1b[31m",
        ctx,
        "\x1b[0m"
      );
    }
    const r = await conv.call(input, context);
    console.dir({ ...r, raw_resp: undefined });
    return r;
  } catch (e) {
    console.error(e);
  }
};

const startNew = cid => {
  component_id = cid;
  conv = new sdk(component_id);
  console.log(
    "\x1b[32m",
    `Session restarted with component_id ${component_id}. Insert your input:`,
    "\x1b[0m"
  );
  return;
};

const handleError = error => {
  console.error(error);
  return;
};

const processArgs = str => {
  const data = (typeof str === "string"
    ? str
    : Array.isArray(str) && str.length
    ? str[0]
    : ""
  )
    .split(";;")
    .filter(s => s)
    .map(s => s.trim());
  const command = data.length ? data[0] : "";

  if (command === "--reset") {
    if (data.length > 1) {
      return startNew(data[1]);
    }
    if (!component_id) {
      return handleError("No component id provided, please enter component ID");
    }
    return startNew(component_id);
  } else if (
    command === "--end" ||
    command === "--exit" ||
    command === "--quit"
  ) {
    isDone = true;
    return undefined;
  } else if (command === "--info" || command === "--help") {
    console.log("Available commands: ");
    console.log(
      "--reset starts a new session. You can also call it as --reset;;component_id to change components"
    );
    console.log("--end || --exit || --quit closes the app");
    console.log(
      "If you did not provide a component ID, your next input will be taken as component ID"
    );
    console.log("Anything else you type is sent as input");
    console.log(
      "You can provide context (a valid JSON string) along with input using input;;context format"
    );
    return undefined;
  }
  if (!conv) {
    if (!command || !command.length) {
      return handleError("No component id provided, please enter component ID");
    }
    return startNew(command);
  }

  return data;
};

module.exports = args => {
  const a = new Promise((resolve, reject) => {
    const data = processArgs(args);
    try {
      data && out(...data);
    } catch (e) {
      console.error(e);
    }
    if (isDone) resolve();
  });

  return a;
};
