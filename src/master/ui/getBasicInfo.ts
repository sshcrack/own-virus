import { BasicInfo } from '../interfaces/base';
import inquirer from "inquirer"

export function getBasicInfo(clients: string[]): Promise<BasicInfo> {
  return new Promise(async (resolve, reject) => {
    try {

      const answers = (await inquirer.prompt([
        {
          message: "Choose client is affected",
          choices: clients,
          type: "list",
          name: "client"
        },
        {
          name: "type",
          message: "What should be run?",
          type: "list",
          choices: [
            "shell",
            "launch",
            "logging"
          ]
        }
      ]))

      resolve({
        client: answers.client,
        type: answers.type
      })
    } catch (e) {
      reject(e)
    }
  });
}