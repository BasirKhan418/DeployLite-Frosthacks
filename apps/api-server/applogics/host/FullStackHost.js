import { RunTaskCommand } from "@aws-sdk/client-ecs";
import client from "../../client/client.js";
const FullStackHost = async (req, res) => {
  //task config
  const config = {
    cluster: process.env.cluster,
    task: process.env.task2,
  };
  //getting the giturl and projectid
  const { giturl, projectid } = req.body;
  console.log(giturl, projectid);

  const cmd = new RunTaskCommand({
    cluster: config.cluster,
    taskDefinition: config.task,
    launchType: "FARGATE",
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: "ENABLED",
        subnets: [
         "subnet-0bd55e2dae6185a96","subnet-08bb8864b5cca45ee","subnet-031ad003d24e82efa"
        ],
        securityGroups: ["sg-09b23c86c1cd38723"],
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: process.env.taskfullstackname,
          environment: [
            {
              name: "GIT_URL",
              value: giturl,
            },
            {
              name: "projectid",
              value: projectid,
            },
          ],
        },
      ],
    },
  });
  try {
    const data = await client.send(cmd);
    console.log(data);
    return res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};
export { FullStackHost };
