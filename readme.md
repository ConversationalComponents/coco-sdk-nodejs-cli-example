CoCo (Conversational Components) SDK example
https://www.conversationalcomponents.com

Test project for coco-sdk-nodejs.
Uses CLI.

App name is coco
Usage example:

>coco namer_vp3
>hi
>--exit

Available commands:
--reset starts a new session. You can also call it as --reset;;component_id to change components
--end || --exit || --quit closes the app
If you did not provide a component ID, your next input will be taken as component ID
Anything else you type is sent as input
You can provide context (a valid JSON string) along with input using input;;context format
