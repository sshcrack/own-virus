import inquirer from "inquirer"

export function getPath(): Promise<string> {
  return new Promise(async resolve => {
    const res = await inquirer.prompt([
      {
        name: "path",
        message: "What should be executed?",
        type: "input"
      }
    ])

    resolve(res.path);
  });
}